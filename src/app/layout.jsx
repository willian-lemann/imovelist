import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-sm`}
      >
        {children}
      </body>
    </html>
  );
}
