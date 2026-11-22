# Registro de Decisões Arquiteturais (ADRs)

Este diretório documenta as decisões estruturais do portfólio interdisciplinar, registrando alternativas consideradas e trade-offs assumidos.

## ADR-001 — Geração Estática e React Server Components por Padrão

- **Decisão:** Utilizar Next.js App Router com páginas pré-renderizadas estaticamente e React Server Components (RSC) por padrão, restringindo `"use client"` às ilhas interativas (primitivas de movimento, navegação do índice, tiles interativos e botão de cópia de e-mail).
- **Alternativa descartada:** Single-Page Application client-side ou componente monolítico `"use client"`.
- **Trade-off:** Exige rebuild ao atualizar conteúdo estático, em troca de HTML semântico imediato no SSR, menor bundle JavaScript no cliente e excelente base para SEO e Core Web Vitals.

## ADR-002 — Design System Marginalia em Tailwind CSS v4 (CSS-First) com Contraste WCAG 2.2 AA

- **Decisão:** Adotar tokens semânticos CSS-first (`@theme` e atributos `data-tone="paper" | "night"`) inspirados na estética editorial de folhas alternadas (*Papel Algodão* e *Ardósia Cirúrgica*) com cor de caneta adaptativa (`#A93F21` sobre papel — `5,27:1`; `#F08A65` sobre noite — `6,49:1`).
- **Alternativa descartada:** Reutilizar a cor de caneta original do modelo (`#7D84EF` ou `#E0613A`), que falha WCAG 2.2 AA sobre fundo claro (`2,74:1` e `2,90:1`).
- **Trade-off:** Dois tokens calibrados de caneta em vez de um hex único, preservando unidade estética com conformidade estrita de acessibilidade.

## ADR-003 — Sistema de Movimento Exclusivamente em Motion (`motion/react`)

- **Decisão:** Reimplementar a linguagem de movimento do modelo (revelação tipográfica, traçado SVG `pathLength`, expansão da folha noturna no scroll, 3D tilt seletivo) utilizando exclusivamente `motion/react` sob `<LazyMotion features={domAnimation} strict>` e `<MotionConfig reducedMotion="user">`.
- **Alternativa descartada:** Adicionar `gsap` (+ `ScrollTrigger` / `MorphSVGPlugin`) ao lado de `motion`.
- **Trade-off:** Substituímos o morph proprietário zig-zag → swoosh por traçado editorial contínuo via `pathLength`, eliminando duplicidade de biblioteca de animação e mantendo bundle enxuto.

## ADR-004 — Conteúdo Tipado com TypeScript + Zod

- **Decisão:** Estruturar perfil e projetos em módulos TypeScript em `src/content/` validados por schemas `zod` em tempo de build, acompanhados de parser enxuto próprio para marcações editoriais (`*sublinhado*` e `[circulado]`).
- **Alternativa descartada:** Introduzir pipeline extra de compilação MDX (`velite`) já na Home piloto.
- **Trade-off:** Build mais simples e imediato nesta etapa, mantendo contratos de dados preparados para acoplar coleções MDX futuras (`/publicacoes`, `/notas`) sem refatoração do layout.

## ADR-005 — Contato Integrado sem Backend ou Banco de Dados

- **Decisão:** Integrar o ponto de contato no rodapé arquitetural (`#contato`) com cópia de e-mail em 1 clique (fallback `mailto:` + aviso `aria-live="polite"`), QR Code SVG puro para currículo acadêmico e perfis canônicos.
- **Alternativa descartada:** Formulário com API Route, servidor SMTP e armazenamento em banco de dados.
- **Trade-off:** Sem persistência de mensagens no site, eliminando superfície de spam, segredos de backend e custo operacional desnecessário.
