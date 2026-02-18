"use client";

import { Check, Crown, Sparkles, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import BlurFade from "@/components/magicui/blur-fade";

const plans = [
  {
    name: "Starter",
    price: "R$ 47",
    period: "/mês",
    description: "Comece com anúncios básicos de imóveis",
    features: [
      "Até 5 imóveis",
      "Busca básica de propriedades",
      "Páginas de listagem padrão",
      "Suporte por email",
    ],
    limitations: [
      "Sem recursos de IA",
      "Sem integração com Instagram",
      "Sem landing pages personalizadas",
    ],
    cta: "Fazer Upgrade para Starter",
    popular: false,
  },
  {
    name: "Profissional",
    price: "R$ 149",
    period: "/mês",
    description: "Desbloqueie ferramentas IA poderosas e integrações",
    features: [
      "Imóveis ilimitados",
      "Gerador de landing pages com IA",
      "Editor de imagens com IA",
      "Integração e auto-publicação no Instagram",
      "Legendas e hashtags geradas por IA",
      "Analíticas avançadas",
      "Suporte prioritário",
    ],
    limitations: [],
    cta: "Fazer Upgrade para Profissional",
    popular: true,
  },
];

interface PricingCardsProps {
  currentPlan?: string;
  onUpgrade?: (plan: string) => void;
}

export function PricingCards({
  currentPlan = "free",
  onUpgrade,
}: PricingCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      {plans.map((plan, index) => {
        const isCurrentPlan = currentPlan === plan.name.toLowerCase();

        return (
          <BlurFade key={plan.name} delay={0.1 * index} inView>
            <Card
              className={cn(
                "relative h-full flex flex-col",
                plan.popular && "border-primary shadow-lg shadow-primary/10",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" /> Mais Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2">
                  {plan.popular ? (
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-primary" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <Zap className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                  {plan.limitations.map((limit) => (
                    <li
                      key={limit}
                      className="flex items-start gap-2 text-sm text-muted-foreground line-through"
                    >
                      <Check className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                      {limit}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  disabled={isCurrentPlan}
                  onClick={() =>
                    onUpgrade && onUpgrade(plan.name.toLowerCase())
                  }
                >
                  {isCurrentPlan ? "Plano Atual" : plan.cta}
                </Button>
              </CardFooter>
            </Card>
          </BlurFade>
        );
      })}
    </div>
  );
}
