"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUp, Check, Copy, ExternalLink } from "lucide-react";
import { profile } from "@/content/profile";
import { siteConfig } from "@/config/site";
import { Sheet } from "@/components/layout/sheet";
import { EditorialHeading } from "@/components/marginalia/editorial-heading";
import { ScannableQRCode } from "@/components/marginalia/qr-code";
import { PenMark } from "@/components/motion/pen-mark";
import { HandWrite } from "@/components/motion/hand-write";
import { RevealBlock } from "@/components/motion/reveal";

export function HomeContact() {
  const [copied, setCopied] = React.useState(false);
  const [hoverEmail, setHoverEmail] = React.useState(false);
  const [hoverLinkIdx, setHoverLinkIdx] = React.useState<number>(-1);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopyEmail = async () => {
    const confirmCopied = () => {
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2200);
    };
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(profile.email);
        confirmCopied();
        return;
      }
    } catch {
      // Fallback to mailto below
    }
    window.location.href = `mailto:${profile.email}`;
  };

  const scrollToTop = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  };

  const paragraphs = profile.closingLetter
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Sheet id="contato" label="contato" tone="night" morph>
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Left column: circled avatar, heading, copyable email, links & scannable QR */}
        <div>
          <div className="relative h-24 w-24 sm:h-28 sm:w-28">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--surface-elevated)]">
              <Image
                src={profile.portraitPath}
                alt={profile.portraitAlt}
                fill
                sizes="112px"
                className="object-cover grayscale"
              />
            </div>
            <PenMark kind="oval" seed={80} padX={9} padY={9} delay={0.12} />
          </div>

          <div className="mt-7">
            <EditorialHeading text={profile.thanksHeading} seed={16} />
          </div>

          {/* Direct contact: one-click copy + mailto */}
          <div className="mt-7 space-y-2">
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--muted)]">
              Contato direto
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCopyEmail}
                onMouseEnter={() => setHoverEmail(true)}
                onMouseLeave={() => setHoverEmail(false)}
                onFocus={() => setHoverEmail(true)}
                onBlur={() => setHoverEmail(false)}
                aria-label={`Copiar endereço de e-mail ${profile.email}`}
                className="relative inline-flex items-center gap-2.5 text-lg font-medium text-[var(--fg)] transition-colors hover:text-[var(--pen)] sm:text-xl"
              >
                <span>{profile.email}</span>
                {copied ? (
                  <Check className="h-4 w-4 text-[var(--clinical)]" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4 text-[var(--pen)]" aria-hidden="true" />
                )}
                <PenMark
                  kind="under"
                  seed={81}
                  padX={1}
                  padY={6}
                  hoverOnly
                  active={hoverEmail || copied}
                />
              </button>

              <span
                role="status"
                aria-live="polite"
                className="font-marginalia min-w-[7ch] -rotate-[4deg] text-2xl text-[var(--pen)]"
              >
                {copied ? "copiado!" : ""}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Clique para copiar ou{" "}
              <a
                href={`mailto:${profile.email}`}
                className="underline decoration-[var(--control-border)] underline-offset-4 hover:text-[var(--pen)]"
              >
                abrir no cliente de e-mail
              </a>
              .
            </p>
          </div>

          {/* Academic & engineering profiles */}
          <nav aria-label="Perfis externos" className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {profile.links.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setHoverLinkIdx(idx)}
                onMouseLeave={() => setHoverLinkIdx(-1)}
                onFocus={() => setHoverLinkIdx(idx)}
                onBlur={() => setHoverLinkIdx(-1)}
                className="font-marginalia relative inline-flex items-center gap-1.5 text-2xl text-[var(--pen)] sm:text-[1.7rem]"
              >
                <span>{link.label}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
                <PenMark
                  kind="under"
                  seed={90 + idx}
                  padX={1}
                  padY={5}
                  hoverOnly
                  active={hoverLinkIdx === idx}
                />
              </a>
            ))}
          </nav>

          {/* Scannable CV / ORCID QR Code */}
          <div className="mt-10 flex items-center gap-5">
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Abrir ${profile.cvNote}`}
              className="block w-24 shrink-0 -rotate-2 rounded-lg bg-[#FAF8F3] p-2 shadow-lg transition-transform duration-300 hover:rotate-0 hover:scale-105"
            >
              <ScannableQRCode
                text={profile.cvUrl}
                label={`Código QR para ${profile.cvNote}`}
              />
            </a>
            <div>
              <HandWrite
                delay={0.2}
                className="font-marginalia text-2xl text-[var(--pen)]"
              >
                {profile.cvNote}
              </HandWrite>
              <p className="mt-1 max-w-[26ch] text-xs leading-relaxed text-[var(--muted)]">
                Escaneie ou clique no QR Code para acessar registro científico e publicações.
              </p>
            </div>
          </div>
        </div>

        {/* Right column: editorial closing letter & handwritten signature */}
        <RevealBlock delay={0.14} className="lg:justify-self-end">
          <div className="max-w-[44ch] rounded-2xl border border-[var(--rule)] bg-[var(--surface-elevated)] p-7 sm:p-10">
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--clinical)]">
              Nota de encerramento
            </p>
            <div className="mt-5 space-y-4 text-base leading-[1.78] text-[var(--fg)] sm:text-[1.05rem]">
              {paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <span className="font-marginalia relative inline-block -rotate-[3deg] text-4xl text-[var(--pen)] sm:text-5xl">
                <HandWrite delay={0.28}>{profile.signature}</HandWrite>
                <PenMark kind="under" seed={82} padX={3} padY={8} delay={0.42} />
              </span>
            </div>
          </div>
        </RevealBlock>
      </div>

      {/* Persistent editorial footer */}
      <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-8 text-xs tracking-[0.06em] text-[var(--muted)]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-medium text-[var(--fg)]">
            {profile.coverWord} {siteConfig.year}
          </span>
          <span>{siteConfig.docLabel}</span>
          <span>{siteConfig.name}</span>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="font-marginalia inline-flex items-center gap-1.5 text-2xl tracking-normal text-[var(--pen)] transition-opacity hover:opacity-80"
        >
          <span>voltar ao topo</span>
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </footer>
    </Sheet>
  );
}
