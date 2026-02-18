# TASK: Implementar Testes E2E - Fluxo de Pagamentos

**Role:** Senior QA Engineer  
**Stack:** Next.js 16 + Playwright + PostgreSQL  
**Objetivo:** Testes automatizados do fluxo completo de autenticação e pagamentos

---

## 📦 INSTALAÇÃO

```bash
npm install -D @playwright/test
npx playwright install
```

---

## ⚙️ CONFIGURAÇÃO

### 1. Playwright Config (playwright.config.ts)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Rodar sequencialmente para evitar race conditions
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 2. Helpers de Teste (e2e/helpers.ts)
```typescript
import { Page, expect } from '@playwright/test';

export async function setupTestUser(page: Page) {
  const email = `test-${Date.now()}@example.com`;
  const password = 'Test123!@#';

  await page.goto('/signup');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

  return { email, password };
}

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
}

export async function simulateWebhook(billingId: string, event: string = 'billing.paid') {
  const response = await fetch('http://localhost:3000/api/abacatepay/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      data: {
        id: billingId,
        status: 'PAID',
      },
    }),
  });
  
  return response.ok;
}

export async function cleanupTestData(email: string) {
  // Implementar conforme seu setup de banco
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  
  await prisma.subscription.deleteMany({
    where: { user: { email } },
  });
  
  await prisma.session.deleteMany({
    where: { user: { email } },
  });
  
  await prisma.user.deleteMany({
    where: { email },
  });
  
  await prisma.$disconnect();
}
```

---

## 🧪 TESTES - ABACATEPAY

### Teste Completo (e2e/abacatepay-flow.spec.ts)
```typescript
import { test, expect } from '@playwright/test';
import { setupTestUser, login, simulateWebhook, cleanupTestData } from './helpers';

test.describe('AbacatePay - Fluxo Completo', () => {
  let testEmail: string;
  let testPassword: string;

  test.beforeEach(async ({ page }) => {
    const user = await setupTestUser(page);
    testEmail = user.email;
    testPassword = user.password;
  });

  test.afterEach(async () => {
    await cleanupTestData(testEmail);
  });

  test('Deve completar fluxo de upgrade com sucesso', async ({ page, context }) => {
    // 1. Verificar que não há assinatura ativa
    await page.goto('/dashboard');
    await expect(page.locator('text=Nenhuma assinatura ativa')).toBeVisible();

    // 2. Ir para página de pricing
    await page.click('a[href="/pricing"]');
    await expect(page).toHaveURL('/pricing');

    // 3. Clicar em "Assinar Starter"
    const checkoutPromise = page.waitForRequest(request => 
      request.url().includes('/api/abacatepay/checkout') && 
      request.method() === 'POST'
    );

    await page.click('button:has-text("Assinar Starter")');
    
    const checkoutRequest = await checkoutPromise;
    const checkoutResponse = await checkoutRequest.response();
    const checkoutData = await checkoutResponse?.json();

    expect(checkoutData).toHaveProperty('url');
    expect(checkoutData.url).toContain('abacatepay.com');

    // 4. Simular redirecionamento para AbacatePay (não vamos abrir de fato)
    // Em produção, o usuário seria redirecionado aqui
    
    // 5. Extrair billing ID da resposta
    // Assumindo que você retorna o billing ID ou consegue extrair da URL
    const billingId = 'bill_test_123456'; // Você precisará obter isso da API

    // 6. Simular webhook de pagamento confirmado
    const webhookSuccess = await simulateWebhook(billingId, 'billing.paid');
    expect(webhookSuccess).toBe(true);

    // 7. Aguardar um pouco para o webhook processar
    await page.waitForTimeout(2000);

    // 8. Recarregar dashboard e verificar assinatura ativa
    await page.goto('/dashboard');
    await page.reload();
    
    await expect(page.locator('text=Plano: starter')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Status: active')).toBeVisible();
  });

  test('Deve mostrar erro ao tentar upgrade sem autenticação', async ({ page }) => {
    // Fazer logout
    await page.goto('/dashboard');
    await page.click('button:has-text("Logout")');
    
    // Tentar acessar API diretamente
    const response = await page.request.post('/api/abacatepay/checkout', {
      data: { plan: 'starter' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(401);
    const error = await response.json();
    expect(error.error).toBe('Não autenticado');
  });

  test('Deve rejeitar plano inválido', async ({ page }) => {
    await page.goto('/dashboard');

    const response = await page.request.post('/api/abacatepay/checkout', {
      data: { plan: 'invalid-plan' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.error).toBe('Plano inválido');
  });

  test('Não deve permitir upgrade se já tem assinatura ativa', async ({ page }) => {
    // Primeiro upgrade
    await page.goto('/pricing');
    await page.click('button:has-text("Assinar Starter")');
    await page.waitForTimeout(1000);

    const billingId = 'bill_test_first';
    await simulateWebhook(billingId, 'billing.paid');
    await page.waitForTimeout(2000);

    // Verificar assinatura ativa
    await page.goto('/dashboard');
    await expect(page.locator('text=Status: active')).toBeVisible();

    // Tentar fazer outro upgrade
    await page.goto('/pricing');
    
    // Implementar lógica no frontend para desabilitar botão se já tem assinatura
    const upgradeButton = page.locator('button:has-text("Assinar Pro")');
    await expect(upgradeButton).toBeDisabled();
  });
});
```

---

## 🧪 TESTES - STRIPE

