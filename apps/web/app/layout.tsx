// @next-codemod-ignore
import "@/app/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

type LayoutProps = {
  children: React.ReactNode;
  login: React.ReactNode & { props: { parallelRouterKey: string } };
};

export const metadata: Metadata = {
  title: {
    template: "%s - Imovelist",
    default: "Encontre facilmente seu imóvel dos sonhos",
  },
  description:
    "Imovelist é um site imobiliário brasileiro que oferece uma ampla variedade de imóveis, incluindo casas, apartamentos e residências. Com mais de 300 listagens disponíveis, encontrar o imóvel perfeito nunca foi tão fácil. Navegue pelo site, filtre ou pesquise na barra de busca para encontrar exatamente o que você procura. Oferecemos uma experiência de usuário e interface de usuário elegantes e modernas para tornar a busca por imóveis uma experiência agradável. Não perca tempo com sites imobiliários desatualizados, escolha o Imovelist para encontrar seu novo lar hoje mesmo!",
};

export default async function Layout({ children }: LayoutProps) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <body
          className={cn("antialiased", fontHeading.variable, fontBody.variable)}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
