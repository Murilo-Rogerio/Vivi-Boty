# 🛍️ Vivi Carvalho Boty — Vitrine Digital & Catálogo E-commerce

[![Status](https://img.shields.io/badge/Status-Ativo-brightgreen?style=flat-square)]()
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20TailwindCSS%20%7C%20VanillaJS-blue?style=flat-square)]()
[![Backend](https://img.shields.io/badge/Backend-Supabase%20%7C%20RLS-3ECF8E?logo=supabase&style=flat-square)]()
[![IA](https://img.shields.io/badge/IA-Google%20Gemini%203.8%20Flash-4285F4?logo=google&style=flat-square)]()
[![Auditoria](https://img.shields.io/badge/QA%20%26%20Security-Auto--Healer%20(6h)-success?style=flat-square)]()
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&style=flat-square)](https://www.vivicarvalhoboty.com.br/)
[![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-violet?style=flat-square)]()

Vitrine digital moderna de perfumes, cosméticos e presentes com inteligência artificial para catálogo rápido, funil de vendas zero-friction e fechamento de pedidos direto pelo WhatsApp.

🌐 **Site Oficial:** [vivicarvalhoboty.com.br](https://www.vivicarvalhoboty.com.br/)

---

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades & Fluxo de Conversão](#-funcionalidades--fluxo-de-conversão)
- [Design, Identidade Visual & Mobile First](#-design-identidade-visual--mobile-first)
- [Destaques vs. Ofertas Relâmpago](#-destaques-vs-ofertas-relâmpago)
- [Inteligência Artificial & Catálogo Ágil](#-inteligência-artificial--catálogo-ágil)
- [Controle de Estoque & Encomendas](#-controle-de-estoque--encomendas)
- [Painel Administrativo (/admin)](#-painel-administrativo-admin)
- [Edge Middleware, Open Graph & Roteamento](#-edge-middleware-open-graph--roteamento)
- [Automação de QA, Performance & Segurança (6 em 6 horas)](#-automação-de-qa-performance--segurança-6-em-6-horas)
- [Banco de Dados & Segurança (Supabase RLS)](#-banco-de-dados--segurança-supabase-rls)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar Localmente & Testes](#-como-executar-localmente--testes)
- [Licença](#-licença)

---

## 🧭 Visão Geral

Solução de comércio eletrônico desenvolvida para a boutique **Vivi Carvalho Boty**, consultora oficial de marcas consagradas como **O Boticário**, **Natura** e **Eudora**.

O projeto combina uma experiência de compra acolhedora e refinada para a cliente com uma central administrativa ágil e intuitiva para a lojista. A cliente visualiza fragrâncias e cosméticos em alta definição com selos de desconto inteligentes ("De / Por"), monta a sacola com cálculo de economia em tempo real e finaliza o pedido em um clique no WhatsApp, com mensagem estruturada contendo endereço, forma de pagamento e status de disponibilidade dos itens.

---

## ⚡ Funcionalidades & Fluxo de Conversão

- 🔍 **Busca Rápida no Hero:** Pesquisa instantânea em tempo real por nome, fragrância, notas olfativas ou marcas.
- 🛍️ **Categorias Otimizadas:** Divisão clara entre *Perfumes*, *Cabelos & Capilar*, *Cremes Corporais*, *Banho & Sabonetes*, *Maquiagem* e *Presentes*.
- 🚚 **Badges de Confiança (Trust Badges):** Destaque para *Pronta entrega* (`fa-solid fa-truck-fast`), *Para presentear* (`fa-solid fa-gift`), *Sem cadastro* (WhatsApp) e *Garantia real* (Marcas oficiais).
- 🎁 **Kits & Presentes:** Seção temática dedicada a estojos prontos e combos promocionais para presentear com sacolas oficiais.
- ⭐ **Depoimentos & Prova Social:** Avaliações de clientes reais fortalecendo a credibilidade e segurança da compra, com modal para envio de novas recomendações.
- 💳 **Seletor de Pagamento:** Escolha facilitada de modalidade (Pix, Cartão, Dinheiro) incluída automaticamente no texto do pedido.
- 🛒 **Sacola Click-to-Chat:** Funil de compra zero-friction sem necessidade de cadastros demorados, senhas ou carrinhos abandonados.
- 📱 **PWA & Compartilhamento Rico:** Metatags Open Graph dinâmicas geradas no Edge para cards visuais impecáveis no WhatsApp, Instagram, Facebook e iMessage.

---

## 🎨 Design, Identidade Visual & Mobile First

- **Nome e Marca Centralizados:** No topo da página (navbar), o bloco de identidade oficial (*Vivi Carvalho Boty* e *PERFUMARIA & PRESENTES*) possui centralização matemática balanceada no mobile e desktop.
- **Paleta Warm Luxury:** Cores nobres baseadas em café profundo (`#241A1B`), ouro acetinado (`#C69A55` / `#A97E3B`), champagne (`#E8A7A1`) e fundo suave off-white (`#FCF9F7`).
- **Touch Targets Acessíveis (WCAG 2.5.5):** Botões de favoritar (`w-8 h-8`), controles de quantidade na sacola (`w-8 h-8`) e botões de ação rápida com dimensões mínimas para toque sem falhas em celulares (360px a 390px).
- **Safe Area no iOS:** Espaçamentos com `env(safe-area-inset-bottom)` no botão flutuante do WhatsApp, botão Voltar ao Topo e barra de navegação inferior, eliminando qualquer colisão com a barra de gestos do iPhone.
- **Animações 60 FPS na GPU:** Gaveta da sacola e modais com aceleração de hardware via `translate3d(100%, 0, 0)` e `will-change: transform, opacity`.
- **Acessibilidade:** Suporte total à preferência do sistema `@media (prefers-reduced-motion: reduce)`.

---

## 🏷️ Destaques vs. Ofertas Relâmpago

Para eliminar ambiguidades e dar total controle à lojista, as áreas da vitrine foram claramente especializadas:

1. **⭐ Destaques mais desejados (Queridinhos da Boutique):**
   - Curadoria nobre das fragrâncias e produtos clássicos mais procurados e amados da loja.
   - Exibido no topo da página inicial com o selo `👑 Queridinhos da Boutique`.
   - Ativado pelo switch `[x] ⭐ Destaque` no painel administrativo.

2. **🔥 Ofertas Relâmpago & Queima de Estoque:**
   - Vitrine exclusiva para itens com preços promocionais reduzidos, descontos agressivos e queima de unidades a pronta entrega.
   - Exibido com fundo temático rosado e selo `🔥 Ofertas Relâmpago`.
   - Ativado pelo switch `[x] 🔥 Oferta Relâmpago` no painel administrativo.

> **Controle Total:** No cadastro ou edição do produto, a lojista escolhe livremente se o produto entra em *Destaques*, em *Ofertas Relâmpago*, em ambos ou em nenhum.

---

## 🤖 Inteligência Artificial & Catálogo Ágil

O painel administrativo conta com integração com a **Google Gemini API** para acelerar o cadastro de novos itens sem perder o tom humano de boutique:

- **Modelo Homologado:** Operação nativa no modelo multimodal estável de última geração **`gemini-3.8-flash`**, com fallback automático e resiliente em cascata para **`gemini-3.5-flash-lite`**, **`gemini-3.6-flash`** e **`gemini-3-flash-preview`**.
- **Otimização para Redes Móveis (4G/5G):** Compressão inteligente no cliente para fotos de até 800px max (qualidade 0.78 JPEG) e sincronização de timeouts no serverless (12s para fotos, 9s para texto), evitando erros 504 da Vercel.
- **Proteção Canvas Tainted:** Imagens de produtos carregadas do Supabase Storage utilizam `crossorigin="anonymous"`, permitindo reanálise por foto sem bloqueio de segurança do navegador.
- **Fallback Suave de Contingência:** Caso o proxy serverless sofra instabilidade ou fila, a aplicação aciona automaticamente a conexão direta com o Google Generative Language sem abortar nem travar o painel.
- **Estética Humanizada ("Anti-Cara de IA"):** Interface 100% humanizada sem termos frios de engenharia. O sistema opera como um assistente de catálogo elegante da consultora.
- **Três Gatilhos Minimalistas:**
  - 📷 **Identificar pela Foto:** Analisa fotos tiradas com o celular, reconhecendo o frasco, a linha e o nome oficial da marca.
  - 🪄 **Puxar pelo Nome:** Pesquisa as informações oficiais da marca a partir do nome digitado e preenche campos comerciais.
  - ✨ **Puxar Descrição Oficial (`A.aiEnhanceDescription`):** Extrai exclusivamente a pirâmide olfativa (saída, corpo e fundo), ativos e modo de uso, **sem sobrescrever** nome, marca ou preço já digitados.
- **Feedback Sensorial Completo:**
  - ✨ *Destaque dourado com transição suave* nos campos preenchidos.
  - 🔔 *Sinal sonoro suave* (duplo acorde Fá5/Lá5 sintetizado via Web Audio API, sem arquivos pesados de áudio).
  - 📳 *Vibração háptica* no smartphone da lojista (`navigator.vibrate`).

---

## 📦 Controle de Estoque & Encomendas

A gestão de disponibilidade é automática e transparente:

- **Estoque Maior que 0:** O produto recebe automaticamente o selo verde **Pronta Entrega** e entra no filtro de envio imediato.
- **Estoque Igual a 0:** O produto é marcado automaticamente como **Disponível para Encomenda** (com prazo de retirada combinado via WhatsApp), garantindo que a lojista nunca perca vendas de itens sob pedido.

---

## 🎛️ Painel Administrativo (/admin)

- 🔒 **Acesso Protegido:** Autenticação via Supabase Auth com Row Level Security (RLS) no PostgreSQL.
- ⚡ **Google API Pill:** Botão minimalista no topo para visualização e troca rápida da chave Gemini.
- 📝 **Switches Independentes:**
  1. *Ativo na Loja* (visibilidade para clientes).
  2. *⭐ Destaque* (presença na vitrine nobre do topo da home).
  3. *🔥 Oferta Relâmpago* (presença na área de promoções e queima de estoque).
- 📋 **Ações em Lote (Bulk Actions):** Seleção múltipla de produtos com barra flutuante para ativação, inativação ou exclusão em massa com segurança.
- ✏️ **Edição Rápida Inline:** Ajuste de preço, preço 'De', estoque e ofertas direto na listagem sem abrir o formulário completo.
- 🚗 **Gerador de Rota de Entregas:** Exportação formatada para o WhatsApp com os pedidos pendentes e bairros para roteiro de entregas em Assis/SP.

---

## 🌐 Edge Middleware, Open Graph & Roteamento

- **Detecção Completa de Crawlers (`middleware.js`):** Intercepta bots de redes sociais (`WhatsApp`, `Applebot/iMessage`, `Facebook`, `Twitter`, `Telegram`, `LinkedIn`, `Discord`, `Googlebot`), entregando HTML ultraleve (< 1KB) com metatags Open Graph completas:
  - `og:title`: Título oficial com ancoragem de desconto (*"De R$ X por R$ Y"*).
  - `og:image`: Imagem de 1200x630px em alta resolução.
  - `og:site_name`: "Vivi Carvalho Boty".
  - `twitter:card`: summary_large_image.
- **Sincronia do Preço Original:** Seleciona `preco_original` diretamente do banco de dados, alinhando os cartões de compartilhamento com a vitrine.
- **Roteamento `/admin` Sem Tela Preta:** O Edge Middleware redireciona (302) para `/?admin=1`, e o roteador SPA abre diretamente o painel de administração, eliminando qualquer tela preta ou erro 404 da Vercel.
- **SEO Canônico Padronizado:** URLs canônicas alinhadas em `https://www.vivicarvalhoboty.com.br/` em todo o HTML, Sitemap e Robots.txt.

---

## 🛡️ Automação de QA, Performance & Segurança (6 em 6 horas)

Para garantir que a boutique opere com estabilidade máxima, segurança contra invasões e excelência visual 24 horas por dia, foi implementada uma suite automatizada de auto-cura (*self-healing*) que roda a cada 6 horas:

- **1. Auditoria Geral de Saúde (`scripts/site-health-qa-audit.js`):** 19 verificações cobrindo integridade funcional, equilíbrio de tags, regras de estoque, paleta de luxo, sanitização XSS e ausência de jargões robóticos.
- **2. Auditoria de UI/UX & Acessibilidade (`scripts/audit-ui-ux.js`):** Validação de WCAG 2.1 AA, proporções de aspecto em imagens, display de fontes e microinterações.
- **3. Suíte E2E Oficial Playwright (`scripts/run-e2e-suite.js` & `tests/e2e-playwright.spec.js`):** 14 testes cobrindo a jornada de compra, cálculo financeiro da sacola, formatação UTF-8 do WhatsApp, políticas RLS e animações na GPU.
- **4. Teste em Produção ao Vivo (`scripts/test-live-production.js`):** Validação real contra `https://www.vivicarvalhoboty.com.br/` confirmando status 200 OK, redirecionamento Edge 302, metatags Open Graph e headers de segurança HTTP (CSP, HSTS, X-Frame-Options, nosniff).
- **Autocura Autônoma:** Em caso de regressão, o robô sidecar aplica o patch, executa as suítes novamente e realiza commit/push automaticamente.

---

## 🗄️ Banco de Dados & Segurança (Supabase RLS)

Arquivo de referência: [`supabase_schema.sql`](file:///c:/Users/murilo.carvalho/Documents/viviboty/supabase_schema.sql)

| Tabela | Chave Primária | Política de Segurança (RLS) |
| :--- | :--- | :--- |
| **`products`** | `UUID` | Leitura pública para itens ativos (`ativo = true`); CRUD restrito a administradores. |
| **`orders`** | `UUID` | **INSERT anônimo permitido** (para finalização do pedido); **SELECT proibido para anônimos** (proteção total dos dados dos clientes). |
| **`site_testimonials`** | `UUID` | Leitura pública para depoimentos aprovados; inserção pública para novas avaliações; moderação restrita ao admin. |
| **`store_settings`** | `TEXT` | Chave Gemini e configurações sensíveis visíveis apenas para a administradora autenticada. |

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | HTML5 Semântico + JS Vanilla (ES6+) | SPA client-side ultra-rápida, modular e sem overhead de frameworks |
| **Estilização** | Tailwind CSS + CSS3 GPU Transitions | Paleta luxo dourada, design responsivo mobile-first e tipografia refinada |
| **Inteligência Artificial** | Google Gemini 3.8 Flash | Modelo oficial multimodal com fallback em cascata para extração de catálogo |
| **Backend & Auth** | Supabase (PostgreSQL 15 + RLS) | Persistência de produtos, pedidos, depoimentos e autenticação administrativa |
| **Armazenamento** | Supabase Storage CDN | Hospedagem otimizada de imagens e banners de produtos com CORS anônimo |
| **Edge & Serverless** | Vercel (Edge Middleware + Functions) | Roteamento, Open Graph dinâmico e proxy seguro de IA (maxDuration 45s) |
| **Qualidade & Segurança** | Self-Healing QA Suite (6 em 6 horas) | Auditoria automática de integridade funcional, performance e proteção XSS |
| **PWA / SEO** | Web App Manifest & Sitemap XML | Instalável no Android/iOS e indexação avançada no Google |

---

## 📂 Estrutura do Projeto

```text
viviboty/
├── api/
│   └── gemini.js              # Serverless Function proxy para Google Gemini API
├── scripts/
│   ├── site-health-qa-audit.js # Suite de auditoria funcional, estética, segurança e autocura
│   ├── audit-ui-ux.js          # Auditoria aprofundada de UI/UX, A11Y (WCAG AA) e Core Web Vitals
│   ├── run-e2e-suite.js        # Executador da suite E2E de jornada de compra, RLS e animações
│   └── test-live-production.js # Validador de requisições reais contra o site em produção
├── tests/
│   └── e2e-playwright.spec.js  # Testes ponta a ponta oficiais Playwright (Microsoft standards)
├── index.html                 # Ponto de entrada SPA, catálogo, sacola e painel administrativo
├── styles.css                 # Folha de estilos compilada
├── input.css                  # Diretivas base do Tailwind CSS
├── middleware.js              # Edge Middleware (Open Graph e redirecionamento de rotas)
├── manifest.json              # Manifesto PWA da aplicação
├── robots.txt                 # Diretrizes para indexadores de busca
├── sitemap.xml                # Mapa do site para SEO
├── vercel.json                # Configuração de rewrites, headers e segurança Vercel
├── supabase_schema.sql        # Esquema DDL PostgreSQL, índices otimizados e políticas RLS
├── seed_catalog.sql           # Carga SQL inicial do banco de dados
└── README.md                  # Documentação oficial do projeto
```

---

## 🚀 Como Executar Localmente & Testes

### Pré-requisitos
- Node.js instalado (v18+).
- Navegador web moderno (Chrome, Edge, Brave, Firefox, Safari).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Murilo-Rogerio/Vivi-Boty.git
   cd Vivi-Boty
   ```

2. **Inicie o servidor local:**
   ```bash
   # Com Node.js:
   npx serve .

   # Ou com Python:
   python -m http.server 8000
   ```

3. **Acesse no navegador:**
   Abra `http://localhost:3000` (ou `http://localhost:8000`).

4. **Executar a suíte de auditorias e testes:**
   ```bash
   npm run qa         # Executa a suite de saúde, segurança e autocura (19 verificações)
   npm run audit:ui   # Executa a auditoria de UI/UX, WCAG 2.1 AA e Core Web Vitals
   npm run test:e2e   # Executa a suite E2E de jornada do cliente, checkout e RLS
   ```

5. **Testar ambiente de produção:**
   ```bash
   node scripts/test-live-production.js
   ```

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido com carinho por **Murilo Rogério** para a **Vivi Carvalho Boty**.
