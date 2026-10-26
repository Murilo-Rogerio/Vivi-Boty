import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.resolve(__dirname, '../index.html');
const stylesPath = path.resolve(__dirname, '../styles.css');

const html = fs.readFileSync(indexPath, 'utf-8');
const styles = fs.existsSync(stylesPath) ? fs.readFileSync(stylesPath, 'utf-8') : '';

console.log('=== DEEP UI/UX, A11Y, DESIGN & CODE QUALITY AUDIT ===\n');

const findings = [];

function addFinding(category, severity, title, details, fixProposal) {
  findings.push({ category, severity, title, details, fixProposal });
}

// 1. A11Y: Icon-only buttons without aria-label or title
const buttonRegex = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
let match;
while ((match = buttonRegex.exec(html)) !== null) {
  const attrs = match[1];
  const body = match[2].trim();
  const isIconOnly = /^(\s*<i\b[^>]*><\/i>\s*|\s*<svg\b[^>]*>[\s\S]*?<\/svg>\s*)+$/i.test(body);
  const hasAccessibleName = /aria-label\s*=|title\s*=/i.test(attrs) || /aria-labelledby\s*=/i.test(attrs);
  if (isIconOnly && !hasAccessibleName) {
    const line = html.slice(0, match.index).split('\n').length;
    addFinding(
      'Accessibility (WCAG 2.1)',
      'HIGH',
      `Botão somente com ícone sem nome acessível (aria-label)`,
      `Linha ${line}: ${match[0].slice(0, 100)}...`,
      `Adicionar aria-label descritivo para leitores de tela`
    );
  }
}

