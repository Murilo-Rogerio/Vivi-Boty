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
- [Inteligência Artificial & Catálogo Ágil](#-inteligência-artificial--catálogo-ágil)
- [Controle de Estoque & Encomendas](#-controle-de-estoque--encomendas)
- [Painel Administrativo (/admin)](#-painel-administrativo-admin)
- [Automação de QA, Performance & Segurança (6 em 6 horas)](#-automação-de-qa-performance--segurança-6-em-6-horas)
- [Arquitetura & Decisões Técnicas](#-arquitetura--decisões-técnicas)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar Localmente](#-como-executar-localmente)
- [Licença](#-licença)

---

## 🧭 Visão Geral

Solução de comércio eletrônico desenvolvida para a boutique **Vivi Carvalho Boty**, consultora oficial de marcas consagradas como **O Boticário**, **Natura** e **Eudora**.

O projeto combina uma experiência de compra fluida e acolhedora para o cliente com uma central administrativa ágil e intuitiva para a lojista. A cliente visualiza fragrâncias e cosméticos em alta definição com selos de desconto inteligentes ("De / Por"), monta a sacola com cálculo de economia em tempo real e finaliza o pedido em um clique no WhatsApp, com mensagem estruturada contendo endereço, forma de pagamento e status de disponibilidade dos itens.

---

## ⚡ Funcionalidades & Fluxo de Conversão

- 🔍 **Busca Rápida no Hero:** Pesquisa instantânea em tempo real por nome, fragrância, notas olfativas ou marcas.
- 🛍️ **Categorias Otimizadas:** Divisão clara entre *Perfumes*, *Cabelos & Capilar*, *Cremes Corporais*, *Banho & Sabonetes*, *Maquiagem* e *Presentes*.
- 🎁 **Kits & Presentes:** Seção temática dedicada a estojos prontos e combos promocionais para presentear.
- ⭐ **Depoimentos & Prova Social:** Avaliações de clientes reais fortalecendo a credibilidade e segurança da compra.
- 💳 **Seletor de Pagamento:** Escolha facilitada de modalidade (Pix, Cartão, Dinheiro) incluída automaticamente no texto do pedido.
- 🛒 **Sacola Click-to-Chat:** Funil de compra zero-friction sem necessidade de cadastros demorados, senhas ou carrinhos abandonados.
- 📱 **PWA & Compartilhamento Rico:** Metatags Open Graph dinâmicas geradas no Edge para cards visuais impecáveis no WhatsApp, Instagram e Facebook.

---

## 🤖 Inteligência Artificial & Catálogo Ágil

O painel administrativo conta com integração direta com a **Google Gemini API** para acelerar o cadastro de novos itens sem perder o tom humano de boutique:

- **Modelo Homologado:** Operação nativa no modelo multimodal estável de última geração **`gemini-3.8-flash`**, com fallback automático e resiliente em cascata para **`gemini-3.5-flash-lite`** e **`gemini-3.6-flash`**.
- **Otimização para Redes Móveis (4G/5G):** Compressão inteligente no cliente para fotos de até 800px max (redução de 75% no payload de dados móveis) e timeout generoso e adaptativo (35s para imagens e 22s para texto).
- **Fallback Suave de Contingência:** Caso o proxy serverless da Vercel sofra instabilidade ou fila, a aplicação aciona automaticamente a conexão direta com o Google Generative Language sem abortar nem travar o painel.
- **Estética Humanizada ("Anti-Cara de IA"):** Interface limpa sem termos frios de engenharia (como *prompt*, *modelo LLM*, *alucinação* ou timeouts brutos). O sistema opera como um assistente de catálogo elegante da consultora.
- **Três Gatilhos Minimalistas:**
  - 📷 **Identificar pela Foto:** Analisa fotos tiradas com o celular, reconhecendo o frasco, a linha e o nome oficial da marca.
  - 🪄 **Puxar pelo Nome:** Pesquisa as informações oficiais da marca a partir do nome digitado e corrige termos automaticamente.
  - ✨ **Puxar Descrição Oficial:** Elabora descrições comerciais envolventes incluindo pirâmide olfativa (saída, corpo e fundo), benefícios e modo de uso.
- **Feedback Sensorial Completo:** Quando o preenchimento automático termina, o sistema aciona:
  - ✨ *Destaque dourado pulsante* nos campos preenchidos.
  - 🔔 *Sinal sonoro suave* (duplo acorde sintetizado via Web Audio API, sem arquivos pesados de áudio).
  - 📳 *Vibração háptica* no smartphone da lojista.

---

## 📦 Controle de Estoque & Encomendas

A gestão de disponibilidade foi unificada e simplificada para eliminar configurações confusas:

- **Estoque Maior que 0:** O produto recebe automaticamente o selo verde **Pronta Entrega** e entra no filtro de envio imediato.
- **Estoque Igual a 0:** O produto é marcado automaticamente como **Disponível para Encomenda** (com prazo de retirada combinado via WhatsApp), permitindo que a lojista nunca perca vendas de itens sob pedido.

---

## 🎛️ Painel Administrativo (/admin)

- 🔒 **Acesso Protegido:** Autenticação via Supabase Auth com Row Level Security (RLS) no PostgreSQL.
- ⚡ **Google API Pill:** Botão minimalista no topo para visualização e troca rápida da chave Gemini.
- 📝 **Switches Simplificados:**
  1. *Produto visível na loja* (ativação imediata no catálogo).
  2. *Destaque & Promoção (Oferta)* (unificado: insere selo de desconto, preço riscado "De / Por" e presença na vitrine da home).
- 📋 **Ações em Lote (Bulk Actions):** Seleção múltipla de produtos com barra flutuante para ativação, inativação ou exclusão em massa com segurança.
- ✏️ **Edição Rápida Inline:** Ajuste de preço, preço 'De', estoque e ofertas direto na listagem sem abrir o formulário completo.
- 🚗 **Gerador de Rota de Entregas:** Exportação formatada para o WhatsApp com os pedidos pendentes e bairros para roteiro de entregas em Assis/SP.

---

## 🛡️ Automação de QA, Performance & Segurança (6 em 6 horas)

Para garantir que a boutique opere com estabilidade máxima, segurança contra invasões e excelência visual 24 horas por dia, foi implementada uma suite automatizada de auto-cura (*self-healing*):

- **Script de Testes e Auditoria:** [`scripts/site-health-qa-audit.js`](file:///c:/Users/murilo.carvalho/Documents/viviboty/scripts/site-health-qa-audit.js) executa 19 verificações estruturadas:
  1. **Integridade Funcional & Bugs:** Equilíbrio sintático de tags `<script>` e `<style>`, verificação de todos os manipuladores de eventos (`onclick="A.*"`), validação da serialização de sacola e das regras de estoque.
  2. **Estética Humana & Identidade:** Varredura estrita contra vazamentos de jargões robóticos de IA na interface do cliente ou administradora, validação da paleta de luxo e do branding oficial *Vivi Carvalho Boty*.
  3. **Performance & Resiliência:** Verificação de redimensionamento de imagens (maxDim 800px), preconnect com `crossorigin` para o CDN de imagens, timeouts adaptativos e configuração de `maxDuration` no Vercel Functions.
  4. **Segurança & Vulnerabilidades:** Validação de sanitização XSS (`escape`, `escapeAttr`), varredura contra vazamento de segredos/chaves mestras no frontend e headers HTTP de segurança (CSP, HSTS, X-Frame-Options, X-Content-Type-Options: nosniff).
  5. **Acessibilidade (WCAG 2.1 AA) & UI/UX Impecável:** 100% dos formulários e filtros com labels/aria-labels, botões de ícone com nomes acessíveis para leitores de tela, feedback de toque tátil (`active:scale`) e contraste tipográfico harmonizado.
- **Sidecar Agendado:** O robô autônomo executa a cada 6 horas (`CRON_TZ=America/Sao_Paulo 0 */6 * * *`). Caso identifique qualquer regressão ou falha, aplica o patch corretivo no código, valida novamente a suite e realiza commit/push automaticamente.

---

## 🏛️ Arquitetura & Decisões Técnicas

- **Edge Middleware para Open Graph & Resiliência de Rotas (`middleware.js`):**
  - Intercepta crawlers em rotas `/produto/:id` e entrega metadados dinâmicos para visualização rica em redes sociais.
  - Captura acessos diretos a rotas administrativas (`/admin`, `/admin/*`) e redireciona com `HTTP 302` para a raiz (`/?admin=...`), eliminando totalmente as telas pretas de 404 da Vercel.
  - Restaura sessões autenticadas suavemente sem atritos de recarregamento.
- **Proxy Serverless Seguro (`/api/gemini`):** Endpoint serverless na Vercel com CORS configurado, timeouts estritos via `AbortController` (18s por modelo, maxDuration 45s) e cascata de modelos para garantir respostas ultra-rápidas e seguras sem expor tokens ou ser bloqueado por navegadores como o Brave.
- **Single-Page Application Nativa:** Construída com JavaScript moderno (ES6+), Tailwind CSS e History API nativa sem complexidade de bundlers pesados.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | HTML5 Semântico + JS Vanilla (ES6+) | SPA client-side ultra-rápida, modular e sem overhead de frameworks |
| **Estilização** | Tailwind CSS + CSS3 Animations | Paleta luxo dourada, design responsivo mobile-first e tipografia refinada |
| **Inteligência Artificial** | Google Gemini 3.8 Flash | Modelo oficial multimodal para extração estruturada de catálogo |
| **Backend & Auth** | Supabase (PostgreSQL + RLS) | Persistência de produtos, pedidos, depoimentos e autenticação administrativa |
| **Armazenamento** | Supabase Storage CDN | Hospedagem otimizada de imagens e banners de produtos |
| **Edge & Serverless** | Vercel (Edge Middleware + Serverless Functions) | Roteamento, Open Graph dinâmico e proxy seguro de IA (maxDuration 45s) |
| **Qualidade & Segurança** | Self-Healing QA Suite (6 em 6 horas) | Auditoria automática de integridade funcional, performance e proteção XSS |
| **PWA / SEO** | Web App Manifest & Sitemap XML | Instalável como aplicativo no celular e indexação avançada no Google |

---

## 📂 Estrutura do Projeto

```text
viviboty/
├── api/
│   └── gemini.js              # Serverless Function proxy para Google Gemini API
├── scripts/
│   ├── site-health-qa-audit.js # Suite de auditoria funcional, estética, segurança e autocura
│   └── audit-ui-ux.js          # Auditoria aprofundada de UI/UX, A11Y (WCAG AA) e Core Web Vitals
├── index.html                 # Ponto de entrada SPA, catálogo, sacola e painel administrativo
├── styles.css                 # Folha de estilos compilada
├── input.css                  # Diretivas base do Tailwind CSS
├── middleware.js              # Edge Middleware (Open Graph e redirecionamento de rotas)
├── manifest.json              # Manifesto PWA da aplicação
├── robots.txt                 # Diretrizes para indexadores de busca
├── sitemap.xml                # Mapa do site para SEO
├── vercel.json                # Configuração de rewrites, headers e segurança Vercel
├── seed_catalog.sql           # Carga SQL inicial do banco de dados
└── README.md                  # Documentação oficial do projeto
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Navegador web moderno (Chrome, Edge, Brave, Firefox, Safari).
- Servidor estático local simples (`npx serve`, extensão Live Server do VS Code ou Python).

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

4. **Executar auditoria de saúde e acessibilidade:**
   ```bash
   npm run qa         # Executa a suite de saúde, segurança e autocura
   npm run audit:ui   # Executa a auditoria de UI/UX, WCAG 2.1 AA e Core Web Vitals
   ```

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido com carinho por **Murilo Rogério** para a **Vivi Carvalho Boty**.
