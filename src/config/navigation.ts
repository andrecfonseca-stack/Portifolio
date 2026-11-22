export type HomeSectionNavItem = {
  id: string;
  number: string;
  label: string;
  shortLabel: string;
};

export type RouteNavItem = {
  href: string;
  label: string;
  description: string;
  status: "active" | "etapa-5" | "future";
};

export const HOME_SECTIONS: HomeSectionNavItem[] = [
  { id: "capa", number: "01", label: "Capa & Posicionamento", shortLabel: "capa" },
  { id: "apresentacao", number: "02", label: "Apresentação", shortLabel: "olá" },
  { id: "atuacao", number: "03", label: "Atuação & Método", shortLabel: "atuação" },
  { id: "projetos", number: "04", label: "Projetos Selecionados", shortLabel: "projetos" },
  { id: "contato", number: "05", label: "Contato & Carta", shortLabel: "contato" },
];

export const SITE_ROUTES: RouteNavItem[] = [
  {
    href: "/",
    label: "Início",
    description: "Visão editorial, eixos interdisciplinares e projetos em destaque",
    status: "active",
  },
  {
    href: "/projetos",
    label: "Projetos",
    description: "Galeria filtrável por domínio e estudos de caso aprofundados",
    status: "etapa-5",
  },
  {
    href: "/sobre",
    label: "Sobre",
    description: "Trajetória clínica, formação acadêmica e linhas de pesquisa",
    status: "etapa-5",
  },
  {
    href: "/publicacoes",
    label: "Publicações",
    description: "Artigos, preprints e capítulos revisados por pares",
    status: "future",
  },
  {
    href: "/palestras",
    label: "Palestras & Aulas",
    description: "Keynotes, workshops e materiais abertos de ensino",
    status: "future",
  },
];
