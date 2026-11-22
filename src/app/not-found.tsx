import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sheet } from "@/components/layout/sheet";

export default function NotFound() {
  return (
    <Sheet
      id="nao-encontrada"
      label="404"
      tone="paper"
      className="flex min-h-[100svh] items-center pt-28"
    >
      <div className="max-w-[54ch]">
        <p className="font-marginalia text-3xl text-[var(--pen)]">
          folha não encontrada — 404
        </p>
        <h1 className="font-editorial mt-3 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] text-[var(--fg)]">
          Esta página ainda não faz parte do caderno.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-[var(--muted)]">
          O endereço solicitado não existe ou pertence às rotas previstas para as
          próximas etapas do portfólio.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--control-border)] px-5 py-2.5 text-sm font-semibold text-[var(--fg)] transition-colors hover:border-[var(--pen)] hover:text-[var(--pen)]"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--pen)]" aria-hidden="true" />
          <span>Voltar para a folha inicial</span>
        </Link>
      </div>
    </Sheet>
  );
}
