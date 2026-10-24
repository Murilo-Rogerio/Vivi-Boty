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

    // 1. Descobrir dinamicamente os modelos disponíveis para esta chave de API
    let modelsToTry = [];
    if (model) {
      modelsToTry.push(model);
    }

    try {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`);
      if (listRes.ok) {
        const listData = await listRes.json();
        if (Array.isArray(listData.models)) {
          const supported = listData.models
            .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
            .map(m => m.name.replace(/^models\//, ''));

          const priority = [
            'gemini-3.8-flash',
            'gemini-3.6-flash',
            'gemini-3.5-flash-lite',
            'gemini-2.5-flash',
            'gemini-2.5-flash-lite'
          ];

          for (const p of priority) {
            if (supported.includes(p) && !modelsToTry.includes(p)) {
              modelsToTry.push(p);
            }
          }
          for (const s of supported) {
            if (!modelsToTry.includes(s) && (s.includes('flash') || s.includes('gemini'))) {
              modelsToTry.push(s);
            }
          }
        }
      } else {
        const errJson = await listRes.json().catch(() => ({}));
        if (listRes.status === 400 && errJson?.error?.message?.toLowerCase().includes('key')) {
          return res.status(400).json(errJson);
        }
      }
    } catch (listErr) {
      console.warn('Não foi possível listar modelos dinamicamente, usando fallback padrão:', listErr.message);
    }

    if (!modelsToTry.length) {
      modelsToTry = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
    }

    let lastError = null;
    let lastStatusCode = 500;

    for (const m of modelsToTry) {
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

          // Se for erro 404 (modelo não suportado ou descontinuado), tenta o próximo modelo
          if (response.status === 404 || errMsg.toLowerCase().includes('not found')) {
            continue;
          }

          // Para outros erros (ex: chave inválida ou cota excedida), retorna direto
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
