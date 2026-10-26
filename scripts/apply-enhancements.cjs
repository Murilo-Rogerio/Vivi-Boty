const fs = require('fs');
const path = require('path');

const normalize = (s) => s.replace(/\r\n/g, '\n');

// 1. Update middleware.js
const middlewarePath = path.join(__dirname, '..', 'middleware.js');
let middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
const isCRLF_mw = middlewareContent.includes('\r\n');
let mwNorm = normalize(middlewareContent);

const targetMw = `<meta property="og:title" content="\${esc(title)}">
<meta property="og:description" content="\${esc(desc)}">
<meta property="og:image" content="\${esc(image)}">
<meta property="og:url" content="\${esc(canonical)}">
<meta property="og:type" content="product">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">`;

const replacementMw = `<meta property="og:site_name" content="Vivi Carvalho Boty">
<meta property="og:title" content="\${esc(title)}">
<meta property="og:description" content="\${esc(desc)}">
<meta property="og:image" content="\${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="\${esc(title)}">
<meta property="og:url" content="\${esc(canonical)}">
<meta property="og:type" content="product">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="\${esc(title)}">
<meta name="twitter:description" content="\${esc(desc)}">
<meta name="twitter:image" content="\${esc(image)}">`;

if (mwNorm.includes(targetMw)) {
  mwNorm = mwNorm.replace(targetMw, replacementMw);
  fs.writeFileSync(middlewarePath, isCRLF_mw ? mwNorm.replace(/\n/g, '\r\n') : mwNorm, 'utf8');
  console.log('✓ middleware.js: Rich Open Graph and Twitter cards added.');
} else {
  console.log('• middleware.js target already updated or not found.');
}

// 2. Update api/gemini.js for optimized timeouts and resilience
const geminiApiPath = path.join(__dirname, '..', 'api', 'gemini.js');
let geminiApiContent = fs.readFileSync(geminiApiPath, 'utf8');
const isCRLF_api = geminiApiContent.includes('\r\n');
let apiNorm = normalize(geminiApiContent);

const targetTimeout = `    // Timeout por tentativa de modelo: 18s para multimodal/imagem, 14s para texto simples
    const timeoutPerModel = hasImage ? 18000 : 14000;`;

const replTimeout = `    // Timeout por tentativa de modelo: 12s para multimodal/imagem, 9s para texto simples
    const timeoutPerModel = hasImage ? 12000 : 9000;`;

if (apiNorm.includes(targetTimeout)) {
  apiNorm = apiNorm.replace(targetTimeout, replTimeout);
  fs.writeFileSync(geminiApiPath, isCRLF_api ? apiNorm.replace(/\n/g, '\r\n') : apiNorm, 'utf8');
  console.log('✓ api/gemini.js: Timeouts optimized to 12s/9s for seamless Vercel execution.');
} else {
  console.log('• api/gemini.js timeout target already updated or not found.');
}

