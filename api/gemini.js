export default async function handler(req, res) {
  // Configuração de CORS para permitir requisições seguras
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
      } catch (_) {
        // body remains as-is
      }
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

    const candidateModels = model
      ? [model, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
      : ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    const models = [...new Set(candidateModels)];

    let lastError = null;
    let lastStatusCode = 500;

    for (const m of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(key)}`;
        const payload = {
          contents,
          generationConfig: {
            temperature: 0.2,
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
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const errMsg = data?.error?.message || `HTTP ${response.status}`;
          lastStatusCode = response.status;
          lastError = new Error(errMsg);

          // Se for erro 404 (modelo não encontrado nesta versão), tenta o próximo modelo do cascade
          if (response.status === 404 || errMsg.toLowerCase().includes('not found')) {
            continue;
          }

          // Para outros erros (ex: chave inválida 400 ou cota 429), retorna imediatamente o detalhe
          return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
      } catch (err) {
        lastError = err;
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
