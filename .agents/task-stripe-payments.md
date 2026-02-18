# TASK: Implementar Pagamentos SaaS com Stripe

**Role:** Senior Payment Engineer  
**Stack:** Next.js 16 (App Router) + Better Auth + Stripe + PostgreSQL  
**Objetivo:** Setup completo de billing SaaS com Better Auth Stripe Plugin

---

## 📦 INSTALAÇÃO

```bash
npm install @better-auth/stripe stripe@^20.0.0
```

---

## ⚙️ CONFIGURAÇÃO

### 1. Env (.env.local)
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Server Auth Config (lib/auth.ts)
```typescript
import { betterAuth } from "better-auth";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "starter",
            priceId: "price_STARTER_ID", // ← Atualizar após criar no Stripe
            limits: { projects: 3 },
          },
          {
            name: "pro",
            priceId: "price_PRO_ID", // ← Atualizar após criar no Stripe
            limits: { projects: 10 },
          },
        ],
      },
    }),
  ],
});
```

### 3. Client Config (lib/auth-client.ts)
```typescript
import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [stripeClient({ subscription: true })],
});
```

### 4. Database Migration
```bash
npx @better-auth/cli migrate
```

**Tabelas criadas automaticamente:**
- Campo `user.stripeCustomerId`
- Tabela `subscription` (com 15+ campos)

---

## 💳 SETUP STRIPE

### Opção A: Stripe Dashboard (Recomendado)

1. **Criar Produtos**
   - Products → Add product
   - Produto 1: "Starter" | R$ 47/mês (recorrente)
   - Produto 2: "Pro" | R$ 97/mês (recorrente)
   - Copiar `price_id` → atualizar `lib/auth.ts`

2. **Criar Webhook**
   - Developers → Webhooks → Add endpoint
   - URL: `https://seudominio.com/api/auth/stripe/webhook`
   - Eventos:
     ```
     checkout.session.completed
     customer.subscription.created
     customer.subscription.updated
     customer.subscription.deleted
     ```
   - Copiar `Signing secret` → `.env` como `STRIPE_WEBHOOK_SECRET`

### Opção B: Stripe CLI (Dev Local)

```bash
# Produtos
stripe products create --name="Starter"
stripe prices create \
  --product=prod_XXX \
  --currency=brl \
  --unit-amount=4700 \
  --recurring[interval]=month

stripe products create --name="Pro"
stripe prices create \
  --product=prod_YYY \
  --currency=brl \
  --unit-amount=9700 \
  --recurring[interval]=month

# Webhook local
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
# Copiar whsec_ para .env
```

---

## 🎯 IMPLEMENTAÇÃO FRONTEND

### 1. Botão de Upgrade (app/pricing/page.tsx)
```typescript
"use client";
import { authClient } from "@/lib/auth-client";

export default function PricingPage() {
  async function handleUpgrade(plan: "starter" | "pro") {
    await authClient.subscription.upgrade({
      plan,
      successUrl: `${window.location.origin}/dashboard?success=true`,
      cancelUrl: `${window.location.origin}/pricing`,
    });
    // ← Usuário redirecionado para Stripe Checkout
  }

  return (
    <div>
      <button onClick={() => handleUpgrade("starter")}>
        Assinar Starter - R$ 47/mês
      </button>
      <button onClick={() => handleUpgrade("pro")}>
        Assinar Pro - R$ 97/mês
      </button>
    </div>
  );
}
```

### 2. Verificar Assinatura (app/dashboard/page.tsx)
```typescript
"use client";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [activeSub, setActiveSub] = useState(null);

  useEffect(() => {
    async function loadSubscription() {
      const { data } = await authClient.subscription.list();
      const sub = data?.find(
        (s) => s.status === "active" || s.status === "trialing"
      );
      setActiveSub(sub);
    }
    loadSubscription();
  }, []);

  if (!activeSub) {
    return <div>Nenhuma assinatura ativa. <a href="/pricing">Ver planos</a></div>;
  }

  return (
    <div>
      <p>Plano atual: {activeSub.plan}</p>
      <p>Status: {activeSub.status}</p>
      <p>Período: {new Date(activeSub.periodEnd).toLocaleDateString()}</p>
    </div>
  );
}
```

