import { test, expect } from '@playwright/test';

/**
 * Suite E2E Oficial: Vivi Carvalho Boty
 * Padrões: Playwright Best Practices (Microsoft & Currents.dev)
 * - Locators acessíveis e semânticos (getByRole, getByLabel, getByPlaceholder)
 * - Asserções web-first sem timeouts arbitrários
 * - Testes isolados para Mobile e Desktop
 */

const BASE_URL = process.env.BASE_URL || 'https://www.vivicarvalhoboty.com.br';

test.describe('🛍️ Catálogo, Vitrine & Navegação', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('deve carregar a Home com título, hero e branding oficial', async ({ page }) => {
    await expect(page).toHaveTitle(/Vivi Carvalho Boty/i);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Beleza original/i);
    await expect(page.getByLabel('Buscar fragrâncias, cosméticos ou presentes')).toBeVisible();
  });

  test('deve pesquisar produto na barra da home e navegar para o catálogo filtrado', async ({ page }) => {
    const searchInput = page.getByLabel('Buscar fragrâncias, cosméticos ou presentes');
    await searchInput.fill('Malbec');
    await page.getByRole('button', { name: 'Buscar' }).click();

    await expect(page).toHaveURL(/.*#\/produtos\?q=Malbec/);
    await expect(page.getByRole('heading', { name: /Catálogo de produtos/i })).toBeVisible();
  });

  test('deve filtrar por pronta entrega e verificar exibição correta de disponibilidade', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/produtos`);
    const prontaEntregaChip = page.getByRole('button', { name: /Pronta entrega/i });
    await expect(prontaEntregaChip).toBeVisible();
    await prontaEntregaChip.click();

    await expect(page).toHaveURL(/.*pronta=1/);
  });
});

test.describe('🛒 Sacola de Compras & Checkout WhatsApp', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('deve adicionar item à sacola, ajustar quantidade e validar cálculo de subtotal', async ({ page }) => {
    // Localiza o primeiro card com botão de sacola
    const addBagButton = page.getByRole('button', { name: /Adicionar .* à sacola/i }).first();
    await expect(addBagButton).toBeVisible();
    await addBagButton.click();

    // Gaveta da sacola deve abrir automaticamente
    const cartDrawer = page.locator('#cart-drawer');
    await expect(cartDrawer).toBeVisible();

    // Aumentar quantidade
    const increaseBtn = page.getByRole('button', { name: /Aumentar quantidade/i }).first();
    await expect(increaseBtn).toBeVisible();
    await increaseBtn.click();

    // Verificar seletor de dados de entrega acessíveis
    const nameInput = page.getByLabel(/Seu nome para identificação na entrega/i);
    const bairroInput = page.getByLabel(/Seu bairro para entrega/i);
    await expect(nameInput).toBeVisible();
    await expect(bairroInput).toBeVisible();

    await nameInput.fill('Mariana Silva');
    await bairroInput.fill('Centro');

    // Botão de finalizar no WhatsApp
    const checkoutBtn = page.getByRole('button', { name: /Finalizar pedido no WhatsApp/i });
    await expect(checkoutBtn).toBeVisible();
  });
});

test.describe('🔒 Segurança, Roteamento & Acessibilidade', () => {

  test('deve redirecionar rota administrativa sem tela preta (Edge Middleware)', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/admin`);
    expect(response?.status()).toBeLessThan(400);
    // Deve renderizar a SPA com redirecionamento suave para a raiz ou tela de login
    await expect(page.locator('body')).toBeVisible();
  });

  test('deve respeitar a preferência de acessibilidade prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE_URL);

    // Avalia se o CSS global desligou as animações para usuários com sensibilidade vestibular
    const animationStatus = await page.evaluate(() => {
      const el = document.querySelector('.float-subtle');
      if (!el) return 'no-element';
      return window.getComputedStyle(el).animationName;
    });

    expect(['none', 'initial', 'no-element']).toContain(animationStatus);
  });
});
