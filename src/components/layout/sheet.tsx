import * as React from "react";
import { NightSheetBg } from "@/components/motion/night-sheet-bg";
import { cn } from "@/lib/cn";

export type SheetTone = "paper" | "night";

export function Sheet({
  id,
  label,
  tone,
  morph = false,
  className,
  children,
}: {
  id: string;
  label: string;
  tone: SheetTone;
  morph?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-sheet={id}
      data-tone={tone}
      data-label={label}
      className={cn(
        "relative isolate overflow-x-clip px-5 py-20 sm:px-10 md:py-28 lg:px-16 xl:px-24",
        className,
      )}
    >
      {tone === "night" && <NightSheetBg morph={morph} />}
      <div className="sheet-grain" aria-hidden="true" />
      <div className="relative z-[1] mx-auto w-full max-w-[1380px]">
        {children}
      </div>
    </section>
  );
}
