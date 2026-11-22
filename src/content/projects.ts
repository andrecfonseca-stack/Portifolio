import { z } from "zod";
import { ProjectSchema, type Project } from "./schemas";

const U = "https://images.unsplash.com/photo-";

const rawProjects: Project[] = [
  {
    slug: "conecta-saude",
    indexLabel: "01",
    title: "Conecta+Saúde",
    tagline: "Triagem e georreferenciamento na UBS",
    kind: "Atenção Primária & SUS · IA",
    year: "2026",
    role: "Arquitetura de IA & Georreferenciamento",
    domains: ["Medicina", "Inteligência Artificial", "Engenharia"],
    featured: true,
    status: "Programa Centelha • Pernambuco",
    summary:
      "Plataforma de suporte à decisão para Unidades Básicas de Saúde (UBS) validada no Programa Centelha. Integra *modelos preditivos de Machine Learning* para classificação de risco, [georreferenciamento territorial] e interface conversacional para apoiar a triagem e a alocação de recursos no SUS.",
    challenge:
      "Superar gargalos na priorização de atendimentos e na alocação territorial de recursos na Atenção Primária à Saúde.",
    marginNote: "validado no Programa Centelha PE!",
    artifactKind: "clinical-triage",
    tag: "atenção primária & sus",
    accent: "#e2455f",
    tone: "night",
    images: [
      "/images/projetos/conecta-saude.jpg",
      "/images/projetos/conecta-saude.jpg",
      `${U}1518834107812-67b0b7c58434`,
    ],
    screens: ["feed", "cover", "detail"],
    stats: [],
    methods: [
      "Python",
      "Machine Learning",
      "Georreferenciamento",
      "NLP / Chatbot",
    ],
    star: {
      situacao:
        "Unidades Básicas de Saúde (UBS) enfrentam alta demanda assistencial e gargalos na priorização de atendimentos e na alocação territorial de recursos públicos, muitas vezes sem ferramentas integradas de inteligência geográfica e triagem.",
      tarefa:
        "Arquitetar uma plataforma de suporte à decisão para a Atenção Primária à Saúde no âmbito do Programa Centelha de Inovação em Pernambuco.",
      acao:
        "Desenvolvi uma solução integrando modelos preditivos de Machine Learning para classificação de risco, georreferenciamento territorial e uma interface conversacional (chatbot) para auxiliar a triagem e o planejamento das equipes de saúde.",
      resultado:
        "Entrega de plataforma funcional validada no Programa Centelha, demonstrando como a convergência entre inteligência artificial e análise espacial pode otimizar fluxos de triagem e a distribuição de recursos no SUS.",
    },
    context:
      "Unidades Básicas de Saúde (UBS) enfrentam alta demanda assistencial e gargalos na priorização de atendimentos e na alocação territorial de recursos públicos.",
    approach:
      "Solução integrando modelos preditivos de Machine Learning para classificação de risco, georreferenciamento territorial e interface conversacional (chatbot).",
    impact:
      "Plataforma funcional validada no Programa Centelha em Pernambuco para otimizar fluxos de triagem e distribuição de recursos no SUS.",
    limitations:
      "Implantação em escala municipal requer integração contínua com bases do e-SUS APS.",
  },
  {
    slug: "atlas-iam",
    indexLabel: "02",
    title: "Atlas IAM Brasil",
    tagline: "ML interpretável e econometria nas 27 capitais",
    kind: "Pesquisa · Epidemiologia & ML",
    year: "2026",
    role: "Pesquisador Principal & Modelagem",
    domains: ["Pesquisa", "Medicina", "Inteligência Artificial"],
    featured: true,
    status: "WCC 2026 • Submetido ABC Cardiol",
    summary:
      "Investigação dos determinantes ecológicos das internações por Infarto Agudo do Miocárdio nas 27 capitais brasileiras (2013–2021). Triangulamos *XGBoost, SHAP/ALE e econometria de painel* (DATASUS, Vigitel e IBGE), comprovando que [indicadores socioeducacionais] superam fatores clínicos tradicionais na explicação das disparidades.",
    challenge:
      "Avaliar o peso dos determinantes sociais versus fatores clínicos e testar a transportabilidade regional e temporal de modelos de ML no Brasil.",
    marginNote: "2 resumos aceitos no World Congress of Cardiology 2026",
    artifactKind: "ml-cohort",
    tag: "pesquisa & painel",
    accent: "#3f8f6b",
    tone: "paper",
    images: [
      `${U}1544367567-0f2fcb009e0b`,
      `${U}1505576399279-565b52d4ac71`,
      `${U}1506126613408-eca07ce68773`,
    ],
    screens: ["stats", "cover", "feed"],
    stats: [
      { value: 27, label: "capitais brasileiras (2013–2021)" },
      { value: 243, label: "observações capital-ano harmonizadas" },
      { value: 0.869, decimals: 3, label: "ROC-AUC na explicação de disparidades" },
    ],
    methods: [
      "XGBoost",
      "SHAP / ALE",
      "Econometria de Painel",
      "Statsmodels",
      "DATASUS",
    ],
    star: {
      situacao:
        "As taxas de hospitalização por Infarto Agudo do Miocárdio (IAM) variam drasticamente entre as capitais brasileiras, com lacunas sobre o peso dos determinantes sociais versus fatores clínicos tradicionais e sobre a confiabilidade regional de modelos nacionais.",
      tarefa:
        "Investigar os determinantes ecológicos das internações por IAM nas 27 capitais brasileiras (2013–2021) e avaliar a transportabilidade geográfica e temporal de algoritmos de aprendizado de máquina.",
      acao:
        "Integrei bases do DATASUS/SIH, Vigitel e IBGE (243 observações capital-ano) para treinar modelos em XGBoost e Random Forest com validação temporal (rolling-origin e expanding-window) e espacial (Leave-One-Region-Out), triangulando SHAP/ALE com regressão Binomial Negativa, GEE, MICE, FDR e E-values.",
      resultado:
        "Comprovação de que indicadores socioeducacionais superam fatores clínicos na explicação das disparidades (ROC-AUC 0,869) e que modelos nacionais falham em recortes regionais e no pós-pandemia (2021). Gerou dois resumos publicados no World Congress of Cardiology 2026 e artigo submetido aos Arquivos Brasileiros de Cardiologia.",
    },
    context:
      "As taxas de hospitalização por IAM variam drasticamente entre as capitais brasileiras, com lacunas sobre o peso dos determinantes sociais versus fatores clínicos.",
    approach:
      "Integração DATASUS/SIH, Vigitel e IBGE com validação temporal e espacial (Leave-One-Region-Out) e triangulação com econometria de painel.",
    impact:
      "Dois resumos publicados no World Congress of Cardiology 2026 e artigo submetido aos Arquivos Brasileiros de Cardiologia.",
    limitations:
      "Delineamento ecológico agregado por capital; inferências operam em nível populacional e territorial.",
  },
  {
    slug: "dengue-recife",
    indexLabel: "03",
    title: "Dengue Recife",
    tagline: "Incidência por distrito e semana epidemiológica",
    kind: "Vigilância Territorial · Saúde Digital",
    year: "2026",
    role: "Engenharia de Dados & Saúde Digital (CCM/UFPE)",
    domains: ["Pesquisa", "Medicina", "Engenharia"],
    featured: true,
    status: "Em desenvolvimento • CCM/UFPE",
    summary:
      "Painel analítico retrospectivo desenvolvido em Saúde Digital (CCM/UFPE) integrando Dados Abertos do Recife e IBGE por semana epidemiológica e distrito sanitário. Compara *linhas de base sazonais e Machine Learning* em horizonte de quatro semanas com [faixas de incerteza e governança LGPD] direto na interface.",
    challenge:
      "Consolidar notificações e dados territoriais por distrito sanitário lidando com atrasos de registro e proteção estrita contra reidentificação.",
    marginNote: "auditoria de completude territorial na tela principal",
    artifactKind: "edu-atlas",
    tag: "vigilância territorial",
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
      "Python",
      "Séries Temporais",
      "Dados Abertos Recife",
      "LGPD",
      "Saúde Digital",
    ],
    star: {
      situacao:
        "Equipes de vigilância epidemiológica municipal precisam consolidar notificações, calendário epidemiológico e dados territoriais para acompanhar a evolução da dengue por distrito sanitário no Recife, lidando com atrasos de registro e risco de interpretações individuais.",
      tarefa:
        "Projetar e desenvolver um painel analítico retrospectivo na disciplina de Saúde Digital (CCM/UFPE) para organizar dados agregados e explorar estimativas de incidência acumulada em horizonte de quatro semanas por distrito sanitário.",
      acao:
        "Estruturei o pipeline de harmonização de dados públicos do Portal de Dados Abertos do Recife e do IBGE por semana epidemiológica e distrito, calculando incidências por 100 mil habitantes e definindo protocolos de comparação entre linhas de base sazonais e Machine Learning sob rigorosa governança (LGPD).",
      resultado:
        "Protótipo analítico estruturado com foco em transparência — exibindo faixas de incerteza, completude territorial e auditoria de qualidade da base diretamente na interface principal, sem exposição de identificadores individuais.",
    },
    context:
      "Equipes de vigilância epidemiológica municipal precisam consolidar notificações e dados territoriais por distrito sanitário no Recife.",
    approach:
      "Harmonização do Portal de Dados Abertos do Recife e IBGE por semana epidemiológica com taxas por 100 mil habitantes e governança LGPD.",
    impact:
      "Protótipo analítico transparente exibindo faixas de incerteza e completude territorial sem exposição individual.",
    limitations:
      "Sujeito ao atraso de digitação das semanas epidemiológicas mais recentes (nowcasting em evolução).",
  },
  {
    slug: "heart-seg",
    indexLabel: "04",
    title: "Heart-Seg",
    tagline: "Segmentação cardíaca com MONAI e Conformal",
    kind: "Visão Computacional · CIn-UFPE",
    year: "2025",
    role: "Pesquisador em Visão Computacional Médica",
    domains: ["Inteligência Artificial", "Medicina", "Pesquisa"],
    featured: true,
    status: "Pesquisa • CIn-UFPE",
    summary:
      "Pipelines automatizados em PyTorch e MONAI para segmentação de tomografias cardíacas e quantificação do tecido adiposo epicárdico no CIn-UFPE. Integramos *Conformal Prediction* para calibrar e mensurar formalmente [o grau de incerteza das máscaras] antes do uso clínico.",
    challenge:
      "Substituir a quantificação manual demorada e variável por segmentação automatizada com garantias estatísticas formais de confiança.",
    marginNote: "extração 3D reprodutível com incerteza calibrada",
    artifactKind: "evidence-doc",
    tag: "visão computacional",
    accent: "#6d7138",
    tone: "paper",
    images: [
      `${U}1490481651871-ab68de25d43d`,
      `${U}1515886657613-9f3515b0c78f`,
      `${U}1445205170230-053b83016050`,
    ],
    screens: ["cover", "detail", "feed"],
    stats: [
      { value: 3, suffix: "D", label: "segmentação volumétrica com MONAI & 3D Slicer" },
      { value: 95, suffix: "%", label: "cobertura estatística alvo via Conformal Prediction" },
    ],
    methods: [
      "PyTorch",
      "MONAI",
      "Conformal Prediction",
      "3D Slicer",
      "Computer Vision",
    ],
    star: {
      situacao:
        "A quantificação manual do tecido adiposo epicárdico em exames de tomografia computadorizada é demorada, sujeita à variabilidade entre avaliadores e carece de estimativas formais de confiança para apoio seguro à decisão clínica.",
      tarefa:
        "Desenvolver e estruturar pipelines automatizados de segmentação de imagens cardíacas com quantificação de incerteza estatística no Laboratório de Pós-Graduação em IA do CIn-UFPE.",
      acao:
        "Construí fluxos de treinamento e inferência em PyTorch e MONAI para segmentação automatizada em tomografias cardíacas, integrando técnicas de Conformal Prediction para calibrar e mensurar o grau de incerteza das predições.",
      resultado:
        "Pipeline reprodutível capaz de automatizar a extração anatômica e entregar garantias estatísticas de confiabilidade das máscaras geradas, elevando a segurança do uso de visão computacional em cardiologia.",
    },
    context:
      "A quantificação manual do tecido adiposo epicárdico em tomografia computadorizada é demorada e sujeita à variabilidade interobservador.",
    approach:
      "Treinamento e inferência em PyTorch e MONAI combinados a Conformal Prediction no CIn-UFPE.",
    impact:
      "Automação reprodutível da extração anatômica com garantias estatísticas formais de confiabilidade.",
    limitations:
      "Requer validação prospectiva multicêntrica em diferentes protocolos de aquisição tomográfica.",
  },
  {
    slug: "iatria",
    indexLabel: "05",
    title: "IATRIA",
    tagline: "Letramento crítico em IA aplicada à medicina",
    kind: "Educação Médica & IA · Formação",
    year: "2025",
    role: "Co-fundador & Instrutor",
    domains: ["Educação", "Medicina", "Inteligência Artificial"],
    featured: true,
    status: "Co-fundador & Instrutor",
    summary:
      "Curso prático co-fundado para capacitar médicos no uso *crítico, ético e seguro* da Inteligência Artificial na clínica e na pesquisa. A trilha parte de problemas reais do consultório e do hospital para ensinar [governança clínica e avaliação de vieses] com autonomia.",
    challenge:
      "Formar médicos capazes de utilizar ferramentas de IA com rigor metodológico e segurança clínica, combatendo o uso acrítico.",
    marginNote: "múltiplas turmas de médicos formados na prática",
    artifactKind: "evidence-doc",
    tag: "educação médica & ia",
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
      "Educação Médica",
      "Governança Clínica",
      "Prompt Engineering",
      "PBL",
    ],
    star: {
      situacao:
        "Médicos na prática clínica e acadêmica enfrentam uma rápida inserção de ferramentas de Inteligência Artificial, mas sem capacitação estruturada sobre governança clínica, limitações de modelos, vieses algorítmicos e engenharia de prompts segura.",
      tarefa:
        "Co-fundar e ministrar, em sociedade, um curso prático voltado especificamente para médicos, focado no letramento crítico e na aplicação segura da Inteligência Artificial na medicina.",
      acao:
        "Estruturei e conduzi uma trilha formativa prática e baseada em problemas reais do consultório, do hospital e da pesquisa clínica, ensinando médicos a avaliar criticamente ferramentas de IA, desenhar fluxos de trabalho seguros e integrar evidências científicas com novas tecnologias.",
      resultado:
        "Formação de múltiplas turmas de médicos capacitados para utilizar a Inteligência Artificial com rigor ético, técnico e autonomia clínica, reduzindo riscos de uso acrítico e aumentando a eficiência na prática médica.",
    },
    context:
      "Médicos enfrentam rápida inserção de ferramentas de IA sem capacitação estruturada sobre governança clínica, vieses e limitações.",
    approach:
      "Trilha formativa baseada em problemas reais do consultório, hospital e pesquisa clínica.",
    impact:
      "Formação de múltiplas turmas de médicos capacitados com autonomia técnica e rigor ético.",
    limitations:
      "Currículo atualizado continuamente conforme evolução regulatória e de modelos fundacionais.",
  },
];

export const projects: Project[] = z.array(ProjectSchema).parse(rawProjects);

export const featuredProjects: Project[] = projects.filter((p) => p.featured);
