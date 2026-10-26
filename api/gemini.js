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

    // Detecta se a requisição contém imagem (multimodal)
    const hasImage = contents.some(c =>
      Array.isArray(c?.parts) && c.parts.some(p => p.inline_data || p.inlineData)
    );

    // Lista de modelos suportados com fallback em cascata
    const priorityModels = model
      ? [model, 'gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3-flash-preview']
      : ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3-flash-preview'];
    const modelsToTry = [...new Set(priorityModels)];

    let lastError = null;
    let lastStatusCode = 500;

    // Timeout por tentativa de modelo: 18s para multimodal/imagem, 14s para texto simples
    const timeoutPerModel = hasImage ? 18000 : 14000;

    for (const m of modelsToTry) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutPerModel);

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

          // Se for erro definitivo (chave inválida ou não autorizada), retorna de imediato
          return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;
        if (err.name === 'AbortError') {
          console.warn(`Tempo limite excedido no modelo ${m} (${timeoutPerModel / 1000}s). Tentando próximo modelo...`);
          lastError = new Error(`Tempo limite esgotado no modelo ${m}.`);
          continue;
        }
      }
    }

    return res.status(lastStatusCode).json({
      error: {
        message: lastError ? lastError.message : 'Não foi possível consultar os dados do produto no momento. Tente novamente.'
      }
    });
  } catch (e) {
    console.error('Erro no handler /api/gemini:', e);
    return res.status(500).json({
      error: { message: e?.message || 'Erro interno no servidor' }
    });
  }
}