### 3. Cancelar Assinatura
```typescript
async function handleCancel() {
  if (!confirm("Cancelar assinatura?")) return;
  
  await authClient.subscription.cancel({
    returnUrl: `${window.location.origin}/account`,
  });
}
```

### 4. Portal de Cobrança
```typescript
async function openBillingPortal() {
  await authClient.subscription.billingPortal({
    returnUrl: `${window.location.origin}/account`,
  });
}
```

---

## 🔒 PROTEÇÃO DE FEATURES (Server-Side)

### Helper de Verificação (lib/subscription.ts)
```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function requireActivePlan(minPlan: "starter" | "pro") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Não autenticado");

  const { data: subs } = await auth.api.subscription.list({
    headers: await headers(),
  });

  const activeSub = subs?.find(
    (s) => s.status === "active" || s.status === "trialing"
  );

  if (!activeSub) {
    throw new Error("Nenhuma assinatura ativa");
  }

  const hierarchy = { starter: 1, pro: 2 };
  if (hierarchy[activeSub.plan] < hierarchy[minPlan]) {
    throw new Error(`Requer plano ${minPlan}`);
  }

  return activeSub;
}
```

### Server Action com Limite (app/actions/projects.ts)
```typescript
"use server";
import { requireActivePlan } from "@/lib/subscription";
import { prisma } from "@/lib/db";

export async function createProject(data: { name: string }) {
  const sub = await requireActivePlan("starter");

  // Verificar limite
  const count = await prisma.project.count({
    where: { userId: sub.referenceId },
  });

  const limits = { starter: 3, pro: 10 };
  if (count >= limits[sub.plan]) {
    throw new Error(`Limite de ${limits[sub.plan]} projetos atingido`);
  }

  return prisma.project.create({
    data: { ...data, userId: sub.referenceId },
  });
}
```

---

## 🧪 TESTE LOCAL DE WEBHOOKS

```bash
# Terminal 1: App
npm run dev

# Terminal 2: Stripe CLI
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# Terminal 3: Trigger evento
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

---

## ✅ CHECKLIST

**Setup Inicial:**
- [ ] Pacotes instalados (`@better-auth/stripe`, `stripe@^20`)
- [ ] Env vars (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)
- [ ] Plugin Stripe configurado em `lib/auth.ts`
- [ ] Cliente Stripe em `lib/auth-client.ts`
- [ ] Migração executada (`subscription` table criada)

**Stripe Dashboard:**
- [ ] 2 produtos criados (Starter, Pro)
- [ ] 2 preços recorrentes (R$ 47, R$ 97)
- [ ] `price_id` atualizados em `lib/auth.ts`
- [ ] Webhook endpoint criado
- [ ] 4 eventos subscritos
- [ ] `STRIPE_WEBHOOK_SECRET` em `.env`

**Frontend:**
- [ ] Página `/pricing` com botões de upgrade
- [ ] Dashboard mostra assinatura ativa
- [ ] Botão de cancelamento
- [ ] Link para billing portal
- [ ] Proteção server-side implementada

**Testes:**
- [ ] Fluxo completo: signup → upgrade → checkout → webhook → active
- [ ] Cancelamento funcionando
- [ ] Portal de cobrança abrindo
- [ ] Limites de features respeitados

---

## 🔗 RECURSOS

**Docs:** https://www.better-auth.com/docs/plugins/stripe  
**Stripe Dashboard:** https://dashboard.stripe.com  
**Test Cards:** `4242 4242 4242 4242` (sucesso), `4000 0000 0000 0002` (decline)  
**Webhook Events:** checkout.session.completed, customer.subscription.*
