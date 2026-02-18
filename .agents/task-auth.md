# TASK: Implementar Autenticação com Better Auth

**Role:** Senior Full-Stack Engineer  
**Objetivo:** Setup completo de autenticação usando Better Auth

---

## 📦 INSTALAÇÃO

```bash
npm install better-auth
```

---

## ⚙️ CONFIGURAÇÃO BASE

### 1. Variáveis de Ambiente (.env)
```env
BETTER_AUTH_SECRET=<gerar com: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=<sua connection string>
```

### 2. Arquivo de Autenticação (lib/auth.ts)
```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // ou "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // ajustar conforme necessário
  },
  socialProviders: {
    // Adicionar conforme necessário
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

### 3. Migração do Banco
```bash
npx @better-auth/cli generate  # Gera schema
npx @better-auth/cli migrate   # Aplica migração (ou use seu ORM)
```

---

## 🔌 INTEGRAÇÃO API

### Next.js App Router (app/api/auth/[...all]/route.ts)
```typescript
import { auth } from "@/lib/auth";

export const { GET, POST } = auth.handler;
```

### Next.js Pages Router (pages/api/auth/[...all].ts)
```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export default toNextJsHandler(auth);
```

---

## 💻 CLIENT SETUP

### React/Next.js (lib/auth-client.ts)
```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL, // opcional se mesma origem
});

export const { signIn, signOut, signUp, useSession } = authClient;
```

---

## 🎯 CASOS DE USO

### Signup
```typescript
await authClient.signUp.email({
  email: "user@example.com",
  password: "securepass123",
  name: "John Doe",
});
```

### Login
```typescript
await authClient.signIn.email({
  email: "user@example.com",
  password: "securepass123",
});
```

### Session no Cliente
```typescript
const { data: session } = useSession();
if (session?.user) {
  console.log("Logged in:", session.user.email);
}
```

### Logout
```typescript
await authClient.signOut();
```

### Proteção de Rota (Middleware - Next.js)
```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
```

---

## ✅ CHECKLIST DE ENTREGA

- [ ] Better Auth instalado
- [ ] Variáveis de ambiente configuradas
- [ ] `lib/auth.ts` criado e configurado
- [ ] Migração do banco executada (tabelas: user, session, account, verification)
- [ ] Rota API `/api/auth/[...all]` funcionando
- [ ] Cliente auth configurado (`lib/auth-client.ts`)
- [ ] Signup/Login funcionando
- [ ] Session persistence funcionando
- [ ] Logout funcionando
- [ ] Rotas protegidas (opcional: middleware)

---

## 🔗 REFERÊNCIA RÁPIDA

**Docs:** https://www.better-auth.com/docs  
**Schema Core:** user, session, account, verification  
**Webhook Path:** `/api/auth/[...all]`  
**Session Cookie:** `better-auth.session_token`

---

**Stack:** Next.js 16 (App Router) + Better Auth + PostgreSQL/MySQL/SQLite
