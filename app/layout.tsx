import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsFlag } from "@/components/layout/js-flag";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social-links";
import { education } from "@/data/experience";
import { absoluteUrl, jsonLd, siteDescription, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s | ${profile.name}` },
  description: siteDescription,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  keywords: ["Akash Bhalani", "Full Stack Web Developer", "Laravel developer", "Python developer", "Django", "FastAPI", "Ahmedabad", "Portfolio"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: profile.name,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription, creator: "@Akashsoni_30" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      url: siteUrl,
      image: absoluteUrl(profile.portrait.src),
      jobTitle: profile.role,
      description: profile.summary,
      email: `mailto:${profile.email}`,
      telephone: profile.phone.display,
      address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressRegion: "Gujarat", addressCountry: "IN" },
      alumniOf: education.map((entry) => ({ "@type": "CollegeOrUniversity", name: entry.organisation })),
      knowsAbout: ["Laravel", "PHP", "Python", "Django", "FastAPI", "JavaScript", "Vue.js", "React", "MySQL", "PostgreSQL", "REST APIs", "Multi-tenant architecture", "LLM integration"],
      knowsLanguage: ["en", "hi", "gu"],
      sameAs: socialLinks.map((link) => link.href),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: profile.name,
      description: siteDescription,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <head>
        {/* Marks the document as scripted before first paint so reveal styles only apply with JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <JsFlag />
      </body>
    </html>
  );
}
