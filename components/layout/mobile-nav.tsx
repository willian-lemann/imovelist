"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Image,
  Instagram,
  User,
  CreditCard,
  Menu,
  X,
  FileText,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/queries/use-user";
import { Button } from "@/components/ui/button";

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

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isPremium } = useUser();

  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)}>
        <Menu className="w-5 h-5" />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-semibold">Imovelist</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const isLocked = item.premium && !isPremium;
                return (
                  <Link
                    key={item.href}
                    href={isLocked ? "/subscription" : item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50",
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="flex-1">{item.label}</span>
                    {item.premium && !isPremium && (
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
