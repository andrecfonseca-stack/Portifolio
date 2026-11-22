import { z } from "zod";
import { ProjectSchema, type Project } from "./schemas";

const rawProjects: Project[] = [
  {
    slug: "triagem-ia-clinica",
    indexLabel: "01",
    title: "Triagem+ IA",
    tagline: "Priorização assistida e explicável para pronto-atendimento.",
    kind: "Medicina · IA · Engenharia",
    year: "2026",
    role: "Liderança Clínica & Arquitetura",
    domains: ["Medicina", "Inteligência Artificial", "Engenharia"],
    featured: true,
    status: "Piloto clínico",
    summary:
      "Sistema de apoio à triagem que combina sinais vitais, queixa estruturada e *calibração probabilística transparente*. Em vez de uma caixa-preta, a interface evidencia os [três fatores clínicos] que elevaram o risco e permite auditoria imediata pela equipe.",
    challenge:
      "Reduzir atrasos em casos tempo-dependentes sem induzir fadiga de alertas na equipe de enfermagem.",
    marginNote: "validado em 3 turnos reais de pronto-socorro",
    artifactKind: "clinical-triage",
    stats: [
      { value: 28, suffix: "%", label: "menos tempo até avaliação em risco alto" },
      { value: 0.91, decimals: 2, label: "AUROC calibrada em validação externa" },
    ],
    methods: [
      "Calibração isotônica",
      "SHAP clínico interpretável",
      "Next.js + FHIR",
      "Estudo observacional prospectivo",
    ],
    context:
      "Serviços de emergência convivem com superlotação e variabilidade interobservador na classificação de risco de quadros silenciosos, como sepse precoce e descompensação cardiopulmonar.",
    approach:
      "Desenhamos um modelo híbrido com escores fisiológicos e notas curtas de acolhimento, priorizando calibração de probabilidades e uma visualização clínica em menos de 4 segundos de leitura.",
    impact:
      "No piloto observacional em modo sombra, o sistema antecipou sinalizações críticas mantendo taxa controlada de falsos alertas e alta aceitação qualitativa da equipe.",
    limitations:
      "Ainda em validação multicêntrica; não substitui julgamento clínico e exige recalibração periódica por perfil epidemiológico local.",
  },
  {
    slug: "coortelab-multimodal",
    indexLabel: "02",
    title: "CoorteLab",
    tagline: "Pipeline reprodutível para pesquisa clínica multimodal.",
    kind: "Pesquisa · IA · Engenharia",
    year: "2025",
    role: "Pesquisador Principal & Engenheiro de Dados",
    domains: ["Pesquisa", "Inteligência Artificial", "Engenharia"],
    featured: true,
    status: "Pesquisa ativa",
    summary:
      "Infraestrutura aberta para integrar dados tabulares longitudinais, exames laboratoriais e *relatos clínicos anonimizados* com versionamento estrito. O objetivo foi transformar scripts isolados de laboratório em [experimentos auditáveis] do dado bruto ao manuscrito.",
    challenge:
      "Garantir reprodutibilidade integral e proteção de privacidade sem travar a velocidade exploratória dos pesquisadores.",
    marginNote: "100% dos gráficos do artigo gerados direto do pipeline",
    artifactKind: "ml-cohort",
    stats: [
      { value: 14200, label: "episódios longitudinais harmonizados" },
      { value: 4, suffix: "×", label: "mais rápido replicar análises de sensibilidade" },
    ],
    methods: [
      "Versionamento determinístico",
      "Validação temporal",
      "Análise de subgrupos e equidade",
      "Documentação computacional",
    ],
    context:
      "Projetos acadêmicos em saúde frequentemente perdem rastreabilidade entre limpeza de prontuários, seleção de coorte e tabelas finais submetidas a periódicos.",
    approach:
      "Construímos um fluxo modular com contratos tipados de variáveis clínicas, checagens automáticas de vazamento temporal e relatórios de calibração por faixa etária e sexo.",
    impact:
      "Permitiu que novos estudantes de iniciação científica e mestrado reproduzissem resultados completos em minutos, elevando o padrão metodológico do grupo.",
    limitations:
      "Projetado inicialmente para dados retrospectivos estruturados; suporte a imagens DICOM de grande porte está no roadmap.",
  },
  {
    slug: "atlas-vivo-fisiopatologia",
    indexLabel: "03",
    title: "Atlas Vivo",
    tagline: "Educação médica interativa baseada em modelos fisiológicos.",
    kind: "Educação · Medicina · Engenharia",
    year: "2025",
    role: "Autor Pedagógico & Desenvolvedor Front-end",
    domains: ["Educação", "Medicina", "Engenharia"],
    featured: true,
    status: "Em produção",
    summary:
      "Ambiente web de aprendizagem ativa onde estudantes manipulam parâmetros hemodinâmicos e respiratórios e observam *consequências clínicas em tempo real*. Substituímos slides estáticos por micro-casos guiados com [feedback imediato] sobre o raciocínio.",
    challenge:
      "Traduzir equações fisiológicas complexas em intuição clínica palpável para alunos do ciclo básico e internato.",
    marginNote: "adotado em 6 turmas de graduação e residência",
    artifactKind: "edu-atlas",
    stats: [
      { value: 840, suffix: "+", label: "estudantes ativos nos módulos abertos" },
      { value: 94, suffix: "%", label: "conclusão nos cenários de gasometria" },
    ],
    methods: [
      "Aprendizagem baseada em problemas",
      "Simulação fisiológica determinística",
      "Acessibilidade WCAG 2.2 AA",
      "Instrumentação pedagógica",
    ],
    context:
      "Conceitos como relação ventilação-perfusão, curva de Frank-Starling e distúrbios ácido-base costumam ser memorizados sem compreensão causal profunda.",
    approach:
      "Cada módulo une uma explicação editorial concisa, controles interativos acessíveis por teclado e perguntas diagnósticas que exploram erros conceituais frequentes.",
    impact:
      "Aumentou o engajamento pré-aula em metodologia ativa e reduziu dúvidas recorrentes na interpretação de casos clínicos integrados.",
    limitations:
      "Modelos simplificados para fins didáticos; cada tela explicita os limites fisiológicos em que a aproximação é válida.",
  },
  {
    slug: "pulsodoc-evidencias",
    indexLabel: "04",
    title: "PulsoDoc",
    tagline: "Síntese estruturada de evidências clínicas com rastreabilidade.",
    kind: "IA · Medicina · Pesquisa",
    year: "2024",
    role: "Idealização, Design Editorial & Prototipagem",
    domains: ["Inteligência Artificial", "Medicina", "Pesquisa"],
    featured: true,
    status: "Aberto",
    summary:
      "Ferramenta de leitura assistida que organiza diretrizes e ensaios clínicos em *quadros comparativos verificáveis*. Cada afirmação gerada mantém vínculo direto ao parágrafo original e [nível de evidência], combatendo alucinações em consultas rápidas.",
    challenge:
      "Aproveitar modelos de linguagem em literatura biomédica sem abrir mão da verificação linha a linha das fontes.",
    marginNote: "zero resumo sem citação verificável na margem",
    artifactKind: "evidence-doc",
    stats: [
      { value: 62, suffix: "%", label: "redução no tempo de síntese bibliográfica" },
      { value: 100, suffix: "%", label: "das afirmações ancoradas em fonte primária" },
    ],
    methods: [
      "Recuperação com citações granulares",
      "Classificação GRADE",
      "Interface editorial de leitura",
      "Avaliação por pares clínicos",
    ],
    context:
      "Médicos e pesquisadores enfrentam volume crescente de publicações e frequentemente recorrem a resumos genéricos sem rastreabilidade metodológica.",
    approach:
      "Projetamos um fluxo inspirado em revisões sistemáticas: extração estruturada de população, intervenção, desfecho e limitações, exibida lado a lado com o texto-fonte.",
    impact:
      "Serviu de base para clubes de revista e protocolos internos de atualização terapêutica, fortalecendo leitura crítica assistida por IA.",
    limitations:
      "Depende da qualidade da indexação das fontes incluídas e exige curadoria humana para recomendações de conduta.",
  },
];

export const projects: Project[] = z.array(ProjectSchema).parse(rawProjects);

export const featuredProjects: Project[] = projects.filter((p) => p.featured);
