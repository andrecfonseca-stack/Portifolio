import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outDir = path.join(rootDir, "out");
const indexPath = path.join(outDir, "index.html");
const targetPath = path.join(rootDir, "portfolio-offline.html");

if (!fs.existsSync(indexPath)) {
  throw new Error(`Arquivo nao encontrado: ${indexPath}. Execute 'npm run build' primeiro.`);
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".woff2") return "font/woff2";
  if (ext === ".woff") return "font/woff";
  if (ext === ".css") return "text/css";
  return "application/octet-stream";
}

function toDataUri(absPath, includeNameParam = false) {
  const buf = fs.readFileSync(absPath);
  const mime = getMimeType(absPath);
  const base64 = buf.toString("base64");
  if (includeNameParam) {
    const fileName = path.basename(absPath);
    return `data:${mime};name=${fileName};base64,${base64}`;
  }
  return `data:${mime};base64,${base64}`;
}

// 1. Build a map of all local images under out/images/** to Base64 Data URIs
const imageDataMap = new Map();
function scanImages(dir, webPrefix = "/images") {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const webPath = `${webPrefix}/${entry.name}`;
    if (entry.isDirectory()) {
      scanImages(full, webPath);
    } else if (/\.(jpe?g|png|webp|svg)$/i.test(entry.name)) {
      const dataUri = toDataUri(full, true);
      imageDataMap.set(webPath, dataUri);
    }
  }
}
scanImages(path.join(outDir, "images"));

function replaceImagePaths(text) {
  let result = text;
  // Sort keys longest-first so query variants or subpaths match cleanly
  const entries = Array.from(imageDataMap.entries()).sort(
    (a, b) => b[0].length - a[0].length,
  );
  for (const [webPath, dataUri] of entries) {
    const escaped = webPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`${escaped}(\\?v=\\d+)?`, "g");
    result = result.replace(re, () => dataUri);
  }
  return result;
}

let html = fs.readFileSync(indexPath, "utf8");

// 2. Remove <link rel="preload" ...> and noModule polyfill script tags
html = html.replace(/<link\b[^>]*\brel="preload"[^>]*\/?>/gi, "");
html = html.replace(/<script\b[^>]*\bnoModule=""[^>]*><\/script>/gi, "");

