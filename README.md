# Portfólio Interdisciplinar — Medicina, IA, Pesquisa, Educação e Engenharia

Portfólio editorial interativo construído em **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Motion (`motion/react`)**, **Lucide React**, **Zod** e **Playwright + axe-core**.

## Direção Editorial (Marginalia)

- **Folhas alternadas** (*Papel Algodão* `#F2EDE4` e *Ardósia Cirúrgica* `#1B2326`) com cor de caneta adaptativa calibrada para **WCAG 2.2 AA** (`#A93F21` sobre papel — `5,27:1`; `#F08A65` sobre noite — `6,49:1`).
- **Tipografia editorial** otimizada via `next/font/google`: `DM Serif Display`, `Plus Jakarta Sans` e `Caveat` (restrita a anotações marginais).
- **Sistema de movimento** sob `<LazyMotion features={domAnimation} strict>` e `<MotionConfig reducedMotion="user">`, com suporte completo a `prefers-reduced-motion`.

## Scripts

```bash
npm run dev        # Servidor de desenvolvimento
npm run typecheck  # Verificação estrita TypeScript
npm run lint       # ESLint (Next Core Web Vitals + TS)
npm run build      # Build de produção (geração estática)
npm run test:e2e   # Suíte Playwright + auditoria WCAG 2.2 AA (Etapa 4+)
```

## Decisões Arquiteturais

Consulte [`docs/adr/README.md`](./docs/adr/README.md) para o registro de decisões, alternativas descartadas e trade-offs.
