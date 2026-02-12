"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Image,
  Instagram,
  User,
  CreditCard,
  LogOut,
  Sparkles,
  FileText,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { useUser } from "@/lib/queries/use-user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { icon: Home, label: "Painel", href: "/dashboard", premium: false },
  { icon: Building2, label: "Imóveis", href: "/listings", premium: false },
  { icon: Image, label: "Galeria", href: "/gallery", premium: true },
  {
    icon: FileText,
    label: "Landing Pages",
    href: "/landing-pages",
    premium: true,
  },
  { icon: Instagram, label: "Instagram", href: "/instagram", premium: true },
  { icon: User, label: "Perfil", href: "/profile", premium: false },
  {
    icon: CreditCard,
    label: "Assinatura",
    href: "/subscription",
    premium: false,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isPremium } = useUser();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Building2 className="w-4 h-4" />
        </div>
        <span className="font-semibold text-base tracking-tight">
          EstateHub
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const isLocked = item.premium && !isPremium;

          return (
            <Link
              key={item.href}
              href={isLocked ? "/subscription" : item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.premium && !isPremium && (
                <Crown className="w-3.5 h-3.5 text-amber-500" />
              )}
              {item.premium && isPremium && (
                <Sparkles className="w-3.5 h-3.5 text-primary opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-sidebar-border">
        {!isPremium && (
          <Link href="/subscription">
            <div className="mb-3 p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">
                  Seja Pro
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Desbloqueie ferramentas IA, Instagram e imóveis ilimitados
              </p>
            </div>
          </Link>
        )}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || "User"}
            </p>
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                {isPremium ? "Pro" : "Grátis"}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={() => signOut()}>
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