// 2. A11Y: Inputs without label or aria-label
const inputRegex = /<input\b([^>]*)>/gi;
while ((match = inputRegex.exec(html)) !== null) {
  const attrs = match[1];
  const typeMatch = /type=["']?([^"'\s>]+)/i.exec(attrs);
  const type = typeMatch ? typeMatch[1].toLowerCase() : 'text';
  if (['hidden', 'submit', 'button', 'image', 'file'].includes(type)) continue;

  const idMatch = /id=["']?([^"'\s>]+)/i.exec(attrs);
  const id = idMatch ? idMatch[1] : null;
  const hasAria = /aria-label\s*=|aria-labelledby\s*=/i.test(attrs);

  if (!hasAria) {
    if (!id || !new RegExp(`<label\\b[^>]*for=["']${id}["']`, 'i').test(html)) {
      const line = html.slice(0, match.index).split('\n').length;
      addFinding(
        'Accessibility (WCAG 2.1)',
        'HIGH',
        `Input sem label associado ou aria-label`,
        `Linha ${line}: ${match[0].slice(0, 100)} (type="${type}", id="${id}")`,
        `Adicionar <label for="${id}"> ou atributo aria-label`
      );
    }
  }
}

// 3. A11Y: Images without alt attribute
const imgRegex = /<img\b([^>]*)>/gi;
while ((match = imgRegex.exec(html)) !== null) {
  const attrs = match[1];
  if (!/alt\s*=/i.test(attrs)) {
    const line = html.slice(0, match.index).split('\n').length;
    addFinding(
      'Accessibility (WCAG 2.1)',
      'MEDIUM',
      `Imagem <img> sem atributo alt`,
      `Linha ${line}: ${match[0].slice(0, 100)}`,
      `Adicionar alt="..." descritivo ou alt="" se puramente decorativa`
    );
  }
}

// 4. Contrast & Impeccable: Low contrast text colors on light backgrounds
// Gold (#C69A55 on white is 2.8:1, fails WCAG AA 4.5:1. Darker gold #8E6523 or #966C2B passes!)
// Muted gold #EACCA4 on light bg fails completely!
const lowContrastGold = /class=["'][^"']*\btext-\[#EACCA4\][^"']*["']/gi;
while ((match = lowContrastGold.exec(html)) !== null) {
  const line = html.slice(0, match.index).split('\n').length;
  // check surrounding 200 chars for light bg
  const context = html.slice(Math.max(0, match.index - 100), Math.min(html.length, match.index + 100));
  if (context.includes('bg-white') || context.includes('bg-[#FAF4F0]') || context.includes('bg-[#FAF0EB]')) {
    addFinding(
      'Impeccable & Contrast (WCAG AA)',
      'MEDIUM',
      `Texto dourado claro (#EACCA4) sobre fundo claro (contraste insuficiente)`,
      `Linha ${line}: text-[#EACCA4] tem contraste < 2.5:1 contra fundos claros`,
      `Substituir por tom dourado escuro de alto contraste como #8E6523 ou #A97E3B`
    );
  }
}

// 5. Mobile Ergonomics / Touch Targets: min 44x44px for primary mobile actions
// Bottom navigation bar, floating WhatsApp button, quantity buttons, quick view buttons
const smallButtons = /<button\b[^>]*class=["'][^"']*\b(w-[456]\s+h-[456]|p-1\b)[^"']*["'][^>]*>/gi;
const smallBtnMatches = [];
while ((match = smallButtons.exec(html)) !== null) {
  const line = html.slice(0, match.index).split('\n').length;
  smallBtnMatches.push({ line, tag: match[0].slice(0, 100) });
}
if (smallBtnMatches.length > 0) {
  addFinding(
    'UI/UX Mobile Ergonomics',
    'LOW',
    `Botões com touch target reduzido (< 44px) detectados`,
    `${smallBtnMatches.length} botões detectados: ` + smallBtnMatches.map(b => `L${b.line}`).join(', '),
    `Garantir que botões de clique possuam padding de toque confortável (mínimo p-2 ou 36-44px)`
  );
}

// 6. Core Web Vitals: font-display swap on Google Fonts
if (!html.includes('&display=swap') && html.includes('fonts.googleapis.com')) {
  addFinding(
    'Core Web Vitals & Performance',
    'MEDIUM',
    `Google Fonts sem parâmetro &display=swap`,
    `Pode bloquear renderização de texto e afetar FCP / LCP`,
    `Adicionar &display=swap nas tags <link rel="stylesheet"> de fontes`
  );
} else if (html.includes('&display=swap')) {
  console.log('✔ Google Fonts possui &display=swap configurado.');
}

// 7. Core Web Vitals: Preconnect to Supabase CDN & Google Fonts
const hasPreconnectSupabase = html.includes('rel="preconnect" href="https://ifqbuhrhmefqiwrpzvsh.supabase.co"');
const hasPreconnectFonts = html.includes('rel="preconnect" href="https://fonts.gstatic.com"');
if (!hasPreconnectSupabase) {
  addFinding(
    'Core Web Vitals & Performance',
    'LOW',
    `Falta preconnect para o CDN do Supabase Storage`,
    `Imagens dos produtos carregam do Supabase Storage. Um preconnect economiza 150-300ms na primeira conexão.`,
    `Adicionar <link rel="preconnect" href="https://ifqbuhrhmefqiwrpzvsh.supabase.co" crossorigin>`
  );
}

// 8. Visual Hierarchy & Micro-interactions: Focus-visible states
if (!html.includes('focus-visible:ring-') && !html.includes(':focus-visible') && !styles.includes(':focus-visible')) {
  addFinding(
    'UI/UX & Accessibility',
    'MEDIUM',
    `Ausência de estilos de :focus-visible para navegação por teclado`,
    `Usuários de teclado/leitores de tela não têm indicador visual claro de foco`,
    `Adicionar regras de foco com contorno elegante dourado (:focus-visible { outline: 2px solid #C69A55; outline-offset: 2px; })`
  );
}

// 9. Layout Shift (CLS): Image containers without explicit aspect ratio
const imgsWithoutAspect = html.match(/<img\b(?![^>]*class=["'][^"']*\baspect-)[^>]*>/gi) || [];
console.log(`Imagens sem classe aspect expressa: ${imgsWithoutAspect.length}`);

// Print findings
console.log(`Total de apontamentos encontrados: ${findings.length}\n`);
findings.forEach((f, idx) => {
  console.log(`[${idx + 1}] [${f.severity}] ${f.category} - ${f.title}`);
  console.log(`    Detalhe: ${f.details}`);
  console.log(`    Solução: ${f.fixProposal}\n`);
});
