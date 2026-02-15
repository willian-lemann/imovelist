"use client";

import { useUser } from "@/lib/queries/use-user";
import { PricingCards } from "@/components/subscription/pricing-cards";
import BlurFade from "@/components/magicui/blur-fade";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SubscriptionContent() {
  const { user, isPremium } = useUser();
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  async function handleUpgrade() {
    try {
      const res = await fetch("/api/abacatepay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "professional" }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao criar checkout. Tente novamente.");
      }
    } catch (err) {
      console.error("Upgrade failed:", err);
      alert("Erro ao processar pagamento. Tente novamente.");
    }
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <div className="text-center max-w-lg mx-auto">
          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-lg text-sm">
              Pagamento realizado com sucesso! Seu plano será ativado em
              instantes.
            </div>
          )}
          <h2 className="text-2xl font-bold tracking-tight">
            {isPremium ? "Sua Assinatura" : "Escolha seu Plano"}
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            {isPremium
              ? "Você está no plano Profissional. Aproveite todos os recursos premium!"
              : "Desbloqueie ferramentas com IA e integrações para o seu negócio imobiliário."}
          </p>
        </div>
      </BlurFade>

      <PricingCards
        currentPlan={user?.subscriptionTier || "free"}
        onUpgrade={handleUpgrade}
      />
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
