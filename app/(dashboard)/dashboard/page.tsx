"use client";

import Link from "next/link";
import {
  Building2,
  TrendingUp,
  Eye,
  Plus,
  Image,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BlurFade from "@/components/magicui/blur-fade";
import { useListings } from "@/lib/queries/use-listings";
import { useUser } from "@/lib/queries/use-user";
import { ListingGrid } from "@/components/listings/listing-grid";

export default function DashboardHomePage() {
  const { user, isPremium, subscriptionPlan } = useUser();
  const { data: myListings } = useListings({ agentId: user?.id, limit: 6 });

  const totalListings = myListings?.total || 0;
  const publishedListings =
    myListings?.listings.filter((l) => l.published).length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <BlurFade delay={0}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Bem-vindo{user?.name ? `, ${user.name}` : ""}
          </h2>
          <p className="text-muted-foreground mt-1">
            Aqui está uma visão geral dos seus imóveis e atividades.
          </p>
        </div>
      </BlurFade>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total de Imóveis",
            value: totalListings,
            icon: Building2,
            change: null,
          },
          {
            label: "Publicados",
            value: publishedListings,
            icon: Eye,
            change: null,
          },
          {
            label: "Rascunhos",
            value: totalListings - publishedListings,
            icon: TrendingUp,
            change: null,
          },
          {
            label: "Plano",
            value:
              subscriptionPlan === "professional"
                ? "Profissional"
                : subscriptionPlan === "starter"
                  ? "Starter"
                  : "Grátis",
            icon: Sparkles,
            change: null,
          },
        ].map((stat, i) => (
          <BlurFade key={stat.label} delay={0.05 * (i + 1)} inView>
            <Card>
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
                <CardAction>
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardAction>
              </CardHeader>
            </Card>
          </BlurFade>
        ))}
      </div>

      {/* Quick Actions */}
      <BlurFade delay={0.3} inView>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href="/listings/new">
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Novo Imóvel
                </Button>
              </Link>
              {isPremium && (
                <>
                  <Link href="/gallery">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Image className="w-3.5 h-3.5" /> Galeria IA
                    </Button>
                  </Link>
                  <Link href="/landing-pages">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Landing Pages
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Recent Listings */}
      <BlurFade delay={0.35} inView>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Imóveis Recentes</h3>
          <Link href="/listings">
            <Button variant="ghost" size="sm" className="gap-1">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
        {myListings?.listings ? (
          <ListingGrid
            listings={myListings.listings}
            emptyMessage="Crie seu primeiro imóvel para começar"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </BlurFade>
    </div>
  );
}
