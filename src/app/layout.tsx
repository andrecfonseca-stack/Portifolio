import type { Metadata, Viewport } from "next";
import { Caveat, DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import { siteConfig } from "@/config/site";
import { buildPersonJsonLd } from "@/lib/structured-data";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { TopChrome } from "@/components/layout/top-chrome";
import { ScrollClimber } from "@/components/marginalia/scroll-climber";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "medicina",
    "inteligência artificial em saúde",
    "pesquisa clínica",
    "educação médica",
    "engenharia de software",
    "portfólio interdisciplinar",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2EDE4" },
    { media: "(prefers-color-scheme: dark)", color: "#1B2326" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = buildPersonJsonLd();

  return (
    <html
      lang="pt-BR"
      className={`${dmSerif.variable} ${plusJakarta.variable} ${caveat.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionProvider>
          <SkipToContent />
          <TopChrome />
          <ScrollClimber />
          <main id="conteudo-principal" tabIndex={-1} className="outline-none">
            {children}
          </main>
        </MotionProvider>
      </body>
    </html>
  );
}
