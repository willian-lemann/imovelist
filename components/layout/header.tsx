"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNav } from "./mobile-nav";

const pageTitles: Record<string, string> = {
  "/dashboard": "Painel",
  "/listings": "Imóveis",
  "/listings/new": "Novo Imóvel",
  "/gallery": "Galeria IA",
  "/landing-pages": "Landing Pages",
  "/instagram": "Instagram",
  "/profile": "Perfil",
  "/subscription": "Assinatura",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "EstateHub";

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <MobileNav />
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar imóveis..." className="pl-8 w-64 h-8" />
        </div>
        <Button variant="ghost" size="icon-sm">
          <Bell className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
