export const config = { matcher: '/produto/:path*' };

const BOT_UA = /facebookexternalhit|whatsapp|instagram|twitterbot|linkedinbot|slackbot|telegrambot/i;

const SUPABASE_URL = 'https://ifqbuhrhmefqiwrpzvsh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcWJ1aHJobWVmcWl3cnB6dnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzE4MDEsImV4cCI6MjA5NzkwNzgwMX0._Yu2nE4AKgNfEM6x7c3uaMPBjj01KMGJ9cxRVqdWw7w';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) return;

  const url = new URL(request.url);
  const productId = url.pathname.split('/').pop();
  const canonicalUrl = escapeHtml(url.href);

  const DEFAULT_TITLE = 'Vivi Carvalho Boty';
  const DEFAULT_DESC = 'Perfumes, cosméticos e presentes escolhidos com carinho para você.';
  const DEFAULT_IMAGE = 'https://ifqbuhrhmefqiwrpzvsh.supabase.co/storage/v1/object/public/site-assets/preview-whatsapp.jpeg';

  let title = DEFAULT_TITLE;
  let desc = DEFAULT_DESC;
  let image = DEFAULT_IMAGE;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${productId}&select=nome,descricao,imagem`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (res.ok) {
      const [p] = await res.json();
      if (p) {
        title = `${p.nome} | Vivi Carvalho Boty`;
        desc = p.descricao?.slice(0, 160) || DEFAULT_DESC;
        image = p.imagem || DEFAULT_IMAGE;
      }
    }
  } catch (_) {
    // fall through to defaults
  }

  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(desc);
  const safeImage = escapeHtml(image);

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
    <title>${safeTitle}</title>
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDesc}">
    <meta property="og:image" content="${safeImage}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDesc}">
    <meta name="twitter:image" content="${safeImage}">
  </head><body></body></html>`;

  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
