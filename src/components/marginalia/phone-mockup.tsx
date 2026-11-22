"use client";

import * as React from "react";
import { m, useMotionValue, useSpring } from "motion/react";
import type { PhoneScreenKind, Project } from "@/content/schemas";
import { MOTION_SPRING } from "@/components/motion/tokens";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";

function photoUrl(url: string, w: number): string {
  if (!/^https:\/\/images\.unsplash\.com\//.test(url) || url.includes("?")) {
    return url;
  }
  return `${url}?auto=format&fit=crop&w=${w}&q=75`;
}

function Pic({ src, alt = "" }: { src: string; alt?: string }) {
  if (!src) {
    return (
      <div
        className="mgn-scr-img"
        style={{ background: "linear-gradient(160deg,#d9d6ce,#a9a59b)" }}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="mgn-scr-img"
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}

function Status({ light }: { light?: boolean }) {
  return (
    <div className="mgn-status" style={{ color: light ? "#fff" : "#18181a" }}>
      <span>9:41</span>
      <i>
        <s />
        <b />
      </i>
    </div>
  );
}

function Tabbar({ accent, on = 0 }: { accent: string; on?: number }) {
  return (
    <div className="mgn-tabbar">
      {[0, 1, 2, 3].map((k) => (
        <span
          key={k}
          style={
            k === on
              ? { background: accent, width: "11cqw", borderRadius: "99px" }
              : undefined
          }
        />
      ))}
    </div>
  );
}

export function PhoneScreen({
  kind,
  project,
  shift,
}: {
  kind: PhoneScreenKind;
  project: Project;
  shift: number;
}) {
  const accent = project.accent || "#e2455f";
  const n = Math.max(1, project.images.length);
  const im = (k: number) => photoUrl(project.images[(shift + k) % n] || "", 520);
  const abs: React.CSSProperties = { position: "absolute" };

  if (kind === "cover") {
    return (
      <div className="mgn-screen">
        <Pic src={im(0)} />
        <div
          style={{
            ...abs,
            inset: 0,
            background:
              "linear-gradient(180deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,0) 26%,rgba(0,0,0,.08) 48%,rgba(0,0,0,.84) 100%)",
          }}
        />
        <Status light />
        <div
          style={{
            ...abs,
            left: "8cqw",
            right: "8cqw",
            bottom: "9cqw",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "15cqw",
              lineHeight: 0.95,
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              fontSize: "4.4cqw",
              opacity: 0.86,
              marginTop: "3cqw",
              lineHeight: 1.35,
            }}
          >
            {project.tagline || project.kind}
          </div>
          <div
            style={{
              marginTop: "7cqw",
              height: "13cqw",
              borderRadius: 99,
              background: accent,
              display: "grid",
              placeItems: "center",
              fontSize: "4.4cqw",
              fontWeight: 600,
            }}
          >
            Explorar caso
          </div>
          <div
            style={{
              display: "flex",
              gap: "1.6cqw",
              justifyContent: "center",
              marginTop: "5cqw",
            }}
          >
            {[0, 1, 2].map((k) => (
              <span
                key={k}
                style={{
                  width: k ? "1.8cqw" : "6cqw",
                  height: "1.8cqw",
                  borderRadius: 99,
                  background: k ? "rgba(255,255,255,.5)" : "#fff",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (kind === "detail") {
    return (
      <div className="mgn-screen">
        <div style={{ ...abs, left: 0, right: 0, top: 0, height: "58%" }}>
          <Pic src={im(0)} />
        </div>
        <Status light />
        <div
          style={{
            ...abs,
            top: "15cqw",
            left: "6cqw",
            right: "6cqw",
            display: "flex",
            justifyContent: "space-between",
            zIndex: 2,
          }}
        >
          {["‹", "♡"].map((c) => (
            <span
              key={c}
              style={{
                width: "10cqw",
                height: "10cqw",
                borderRadius: "50%",
                background: "rgba(255,255,255,.92)",
                display: "grid",
                placeItems: "center",
                fontSize: "5.4cqw",
                color: "#18181a",
              }}
            >
              {c}
            </span>
          ))}
        </div>
        <div
          style={{
            ...abs,
            left: 0,
            right: 0,
            bottom: 0,
            height: "50%",
            background: "#fff",
            borderRadius: "9cqw 9cqw 0 0",
            padding: "5cqw 7cqw 0",
          }}
        >
          <div
            style={{
              width: "12cqw",
              height: "1.4cqw",
              borderRadius: 99,
              background: "#ddd",
              margin: "0 auto 5cqw",
            }}
          />
          <div style={{ fontSize: "7.2cqw", fontWeight: 600, lineHeight: 1.1 }}>
            {project.title}
          </div>
          <div
            style={{
              fontSize: "3.6cqw",
              color: "#8a8984",
              marginTop: "1.4cqw",
            }}
          >
            {project.kind || project.tagline}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2cqw",
              marginTop: "3.4cqw",
              fontSize: "4.2cqw",
            }}
          >
            <span style={{ color: accent, letterSpacing: ".1em" }}>★★★★★</span>
            <span style={{ color: "#8a8984", fontSize: "3.4cqw" }}>
              4.9 · 2.1k
            </span>
          </div>
          <div className="mgn-bars" style={{ marginTop: "4cqw" }}>
            <span />
            <span style={{ width: "88%" }} />
            <span style={{ width: "64%" }} />
          </div>
          <div
            style={{
              ...abs,
              left: "7cqw",
              right: "7cqw",
              bottom: "7cqw",
              height: "13cqw",
              borderRadius: 99,
              background: accent,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: "4.4cqw",
              fontWeight: 600,
            }}
          >
            Continue
          </div>
        </div>
      </div>
    );
  }

  if (kind === "stats") {
    const pct = 68;
    const C = 2 * Math.PI * 40;
    const bars = [42, 66, 50, 92, 72, 34, 80];
    return (
      <div className="mgn-screen">
        <Status />
        <div style={{ ...abs, left: "7cqw", right: "7cqw", top: "15cqw" }}>
          <div style={{ fontSize: "3.8cqw", color: "#8a8984" }}>This week</div>
          <div
            style={{ fontSize: "7.4cqw", fontWeight: 600, marginTop: ".6cqw" }}
          >
            Your progress
          </div>
          <div
            style={{
              position: "relative",
              width: "52cqw",
              height: "52cqw",
              margin: "6cqw auto 0",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              style={{
                width: "100%",
                height: "100%",
                transform: "rotate(-90deg)",
              }}
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e6e4de"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={accent}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(C * pct) / 100} ${C}`}
              />
            </svg>
            <div
              style={{
                ...abs,
                inset: 0,
                display: "grid",
                placeContent: "center",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "10cqw", fontWeight: 600 }}>{pct}%</div>
              <div style={{ fontSize: "3.4cqw", color: "#8a8984" }}>
                of your goal
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "2.6cqw",
              height: "22cqw",
              marginTop: "7cqw",
            }}
          >
            {bars.map((h, k) => (
              <span
                key={k}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: "2cqw",
                  background: accent,
                  opacity: k === 3 ? 1 : 0.3,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "3cqw",
              color: "#8a8984",
              marginTop: "1.6cqw",
              padding: "0 1cqw",
            }}
          >
            {["M", "T", "W", "T", "F", "S", "S"].map((d, k) => (
              <span key={k}>{d}</span>
            ))}
          </div>
          {[0, 1].map((k) => (
            <div
              key={k}
              style={{
                display: "flex",
                gap: "3cqw",
                alignItems: "center",
                marginTop: "5cqw",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "12cqw",
                  height: "12cqw",
                  borderRadius: "3cqw",
                  overflow: "hidden",
                  flex: "none",
                }}
              >
                <Pic src={im(k + 1)} />
              </div>
              <div className="mgn-bars" style={{ flex: 1 }}>
                <span
                  style={{
                    width: k ? "62%" : "78%",
                    background: "#cfccc5",
                  }}
                />
                <span style={{ width: "44%" }} />
              </div>
            </div>
          ))}
        </div>
        <Tabbar accent={accent} on={2} />
      </div>
    );
  }

  // "feed"
  return (
    <div className="mgn-screen">
      <Status />
      <div style={{ ...abs, left: "7cqw", right: "7cqw", top: "15cqw" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "3.8cqw", color: "#8a8984" }}>
              Good morning
            </div>
            <div
              style={{
                fontSize: "7.4cqw",
                fontWeight: 600,
                marginTop: ".6cqw",
              }}
            >
              {project.title}
            </div>
          </div>
          <span
            style={{
              width: "10cqw",
              height: "10cqw",
              borderRadius: "50%",
              background: accent,
              opacity: 0.9,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.4cqw",
            height: "11cqw",
            borderRadius: 99,
            background: "#ebe9e3",
            marginTop: "5cqw",
            padding: "0 4cqw",
            fontSize: "3.6cqw",
            color: "#8a8984",
          }}
        >
          <span
            style={{
              width: "3.6cqw",
              height: "3.6cqw",
              borderRadius: "50%",
              border: ".6cqw solid #8a8984",
            }}
          />
          Search
        </div>
        <div style={{ display: "flex", gap: "2cqw", marginTop: "4cqw" }}>
          {["For you", "New", "Saved"].map((c, k) => (
            <span
              key={c}
              className="mgn-chip"
              style={k ? undefined : { background: accent, color: "#fff" }}
            >
              {c}
            </span>
          ))}
        </div>
        <div
          style={{
            position: "relative",
            height: "66cqw",
            borderRadius: "7cqw",
            overflow: "hidden",
            marginTop: "4.6cqw",
          }}
        >
          <Pic src={im(0)} />
          <div
            style={{
              ...abs,
              inset: 0,
              background:
                "linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.7))",
            }}
          />
          <div
            style={{
              ...abs,
              left: "5cqw",
              right: "5cqw",
              bottom: "4.6cqw",
              color: "#fff",
            }}
          >
            <div style={{ fontSize: "5.4cqw", fontWeight: 600 }}>
              {project.tagline
                ? project.tagline.split(/[,.]/)[0]
                : project.title}
            </div>
            <div
              style={{ fontSize: "3.4cqw", opacity: 0.8, marginTop: "1cqw" }}
            >
              Picked for you
            </div>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3cqw",
            marginTop: "3cqw",
          }}
        >
          {[1, 2].map((k) => (
            <div
              key={k}
              style={{
                position: "relative",
                height: "34cqw",
                borderRadius: "5cqw",
                overflow: "hidden",
              }}
            >
              <Pic src={im(k)} />
            </div>
          ))}
        </div>
      </div>
      <Tabbar accent={accent} />
    </div>
  );
}

export function PhoneMockup({
  project,
  kind,
  shift = 0,
}: {
  project: Project;
  kind: PhoneScreenKind;
  shift?: number;
}) {
  return (
    <div
      className="mgn-phone"
      role="img"
      aria-label={`${project.title} — tela ${kind}`}
    >
      <div className="mgn-phone-body">
        <PhoneScreen kind={kind} project={project} shift={shift} />
        <span className="mgn-island" />
      </div>
    </div>
  );
}

export function TiltPhone({
  slot,
  project,
  kind,
}: {
  slot: 0 | 1 | 2;
  project: Project;
  kind: PhoneScreenKind;
}) {
  const { mounted, reduced } = useSafeMotion();
  const baseTilt = slot === 0 ? -7 : slot === 2 ? 6 : 0;
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, MOTION_SPRING.tactile);
  const rotateY = useSpring(rawRotateY, MOTION_SPRING.tactile);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    rawRotateY.set(dx * 22);
    rawRotateX.set(-dy * 16);
  };

  const handleLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return (
    <div
      className="mgn-trio-p"
      data-slot={slot}
      data-depth={[0.7, 1, 0.4][slot]}
    >
      <m.div
        className="mgn-tilt"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={
          mounted && !reduced
            ? {
                rotateX,
                rotateY,
                rotateZ: baseTilt,
                transformStyle: "preserve-3d",
              }
            : undefined
        }
      >
        <PhoneMockup project={project} kind={kind} shift={slot} />
      </m.div>
    </div>
  );
}
