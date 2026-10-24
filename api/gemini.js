export default async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Método não permitido. Use POST.' } });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (_) {}
    }

    const { apiKey, contents, systemInstruction, model } = body || {};
    const key = (apiKey || process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');

    if (!key) {
      return res.status(400).json({
        error: {
          message: 'Chave da API Google Gemini não informada. Configure a chave no painel de administração.'
        }
      });
    }

    if (!contents || !Array.isArray(contents) || !contents.length) {
      return res.status(400).json({
        error: { message: 'Conteúdo para consulta da IA não informado.' }
      });
    }

    // Modelos rápidos e diretos na v1beta:
    // gemini-2.5-flash-lite: altíssima velocidade (< 1.5s), ideal para extração de dados e JSON
    // gemini-2.5-flash: modelo flash híbrido de alta capacidade
    // gemini-2.0-flash: fallback robusto
    const priorityModels = model
      ? [model, 'gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3-flash-preview']
      : ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3-flash-preview'];
    const modelsToTry = [...new Set(priorityModels)];

    let lastError = null;
    let lastStatusCode = 500;

    for (const m of modelsToTry) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9500); // 9.5s por modelo para nunca exceder limite da Vercel

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(key)}`;
        const payload = {
          contents,
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        };

        if (systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: systemInstruction }]
          };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const errMsg = data?.error?.message || `HTTP ${response.status}`;
          lastStatusCode = response.status;
          lastError = new Error(errMsg);

          // Se modelo não foi encontrado (404), tenta o próximo modelo da lista
          const isRetryable =
            response.status === 503 ||
            response.status === 429 ||
            response.status === 404 ||
            errMsg.toLowerCase().includes('not found') ||
            errMsg.toLowerCase().includes('no longer available') ||
            errMsg.toLowerCase().includes('deprecated') ||
            errMsg.toLowerCase().includes('high demand') ||
            errMsg.toLowerCase().includes('overloaded') ||
            errMsg.toLowerCase().includes('resource has been exhausted') ||
            errMsg.toLowerCase().includes('rate limit');

          if (isRetryable) {
            console.warn(`Modelo ${m} temporariamente indisponível ou em alta demanda (${errMsg}). Tentando próximo modelo...`);
            continue;
          }

          // Erro de autenticação/chave inválida (400) ou cota (429) retorna de imediato
          return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;
        if (err.name === 'AbortError') {
          lastError = new Error(`Tempo limite esgotado ao consultar modelo ${m}.`);
        }
      }
    }

    return res.status(lastStatusCode).json({
      error: {
        message: lastError ? lastError.message : 'Falha ao comunicar com os modelos do Google Gemini.'
      }
    });
  } catch (e) {
    console.error('Erro no handler /api/gemini:', e);
    return res.status(500).json({
      error: { message: e?.message || 'Erro interno no servidor' }
    });
  }
}
