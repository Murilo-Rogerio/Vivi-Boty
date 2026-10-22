# Aprimoramento do Site Vivi Boty - Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aprimorar o site da Vivi Boty nas 3 frentes solicitadas (Design & Identidade Visual, Performance & Mobile, Conversão & Usabilidade) e implementar o botão de exclusão de produto na tela de admin.

**Architecture:** A aplicação é uma Single Page Application pura (HTML5, CSS customizado + Tailwind, JavaScript modular no objeto global `A` e Supabase como backend). As melhorias serão aplicadas preservando a arquitetura SPA leve sem requerer pipeline complexo de build, otimizando o carregamento, aprimorando a identidade visual da boutique e aperfeiçoando os fluxos da sacola e do painel admin.

**Tech Stack:** HTML5, CSS3 (variáveis semânticas, media queries, keyframes), JavaScript moderno (ES6+), Supabase JS v2, Tailwind CSS.

**Spec:** Requisição do usuário:
1. Design e Identidade Visual (Frontend Design refinado, tipografia, estética boutique).
2. Performance e Experiência Mobile (LCP, fontes, CLS, otimização de imagens e navegação touch).
3. Conversão e Usabilidade (melhorias na sacola, mensagem WhatsApp enriquecida, busca e filtros intuitivos).
4. Botão de excluir produto na tela de admin (tanto na edição quanto na listagem com confirmação segura).

## Global Constraints

- Manter compatibilidade com Supabase (tabelas `products`, `admin_users`, storage `products` e `site-assets`).
- Preservar anon key e URL do Supabase já configuradas no `index.html`.
- Garantir suporte responsivo completo (mobile viewport down to 360px até desktop widescreen).
- Não quebrar o roteamento nativo sem hash (`/`, `/produtos`, `/produto/:id`, `/admin`, `/admin/produtos`, `/admin/novo`, `/admin/editar/:id`).

## Review Focus

1. Exclusão de produto no admin: testar se remove do Supabase e atualiza o estado local (`this.prods` e `this.pmap`) sem crashar.
2. Navegação em mobile: testar se a barra inferior e os drawers (sacola, favoritos, quickview) abrem e fecham sem travar scroll.
3. Pedido WhatsApp: validar formatação de mensagens com múltiplos itens, quebra de linha correta e flag de presente.
4. Performance LCP/CLS: dimensões de imagem com `aspect-ratio` fixo e tags de acessibilidade sem warnings no console.
5. Filtros e busca no catálogo: testar combinação de busca por texto + categoria + marca + ordenação.

---

### Task 1: Botão de Excluir Produto no Painel Admin

**Files:**
- Modify: `index.html` (métodos `viewAdminForm`, `viewAdminProducts` e `deleteProduct`)

- [ ] Adicionar botão explícito e destacado "Excluir produto" no formulário de edição (`viewAdminForm(id)`), visível apenas quando `id` existir.
- [ ] Atualizar `deleteProduct(id, returnToList)` para exibir confirmação amigável e redirecionar para `/admin/produtos` após exclusão.
- [ ] Melhorar visual do botão de excluir na listagem de produtos (`viewAdminProducts`) com tooltip e acessibilidade clara.
- [ ] Testar fluxo de exclusão tanto pela listagem quanto pela tela de edição.

### Task 2: Design e Identidade Visual (Boutique de Luxo)

**Files:**
- Modify: `index.html` (seção `<style>`, hero, cabeçalho e cards de produto)

- [ ] Refinar paleta de cores e tipografia no CSS `:root`: contraste aprimorado, bordas suaves, sombras orgânicas em vez de sombras cinza genéricas.
- [ ] Redesenhar os cards de produto (`renderCard`):
  - Badges elegantes (Promoção com tom quente, Pronta entrega em esmeralda refinado, Destaque em ouro nobre).
  - Preço com destaque nobre na tipografia serifada `Playfair Display`.
  - Micro-interações táteis nos botões de adicionar à sacola e pedir no WhatsApp.
- [ ] Elevar o Hero e cabeçalho da loja:
  - Destaque para o atendimento humano da Vivi e marcas oficiais (O Boticário, Natura, Eudora).
  - Chamada clara para ação e selos de autenticidade/pronta entrega.
- [ ] Polir modais de Quickview e Favoritos com bordas refinadas e layout harmonioso.

### Task 3: Performance, LCP e Experiência Mobile

**Files:**
- Modify: `index.html` (metatags, preconnect/preload, atributos de imagem, CSS mobile)

- [ ] Inserir preloads e preconnects prioritários para fontes Google e storage do Supabase.
- [ ] Adicionar `decoding="async"`, `fetchpriority` e `aspect-ratio` nas imagens de produto para eliminar CLS e acelerar LCP.
- [ ] Melhorar touch-targets e comportamento de scroll horizontal nos chips de filtro (`scrollbar-none`, `scroll-snap-type: x mandatory`).
- [ ] Ajustar barra de navegação móvel inferior para respeitar área segura de tela (`env(safe-area-inset-bottom)`).

### Task 4: Conversão, Sacola e Mensagem WhatsApp

**Files:**
- Modify: `index.html` (métodos `checkoutWhatsApp`, `renderCartDrawer`, `catalogFilters`, `orderWhatsAppDirect`)

- [ ] Aprimorar mensagem gerada para o WhatsApp:
  - Formatação mais profissional com emojis adequados, saudação cordial, resumo de itens, total e indicador de presente.
- [ ] Adicionar campo opcional de observação/nome do cliente na sacola para atendimento ainda mais personalizado.
- [ ] No catálogo: adicionar botão rápido "Limpar filtros" visível quando houver qualquer filtro aplicado.
- [ ] Exibir micro-animação na sacola ao adicionar item para dar feedback instantâneo ao cliente.

### Task 5: Validação e Testes Finais

**Files:**
- Verify: `index.html` e integridade das rotas

- [ ] Executar validação de sintaxe e estrutura do HTML/JS.
- [ ] Testar fluxo do carrinho, filtros de catálogo, rotas e painel administrativo.
- [ ] Confirmar que o botão de exclusão no admin funciona conforme especificado.
