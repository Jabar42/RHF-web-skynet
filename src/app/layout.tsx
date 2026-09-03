import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import AgentChat from "@/components/AgentChat";
import Script from "next/script";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rhf-web-skynet.vercel.app"),
  title: "RHF — Asesoría Inmobiliaria Premium en Cartagena",
  description:
    "Rafael Hernández Franco. Asesoría inmobiliaria premium en Cartagena y la Zona Norte. Conoce nuestra cartera: Doral Country, Doral Suite, Doral West, Acacias Campestre y Blue Garden.",
  keywords: [
    "asesoría inmobiliaria Cartagena",
    "apartamentos Zona Norte Cartagena",
    "Doral Cartagena",
    "RHF propiedades",
    "inversión inmobiliaria Cartagena",
    "Rafael Hernández Franco",
  ],
  authors: [{ name: "Rafael Hernández Franco" }],
  openGraph: {
    title: "RHF — Asesoría Inmobiliaria Premium en Cartagena",
    description:
      "Nuestra cartera de proyectos en la Zona Norte y alrededores. Te acompañamos en cada paso.",
    url: "https://rhf-web-skynet.vercel.app",
    siteName: "RHF Asesoría Inmobiliaria",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "RHF — Asesoría Inmobiliaria Cartagena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RHF — Asesoría Inmobiliaria Premium en Cartagena",
    description:
      "Nuestra cartera de proyectos en la Zona Norte y alrededores.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=630&fit=crop",
    ],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://rhf-web-skynet.vercel.app" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "RHF — Rafael Hernández Franco",
  description:
    "Asesoría inmobiliaria premium en Cartagena y la Zona Norte. Cartera de proyectos: Doral Country, Doral Suite, Doral West, Acacias Campestre, Blue Garden.",
  url: "https://rhf-web-skynet.vercel.app",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cartagena",
    addressRegion: "Bolívar",
    addressCountry: "CO",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["es"],
  },
  knowsAbout: [
    "Propiedad raíz",
    "Apartamentos Zona Norte Cartagena",
    "Inversión inmobiliaria",
    "Doral Cartagena",
  ],
  areaServed: {
    "@type": "City",
    name: "Cartagena",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${montserrat.variable} scroll-smooth`}
    >
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        {children}
        <AgentChat />
      </body>
    </html>
  );
}
