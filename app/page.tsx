import Link from "next/link";
import {
  Building2,
  Sparkles,
  Image,
  Instagram,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { headers } from "next/dist/server/request/headers";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const isLogged = !!session;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="font-semibold text-base">EstateHub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/search">
              <Button variant="ghost" size="sm">
                Procurar Imóveis
              </Button>
            </Link>
            <Link href={isLogged ? "/dashboard" : "/sign-in"}>
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>

            {!isLogged && (
              <Link href="/sign-up">
                <Button size="sm">Começar</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" /> Plataforma Imobiliária com
              IA
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Seus Imóveis. <span className="text-primary">Turbinados</span> com
              IA.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              A plataforma moderna para corretores de imóveis. Anuncie
              propriedades, gere landing pages com IA, melhore fotos e publique
              no Instagram — tudo em um painel.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2 text-base px-6">
                  Comece Grátis <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" size="lg" className="text-base px-6">
                  Procurar Imóveis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Tudo que corretores precisam
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ferramentas poderosas para anunciar, divulgar e vender imóveis
              mais rápido
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "Anúncios Inteligentes",
                description:
                  "Crie e gerencie anúncios de imóveis com busca poderosa, filtros e ferramentas de organização.",
              },
              {
                icon: Image,
                title: "Edição de Imagem com IA",
                description:
                  "Melhore fotos de propriedades com IA. Decore ambientes, melhore a iluminação e crie visuais incríveis.",
              },
              {
                icon: Instagram,
                title: "Integração Social",
                description:
                  "Gere legendas com IA e publique diretamente no Instagram. Cresça sua audiência sem esforço.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mb-8">
            Junte-se aos corretores que já estão usando IA para vender mais
            imóveis. Grátis para começar, sem cartão de crédito.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="gap-2 text-base px-8">
              Criar Sua Conta <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">EstateHub</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} EstateHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
