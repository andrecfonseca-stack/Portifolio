import { z } from "zod";
import { ProjectSchema, type Project } from "./schemas";

const U = "https://images.unsplash.com/photo-";

const rawProjects: Project[] = [
  {
    slug: "triagem-ia-clinica",
    indexLabel: "01",
    title: "Triagem+",
    tagline: "Priorização clínica explicável, passo a passo.",
    kind: "Medicina · IA · App clínico",
    year: "2026",
    role: "Liderança Clínica & Arquitetura",
    domains: ["Medicina", "Inteligência Artificial", "Engenharia"],
    featured: true,
    status: "Piloto clínico",
    summary:
      "Sistema de apoio à triagem desenhado do zero para emergência. Em vez de uma caixa-preta, mapeamos [como a equipe avalia risco] à beira do leito e construímos o fluxo em torno de *decisões auditáveis em segundos*.",
    challenge:
      "Reduzir atrasos em casos tempo-dependentes sem induzir fadiga de alertas na equipe.",
    marginNote: "validado em 3 turnos reais de pronto-socorro!",
    artifactKind: "clinical-triage",
    tag: "piloto clínico",
    accent: "#e2455f",
    tone: "night",
    images: [
      `${U}1547153760-18fc86324498`,
      `${U}1508700929628-666bc8bd84ea`,
      `${U}1518834107812-67b0b7c58434`,
    ],
    screens: ["feed", "cover", "detail"],
    stats: [],
    methods: [
      "Calibração isotônica",
      "SHAP clínico interpretável",
      "Next.js + FHIR",
      "Estudo observacional prospectivo",
    ],
    context:
      "Serviços de emergência convivem com superlotação e variabilidade interobservador na classificação de risco de quadros silenciosos.",
    approach:
      "Desenhamos um modelo híbrido com escores fisiológicos e notas curtas de acolhimento, priorizando calibração de probabilidades e leitura em menos de 4 segundos.",
    impact:
      "No piloto observacional em modo sombra, o sistema antecipou sinalizações críticas mantendo taxa controlada de falsos alertas.",
    limitations:
      "Ainda em validação multicêntrica; não substitui julgamento clínico e exige recalibração periódica.",
  },
  {
    slug: "coortelab-multimodal",
    indexLabel: "02",
    title: "Verde",
    tagline: "Hábitos clínicos e acompanhamento longitudinal gentil.",
    kind: "Pesquisa · Saúde digital",
    year: "2025",
    role: "Pesquisador Principal & Design de Produto",
    domains: ["Pesquisa", "Medicina", "Inteligência Artificial"],
    featured: true,
    status: "Pesquisa ativa",
    summary:
      "Aplicativo de acompanhamento longitudinal nascido de uma imersão em pesquisa clínica. Entrevistas mostraram que pacientes [sentem culpa ao falhar um dia], então o Verde nunca pune ausências — ele celebra *pequenas constâncias* e recalibra o plano.",
    challenge:
      "Manter adesão terapêutica contínua sem uma única notificação punitiva.",
    marginNote: "o melhor insight veio da entrevista #9",
    artifactKind: "ml-cohort",
    tag: "pesquisa clínica",
    accent: "#3f8f6b",
    tone: "paper",
    images: [
      `${U}1544367567-0f2fcb009e0b`,
      `${U}1505576399279-565b52d4ac71`,
      `${U}1506126613408-eca07ce68773`,
    ],
    screens: ["stats", "cover", "feed"],
    stats: [
      { value: 431, label: "pacientes avaliados" },
      { value: 49.5, decimals: 1, suffix: "%", label: "abandonam apps comuns na 1ª semana" },
      { value: 14, label: "entrevistas em profundidade" },
    ],
    methods: [
      "Versionamento determinístico",
      "Validação temporal",
      "Análise de subgrupos",
      "Documentação computacional",
    ],
    context:
      "Protocolos longitudinais frequentemente perdem adesão na primeira semana por excesso de atrito no registro diário.",
    approach:
      "Construímos um fluxo modular com micro-registros adaptativos e relatórios visuais claros de progresso semanal.",
    impact:
      "Elevou a retenção de dados longitudinais na coorte piloto e reduziu relatos de ansiedade associada ao automonitoramento.",
    limitations:
      "Projetado inicialmente para acompanhamento ambulatorial; integração direta com wearables está no roadmap.",
  },
  {
    slug: "atlas-vivo-fisiopatologia",
    indexLabel: "03",
    title: "Atlas Vivo",
    tagline: "Sua biblioteca clínica, finalmente em ordem.",
    kind: "Educação · Arquitetura da informação",
    year: "2025",
    role: "Autor Pedagógico & Arquiteto Front-end",
    domains: ["Educação", "Medicina", "Engenharia"],
    featured: true,
    status: "Em produção",
    summary:
      "Redesenho completo do ambiente de estudo médico que abro todos os dias. Estudantes adoravam os casos clínicos, mas [se perdiam na navegação]. Reconstruí a arquitetura da informação em torno *da estante de casos, não do feed*, dando espaço para leitura profunda.",
    challenge:
      "Tornar as ferramentas diagnósticas e referências encontráveis em dois toques ou menos.",
    marginNote: "card sorting com 12 residentes e alunos",
    artifactKind: "edu-atlas",
    tag: "educação médica",
    accent: "#b4612a",
    tone: "night",
    images: [
      `${U}1544947950-fa07a98d237f`,
      `${U}1495446815901-a7297e633e8d`,
      `${U}1532012197267-da84d127e765`,
    ],
    screens: ["detail", "feed", "cover"],
    stats: [],
    methods: [
      "Aprendizagem baseada em problemas",
      "Arquitetura da informação",
      "Acessibilidade WCAG 2.2 AA",
      "Instrumentação pedagógica",
    ],
    context:
      "Conceitos fisiopatológicos e revisões bibliográficas costumam ficar dispersos em dezenas de PDFs e anotações desconexas.",
    approach:
      "Cada módulo une uma explicação editorial concisa, organização por sistemas orgânicos e síntese rápida de evidências.",
    impact:
      "Aumentou o engajamento pré-aula em metodologia ativa e reduziu o tempo de localização de diretrizes.",
    limitations:
      "Modelos simplificados para fins didáticos; cada ficha explicita os limites fisiológicos aplicáveis.",
  },
  {
    slug: "pulsodoc-evidencias",
    indexLabel: "04",
    title: "PulsoDoc",
    tagline: "Evidências verificadas, feitas para durar.",
    kind: "IA · Síntese biomédica",
    year: "2024",
    role: "Idealização, Design Editorial & Engenharia",
    domains: ["Inteligência Artificial", "Medicina", "Pesquisa"],
    featured: true,
    status: "Aberto",
    summary:
      "Aplicação que apoia médicos e pesquisadores na leitura *crítica e rastreável* de ensaios clínicos. Profissionais queriam velocidade, mas não confiavam em resumos opacos — exibir [graus de evidência e notas metodológicas] fez toda a diferença.",
    challenge:
      "Construir confiança imediata na síntese assistida por IA antes de qualquer conduta.",
    marginNote: "zero resumo sem citação verificável na margem",
    artifactKind: "evidence-doc",
    tag: "síntese & IA",
    accent: "#6d7138",
    tone: "paper",
    images: [
      `${U}1490481651871-ab68de25d43d`,
      `${U}1515886657613-9f3515b0c78f`,
      `${U}1445205170230-053b83016050`,
    ],
    screens: ["cover", "detail", "feed"],
    stats: [
      { value: 6, label: "rodadas de testes de usabilidade" },
      { value: 32, suffix: "%", label: "mais rapidez na revisão crítica" },
    ],
    methods: [
      "Recuperação com citações granulares",
      "Classificação GRADE",
      "Interface editorial de leitura",
      "Avaliação por pares clínicos",
    ],
    context:
      "Médicos enfrentam volume crescente de publicações e frequentemente recorrem a sínteses genéricas sem rastreabilidade.",
    approach:
      "Projetamos um fluxo inspirado em revisões sistemáticas: extração estruturada exibida lado a lado com a fonte primária.",
    impact:
      "Serviu de base para clubes de revista e protocolos internos de atualização terapêutica.",
    limitations:
      "Depende da qualidade da indexação das fontes incluídas e exige curadoria humana.",
  },
  {
    slug: "sinapse-referencias",
    indexLabel: "05",
    title: "Muse",
    tagline: "Cada referência científica em um lugar calmo.",
    kind: "Projeto autoral · iOS & Web",
    year: "2024",
    role: "Concepção & Desenvolvimento Full-stack",
    domains: ["Pesquisa", "Educação", "Engenharia"],
    featured: true,
    status: "Aberto",
    summary:
      "Pesquisadores salvam referências em toda parte e não as encontram quando escrevem. O Muse torna simples *salvar, classificar e compartilhar* achados visuais e artigos, permitindo [redescobri-los por tema e hipótese] sem perder o fio da pesquisa.",
    challenge:
      "Transformar uma pasta caótica de capturas e preprints em um caderno visual apresentável.",
    marginNote: "protótipo construído em um fim de semana",
    artifactKind: "evidence-doc",
    tag: "projeto autoral",
    accent: "#6f5cf0",
    tone: "night",
    images: [
      `${U}1541961017774-22349e4a1262`,
      `${U}1579783902614-a3fb3927b6a5`,
      `${U}1513364776144-60967b0f800f`,
    ],
    screens: ["feed", "detail", "stats"],
    stats: [],
    methods: [
      "Indexação semântica e visual",
      "Organização por coleções",
      "Interface minimalista",
      "Exportação para aulas e artigos",
    ],
    context:
      "Durante a preparação de aulas e manuscritos, figuras, diagramas e recortes de literatura costumam se perder.",
    approach:
      "Criamos um fichário visual rápido com busca por cor, tag metodológica e vínculo direto à fonte original.",
    impact:
      "Acelerou a montagem de aulas visuais e painéis de discussão interdisciplinar.",
    limitations:
      "Focado em curadoria individual e pequenos grupos de pesquisa.",
  },
];

export const projects: Project[] = z.array(ProjectSchema).parse(rawProjects);

export const featuredProjects: Project[] = projects.filter((p) => p.featured);