### Teste Completo (e2e/stripe-flow.spec.ts)
```typescript
import { test, expect } from '@playwright/test';
import { setupTestUser, cleanupTestData } from './helpers';

test.describe('Stripe - Fluxo Completo', () => {
  let testEmail: string;

  test.beforeEach(async ({ page }) => {
    const user = await setupTestUser(page);
    testEmail = user.email;
  });

  test.afterEach(async () => {
    await cleanupTestData(testEmail);
  });

  test('Deve redirecionar para Stripe Checkout', async ({ page, context }) => {
    await page.goto('/pricing');

    // Monitorar navegação para Stripe
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.click('button:has-text("Assinar Starter")'),
    ]);

    // Verificar que foi redirecionado para Stripe Checkout
    await popup.waitForLoadState();
    expect(popup.url()).toContain('checkout.stripe.com');

    // Fechar popup
    await popup.close();
  });

  test('Deve usar cartão de teste do Stripe', async ({ page, context }) => {
    await page.goto('/pricing');

    const [checkoutPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('button:has-text("Assinar Starter")'),
    ]);

    await checkoutPage.waitForLoadState();

    // Preencher formulário do Stripe (isso requer Stripe em test mode)
    await checkoutPage.fill('[name="cardnumber"]', '4242424242424242');
    await checkoutPage.fill('[name="exp-date"]', '1234'); // MM/YY
    await checkoutPage.fill('[name="cvc"]', '123');
    await checkoutPage.fill('[name="billingName"]', 'Test User');

    await checkoutPage.click('button[type="submit"]');

    // Aguardar redirecionamento de volta
    await page.waitForURL('**/dashboard?success=true', { timeout: 30000 });

    // Verificar assinatura ativa
    await expect(page.locator('text=Plano: starter')).toBeVisible();
  });

  test('Deve processar webhook checkout.session.completed', async ({ page }) => {
    // Este teste requer Stripe CLI rodando localmente
    // stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

    await page.goto('/pricing');
    
    // Trigger checkout (não completar)
    const checkoutPromise = page.waitForRequest(req => 
      req.url().includes('subscription.upgrade')
    );
    
    await page.click('button:has-text("Assinar Starter")');
    
    // Aguardar webhook ser processado (via Stripe CLI)
    await page.waitForTimeout(5000);
    
    await page.goto('/dashboard');
    await page.reload();
    
    // Verificar se subscription foi criada
    const hasSubscription = await page.locator('text=Plano:').isVisible();
    expect(hasSubscription).toBe(true);
  });
});
```

---

## 🧪 TESTES - AUTENTICAÇÃO

### Teste Básico (e2e/auth.spec.ts)
```typescript
import { test, expect } from '@playwright/test';
import { cleanupTestData } from './helpers';

test.describe('Autenticação', () => {
  const testEmail = `auth-test-${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';

  test.afterEach(async () => {
    await cleanupTestData(testEmail);
  });

  test('Deve fazer signup, login e logout', async ({ page }) => {
    // Signup
    await page.goto('/signup');
    await page.fill('input[name="name"]', 'Auth Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Auth Test User')).toBeVisible();

    // Logout
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL('/');

    // Login novamente
    await page.goto('/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test('Deve proteger rotas autenticadas', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Deve redirecionar para login
    await expect(page).toHaveURL('/login');
  });

  test('Deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@email.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=/invalid|incorreto|erro/i')).toBeVisible();
  });
});
```

---

## 🧪 TESTES - PROTEÇÃO DE FEATURES

### Teste de Limites (e2e/feature-limits.spec.ts)
```typescript
import { test, expect } from '@playwright/test';
import { setupTestUser, simulateWebhook, cleanupTestData } from './helpers';

test.describe('Limites de Plano', () => {
  let testEmail: string;

  test.beforeEach(async ({ page }) => {
    const user = await setupTestUser(page);
    testEmail = user.email;
  });

  test.afterEach(async () => {
    await cleanupTestData(testEmail);
  });

  test('Deve respeitar limite de projetos do plano Starter', async ({ page }) => {
    // Ativar subscription starter
    const billingId = 'bill_limit_test';
    await simulateWebhook(billingId, 'billing.paid');
    await page.waitForTimeout(2000);

    await page.goto('/projects');

    // Criar 3 projetos (limite do starter)
    for (let i = 1; i <= 3; i++) {
      await page.fill('input[name="project-name"]', `Projeto ${i}`);
      await page.click('button:has-text("Criar Projeto")');
      await expect(page.locator(`text=Projeto ${i}`)).toBeVisible();
    }

    // Tentar criar 4º projeto (deve falhar)
    await page.fill('input[name="project-name"]', 'Projeto 4');
    await page.click('button:has-text("Criar Projeto")');

    await expect(page.locator('text=/limite.*atingido/i')).toBeVisible();
  });
});
```

---

## 🚀 EXECUTAR TESTES

```bash
# Todos os testes
npx playwright test

# Teste específico
npx playwright test e2e/abacatepay-flow.spec.ts

# Com UI
npx playwright test --ui

# Modo debug
npx playwright test --debug

# Gerar relatório
npx playwright show-report
```

---

## ✅ CHECKLIST

- [ ] Playwright instalado e configurado
- [ ] Helpers de teste criados
- [ ] Testes de autenticação implementados
- [ ] Testes de fluxo AbacatePay implementados
- [ ] Testes de fluxo Stripe implementados (opcional)
- [ ] Testes de limites de plano implementados
- [ ] Testes passando em CI/CD
- [ ] Cleanup de dados de teste funcionando

---

## 🔗 RECURSOS

**Docs Playwright:** https://playwright.dev  
**Best Practices:** https://playwright.dev/docs/best-practices  
**Debug Guide:** https://playwright.dev/docs/debug
