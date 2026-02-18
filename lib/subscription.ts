import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type PlanName = "starter" | "professional";

const PLAN_HIERARCHY: Record<PlanName, number> = {
  starter: 1,
  professional: 2,
};

const PLAN_LIMITS: Record<PlanName, { listings: number }> = {
  starter: { listings: 5 },
  professional: { listings: Infinity },
};

export async function getActiveSubscription() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const subs = await auth.api.listActiveSubscriptions({
    headers: await headers(),
  });

  const activeSub = subs?.find(
    (s: { status: string | null }) =>
      s.status === "active" || s.status === "trialing",
  );

  return activeSub || null;
}

export async function requireActivePlan(minPlan: PlanName) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Não autenticado");

  const activeSub = await getActiveSubscription();

  if (!activeSub) {
    throw new Error("Nenhuma assinatura ativa");
  }

  const subPlan = activeSub.plan as PlanName;
  if (
    PLAN_HIERARCHY[subPlan] === undefined ||
    PLAN_HIERARCHY[subPlan] < PLAN_HIERARCHY[minPlan]
  ) {
    throw new Error(`Requer plano ${minPlan}`);
  }

  return activeSub;
}

export function getPlanLimits(plan: PlanName) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.starter;
}
