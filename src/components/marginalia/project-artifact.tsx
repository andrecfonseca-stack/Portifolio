import { Activity, BookOpenCheck, GitBranch, FileSearch2 } from "lucide-react";
import type { Project } from "@/content/schemas";
import { InteractiveTilt3D } from "@/components/motion/tilt-card";

/**
 * Editorial-scientific artifact frame representing each interdisciplinary project.
 * Replaces generic phone mockups with authentic clinical, ML, educational and evidence previews.
 */
export function ProjectArtifactFrame({ project }: { project: Project }) {
  return (
    <InteractiveTilt3D>
      <div className="relative overflow-hidden rounded-2xl border border-[var(--control-border)] bg-[var(--surface-elevated)] p-5 shadow-[0_24px_54px_-32px_rgba(27,35,38,0.42)] sm:p-6">
        {/* Top editorial specification bar */}
        <div className="flex items-center justify-between gap-3 border-b border-[var(--rule)] pb-3 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--muted)]">
          <span className="inline-flex items-center gap-1.5">
            {project.artifactKind === "clinical-triage" && (
              <Activity className="h-3.5 w-3.5 text-[var(--clinical)]" aria-hidden="true" />
            )}
            {project.artifactKind === "ml-cohort" && (
              <GitBranch className="h-3.5 w-3.5 text-[var(--clinical)]" aria-hidden="true" />
            )}
            {project.artifactKind === "edu-atlas" && (
              <BookOpenCheck className="h-3.5 w-3.5 text-[var(--clinical)]" aria-hidden="true" />
            )}
            {project.artifactKind === "evidence-doc" && (
              <FileSearch2 className="h-3.5 w-3.5 text-[var(--clinical)]" aria-hidden="true" />
            )}
            <span>Artefato {project.indexLabel}</span>
          </span>
          <span className="rounded-full border border-[var(--rule)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--clinical)]">
            {project.status}
          </span>
        </div>

        {/* Artifact visual body tailored by interdisciplinary kind */}
        <div className="mt-5">
          {project.artifactKind === "clinical-triage" && <ClinicalTriageVisual />}
          {project.artifactKind === "ml-cohort" && <MlCohortVisual />}
          {project.artifactKind === "edu-atlas" && <EduAtlasVisual />}
          {project.artifactKind === "evidence-doc" && <EvidenceDocVisual />}
        </div>

        {/* Method tags footer */}
        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-[var(--rule)] pt-4">
          {project.methods.slice(0, 3).map((method) => (
            <span
              key={method}
              className="rounded-md bg-[var(--surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)]"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </InteractiveTilt3D>
  );
}

function ClinicalTriageVisual() {
  const factors = [
    { label: "Frequência respiratória (26 irpm)", weight: 84, impact: "+0,31" },
    { label: "Pressão arterial sistólica (94 mmHg)", weight: 68, impact: "+0,24" },
    { label: "Lactato capilar / perfusão", weight: 52, impact: "+0,16" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between rounded-xl bg-[var(--surface)] p-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[var(--muted)]">
            Probabilidade calibrada · Sepse precoce
          </p>
          <p className="font-editorial tabular-metrics mt-1 text-3xl text-[var(--fg)]">
            71,4%
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block rounded-full bg-[var(--pen)] px-3 py-1 text-xs font-semibold text-[#FAF8F3]">
            Prioridade Alta
          </span>
          <p className="tabular-metrics mt-1 text-[11px] text-[var(--muted)]">
            IC 95%: 65–77%
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-[var(--fg)]">
          Fatores clínicos explicáveis (SHAP local)
        </p>
        {factors.map((f) => (
          <div key={f.label} className="space-y-1">
            <div className="flex justify-between gap-2 text-xs">
              <span className="text-[var(--muted)]">{f.label}</span>
              <span className="tabular-metrics font-semibold text-[var(--pen)]">
                {f.impact}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface)]">
              <div
                className="h-full rounded-full bg-[var(--clinical)]"
                style={{ width: `${f.weight}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MlCohortVisual() {
  const stages = [
    { step: "01", title: "Harmonização FHIR", meta: "14.200 episódios · 0 leakage" },
    { step: "02", title: "Split Temporal", meta: "Treino 2019–23 · Validação 2024" },
    { step: "03", title: "Auditoria de Subgrupos", meta: "Δ ECE < 0,018 por faixa etária" },
  ];
  return (
    <div className="space-y-3">
      {stages.map((s) => (
        <div
          key={s.step}
          className="flex items-center justify-between gap-3 rounded-xl border border-[var(--rule)] bg-[var(--surface)] px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="font-marginalia text-2xl text-[var(--pen)]">
              {s.step}
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--fg)]">{s.title}</p>
              <p className="tabular-metrics text-xs text-[var(--muted)]">{s.meta}</p>
            </div>
          </div>
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--clinical)]"
          />
        </div>
      ))}
      <div className="rounded-xl bg-[var(--surface)] px-4 py-3">
        <div className="mb-1.5 flex justify-between text-[11px] font-medium text-[var(--muted)]">
          <span>Curva de calibração (validação externa)</span>
          <span className="tabular-metrics text-[var(--clinical)]">Brier 0,084</span>
        </div>
        <svg viewBox="0 0 240 54" aria-hidden="true" className="h-12 w-full">
          <line
            x1="8"
            y1="46"
            x2="232"
            y2="8"
            stroke="var(--rule)"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <path
            d="M8 46 C 58 40, 102 29, 152 20 C 184 14, 210 11, 232 9"
            fill="none"
            stroke="var(--pen)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="68" cy="36" r="3.5" fill="var(--clinical)" />
          <circle cx="134" cy="24" r="3.5" fill="var(--clinical)" />
          <circle cx="196" cy="13" r="3.5" fill="var(--clinical)" />
        </svg>
      </div>
    </div>
  );
}

function EduAtlasVisual() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[var(--fg)]">
            Módulo 04 · Curva de Frank-Starling
          </span>
          <span className="tabular-metrics font-medium text-[var(--clinical)]">
            Caso interativo
          </span>
        </div>
        <svg viewBox="0 0 260 96" aria-hidden="true" className="mt-3 h-24 w-full">
          <line x1="20" y1="84" x2="246" y2="84" stroke="var(--rule)" strokeWidth="1.5" />
          <line x1="20" y1="12" x2="20" y2="84" stroke="var(--rule)" strokeWidth="1.5" />
          {/* Normal physiology curve */}
          <path
            d="M24 80 C 65 44, 130 22, 238 18"
            fill="none"
            stroke="var(--clinical)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Reduced contractility curve */}
          <path
            d="M24 80 C 78 60, 140 50, 238 48"
            fill="none"
            stroke="var(--pen)"
            strokeWidth="2.2"
            strokeDasharray="5 4"
            strokeLinecap="round"
          />
          <circle cx="132" cy="30" r="4.5" fill="var(--clinical)" />
          <circle cx="132" cy="54" r="4.5" fill="var(--pen)" />
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { k: "Pré-carga", v: "14 mmHg" },
          { k: "Débito", v: "4,8 L/min" },
          { k: "Resposta", v: "+18%" },
        ].map((item) => (
          <div
            key={item.k}
            className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] px-2 py-2.5"
          >
            <p className="text-[11px] text-[var(--muted)]">{item.k}</p>
            <p className="tabular-metrics mt-0.5 text-sm font-semibold text-[var(--fg)]">
              {item.v}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvidenceDocVisual() {
  const claims = [
    {
      grade: "GRADE Alta",
      text: "Redução de mortalidade em 28 dias no subgrupo precoce.",
      source: "NEJM 2024 · p. 1142, §3",
    },
    {
      grade: "GRADE Moderada",
      text: "Heterogeneidade moderada entre centros de baixo volume.",
      source: "Lancet 2025 · Tabela 2",
    },
  ];
  return (
    <div className="space-y-3">
      {claims.map((c) => (
        <div
          key={c.source}
          className="rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-[var(--surface-elevated)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--clinical)]">
              {c.grade}
            </span>
            <span className="tabular-metrics text-[11px] font-medium text-[var(--pen)]">
              {c.source}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--fg)]">
            {c.text}
          </p>
        </div>
      ))}
    </div>
  );
}
