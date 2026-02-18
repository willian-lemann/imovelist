"use client";

import { useUser } from "@/lib/queries/use-user";
import { authClient } from "@/lib/auth-client";
import { PricingCards } from "@/components/subscription/pricing-cards";
import BlurFade from "@/components/magicui/blur-fade";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, XCircle } from "lucide-react";

function SubscriptionContent() {
  const { isPremium, subscriptionPlan } = useUser();
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  async function handleUpgrade(plan: string) {
    try {
      await authClient.subscription.upgrade({
        plan,
        successUrl: `${window.location.origin}/subscription?success=true`,
        cancelUrl: `${window.location.origin}/subscription`,
      });
    } catch (err) {
      console.error("Upgrade failed:", err);
      alert("Erro ao processar pagamento. Tente novamente.");
    }
  }

  async function handleCancel() {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura?.")) return;

    try {
      await authClient.subscription.cancel({
        returnUrl: `${window.location.origin}/subscription`,
      });
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Erro ao cancelar assinatura. Tente novamente.");
    }
  }

  async function handleBillingPortal() {
    try {
      await authClient.subscription.billingPortal({
        returnUrl: `${window.location.origin}/subscription`,
      });
    } catch (err) {
      console.error("Billing portal failed:", err);
      alert("Erro ao abrir portal de cobrança. Tente novamente.");
    }
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <div className="text-center max-w-lg mx-auto">
          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-lg text-sm">
              Pagamento realizado com sucesso! Seu plano foi ativado.
            </div>
          )}
          <h2 className="text-2xl font-bold tracking-tight">
            {isPremium ? "Sua Assinatura" : "Escolha seu Plano"}
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            {isPremium
              ? "Você está no plano Profissional. Aproveite todos os recursos premium!."
              : "Desbloqueie ferramentas com IA e integrações para o seu negócio imobiliário."}
          </p>
        </div>
      </BlurFade>

      <PricingCards
        currentPlan={subscriptionPlan || "free"}
        onUpgrade={handleUpgrade}
      />

      {subscriptionPlan && subscriptionPlan !== "free" && (
        <BlurFade delay={0.2}>
          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleBillingPortal}
            >
              <CreditCard className="w-4 h-4" />
              Gerenciar Cobrança
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-destructive hover:text-destructive"
              onClick={handleCancel}
            >
              <XCircle className="w-4 h-4" />
              Cancelar Assinatura
            </Button>
          </div>
        </BlurFade>
      )}
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense>
      <SubscriptionContent />
    </Suspense>
  );
}
