export const config = { matcher: '/produto/:path*' };

const BOT_UA = /facebookexternalhit|whatsapp|instagram|twitterbot|linkedinbot|slackbot|telegrambot/i;

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) return;

  const url = new URL(request.url);
  const productId = url.pathname.split('/').pop();
  const SUPABASE_URL = 'https://ifqbuhrhmefqiwrpzvsh.supabase.co';
  const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';

  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}&select=nome,descricao,imagem`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
  });
  const [p] = await res.json();

  const title = p ? `${p.nome} | Vivi Carvalho Boty` : 'Vivi Carvalho Boty';
  const desc = p?.descricao?.slice(0,160) || 'Perfumes, cosméticos e presentes escolhidos com carinho para você.';
  const image = p?.imagem || 'https://ifqbuhrhmefqiwrpzvsh.supabase.co/storage/v1/object/public/site-assets/preview-whatsapp.jpeg';

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
    <title>${title}</title>
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="${image}">
    <meta property="og:type" content="website">
  </head><body></body></html>`;

  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
