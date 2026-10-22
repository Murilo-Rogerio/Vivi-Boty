# 🛍️ Vivi Boty — Vitrine Digital & Catálogo E-commerce

[![Status](https://img.shields.io/badge/Status-Ativo-brightgreen?style=flat-square)]()
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20TailwindCSS%20%7C%20VanillaJS-blue?style=flat-square)]()
[![Backend](https://img.shields.io/badge/Backend-Supabase%20%7C%20RLS-3ECF8E?logo=supabase&style=flat-square)]()
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&style=flat-square)](https://www.vivicarvalhoboty.com.br/)
[![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-violet?style=flat-square)]()

Vitrine digital moderna de perfumes, cosméticos e presentes com funil de vendas zero-friction e fechamento de pedidos direto pelo WhatsApp.

🌐 **Site Oficial:** [vivicarvalhoboty.com.br](https://www.vivicarvalhoboty.com.br/)

---

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades & Fluxo de Conversão](#-funcionalidades--fluxo-de-conversão)
- [Arquitetura & Decisões Técnicas](#-arquitetura--decisões-técnicas)
- [Stack Tecnológica](#-stack-tecnológica)
- [Painel Administrativo (/admin)](#-painel-administrativo-admin)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar Localmente](#-como-executar-localmente)
- [Licença](#-licença)

---

## 🧭 Visão Geral

Solução de comércio eletrônico focada em conversão para pequenos negócios: o cliente visualiza produtos com fotos em alta definição, preços dinâmicos e promoções, monta a sacola e envia o pedido formatado com um clique diretamente para o WhatsApp da lojista, sem atritos de checkout longo ou cadastros complexos.

Inclui painel administrativo restrito (`/admin`) para cadastro, edição, pausa, destaque e exclusão de produtos com gerenciamento de mídia via Supabase Storage.

---

## ⚡ Funcionalidades & Fluxo de Conversão

- 🔍 **Busca Rápida no Hero:** Campo de pesquisa instantâneo integrado ao cabeçalho para localização direta de perfumes, cosméticos e marcas.
- 🎁 **Kits de Presentes:** Seção temática dedicada a kits prontos e combos promocionais para ocasiões especiais.
- ⭐ **Depoimentos & Prova Social:** Avaliações e relatos de clientes reais fortalecendo a credibilidade e conversão da marca.
- 💳 **Seletor de Pagamento:** Escolha facilitada de modalidade (PIX, Cartão, Dinheiro) já anexada na mensagem de pedido.
- 🛒 **Sacola Click-to-Chat:** Montagem rápida de pedidos sem cadastro ou checkout burocrático, com envio formatado para o WhatsApp da lojista.
- 📱 **Catálogo Responsivo & Roteamento Real:** URLs amigáveis (`/produtos`, `/produto/:id`) com meta tags Open Graph dinâmicas para compartilhamento rico em redes sociais.

### Fluxo Passo a Passo:
1. O cliente acessa a vitrine através de links no Instagram, WhatsApp ou busca orgânica.
2. Utiliza a busca rápida ou filtra produtos por categoria, marca, gênero, ofertas, kits ou pronta-entrega.
3. Adiciona itens à sacola, seleciona a forma de pagamento e clica para enviar o pedido.
4. A lojista recebe a mensagem no WhatsApp com a lista de itens, valores e método de pagamento pré-formatados para fechamento imediato da venda e entrega.

---

## 🏛️ Arquitetura & Decisões Técnicas

- **Edge Middleware para Open Graph:** O arquivo `middleware.js` intercepta requisições de crawlers (WhatsApp, Facebook, Twitter, Telegram) em rotas `/produto/:id` e injeta metatags dinâmicas (`og:title`, `og:image`, `og:description`), garantindo previews ricos sem a necessidade de um framework SSR pesado.
- **Roteamento SPA sem Framework:** Rewrites configurados no `vercel.json` direcionam `/produtos`, `/produto/:id` e `/admin` para `index.html`, mantendo a fluidez de uma Single-Page Application pura com History API nativa.
- **Segurança e Isolamento de Dados:** Painel restrito autenticado via Supabase Auth com Row Level Security (RLS) no PostgreSQL, impedindo acesso não autorizado às mutações do catálogo.
- **Headers HTTP Rigorosos:** Aplicação de políticas de segurança no edge (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin` e `Permissions-Policy`).

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | HTML5 Semântico + JS Vanilla (ES6+) | SPA client-side de altíssimo desempenho sem dependências pesadas de build |
| **Estilização** | Tailwind CSS + CSS3 | Design system customizado, tipografia Plus Jakarta Sans e Playfair Display |
| **Backend / Auth** | Supabase (PostgreSQL + RLS) | Autenticação para área administrativa e persistência segura do catálogo |
| **Armazenamento** | Supabase Storage | Upload e distribuição de imagens de produtos |
| **Edge / Infra** | Vercel (Edge Middleware) | Roteamento dinâmico, injeção de Open Graph tags e headers de segurança |
| **PWA / SEO** | Manifest & Sitemap XML | Suporte PWA com ícones e indexação otimizada para motores de busca |

---

## 🔒 Painel Administrativo (`/admin`)

- Autenticação restrita via Supabase Auth (e-mail/senha criptografados).
- Gestão completa (CRUD) de produtos com upload otimizado de fotos.
- Etiquetas promocionais: Destaque, Promoção e Pronta Entrega.
- Opção de pausar produto temporariamente sem exclusão do banco de dados.

---

## 📂 Estrutura do Projeto

```text
viviboty/
├── index.html                 # Ponto de entrada SPA, componentes e catálogo
├── styles.css                 # Folha de estilos compilada
├── input.css                  # Diretivas base do Tailwind CSS
├── middleware.js              # Edge Middleware para injeção de Open Graph
├── manifest.json              # Manifesto PWA
├── robots.txt                 # Diretrizes para indexadores
├── sitemap.xml                # Mapa do site para SEO
├── vercel.json                # Configuração de rewrites e headers de segurança
└── README.md                  # Documentação oficial
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Navegador moderno
- Servidor estático local simples (`npx serve`, Python `http.server` ou Live Server do VS Code)

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

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido por **Murilo Rogério**.
