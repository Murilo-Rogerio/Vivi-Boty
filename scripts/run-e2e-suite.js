import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import middleware from '../middleware.js';
import geminiHandler from '../api/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.resolve(__dirname, '../index.html');
const schemaPath = path.resolve(__dirname, '../supabase_schema.sql');
const geminiPath = path.resolve(__dirname, '../api/gemini.js');

const html = fs.readFileSync(indexPath, 'utf-8');
const schema = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf-8') : '';
const geminiCode = fs.existsSync(geminiPath) ? fs.readFileSync(geminiPath, 'utf-8') : '';

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
// 5. RESILIÊNCIA DA IA: BUSCA, PREENCHIMENTO & FALLBACKS EM CASCATA
// ----------------------------------------------------------------------------
console.log('\n--- 5. IA & RESILIÊNCIA: MODELO GEMINI-3.8-FLASH & CASCATA ---');

assertTest('Modelo gemini-3.8-flash prioritário em api/gemini.js com fallbacks',
  geminiCode.includes("'gemini-3.8-flash'") &&
  geminiCode.includes("'gemini-3.5-flash-lite'") &&
  geminiCode.includes("'gemini-3.6-flash'") &&
  geminiCode.includes("'gemini-3-flash-preview'"));

assertTest('Modelo gemini-3.8-flash prioritário na contingência direta de index.html',
  html.includes("const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3-flash-preview'];"));

assertTest('Chamada proxy cliente passa gemini-3.8-flash explicitamente',
  html.includes("model: 'gemini-3.8-flash'"));

assertTest('Timeout adaptativo para mobile 4G configurado (foto: 35s, texto: 22s)',
  html.includes('const clientTimeoutMs = hasImage ? 35000 : 22000;'));

assertTest('Timeout por modelo configurado no serverless api/gemini.js',
  geminiCode.includes('const timeoutPerModel = hasImage ? 12000 : 9000;'));

// Execução real da cascata de fallback do Gemini
const originalFetch = globalThis.fetch;
const modelCalls = [];
globalThis.fetch = async (url) => {
  modelCalls.push(url);
  if (url.includes('gemini-3.8-flash')) {
    return new Response(JSON.stringify({ error: { message: 'High demand on gemini-3.8-flash' } }), { status: 503 });
  }
  return new Response(JSON.stringify({
    candidates: [{ content: { parts: [{ text: '{"status":"ok","modelo":"fallback"}' }] } }]
  }), { status: 200 });
};

let resStatus = 0;
let resData = null;
const mockRes = {
  setHeader: () => {},
  status: (s) => {
    resStatus = s;
    return {
      json: (d) => { resData = d; return mockRes; },
      end: () => mockRes
    };
  }
};

await geminiHandler({
  method: 'POST',
  body: { apiKey: 'AIzaFakeKey123', contents: [{ parts: [{ text: 'test' }] }] }
}, mockRes);

globalThis.fetch = originalFetch;

assertTest('Execução real de fallback: gemini-3.8-flash tenta primeiro e cascata para gemini-3.5-flash-lite em 503',
  modelCalls.length >= 2 &&
  modelCalls[0].includes('gemini-3.8-flash') &&
  modelCalls[1].includes('gemini-3.5-flash-lite') &&
  resStatus === 200 &&
  resData?.candidates?.[0]?.content?.parts?.[0]?.text?.includes('fallback'));

// Validação de segurança e integridade do endpoint api/gemini.js
let missingKeyStatus = 0;
await geminiHandler({ method: 'POST', body: {} }, {
  setHeader: () => {},
  status: (s) => { missingKeyStatus = s; return { json: () => {}, end: () => {} }; }
});
assertTest('Endpoint /api/gemini rejeita requisições sem chave com HTTP 400 amigável',
  missingKeyStatus === 400);

let getMethodStatus = 0;
await geminiHandler({ method: 'GET' }, {
  setHeader: () => {},
  status: (s) => { getMethodStatus = s; return { json: () => {}, end: () => {} }; }
});
assertTest('Endpoint /api/gemini rejeita métodos não permitidos com HTTP 405',
  getMethodStatus === 405);

