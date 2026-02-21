import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Imovelist — Plataforma Imobiliária com IA feita para Corretores autônomos e imobiliárias locais",
  description:
    "Plataforma moderna de anúncios imobiliários com IA para corretores. Encontre seu imóvel dos sonhos em Imbituba, Garopaba e região. Compare preços de casas, apartamentos e terrenos para venda e aluguel.",
  keywords: [
    "imóveis em imbituba",
    "imóveis em garopaba",
    "imóveis imbituba sc",
    "imobiliária imbituba",
    "encontre seu imóvel dos sonhos em imbituba",
    "casas em imbituba",
    "apartamentos em imbituba",
    "terrenos em imbituba",
    "lotes em imbituba",
    "imóveis para alugar em imbituba",
    "imóveis para comprar em imbituba",
    "investimento imobiliário em imbituba",
    "imóveis em imbituba e região",
    "cartório de registro de imóveis imbituba",
    "registro de imóveis imbituba sc",
    "imobiliária imbituba",
    "comprar casas em imbituba",
    "comprar apartamentos para alugar em imbituba",
    "comprar terrenos em imbituba",
    "comprar lotes em imbituba",
    "imóveis imbituba",
    "imóveis garopaba",
    "clima em imbituba",
    "previsão do tempo imbituba",
  ],
  openGraph: {
    title:
      "Imovelist — Plataforma Imobiliária com IA para Imbituba e Região",
    description:
      "Encontre seu imóvel dos sonhos em Imbituba, Garopaba e arredores. Plataforma completa com inteligência artificial para corretores e imobiliárias.",
    url: "https://imovelist.vercel.app",
    siteName: "Imovelist",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
