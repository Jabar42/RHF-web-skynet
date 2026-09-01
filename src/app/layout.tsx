import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

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
  title: "RHF Cartera | Proyectos Inmobiliarios en Cartagena",
  description:
    "Cartera de proyectos inmobiliarios de Rafael Hernández Franco. Doral Country, Doral Suite, Doral West, Acacias Campestre y Blue Garden — Zona Norte de Cartagena.",
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
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
