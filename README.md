# Vivi Boty

Vitrine digital de perfumes, cosméticos e presentes com pedido direto pelo WhatsApp.

**Site:** [vivicarvalhoboty.com.br](https://vivicarvalhoboty.com.br/)

## O que é

Catálogo para a loja da Vivi: o cliente vê produtos, preços e promoções, monta a sacola e envia um orçamento pronto no WhatsApp. Sem checkout online e sem cadastro do comprador.

O painel em `/admin` deixa a administradora cadastrar, pausar, destacar e excluir produtos, com foto no Supabase Storage.

## Stack

- HTML, CSS e JavaScript (SPA sem build)
- Tailwind CSS via CDN + estilos próprios
- Supabase (Postgres, Auth, Storage, RLS)
- Vercel (domínio, rewrites e middleware de Open Graph)

## Fluxo do cliente

1. Abre o site pelo Instagram, WhatsApp ou busca.
2. Filtra por categoria, marca, gênero, promoção, destaque ou pronta entrega.
3. Adiciona à sacola ou pede o item no WhatsApp.
4. A Vivi confirma disponibilidade, entrega e fecha a venda.

Rotas reais (`/produtos`, `/produto/:id`) permitem compartilhar um produto com preview no WhatsApp. URLs antigas com `#/` são redirecionadas automaticamente.

## Painel

- Login só com e-mail/senha (não há cadastro no frontend)
- CRUD de produtos, upload de imagem (até 5 MB) e selos de destaque/promoção/pronta entrega
- Pausar um item tira ele da vitrine sem apagar o cadastro

## Configuração

As credenciais públicas ficam no `index.html`:

```js
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA-ANON-KEY';
```

A anon key é pública por desenho. Leitura e escrita são controladas por RLS no Supabase, não por esconder a chave.

## Local

```bash
git clone https://github.com/Murilo-Rogerio/Vivi-Boty.git
cd Vivi-Boty
```

Abra `index.html` com um servidor estático (Live Server ou `npx serve`) para as rotas `/produtos` e `/admin` funcionarem. Abrir o arquivo como `file://` quebra a navegação por caminho.

## Licença

MIT
