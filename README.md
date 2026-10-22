# 🛍️ Vivi Boty — Vitrine Digital & Catálogo E-commerce

[![Status](https://img.shields.io/badge/Status-Ativo-brightgreen?style=flat-square)]()
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20TailwindCSS%20%7C%20VanillaJS-blue?style=flat-square)]()
[![Backend](https://img.shields.io/badge/Backend-Supabase%20%7C%20RLS-3ECF8E?logo=supabase&style=flat-square)]()
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&style=flat-square)](https://vivicarvalhoboty.com.br/)
[![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-violet?style=flat-square)]()

Vitrine digital moderna de perfumes, cosméticos e presentes com funil de vendas zero-friction e fechamento de pedidos direto pelo WhatsApp.

🌐 **Site Oficial:** [vivicarvalhoboty.com.br](https://vivicarvalhoboty.com.br/)

---

## 🧭 O que é

Solução de comércio eletrônico focada em conversão para pequenos negócios: o cliente visualiza produtos com fotos em alta definição, preços dinâmicos e promoções, monta a sacola e envia o pedido formatado com um clique diretamente para o WhatsApp da lojista, sem atritos de checkout longo ou cadastros complexos.

Inclui painel administrativo restrito (`/admin`) para cadastro, edição, pausa, destaque e exclusão de produtos com gerenciamento de mídia via Supabase Storage.

---

## 🛠️ Stack Tecnológica

- **Frontend:** HTML5 Semântico, CSS3 e JavaScript Vanilla moderno (SPA de altíssimo desempenho sem etapa de build pesada).
- **Estilização:** Tailwind CSS (via CDN) com design system personalizado e tipografia refinada (Plus Jakarta Sans & Playfair Display).
- **Backend & Dados:** Supabase (PostgreSQL, Auth com RLS rigoroso e Supabase Storage).
- **Infraestrutura & SEO:** Vercel (gerenciamento de domínio, rewrites de rotas SPA e middleware de Open Graph para previews dinâmicos no WhatsApp e redes sociais).

---

## ⚡ Fluxo de Compra e Conversão

1. O cliente acessa a vitrine através de links no Instagram, WhatsApp ou busca orgânica.
2. Filtra produtos por categoria, marca, gênero, ofertas, destaque ou pronta-entrega.
3. Adiciona itens à sacola ou solicita o produto diretamente pelo WhatsApp.
4. A lojista recebe a mensagem com itens e valores pré-formatados para fechamento imediato da venda e entrega.

Suporte a rotas reais (`/produtos`, `/produto/:id`) permitindo compartilhamento de produtos específicos com meta tags completas.

---

## 🔒 Painel Administrativo (`/admin`)

- Autenticação restrita via Supabase Auth (e-mail/senha criptografados).
- Gestão completa (CRUD) de produtos com upload otimizado de fotos.
- Etiquetas promocionais: Destaque, Promoção e Pronta Entrega.
- Opção de pausar produto temporariamente sem exclusão do banco de dados.

---

## 🚀 Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/Murilo-Rogerio/Vivi-Boty.git

# Acesse o diretório
cd Vivi-Boty

# Inicie um servidor local (ex.: npx serve ou Live Server)
npx serve .
```

---

## 📄 Licença

Distribuído sob a licença MIT.
