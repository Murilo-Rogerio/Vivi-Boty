export const config = { matcher: ['/produto/:path*', '/admin', '/admin/:path*'] };

const BOT_UA = /facebookexternalhit|WhatsApp|Instagram|Twitterbot|linkedinbot|Slackbot|TelegramBot|Discordbot|Pinterest|Googlebot/i;
const SUPABASE_URL = 'https://ifqbuhrhmefqiwrpzvsh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcWJ1aHJobWVmcWl3cnB6dnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzE4MDEsImV4cCI6MjA5NzkwNzgwMX0._Yu2nE4AKgNfEM6x7c3uaMPBjj01KMGJ9cxRVqdWw7w';
const FALLBACK_IMAGE = 'https://ifqbuhrhmefqiwrpzvsh.supabase.co/storage/v1/object/public/site-assets/preview-whatsapp.jpeg';

function esc(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatBRL(v) {
  const n = Number(v || 0);
  return 'R$ ' + n.toFixed(2).replace('.', ',');
}

export default async function middleware(request) {
  const url = new URL(request.url);

  // Redireciona /admin direto para a tela inicial para evitar 404 e tela preta na Vercel
  if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
    const sub = url.pathname.replace(/^\/admin\/?/, '');
    const redirectUrl = sub ? `/?admin=${encodeURIComponent(sub)}` : '/?admin=1';
    return Response.redirect(new URL(redirectUrl, request.url), 302);
  }
  const ua = request.headers.get('user-agent') || '';
  const rawId = url.pathname.split('/').filter(Boolean).pop() || '';
  const productId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  // Se for um usuário humano que acessou /produto/:id diretamente,
  // redireciona com 302 para a raiz com ?p=:id onde a SPA abre o produto sem 404
  if (!BOT_UA.test(ua)) {
    if (productId && productId !== 'produto') {
      return Response.redirect(new URL(`/?p=${encodeURIComponent(productId)}`, request.url), 302);
    }
    return Response.redirect(new URL('/', request.url), 302);
  }

  if (!productId || productId === 'produto') {
    return Response.redirect(new URL('/', request.url), 302);
  }

  let product = null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(productId)}&ativo=eq.true&select=nome,descricao,imagem,preco,marca,ativo,destaque,promocao`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );
    if (res.ok) {
      const rows = await res.json();
      product = Array.isArray(rows) ? rows[0] : null;
    }
  } catch {
    product = null;
  }

  const priceNum = Number(product?.preco || 0);
  const hasPromo = Boolean(product && priceNum > 0 && (product.destaque || product.promocao));
  const origPrice = hasPromo ? (Math.ceil(priceNum / 0.8) - 0.10) : priceNum;

  const title = product?.nome
    ? `${product.nome}${priceNum > 0 ? ` — ${hasPromo ? `De ${formatBRL(origPrice)} por ` : ''}${formatBRL(priceNum)}` : ''} | Vivi Carvalho Boty`
    : 'Vivi Carvalho Boty | Perfumes, Cosméticos e Presentes';
  const desc = (product?.descricao || 'Perfumes, cosméticos e presentes originais com atendimento humanizado pelo WhatsApp.').slice(0, 160);
  const image = (product?.imagem && /^https?:\/\//i.test(product.imagem)) ? product.imagem : FALLBACK_IMAGE;
  const canonical = `https://www.vivicarvalhoboty.com.br/?p=${encodeURIComponent(productId)}`;

  const html = `<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="UTF-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:site_name" content="Vivi Carvalho Boty">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:type" content="product">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(image)}">
<meta http-equiv="refresh" content="0;url=${esc(canonical)}">
</head><body>
<p>Redirecionando para <a href="${esc(canonical)}">${esc(product?.nome || 'Vivi Carvalho Boty')}</a>...</p>
</body></html>`;

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' }
  });
}
