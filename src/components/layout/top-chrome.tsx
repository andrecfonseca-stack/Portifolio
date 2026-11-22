"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { HOME_SECTIONS, SITE_ROUTES } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { PenMark } from "@/components/motion/pen-mark";
import { MOTION_EASE } from "@/components/motion/tokens";
import { cn } from "@/lib/cn";

export function TopChrome() {
  const [open, setOpen] = React.useState(false);
  const [hoverTrigger, setHoverTrigger] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState(HOME_SECTIONS[0].shortLabel);
  const [activeTone, setActiveTone] = React.useState<"paper" | "night">("paper");
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  // Track active editorial sheet and surface tone on scroll
  React.useEffect(() => {
    const sheets = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-sheet]"),
    );
    if (!sheets.length) return;

    const updateActive = () => {
      const marker = window.innerHeight * 0.22;
      let current = sheets[0];
      for (const sheet of sheets) {
        const rect = sheet.getBoundingClientRect();
        if (rect.top <= marker) {
          current = sheet;
        }
      }
      const nextLabel = current.dataset.label || HOME_SECTIONS[0].shortLabel;
      const nextTone = current.dataset.tone === "night" ? "night" : "paper";
      setActiveSection(nextLabel);
      setActiveTone(nextTone);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  // Keyboard Escape and focus management for the full-screen index
  React.useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeOverlay = () => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const jumpToSection = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    }
  };

  const isNight = activeTone === "night";

  return (
    <>
      <header
        data-tone={activeTone}
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-colors duration-300 backdrop-blur-md",
          isNight
            ? "bg-[color:rgba(27,35,38,0.86)] text-[var(--ink-night)] border-b border-[var(--rule-night)]"
            : "bg-[color:rgba(242,237,228,0.86)] text-[var(--ink-paper)] border-b border-[var(--rule-paper)]",
        )}
      >
        <div className="mx-auto grid max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3 text-xs tracking-[0.06em] sm:grid-cols-[1fr_auto_1fr] sm:px-10 lg:px-16">
          <div className="hidden items-center gap-3 sm:flex">
            <span className="tabular-metrics font-medium">{siteConfig.year}</span>
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            <a
              href="#contato"
              className="underline-offset-4 transition-colors hover:text-[var(--pen)] hover:underline"
            >
              Contato
            </a>
          </div>

          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls="indice-editorial"
            onClick={() => setOpen((v) => !v)}
            onMouseEnter={() => setHoverTrigger(true)}
            onMouseLeave={() => setHoverTrigger(false)}
            onFocus={() => setHoverTrigger(true)}
            onBlur={() => setHoverTrigger(false)}
            className="relative justify-self-start px-3 py-1 font-medium tracking-[0.06em] uppercase transition-colors hover:text-[var(--pen)] sm:justify-self-center"
          >
            <span>{siteConfig.docLabel}</span>
            <PenMark
              kind="oval"
              seed={4}
              padX={4}
              padY={2}
              hoverOnly
              active={hoverTrigger || open}
            />
          </button>

          <div className="flex items-baseline justify-end gap-3">
            <Link
              href="/"
              className="hidden font-medium transition-colors hover:text-[var(--pen)] md:inline"
            >
              {siteConfig.name}
            </Link>
            <span
              className="font-marginalia min-w-[5.5ch] text-right text-xl tracking-normal text-[var(--pen)]"
              aria-live="polite"
            >
              {activeSection}
            </span>
          </div>
        </div>

        {/* Hairline scroll progress bar */}
        <m.div
          aria-hidden="true"
          className="h-[2px] w-full origin-left bg-[var(--pen)]"
          style={{ scaleX: prefersReduced ? scrollYProgress : scaleX }}
        />
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="indice-editorial"
            role="dialog"
            aria-modal="true"
            aria-label="Índice do portfólio"
            data-tone="paper"
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { clipPath: "circle(0% at 50% 0%)", opacity: 1 }
            }
            animate={
              prefersReduced
                ? { opacity: 1 }
                : { clipPath: "circle(150% at 50% 0%)", opacity: 1 }
            }
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { clipPath: "circle(0% at 50% 0%)", opacity: 1 }
            }
            transition={{
              duration: prefersReduced ? 0.15 : 0.65,
              ease: MOTION_EASE.editorial,
            }}
            className="fixed inset-0 z-[70] flex flex-col justify-between overflow-y-auto bg-[var(--tone-paper)] px-6 py-6 text-[var(--ink-paper)] sm:px-12 sm:py-8 lg:px-20"
          >
            <div className="sheet-grain" aria-hidden="true" />

            <div className="relative z-[1] mx-auto flex w-full max-w-[1380px] items-center justify-between border-b border-[var(--rule-paper)] pb-4">
              <span className="text-xs font-medium tracking-[0.08em] uppercase text-[var(--muted-paper)]">
                {siteConfig.docLabel} — {siteConfig.year}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={closeOverlay}
                className="font-marginalia inline-flex items-center gap-1.5 text-2xl text-[var(--pen-paper)] transition-opacity hover:opacity-80"
              >
                <span>fechar</span>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative z-[1] mx-auto my-auto grid w-full max-w-[1380px] gap-12 py-10 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
              <nav aria-label="Folhas desta página">
                <p className="font-marginalia mb-4 text-2xl text-[var(--pen-paper)]">
                  folhas da home piloto
                </p>
                <ol className="grid gap-3 sm:gap-4">
                  {HOME_SECTIONS.map((sec) => (
                    <li key={sec.id}>
                      <button
                        type="button"
                        onClick={() => jumpToSection(sec.id)}
                        className="group flex w-full items-baseline gap-4 py-1 text-left transition-colors hover:text-[var(--pen-paper)]"
                      >
                        <span className="font-marginalia min-w-[2.4ch] text-2xl text-[var(--pen-paper)] sm:text-3xl">
                          {sec.number}
                        </span>
                        <span className="font-editorial text-3xl leading-none sm:text-5xl">
                          {sec.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="border-t border-[var(--rule-paper)] pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
                <p className="font-marginalia mb-4 text-2xl text-[var(--pen-paper)]">
                  arquitetura de rotas do site
                </p>
                <ul className="grid gap-4">
                  {SITE_ROUTES.map((route) => (
                    <li
                      key={route.href}
                      className="flex items-start justify-between gap-4 border-b border-[var(--rule-paper)] pb-3 last:border-b-0"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          {route.status === "active" ? (
                            <Link
                              href={route.href}
                              onClick={closeOverlay}
                              className="inline-flex items-center gap-1 text-base font-semibold text-[var(--ink-paper)] hover:text-[var(--pen-paper)]"
                            >
                              {route.label}
                              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                          ) : (
                            <span className="text-base font-semibold text-[var(--ink-paper)]">
                              {route.label}
                            </span>
                          )}
                          <span className="rounded-full border border-[var(--control-border-paper)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted-paper)]">
                            {route.status === "active"
                              ? "Ativa"
                              : route.status === "etapa-5"
                                ? "Etapa 5"
                                : "Expansão futura"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[var(--muted-paper)]">
                          {route.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative z-[1] mx-auto flex w-full max-w-[1380px] flex-wrap items-center justify-between gap-4 border-t border-[var(--rule-paper)] pt-4 text-xs tracking-[0.06em] text-[var(--muted-paper)]">
              <span>{siteConfig.name}</span>
              <span>Pressione Esc para fechar o índice</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
