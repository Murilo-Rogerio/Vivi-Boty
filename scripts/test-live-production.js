import https from 'https';

console.log('=== TESTES REAIS CONTRA PRODUÇÃO: https://www.vivicarvalhoboty.com.br ===\n');

function requestUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.abort(); reject(new Error('Timeout de 10s')); });
  });
}

async function runLiveTests() {
  // Teste 1: Homepage em produção
  try {
    const home = await requestUrl('https://www.vivicarvalhoboty.com.br/');
    console.log(`[TESTE 1] Home Page HTTP Status: ${home.status}`);
    console.log(`          Título presente: ${home.body.includes('<title>Vivi Carvalho Boty') ? '✔ SIM' : '✖ NÃO'}`);
    console.log(`          Preconnect crossorigin: ${home.body.includes('rel="preconnect" href="https://ifqbuhrhmefqiwrpzvsh.supabase.co" crossorigin') ? '✔ SIM' : '✖ NÃO'}`);
    console.log(`          Cache/Edge Server: ${home.headers.server || 'Vercel'}`);
  } catch (e) {
    console.error('[TESTE 1] Falha:', e.message);
  }

  // Teste 2: Rota /admin redirecionamento Edge Middleware
  try {
    const admin = await requestUrl('https://www.vivicarvalhoboty.com.br/admin');
    console.log(`\n[TESTE 2] Rota /admin HTTP Status: ${admin.status}`);
    console.log(`          Location header: ${admin.headers.location || 'Nenhum (renderização direta)'}`);
    console.log(`          Sem erro 404 da Vercel: ${admin.status !== 404 ? '✔ APROVADO' : '✖ REPROVADO'}`);
  } catch (e) {
    console.error('[TESTE 2] Falha:', e.message);
  }

  // Teste 3: Open Graph Crawler Interception (WhatsApp User-Agent)
  try {
    const crawler = await requestUrl('https://www.vivicarvalhoboty.com.br/', {
      'User-Agent': 'WhatsApp/2.21.12.21 i'
    });
    console.log(`\n[TESTE 3] Crawler WhatsApp HTTP Status: ${crawler.status}`);
    console.log(`          Possui og:title: ${crawler.body.includes('og:title') ? '✔ SIM' : '✖ NÃO'}`);
    console.log(`          Possui og:image: ${crawler.body.includes('og:image') ? '✔ SIM' : '✖ NÃO'}`);
    console.log(`          Possui og:description: ${crawler.body.includes('og:description') ? '✔ SIM' : '✖ NÃO'}`);
  } catch (e) {
    console.error('[TESTE 3] Falha:', e.message);
  }

  // Teste 4: Headers de Segurança em Produção
  try {
    const sec = await requestUrl('https://www.vivicarvalhoboty.com.br/');
    console.log(`\n[TESTE 4] Headers de Segurança HTTP:`);
    console.log(`          X-Content-Type-Options: ${sec.headers['x-content-type-options'] || '✖ Ausente'}`);
    console.log(`          X-Frame-Options: ${sec.headers['x-frame-options'] || '✖ Ausente'}`);
    console.log(`          Strict-Transport-Security: ${sec.headers['strict-transport-security'] || '✖ Ausente'}`);
    console.log(`          Content-Security-Policy: ${sec.headers['content-security-policy'] ? '✔ Configurado' : '✖ Ausente'}`);
  } catch (e) {
    console.error('[TESTE 4] Falha:', e.message);
  }
}

runLiveTests();
