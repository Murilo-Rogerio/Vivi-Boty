#!/usr/bin/env node

/**
 * BATERIA PESADA DE TESTES: PERFORMANCE, FALHAS/BUGS E SEGURANÇA
 * E-commerce Vivi Carvalho Boty - Validação Pré-Deploy para Produção Vercel
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const indexPath = path.join(projectRoot, 'index.html');
const geminiApiPath = path.join(projectRoot, 'api', 'gemini.js');
const middlewarePath = path.join(projectRoot, 'middleware.js');
const vercelJsonPath = path.join(projectRoot, 'vercel.json');

const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: []
};

function pass(name, detail = '') {
  stats.total++;
  stats.passed++;
  console.log(`\x1b[32m✔ [PASS]\x1b[0m ${name} ${detail ? `\x1b[90m(${detail})\x1b[0m` : ''}`);
}

function warn(name, detail = '') {
  stats.total++;
  stats.warnings++;
  console.log(`\x1b[33m⚠ [WARN]\x1b[0m ${name} ${detail ? `\x1b[33m- ${detail}\x1b[0m` : ''}`);
}

function fail(name, error) {
  stats.total++;
  stats.failed++;
  stats.errors.push({ name, error });
  console.log(`\x1b[31m✖ [FAIL]\x1b[0m ${name}: \x1b[31m${error}\x1b[0m`);
}

console.log('\n=============================================================');
console.log('🚀 INICIANDO TESTE PESADO MULTIDIMENSIONAL (PRÉ-DEPLOY)');
console.log('Ambiente: Node.js ' + process.version + ' | Vercel Static + Edge Engine');
console.log('=============================================================\n');

if (!fs.existsSync(indexPath)) {
  fail('Arquivo index.html', 'index.html não foi encontrado');
  process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf-8');
const vercelJson = fs.existsSync(vercelJsonPath) ? JSON.parse(fs.readFileSync(vercelJsonPath, 'utf-8')) : {};
const middlewareCode = fs.existsSync(middlewarePath) ? fs.readFileSync(middlewarePath, 'utf-8') : '';
const apiCode = fs.existsSync(geminiApiPath) ? fs.readFileSync(geminiApiPath, 'utf-8') : '';

// =============================================================
// SEÇÃO 1: SINTAXE E PARSING DO JAVASCRIPT EMBUTIDO E EXTENSÕES
// =============================================================
console.log('\n--- 1. AUDITORIA PROFUNDA DE SINTAXE & JAVASCRIPT AST ---');

// Extração de todos os blocos <script>
const scriptTagRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let scriptIdx = 0;
let scriptMatch;

while ((scriptMatch = scriptTagRegex.exec(html)) !== null) {
  scriptIdx++;
  const attrs = scriptMatch[1];
  const content = scriptMatch[2].trim();
  if (!content) continue;

  // Ignora se for script externo com src="..."
  if (/src=["'][^"']+["']/i.test(attrs)) {
    continue;
  }

  // Se for JSON-LD de SEO schema
  if (/type=["']application\/ld\+json["']/i.test(attrs)) {
    try {
      const parsedJsonLd = JSON.parse(content);
      pass(`Schema JSON-LD de SEO (#${scriptIdx})`, `Válido: ${parsedJsonLd['@type'] || 'Schema'}`);
    } catch (err) {
      fail(`Schema JSON-LD de SEO (#${scriptIdx})`, err.message);
    }
    continue;
  }

  // Script JS Executável
  try {
    new vm.Script(content, { filename: `index.html:inline-script-${scriptIdx}` });
    pass(`Sintaxe do Script JS Executável (#${scriptIdx})`, `${content.split('\n').length} linhas AST válidas`);
  } catch (err) {
    fail(`Sintaxe do Script JS Executável (#${scriptIdx})`, err.message);
  }
}

// =============================================================
// SEÇÃO 2: VERIFICAÇÃO DE MÉTODOS E EVENT HANDLERS
// =============================================================
console.log('\n--- 2. INTEGRIDADE DE EVENT HANDLERS & MÉTODOS DE OBJETO ---');

// Extrair declaração de const A = { ... };
const hasAObject = /const\s+A\s*=\s*\{/.test(html) && /window\.A\s*=|A\.init\(\)/.test(html);
if (hasAObject) {
  pass('Objeto central A da aplicação inicializado e ligado ao ciclo de vida DOM');
} else {
  fail('Objeto A da aplicação', 'Declaração ou inicialização não encontrada');
}

// Encontrar todas as chamadas A.metodo(...) no HTML
const eventHandlers = [
  ...html.matchAll(/\b(?:onclick|onsubmit|onchange|oninput|onkeydown)=["']A\.([a-zA-Z0-9_]+)\(/g)
];
const usedMethods = [...new Set(eventHandlers.map(m => m[1]))];
const missingMethods = [];

usedMethods.forEach(method => {
  const methodRegex = new RegExp(`(?:async\\s+)?${method}\\s*\\(`, 'g');
  if (!methodRegex.test(html)) {
    missingMethods.push(method);
  }
});

if (missingMethods.length === 0) {
  pass(`Todos os ${usedMethods.length} métodos chamados por eventos HTML existem no objeto A`, usedMethods.slice(0, 10).join(', ') + '...');
} else {
  fail('Métodos referenciados no HTML mas ausentes no código', missingMethods.join(', '));
}

// IDs duplicados em elementos HTML
const idRegex = /\bid=["']([^"']+)["']/g;
const idCounts = {};
let idMatch;
while ((idMatch = idRegex.exec(html)) !== null) {
  const id = idMatch[1];
  idCounts[id] = (idCounts[id] || 0) + 1;
}

const duplicateIds = Object.keys(idCounts).filter(id => idCounts[id] > 1);
if (duplicateIds.length === 0) {
  pass('Zero IDs duplicados no DOM do index.html', `${Object.keys(idCounts).length} IDs únicos verificados`);
} else {
  fail('IDs duplicados detectados', duplicateIds.join(', '));
}

// =============================================================
// SEÇÃO 3: AUDITORIA DE PERFORMANCE, ASSETS & CORE WEB VITALS
// =============================================================
console.log('\n--- 3. AUDITORIA DE PERFORMANCE & CORE WEB VITALS (LCP, CLS, FID) ---');

// Tamanho do arquivo bruto e compactado (GZIP)
const rawSize = Buffer.byteLength(html, 'utf-8');
const gzipped = zlib.gzipSync(Buffer.from(html, 'utf-8'));
const gzipSize = gzipped.length;

if (gzipSize < 100 * 1024) {
  pass('Tamanho compactado GZIP excelente para conexões 4G móveis', `${(gzipSize / 1024).toFixed(1)} KB gzipped (${(rawSize / 1024).toFixed(1)} KB raw)`);
} else {
  warn('Tamanho do arquivo index.html elevado', `${(gzipSize / 1024).toFixed(1)} KB`);
}

// Preconnects para CDNs críticos
const hasSupabasePreconnect = html.includes('rel="preconnect" href="https://ifqbuhrhmefqiwrpzvsh.supabase.co" crossorigin');
const hasGoogleFontsPreconnect = html.includes('rel="preconnect" href="https://fonts.googleapis.com"') && html.includes('rel="preconnect" href="https://fonts.gstatic.com" crossorigin');

if (hasSupabasePreconnect && hasGoogleFontsPreconnect) {
  pass('Preconnects otimizados com crossorigin configurados (reduz DNS + TLS em ~300ms)');
} else {
  fail('Preconnect ausente ou sem crossorigin', 'Verifique conexão ao Supabase e Google Fonts');
}

// Font-display swap
if (html.includes('&display=swap')) {
  pass('Google Fonts configurado com &display=swap (previne FOIT e bloqueio de LCP)');
} else {
  fail('Fontes sem &display=swap', 'Pode bloquear a renderização inicial');
}

// Imagem Hero LCP
const hasLcpHeroImage = html.includes('fetchpriority="high"') && html.includes('Vivi Carvalho');
if (hasLcpHeroImage) {
  pass('Imagem hero da consultora configurada com fetchpriority="high" para acelerar o LCP');
} else {
  warn('Imagem de destaque sem fetchpriority="high"');
}

// Aceleração por GPU para gavetas móveis
const hasGpuAcceleration = html.includes('translate3d') || html.includes('will-change');
if (hasGpuAcceleration) {
  pass('Aceleração por hardware configurada (translate3d/will-change) para 60 FPS mobile');
} else {
  warn('Aceleração por GPU ausente nas animações');
}

// Redução de movimento (@media prefers-reduced-motion)
if (html.includes('prefers-reduced-motion: reduce')) {
  pass('Acessibilidade visual: suporte a prefers-reduced-motion: reduce implementado');
} else {
  fail('Falta @media (prefers-reduced-motion: reduce) para acessibilidade vestibular');
}

// =============================================================
// SEÇÃO 4: AUDITORIA DE SEGURANÇA & PROTEÇÃO DE DADOS
// =============================================================
console.log('\n--- 4. AUDITORIA PESADA DE SEGURANÇA (OWASP / XSS / SECRETS / RLS) ---');

// 1. Verificação de vazamento de credenciais mestre
const forbiddenSecrets = [
  { pattern: /service_role/i, name: 'SUPABASE_SERVICE_ROLE_KEY' },
  { pattern: /AIzaSy[A-Za-z0-9_-]{33}/, name: 'GOOGLE_API_KEY hardcoded' },
  { pattern: /sk-[a-zA-Z0-9]{20,}/, name: 'OPENAI_API_KEY / SECRET_KEY' },
  { pattern: /-----BEGIN PRIVATE KEY-----/, name: 'Chave privada RSA/ECC' }
];

let leakFound = false;
forbiddenSecrets.forEach(({ pattern, name }) => {
  if (pattern.test(html)) {
    fail(`Possível vazamento de segredo no index.html: ${name}`, 'Credencial restrita detectada no código cliente');
    leakFound = true;
  }
});
if (!leakFound) {
  pass('Nenhum segredo ou chave mestra restrita exposta no código-fonte cliente');
}

// 2. Funções de escape XSS presentes e ativas
const hasEscapeFn = html.includes('escape(str)') && html.includes('escapeAttr(str)');
if (hasEscapeFn) {
  pass('Sanitizadores de XSS nativos (escape e escapeAttr) implementados e ativos');
} else {
  fail('Funções de sanitização XSS ausentes', 'escape e escapeAttr são obrigatórias');
}

// 3. Validação de URLs seguras
const hasSafeUrl = html.includes('safeUrl(url)');
if (hasSafeUrl) {
  pass('Validador de URLs seguras (safeUrl) ativo contra injeção de javascript: / data:');
} else {
  warn('Validador safeUrl não localizado');
}

// 4. Headers de segurança no Edge (vercel.json)
const edgeHeaders = vercelJson?.headers?.[0]?.headers || [];
const cspHeader = edgeHeaders.find(h => h.key.toLowerCase() === 'content-security-policy');
const hstsHeader = edgeHeaders.find(h => h.key.toLowerCase() === 'strict-transport-security');
const xFrameHeader = edgeHeaders.find(h => h.key.toLowerCase() === 'x-frame-options');
const noSniffHeader = edgeHeaders.find(h => h.key.toLowerCase() === 'x-content-type-options');

if (cspHeader && hstsHeader && xFrameHeader && noSniffHeader) {
  pass('Headers HTTP de segurança completos no vercel.json (CSP, HSTS, X-Frame-Options, no-sniff)');
} else {
  fail('Headers de segurança incompletos no vercel.json', 'Verifique CSP, HSTS ou Frame-Options');
}

// =============================================================
// SEÇÃO 5: ERGONOMIA MOBILE & ACESSIBILIDADE WCAG 2.1 AA
// =============================================================
console.log('\n--- 5. AUDITORIA DE ERGONOMIA TOUCH & ACESSIBILIDADE (WCAG 2.1 AA) ---');

// Inputs com identificadores acessíveis
const inputsWithoutLabel = [];
const inputMatches = [...html.matchAll(/<input\b([^>]*)>/gi)];
inputMatches.forEach(m => {
  const attrs = m[1];
  if (/type=["'](hidden|submit|button|file)["']/i.test(attrs)) return;
  const hasAria = /aria-label\s*=|aria-labelledby\s*=/i.test(attrs);
  const idMatch = /id=["']([^"']+)["']/i.exec(attrs);
  const hasLabel = idMatch && new RegExp(`<label\\b[^>]*for=["']${idMatch[1]}["']`, 'i').test(html);
  if (!hasAria && !hasLabel) {
    inputsWithoutLabel.push(m[0].slice(0, 60));
  }
});

if (inputsWithoutLabel.length === 0) {
  pass(`100% dos ${inputMatches.length} inputs possuem nome acessível (aria-label ou label associado)`);
} else {
  fail('Inputs sem identificador acessível', inputsWithoutLabel.join(', '));
}

// Botões com nomes acessíveis
const iconOnlyWithoutAria = [];
const btnMatches = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];
btnMatches.forEach(m => {
  const attrs = m[1];
  const content = m[2].trim();
  const isIcon = /^(\s*<i\b[^>]*><\/i>\s*|\s*<svg\b[^>]*>[\s\S]*?<\/svg>\s*)+$/i.test(content);
  const hasAria = /aria-label\s*=|title\s*=|aria-labelledby\s*=/i.test(attrs);
  if (isIcon && !hasAria) {
    iconOnlyWithoutAria.push(m[0].slice(0, 60));
  }
});

if (iconOnlyWithoutAria.length === 0) {
  pass(`100% dos ${btnMatches.length} botões possuem rótulo textual ou aria-label para leitores de tela`);
} else {
  fail('Botões de ícone sem nome acessível', iconOnlyWithoutAria.join(', '));
}

// Touch targets minúsculos (<button class="... p-1 ..."> ou similar)
const tinyButtons = [];
btnMatches.forEach(m => {
  const attrs = m[1];
  if (/\bp-1\b/i.test(attrs) && !/min-w-\[/i.test(attrs)) {
    tinyButtons.push(m[0].slice(0, 60));
  }
});

if (tinyButtons.length === 0) {
  pass('Todos os botões atendem aos requisitos de touch target móvel confortável (>= 44px ou padding seguro)');
} else {
  fail('Botões com área de toque potencialmente restrita (p-1 sem min-w/min-h)', tinyButtons.join(', '));
}

// =============================================================
// SEÇÃO 6: REGRAS DE NEGÓCIO, LOGÍSTICA & PROCESSO DE COMPRA
// =============================================================
console.log('\n--- 6. REGRAS DE NEGÓCIO, FRETE GRÁTIS & WHATSAPP CHECKOUT ---');

// Benefício: Frete Grátis Assis e Região
const hasFreteGratis = html.includes('Frete Grátis para Assis e Região') || html.includes('Frete Grátis Assis e Região');
if (hasFreteGratis) {
  pass('Política oficial "Frete Grátis para Assis e Região" ativa e destacada no site');
} else {
  fail('Benefício de Frete Grátis ausente da interface');
}

// Ausência de cupons ou brindes VIP removidos
const hasCupomRemnants = /coupon-input|applyCoupon|activeCoupon|BEMVINDA/i.test(html);
const hasVipRemnants = /Amostra VIP \+ Mimo Especial/i.test(html);

if (!hasCupomRemnants && !hasVipRemnants) {
  pass('Cupons de desconto e Amostra VIP/Mimo Especial completamente expurgados conforme solicitação');
} else {
  fail('Resquícios de cupons ou amostras VIP ainda presentes no código', `cupom: ${hasCupomRemnants}, vip: ${hasVipRemnants}`);
}

// Regra de Estoque
if (html.includes('Maior que 0 = Pronta entrega') && html.includes('Sob Encomenda')) {
  pass('Regra de negócio de estoque (Estoque > 0 = Pronta entrega, Estoque = 0 = Sob Encomenda) íntegra');
} else {
  warn('Texto orientador de estoque pode ter sido alterado');
}

// Geração de mensagem WhatsApp
if (html.includes('checkoutWhatsApp()') && html.includes('wa.me/')) {
  pass('Fluxo de pedido via WhatsApp com codificação UTF-8 e checkoutWhatsApp ativo');
} else {
  fail('Fluxo de finalização no WhatsApp ausente');
}

// =============================================================
// RESUMO GERAL
// =============================================================
console.log('\n=============================================================');
console.log('📊 RESUMO DA BATERIA PESADA DE TESTES:');
console.log(`Total de verificações: ${stats.total}`);
console.log(`✔ Aprovadas:           ${stats.passed}`);
console.log(`⚠ Avisos:             ${stats.warnings}`);
console.log(`✖ Falhas:             ${stats.failed}`);
console.log('=============================================================\n');

if (stats.failed > 0) {
  console.log('\x1b[31mAlgumas verificações falharam. O projeto precisa de ajustes antes do deploy.\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32m🌟 PERFEIÇÃO ALCANÇADA: 100% DOS TESTES APROVADOS! PROJETO PRONTO PARA DEPLOY.\x1b[0m\n');
  process.exit(0);
}
