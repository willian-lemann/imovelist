"use client";

import { Crown, Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
  feature: string;
  description?: string;
}

export function UpgradePrompt({ feature, description }: UpgradePromptProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-1">{feature}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description ||
            `Este recurso está disponível no plano Profissional. Faça upgrade para desbloquear ${feature.toLowerCase()} e outros recursos premium.`}
        </p>
        <Link href="/subscription">
          <Button className="gap-2">
            <Crown className="w-4 h-4" />
            Fazer Upgrade para Profissional
            <Sparkles className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