// 3. Inline all <link rel="stylesheet" href="/_next/..."> with embedded Base64 fonts
const cssDataUriMap = new Map();
html = html.replace(
  /<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*\/?>/gi,
  (_match, href) => {
    const relPath = href.replace(/^\//, "");
    const cssPath = path.join(outDir, relPath);
    if (!fs.existsSync(cssPath)) return _match;

    let css = fs.readFileSync(cssPath, "utf8");
    // Inline font files referenced via url(...) in CSS
    css = css.replace(/url\((['"]?)([^)'"]+\.woff2?)\1\)/gi, (m, _q, fontUrl) => {
      let fontAbsPath;
      if (fontUrl.startsWith("/")) {
        fontAbsPath = path.join(outDir, fontUrl.replace(/^\//, ""));
      } else {
        fontAbsPath = path.resolve(path.dirname(cssPath), fontUrl);
      }
      if (fs.existsSync(fontAbsPath)) {
        return `url("${toDataUri(fontAbsPath)}")`;
      }
      return m;
    });

    css = replaceImagePaths(css);
    const cssBase64 = Buffer.from(css, "utf8").toString("base64");
    const cssDataUri = `data:text/css;base64,${cssBase64}`;
    cssDataUriMap.set(href, cssDataUri);

    return `<link rel="stylesheet" href="${cssDataUri}" data-precedence="next"/>`;
  },
);

// 4. Collect all external <script src="/_next/static/..."> in order, remove them from <head>,
//    and inline them at the end of <body> after __next_f and _R_
const externalScriptSrcs = [];
html = html.replace(
  /<script\b[^>]*\bsrc="(\/_next\/static\/[^"]+)"[^>]*><\/script>/gi,
  (_match, src) => {
    if (!externalScriptSrcs.includes(src)) {
      externalScriptSrcs.push(src);
    }
    return "";
  },
);

// 5. Clean up Flight payload (__next_f) references to external CSS/JS preloads so React 19
//    never attempts to fetch file:///_next/... during hydration
for (const [cssHref, cssDataUri] of cssDataUriMap.entries()) {
  html = html.split(cssHref).join(cssDataUri);
}
// Remove :HL[...] font/style hints from Flight JSON-escaped string (stopping at literal \n)
html = html.replace(/:HL\[(?:(?!\\n).)*?\]\\n/g, "");
// Replace escaped virtual script descriptors [\"$\",\"script\",\"script-0\",{...}] with null in Flight payload
html = html.replace(
  /\[\\"\$\\"\s*,\s*\\"script\\"\s*,\s*\\"script-\d+\\"\s*,\s*\{[^}]+\}\]/g,
  "null",
);

// 6. Replace all /images/... paths in HTML (including inline Flight payloads) with Base64 Data URIs
html = replaceImagePaths(html);

// 7. Build inline script bundle:
//    a) file:// History & Location compatibility shim
//    b) /scenes/stick.js, /scenes/switch-opener.js, /scenes/margin-climber.js
//    c) All Next.js chunk scripts in deterministic order (chunks first, turbopack runtime last)
const fileProtocolShim = `
<script>
(function() {
  var origGetAttr = Element.prototype.getAttribute;
  Element.prototype.getAttribute = function(name) {
    if (name === "src" && this.tagName === "SCRIPT" && !origGetAttr.call(this, "src")) {
      var chunkSrc = origGetAttr.call(this, "data-chunk");
      if (chunkSrc) return chunkSrc;
    }
    return origGetAttr.call(this, name);
  };
  if (location.protocol === "file:") {
    var origFetch = window.fetch ? window.fetch.bind(window) : null;
    if (origFetch) {
      window.fetch = function(input, init) {
        var u = typeof input === "string" ? input : (input && (input.url || input.href)) || String(input || "");
        if (u.startsWith("file:") || u.startsWith("/")) {
          return Promise.resolve(new Response("", { status: 200, headers: { "content-type": "text/plain" } }));
        }
        return origFetch(input, init);
      };
    }
    var origReplace = history.replaceState.bind(history);
    var origPush = history.pushState.bind(history);
    function safeUrl(url) {
      if (typeof url === "string" && url.startsWith("/") && !url.startsWith(location.pathname)) {
        var h = url.indexOf("#");
        return h >= 0 ? location.pathname + url.slice(h) : location.pathname;
      }
      return url;
    }
    history.replaceState = function(state, title, url) {
      try { return origReplace(state, title, safeUrl(url)); } catch (e) { return undefined; }
    };
    history.pushState = function(state, title, url) {
      try { return origPush(state, title, safeUrl(url)); } catch (e) { return undefined; }
    };
  }
})();
</script>
`;

const sceneScripts = [
  "scenes/stick.js",
  "scenes/switch-opener.js",
  "scenes/margin-climber.js",
]
  .map((rel) => {
    const p = path.join(outDir, rel);
    if (!fs.existsSync(p)) return "";
    const code = fs.readFileSync(p, "utf8");
    return `<script data-scene="${rel}">\n${code}\n</script>`;
  })
  .join("\n");

// Separate turbopack runtime script so module chunks register in globalThis["TURBOPACK"] before or after safely
const runtimeSrcs = externalScriptSrcs.filter((s) => s.includes("turbopack-"));
const chunkSrcs = externalScriptSrcs.filter((s) => !s.includes("turbopack-"));
const orderedSrcs = [...chunkSrcs, ...runtimeSrcs];

const inlinedNextScripts = orderedSrcs
  .map((src) => {
    const abs = path.join(outDir, src.replace(/^\//, ""));
    if (!fs.existsSync(abs)) {
      throw new Error(`Script chunk nao encontrado: ${abs}`);
    }
    let code = fs.readFileSync(abs, "utf8");
    if (src.includes("turbopack-")) {
      // Short-circuit G(e,t) when a chunk was already registered inline (r.resolved === true)
      code = code.replace(
        "if(r.loadingStarted)return r.promise;",
        "if(r.resolved||r.loadingStarted)return r.promise;",
      );
    }
    code = replaceImagePaths(code);
    // Prevent premature </script> closing if present inside string literals
    code = code.replace(/<\/script>/gi, "<\\/script>");
    return `<script data-chunk="${src}">\n${code}\n</script>`;
  })
  .join("\n");

// Insert fileProtocolShim, sceneScripts, and inlinedNextScripts right before the final </body>
// (keeping <head> 100% aligned with React 19 SSR hydration)
const bodyEndIdx = html.lastIndexOf("</body>");
if (bodyEndIdx >= 0) {
  html =
    html.slice(0, bodyEndIdx) +
    `\n${fileProtocolShim}\n${sceneScripts}\n${inlinedNextScripts}\n` +
    html.slice(bodyEndIdx);
}

// Strip any remaining crossorigin="", type="module", or loading="lazy" (since all images are inline Base64)
html = html.replace(/\scrossorigin="[^"]*"/gi, "");
html = html.replace(/\stype="module"/gi, "");
html = html.replace(/\sloading="lazy"/gi, "");

fs.writeFileSync(targetPath, html, "utf8");
const sizeMB = (fs.statSync(targetPath).size / (1024 * 1024)).toFixed(2);
console.log(`Gerado com sucesso: ${targetPath} (${sizeMB} MB)`);