// 3. Update index.html
const indexPath = path.join(__dirname, '..', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
const isCRLF_idx = indexContent.includes('\r\n');
let idxNorm = normalize(indexContent);

// 3a. handleRoute() admin query param
const targetHandleRoute = `  handleRoute() {
    this.migrateHash();
    const rawPath = this._virtualPath !== null ? this._virtualPath : location.pathname;
    this.path = (rawPath.replace(/\\/+$/, '') || '/');`;

const replHandleRoute = `  handleRoute() {
    this.migrateHash();
    const spInitial = new URLSearchParams(this.getCurrentSearch());
    if (spInitial.has('admin')) {
      const adminVal = spInitial.get('admin');
      const targetAdmin = (adminVal && adminVal !== '1') ? \`/admin/\${adminVal}\` : '/admin';
      this._virtualPath = targetAdmin;
      this._virtualSearch = '';
      try {
        history.replaceState(null, '', targetAdmin);
      } catch {}
    }
    const rawPath = this._virtualPath !== null ? this._virtualPath : location.pathname;
    this.path = (rawPath.replace(/\\/+$/, '') || '/');`;

if (idxNorm.includes(targetHandleRoute)) {
  idxNorm = idxNorm.replace(targetHandleRoute, replHandleRoute);
  console.log('✓ index.html: handleRoute admin parameter navigation added.');
} else {
  console.log('• index.html handleRoute target already updated or not found.');
}

// 3b. Add playSuccessChime and triggerHapticFeedback
const targetHighlight = `  highlightFilledFields(fieldIds) {
    fieldIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.add('ring-2', 'ring-[#C69A55]', 'bg-[#FAF0EB]/60');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-[#C69A55]', 'bg-[#FAF0EB]/60');
      }, 3000);
    });
  },`;

const replHighlight = `  playSuccessChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const createTone = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.04, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration + 0.05);
      };
      createTone(698.46, now, 0.22); // F5
      createTone(880.00, now + 0.08, 0.28); // A5
      setTimeout(() => ctx.close().catch(() => {}), 600);
    } catch {}
  },

  triggerHapticFeedback() {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate([35, 50, 35]);
      }
    } catch {}
  },

  highlightFilledFields(fieldIds) {
    this.playSuccessChime();
    this.triggerHapticFeedback();
    fieldIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.add('ring-2', 'ring-[#C69A55]', 'bg-[#FAF0EB]/60');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-[#C69A55]', 'bg-[#FAF0EB]/60');
      }, 3000);
    });
  },`;

if (idxNorm.includes(targetHighlight)) {
  idxNorm = idxNorm.replace(targetHighlight, replHighlight);
  console.log('✓ index.html: playSuccessChime and triggerHapticFeedback added.');
} else {
  console.log('• index.html highlightFilledFields target already updated or not found.');
}

// 3c. Add aiEnhanceDescription to prevent overwriting whole product on "Puxar descrição oficial"
const targetAfterAiFillFromName = `      this.setAiStatus('Não foi possível carregar os dados pelo nome informado.', true);
    } finally {
      this.setAiLoading(false);
    }
  },`;

const replWithAiEnhance = `      this.setAiStatus('Não foi possível carregar os dados pelo nome informado.', true);
    } finally {
      this.setAiLoading(false);
    }
  },

  async aiEnhanceDescription() {
    if (this.aiBusy) {
      this.showToast('Aguarde a consulta em andamento...', 'info');
      return;
    }

    const key = await this.getGeminiApiKey();
    if (!key) return;

    const nameEl = document.getElementById('form-name');
    const brandEl = document.getElementById('form-brand');
    const descEl = document.getElementById('form-desc');

    const curName = (nameEl?.value || '').trim();
    if (!curName) {
      this.showToast('Digite o nome do produto para buscar a descrição oficial!', 'info');
      nameEl?.focus();
      return;
    }

    const curBrand = brandEl?.value || '';
    this.setAiLoading(true, 'name');
    this.setAiStatus(\`Consultando pirâmide olfativa e detalhes de "\${curName}" com o Gemini...\`);

    try {
      const promptText = \`Você é uma especialista em cosméticos e perfumaria brasileira (O Boticário, Natura e Eudora).
Forneça a descrição oficial completa, elegante e detalhada do produto: "\${curName}"\${curBrand ? \` da marca \${curBrand}\` : ''}.
- Para perfumes: Família olfativa e pirâmide olfativa (notas de saída/topo, corpo/coração e fundo).
- Para cabelos: Tecnologia capilar, ativos e modo de usar.
- Para cremes corporais: Ativos, sensorial, benefícios na pele e modo de usar.
- Para presentes/kits: Itens inclusos e volumetrias.

Retorne EXCLUSIVAMENTE em formato JSON:
{
  "descricao": "string"
}\`;

      const rawJson = await this.callGeminiApi(key, [
        {
          parts: [{ text: promptText }]
        }
      ]);

      const res = this.parseGeminiJson(rawJson);
      if (!res || !res.descricao) throw new Error('Não foi possível obter a descrição da IA.');

      if (descEl) {
        descEl.value = res.descricao;
        this.highlightFilledFields(['form-desc']);
      }

      this.showToast('✨ Descrição e notas olfativas oficiais carregadas com sucesso!', 'success');
      this.setAiStatus('Descrição oficial atualizada com sucesso!');
      setTimeout(() => this.setAiStatus(''), 4000);
    } catch (e) {
      console.error('Erro ao buscar descrição oficial:', e);
      this.showToast('Não foi possível obter a descrição oficial agora.', 'error');
      this.setAiStatus('Não foi possível carregar a descrição.', true);
    } finally {
      this.setAiLoading(false);
    }
  },`;

if (idxNorm.includes(targetAfterAiFillFromName)) {
  idxNorm = idxNorm.replace(targetAfterAiFillFromName, replWithAiEnhance);
  console.log('✓ index.html: aiEnhanceDescription method added.');
} else {
  console.log('• index.html aiFillFromName target already updated or not found.');
}

// 3d. Update #btn-ai-desc onclick to call A.aiEnhanceDescription()
const targetBtnAiDesc = `<button type="button" id="btn-ai-desc" onclick="A.aiFillFromName()"`;
const replBtnAiDesc = `<button type="button" id="btn-ai-desc" onclick="A.aiEnhanceDescription()"`;

if (idxNorm.includes(targetBtnAiDesc)) {
  idxNorm = idxNorm.replace(targetBtnAiDesc, replBtnAiDesc);
  console.log('✓ index.html: btn-ai-desc onclick updated to A.aiEnhanceDescription().');
} else {
  console.log('• index.html btn-ai-desc target already updated or not found.');
}

// 3e. Add crossorigin="anonymous" to #img-preview img
const targetImgPreview = `<img src="\${this.escapeAttr(this.safeUrl(p.imagem))}" alt="\${this.escapeAttr(p.nome)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">`;
const replImgPreview = `<img src="\${this.escapeAttr(this.safeUrl(p.imagem))}" crossorigin="anonymous" alt="\${this.escapeAttr(p.nome)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">`;

if (idxNorm.includes(targetImgPreview)) {
  idxNorm = idxNorm.replace(targetImgPreview, replImgPreview);
  console.log('✓ index.html: crossorigin="anonymous" added to preview img.');
} else {
  console.log('• index.html preview img target already updated or not found.');
}

// 3f. Refine modal text from robotic to human
const targetModalText = `Para usar a IA do Google Gemini no cadastro rápido`;
const replModalText = `Para ativar o assistente inteligente de catálogo e preenchimento oficial`;

if (idxNorm.includes(targetModalText)) {
  idxNorm = idxNorm.replace(targetModalText, replModalText);
  console.log('✓ index.html: AI modal text refined to warm luxury tone.');
} else {
  console.log('• index.html modal text target already updated or not found.');
}

fs.writeFileSync(indexPath, isCRLF_idx ? idxNorm.replace(/\n/g, '\r\n') : idxNorm, 'utf8');
console.log('All enhancements written successfully.');
