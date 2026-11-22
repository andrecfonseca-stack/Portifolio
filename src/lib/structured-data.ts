import { siteConfig } from "@/config/site";
import { profile } from "@/content/profile";

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteConfig.url,
    email: `mailto:${profile.email}`,
    jobTitle: profile.rolePill,
    description: siteConfig.description,
    knowsAbout: [
      "Medicina Clínica",
      "Inteligência Artificial em Saúde",
      "Pesquisa Científica",
      "Educação Médica",
      "Engenharia de Software",
    ],
    sameAs: profile.links.map((l) => l.href),
  };
}
