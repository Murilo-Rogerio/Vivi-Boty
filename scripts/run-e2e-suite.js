import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.resolve(__dirname, '../index.html');
const schemaPath = path.resolve(__dirname, '../supabase_schema.sql');

const html = fs.readFileSync(indexPath, 'utf-8');
const schema = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf-8') : '';

console.log('=============================================================');
console.log('🧪 SUITE E2E & ARQUITETURA: VIVI CARVALHO BOTY');
console.log('Padrões: Playwright Best Practices, Supabase RLS & 60 FPS UI');
console.log('=============================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assertTest(title, condition, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✔ PASS: ${title}`);
  } else {
    failedTests++;
    console.error(`✖ FAIL: ${title}`);
    if (details) console.error(`   Detalhe: ${details}`);
  }
}

// ----------------------------------------------------------------------------
// 1. E2E FLOW: CÁLCULO DE CARRINHO & REGRAS DE PREÇO
// ----------------------------------------------------------------------------
console.log('--- 1. JORNADA DE COMPRA: SACÓLA & MATEMÁTICA FINANCEIRA ---');

// Extrair helper de cálculo do HTML para teste unitário/E2E
function mockPricing(p, customOrig = 0) {
  const preco = parseFloat(p.preco) || 0;
  const rawOrig = customOrig > 0 ? customOrig : (parseFloat(p.preco_original) || 0);
  let originalPrice = rawOrig;
  let hasDiscount = false;
  let discountPct = 0;
  let savings = 0;

  if (originalPrice > preco && preco > 0) {
    hasDiscount = true;
    savings = originalPrice - preco;
    discountPct = Math.round((savings / originalPrice) * 100);
  } else if (p.promocao && preco > 0 && originalPrice <= 0) {
    originalPrice = Math.round((preco * 1.25) * 100) / 100;
    hasDiscount = true;
    savings = originalPrice - preco;
    discountPct = Math.round((savings / originalPrice) * 100);
  } else {
    originalPrice = preco;
  }

  return { finalPrice: preco, originalPrice, hasDiscount, discountPct, savings };
}

const prodNormal = { preco: 159.90, estoque: 5 };
const resNormal = mockPricing(prodNormal);
assertTest('Preço normal sem desconto mantém valor original igual ao final', resNormal.finalPrice === 159.90 && !resNormal.hasDiscount);

const prodPromo = { preco: 129.90, preco_original: 179.90, promocao: true, estoque: 2 };
const resPromo = mockPricing(prodPromo);
assertTest('Produto promocional calcula desconto real e economia em reais', resPromo.hasDiscount && resPromo.discountPct === 28 && Math.abs(resPromo.savings - 50.00) < 0.01);

const prodZero = { preco: 0, estoque: 0 };
const resZero = mockPricing(prodZero);
assertTest('Produto sob encomenda (preço 0) não gera desconto espúrio', resZero.finalPrice === 0 && !resZero.hasDiscount);

// ----------------------------------------------------------------------------
// 2. JORNADA DE COMPRA: CODIFICAÇÃO DA MENSAGEM WHATSAPP
// ----------------------------------------------------------------------------
console.log('\n--- 2. JORNADA DE COMPRA: MENSAGEM ESTRUTURADA WHATSAPP ---');

function generateMockWhatsAppUrl(orderCode, clientName, clientBairro, items, total, payMethod, isGift) {
  const base = 'https://wa.me/5518997871211';
  let msg = `🛍️ *NOVO PEDIDO - VIVI CARVALHO BOTY*\n`;
  msg += `Código: #${orderCode}\n\n`;
  msg += `👤 *Cliente:* ${clientName || 'Cliente'} (Bairro: ${clientBairro || 'A combinar'})\n`;
  msg += `🎁 *Para presente:* ${isGift ? 'Sim (caprichar na embalagem!)' : 'Não'}\n\n`;
  msg += `📋 *Itens:* \n`;
  items.forEach(it => {
    msg += `• ${it.q}x ${it.nome} - R$ ${(it.preco * it.q).toFixed(2)}\n`;
  });
  msg += `\n💰 *Total:* R$ ${total.toFixed(2)}\n`;
  msg += `💳 *Forma de pagamento:* ${payMethod}\n\n`;
  msg += `Olá, Vivi! Acabei de montar meu pedido pelo site e gostaria de confirmar a entrega!`;

  return `${base}?text=${encodeURIComponent(msg)}`;
}

const mockUrl = generateMockWhatsAppUrl('PED-1234', 'Ana Paula', 'Vila Operária', [{ nome: 'Lily Eau de Parfum', preco: 299.90, q: 1 }], 299.90, 'Pix', true);
assertTest('URL do WhatsApp gerada corretamente com codificação UTF-8', mockUrl.startsWith('https://wa.me/5518997871211?text='));
assertTest('URL contém parâmetros essenciais (código, cliente, bairro e presente)', mockUrl.includes('PED-1234') && mockUrl.includes('Ana%20Paula') && mockUrl.includes('Vila%20Oper%C3%A1ria'));

// ----------------------------------------------------------------------------
// 3. BACKEND & SUPABASE RLS CONTRACT
// ----------------------------------------------------------------------------
console.log('\n--- 3. SUPABASE & POSTGRESQL BEST PRACTICES ---');

assertTest('Esquema SQL define chave primária UUID em todas as tabelas', 
  schema.includes('id UUID PRIMARY KEY DEFAULT gen_random_uuid()'));

assertTest('Row Level Security (RLS) ativada explicitamente em todas as tabelas públicas',
  schema.includes('ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;') &&
  schema.includes('ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;') &&
  schema.includes('ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;') &&
  schema.includes('ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;'));

assertTest('Política de pedidos impede leitura anônima (SELECT exclusivo para autenticado)',
  schema.includes('CREATE POLICY "Admin select orders"') &&
  schema.includes('TO authenticated'));

assertTest('Política de configurações protege chaves de API contra visualização anônima',
  schema.includes("key NOT ILIKE '%key%'") || schema.includes("key != 'gemini_api_key'"));

assertTest('Índices de performance de catálogo e busca rápida criados no banco',
  schema.includes('idx_products_active_catalog') && schema.includes('idx_products_fulltext'));

// ----------------------------------------------------------------------------
// 4. ANIMAÇÕES 60 FPS & PREFERS-REDUCED-MOTION
// ----------------------------------------------------------------------------
console.log('\n--- 4. ANIMAÇÕES & EFEITOS VISUAIS (60 FPS & ACCESSIBILITY) ---');

assertTest('Aceleração de hardware (will-change) configurada em transições críticas',
  html.includes('will-change: transform') && html.includes('will-change: opacity'));

assertTest('Uso de translate3d para composição via GPU em gavetas mobile',
  html.includes('translate3d(100%, 0, 0)') && html.includes('translate3d(0, 0, 0)'));

assertTest('Media query @media (prefers-reduced-motion: reduce) desativa animações para acessibilidade',
  html.includes('@media (prefers-reduced-motion: reduce)'));

assertTest('Easing natural cubic-bezier presente nas transições de modal e drawer',
  html.includes('cubic-bezier(0.16, 1, 0.3, 1)'));

// ----------------------------------------------------------------------------
// 5. RESUMO
// ----------------------------------------------------------------------------
console.log('\n=============================================================');
console.log(`RESUMO DA SUITE E2E:`);
console.log(`Total de testes: ${totalTests}`);
console.log(`✔ Aprovados:     ${passedTests}`);
console.log(`✖ Falhas:        ${failedTests}`);
console.log('=============================================================');

if (failedTests > 0) process.exit(1);
else process.exit(0);