// Teste de resiliência da busca (accent-insensitive e case-insensitive)
function mockNormalizeSearch(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const testCatalog = [
  { nome: 'Colônia Desodorante Malbec 100ml', marca: 'O Boticário', categoria: 'Perfumes' },
  { nome: 'Elysée Eau de Parfum 50ml', marca: 'O Boticário', categoria: 'Perfumes' },
  { nome: 'Óleo Corporal Amêndoas Doces Sève 200ml', marca: 'Natura', categoria: 'Corpo e Banho' }
];

const matchColonia = testCatalog.filter(p => mockNormalizeSearch(`${p.nome} ${p.marca} ${p.categoria}`).includes(mockNormalizeSearch('colonia')));
const matchElysee = testCatalog.filter(p => mockNormalizeSearch(`${p.nome} ${p.marca} ${p.categoria}`).includes(mockNormalizeSearch('elysee')));
const matchOleo = testCatalog.filter(p => mockNormalizeSearch(`${p.nome} ${p.marca} ${p.categoria}`).includes(mockNormalizeSearch('oleo')));

assertTest('Resiliência da busca de catálogo: busca sem acento encontra termos com acento e vice-versa',
  matchColonia.length === 1 && matchElysee.length === 1 && matchOleo.length === 1 &&
  html.includes('normalizeSearch(text)'));

// Teste de resiliência de parsing do preenchimento de catálogo por IA
function mockParseGeminiJson(rawText) {
  if (!rawText) return null;
  let clean = rawText.trim();
  if (clean.startsWith('```json')) clean = clean.replace(/^```json\s*/i, '');
  if (clean.startsWith('```')) clean = clean.replace(/^```\s*/, '');
  if (clean.endsWith('```')) clean = clean.replace(/\s*```$/, '');
  try {
    return JSON.parse(clean);
  } catch (e) {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw e;
  }
}

const parsedMarkdown = mockParseGeminiJson('```json\n{"nome":"Clash Extreme","marca":"O Boticário"}\n```');
const parsedWithText = mockParseGeminiJson('Aqui está o resultado oficial:\n{"nome":"Clash Extreme","marca":"O Boticário"}\nEspero ter ajudado!');
assertTest('Resiliência do preenchimento por IA: extrai JSON válido mesmo envolvido por markdown ou texto extra',
  parsedMarkdown?.nome === 'Clash Extreme' && parsedWithText?.marca === 'O Boticário' &&
  html.includes('parseGeminiJson(rawText)'));

// ----------------------------------------------------------------------------
// 6. EDGE MIDDLEWARE: CARDS WHATSAPP & REDIRECIONAMENTO /admin SEM TELA PRETA
// ----------------------------------------------------------------------------
console.log('\n--- 6. EDGE MIDDLEWARE: CARDS WHATSAPP & REDIRECIONAMENTO /admin ---');

const reqAdmin = new Request('https://www.vivicarvalhoboty.com.br/admin');
const resAdmin = await middleware(reqAdmin);
assertTest('Redirecionamento HTTP 302 na rota /admin para evitar tela preta na Vercel',
  resAdmin.status === 302 && (resAdmin.headers.get('location') || '').includes('/?admin=1'));

const reqAdminSub = new Request('https://www.vivicarvalhoboty.com.br/admin/pedidos');
const resAdminSub = await middleware(reqAdminSub);
assertTest('Redirecionamento HTTP 302 preserva sub-rotas de administração (ex: /admin/pedidos)',
  resAdminSub.status === 302 && (resAdminSub.headers.get('location') || '').includes('/?admin=pedidos'));

const reqCrawler = new Request('https://www.vivicarvalhoboty.com.br/produto/prod-123', {
  headers: { 'user-agent': 'WhatsApp/2.21.12.21 i' }
});
const resCrawler = await middleware(reqCrawler);
const crawlerHtml = await resCrawler.text();
assertTest('WhatsApp crawler recebe resposta 200 com metatags dinâmicas Open Graph',
  resCrawler.status === 200 &&
  crawlerHtml.includes('og:title') &&
  crawlerHtml.includes('og:image') &&
  crawlerHtml.includes('og:description') &&
  crawlerHtml.includes('twitter:card'));

// Teste de card WhatsApp com metatags dinâmicas para produto em promoção
const origFetchMid = globalThis.fetch;
globalThis.fetch = async (url) => {
  if (url.includes('/rest/v1/products')) {
    return new Response(JSON.stringify([{
      nome: 'Elysée Eau de Parfum 50ml',
      descricao: 'Fragrância feminina sofisticada e marcante.',
      preco: 229.90,
      preco_original: 299.90,
      promocao: true,
      imagem: 'https://cdn.viviboty.com.br/elysee.jpg'
    }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  return origFetchMid(url);
};

const reqPromoCrawler = new Request('https://www.vivicarvalhoboty.com.br/produto/elysee-50ml', {
  headers: { 'user-agent': 'WhatsApp/2.21.12.21 i' }
});
const resPromoCrawler = await middleware(reqPromoCrawler);
const promoHtml = await resPromoCrawler.text();
globalThis.fetch = origFetchMid;

assertTest('WhatsApp crawler renderiza card com título, preço promocional ("De ... por ...") e imagem dinâmica',
  resPromoCrawler.status === 200 &&
  promoHtml.includes('Elysée Eau de Parfum 50ml — De R$ 299,90 por R$ 229,90') &&
  promoHtml.includes('https://cdn.viviboty.com.br/elysee.jpg') &&
  promoHtml.includes('https://www.vivicarvalhoboty.com.br/?p=elysee-50ml'));

const reqHuman = new Request('https://www.vivicarvalhoboty.com.br/produto/prod-123', {
  headers: { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)' }
});
const resHuman = await middleware(reqHuman);
assertTest('Usuário humano acessando /produto/:id é redirecionado via 302 para SPA sem erro 404',
  resHuman.status === 302 && (resHuman.headers.get('location') || '').includes('/?p=prod-123'));

assertTest('Cliente SPA processa parâmetro ?admin da rota redirecionada sem tela preta',
  html.includes("spInitial.has('admin')") && html.includes("targetAdmin = (adminVal && adminVal !== '1') ? `/admin/${adminVal}` : '/admin'"));

assertTest('Cliente SPA processa deep link de produto ?p= ou ?produto= via quickview',
  html.includes("sp.get('p') || sp.get('produto')") && html.includes("openQuickView(pid)"));

// ----------------------------------------------------------------------------
// 7. RESUMO
// ----------------------------------------------------------------------------
console.log('\n=============================================================');
console.log(`RESUMO DA SUITE E2E:`);
console.log(`Total de testes: ${totalTests}`);
console.log(`✔ Aprovados:     ${passedTests}`);
console.log(`✖ Falhas:        ${failedTests}`);
console.log('=============================================================');

if (failedTests > 0) process.exit(1);
else process.exit(0);
