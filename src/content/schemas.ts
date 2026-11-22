import { z } from "zod";

export const DomainSchema = z.enum([
  "Medicina",
  "Inteligência Artificial",
  "Pesquisa",
  "Educação",
  "Engenharia",
]);

export type Domain = z.infer<typeof DomainSchema>;

export const ArtifactKindSchema = z.enum([
  "clinical-triage",
  "ml-cohort",
  "edu-atlas",
  "evidence-doc",
]);

export type ArtifactKind = z.infer<typeof ArtifactKindSchema>;

export const PhoneScreenKindSchema = z.enum([
  "cover",
  "feed",
  "detail",
  "stats",
]);

export type PhoneScreenKind = z.infer<typeof PhoneScreenKindSchema>;

export const ProjectStatSchema = z.object({
  value: z.number(),
  decimals: z.number().int().min(0).max(2).optional(),
  suffix: z.string().optional(),
  label: z.string().min(2),
});

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  indexLabel: z.string(),
  title: z.string().min(2),
  tagline: z.string().min(5),
  kind: z.string().min(3),
  year: z.string().regex(/^\d{4}$/),
  role: z.string().min(3),
  domains: z.array(DomainSchema).min(1),
  featured: z.boolean(),
  status: z.enum(["Em produção", "Pesquisa ativa", "Piloto clínico", "Aberto"]),
  summary: z.string().min(20),
  challenge: z.string().min(10),
  marginNote: z.string().min(4),
  artifactKind: ArtifactKindSchema,
  tag: z.string().min(2),
  accent: z.string().min(4),
  tone: z.enum(["paper", "night"]),
  images: z.array(z.string()).min(3),
  screens: z.array(PhoneScreenKindSchema).length(3),
  stats: z.array(ProjectStatSchema).max(3),
  methods: z.array(z.string()).min(2),
  context: z.string().min(20),
  approach: z.string().min(20),
  impact: z.string().min(20),
  limitations: z.string().min(10),
});

export type Project = z.infer<typeof ProjectSchema>;

export const PillarTileSchema = z.object({
  id: z.string(),
  code: z.string().min(2).max(4),
  name: z.string().min(2),
  note: z.string().min(8),
  bg: z.string(),
  fg: z.string(),
  relatedCompetencies: z.array(z.string()).min(1),
});

export type PillarTile = z.infer<typeof PillarTileSchema>;

export const BookReferenceSchema = z.object({
  title: z.string().min(3),
  author: z.string().min(3),
  color: z.string(),
});

export type BookReference = z.infer<typeof BookReferenceSchema>;

export const ProfileSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  rolePill: z.string(),
  coverWord: z.string(),
  docLabel: z.string(),
  year: z.string(),
  location: z.string(),
  portraitPath: z.string(),
  portraitAlt: z.string(),
  traits: z.array(z.string()).length(6),
  greeting: z.string(),
  bio: z.string(),
  practiceIntro: z.string(),
  defaultTileNote: z.string(),
  pillarTiles: z.array(PillarTileSchema).min(4).max(6),
  booksNote: z.string(),
  books: z.array(BookReferenceSchema).min(3).max(6),
  competencies: z.array(z.string()).min(6),
  projectsNote: z.string(),
  thanksHeading: z.string(),
  email: z.string().email(),
  cvUrl: z.string().url(),
  cvNote: z.string(),
  links: z.array(
    z.object({
      label: z.string(),
      href: z.string().url(),
      description: z.string(),
    }),
  ),
  closingLetter: z.string(),
  signature: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;
