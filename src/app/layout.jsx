import { ClerkProvider } from "@clerk/nextjs";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s - Imovelist",
    default: "Encontre facilmente seu imóvel dos sonhos",
  },
  description:
    "Imovelist é um site imobiliário brasileiro que oferece uma ampla variedade de imóveis, incluindo casas, apartamentos e residências. Com mais de 300 listagens disponíveis, encontrar o imóvel perfeito nunca foi tão fácil. Navegue pelo site, filtre ou pesquise na barra de busca para encontrar exatamente o que você procura. Oferecemos uma experiência de usuário e interface de usuário elegantes e modernas para tornar a busca por imóveis uma experiência agradável. Não perca tempo com sites imobiliários desatualizados, escolha o Imovelist para encontrar seu novo lar hoje mesmo!",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className={`${inter.variable} antialiased text-sm`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
