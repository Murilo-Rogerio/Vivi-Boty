## 🌸 Vivi Boty
Uma vitrine digital de perfumes, cosméticos e presentes com atendimento direto pelo WhatsApp.

Link:[Vivi Boty](https://vivicarvalhoboty.com.br/)

## 💖 O que é a Vivi Boty?
Mãe, a Vivi Boty é o seu novo espaço na internet para o seu negócio. Eu criei esse site para ser a sua vitrine virtual — agora os seus clientes podem ver seus produtos, conferir preços, aproveitar promoções e, com um clique, já são direcionados para falar com você pelo WhatsApp e fechar a compra. Fiz com muito carinho pra te ajudar a vender mais, alcançar novos clientes e facilitar o seu dia a dia.

## 📌 Sobre o Projeto
A Vivi Boty é uma plataforma de catálogo digital desenvolvida para pequenos empreendedores do nicho de beleza e perfumaria. O projeto nasceu da necessidade real de digitalizar um negócio físico, tornando o processo de escolha do produto visual, informativo e integrado ao canal de venda que a empreendedora já usa (WhatsApp).

Sem pagamento online, sem complexidade. O cliente escolhe, adiciona à sacola e manda um orçamento pronto pelo WhatsApp. A Vivi confirma a disponibilidade e fecha a venda.

Para o meu portfólio, este projeto demonstra competência em:
- UI/UX focado em conversão: Layout limpo que destaca fotos, preços e selos de promoção para prender a atenção do cliente
- Funil de vendas click-to-chat: Integração com WhatsApp para reduzir a fricção entre o interesse e a compra
- Autenticação e controle de acesso: Painel administrativo protegido com Supabase Auth + RLS
- Gerenciamento de conteúdo por usuário final: A Vivi cadastra produtos, troca fotos e preços sem precisar tocar no código
- Mobile-first: Interface pensada para quem chega pelo link do Instagram ou WhatsApp no celular

## 🛠️ Tecnologias
- Tecnologia	- Uso
- HTML5|Estrutura semântica da SPA (Single Page Application)
- CSS3|Estilização com variáveis, animações e layout responsivo
- Tailwind|CSS (CDN)	Framework de utilitários CSS para prototipagem rápida
- JavaScript|ES6+	Roteamento por hash, renderização dinâmica, gerenciamento de estado
- Supabase|(PostgreSQL)	Banco de dados relacional para produtos e usuários admin
- Supabase|Auth	Autenticação por e-mail/senha para o painel administrativo
- Supabase|Storage	Armazenamento de imagens dos produtos
- Supabase|RLS	Row Level Security para controle de acesso no banco
- Font|Awesome (CDN)	Ícones
- Google|Fonts	Playfair Display + Lato
- Netlify|Hospedagem estática com deploy automático via GitHub

## ✨ Funcionalidades
Para o cliente
- 🛍️ Catálogo de produtos com foto, nome, marca, preço e descrição
- 🔍 Busca por nome do produto
- 🏷️ Filtros por categoria, marca, gênero (masculino/feminino/unissex) e promoções
- 👁️ Página de detalhe do produto com todas as informações
- 🛒 Sacola de orçamento — adiciona vários produtos com quantidade
- 📲 Envio pelo WhatsApp — mensagem formatada com todos os itens e total estimado
- 📲 Pedido individual pelo WhatsApp — um clique no produto abre conversa pronta
- 📱 100% responsivo — otimizado para celular, tablet e desktop

Para a administradora (painel #/admin)
- 🔐 Login seguro com e-mail e senha (Supabase Auth)
- ➕ Cadastrar produto com nome, marca, categoria, gênero, preço, descrição e imagem
- ✏️ Editar produto — alterar qualquer campo, incluindo troca de foto
- 🗑️ Excluir produto com confirmação
- 🟢 Ativar/desativar produto sem excluir
- ⭐ Marcar como destaque, promoção ou pronta entrega
- 📸 Upload de imagens direto pelo painel (validação de tipo e tamanho)
- 📊 Lista completa de produtos com status e ações rápidas

📱 Como o cliente usa
1. Acessa o link do site
2. Navega pelos produtos ou usa os filtros para encontrar o que quer
3. Adiciona à sacola ou clica em "Quero no WhatsApp" direto no produto
4. O WhatsApp abre com a mensagem pronta: "Olá, Vivi! Tenho interesse neste produto: [nome] - [preço]. Pode me passar mais informações?"
5. A Vivi responde, confirma a disponibilidade e fecha a venda

🗂️ Estrutura do Projeto
vivi-boty/
├── index.html # Arquivo único com todo o frontend
└── README.md # Este arquivo


Tudo em um único `index.html` é uma escolha deliberada: elimina a necessidade de build, simplifica o deploy e permite que a administradora entenda que o site é um arquivo só — sem dependências complexas.

---

### ⚙️ Configuração

As credenciais do Supabase ficam no topo do `<script>` no `index.html`:

```js
const VIVI_LOGO = 'URL_DA_IMAGEM';
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA-ANON-KEY';
````
A anon key é pública por design — a segurança vem das políticas RLS configuradas no Supabase, não de esconder a chave.

## 🚀 Deploy
O site está hospedado no Netlify com deploy automático via GitHub:

- Edita o index.html
- Envia para o GitHub
- O Netlify detecta a mudança e republica automaticamente
- Para alterar produtos, preços e imagens: entra no site → #/admin → edita pelo painel. Não precisa mexer no código nem no GitHub.

## 🔒 Segurança
| Camada | Proteção |
|---|---|
| Produtos (tabela `products`) | RLS ativo — público só vê produtos ativos. Só admin cria, edita ou exclui |
| Imagens (bucket `products`) | RLS ativo — público só vê. Só admin faz upload, atualiza ou deleta |
| Autenticação | Supabase Auth — só `signInWithPassword`, sem `signUp` no frontend |
| Controle de admin | Tabela `admin_users` verificada a cada acesso ao painel |
| Upload de imagens | Validação de tipo (`image/*`) e tamanho (máx 5MB) no frontend |
| XSS | Dados dos produtos escapados com `textContent` antes de ir para o HTML |
| Injeção de SQL | Impossível — Supabase Client usa queries parametrizadas |

## 🧪 Como Rodar Localmente
```js
git clone https://github.com/Murilo-Rogerio/Vivi-Boty.git
cd Vivi-Boty
```
- Abra o index.html no navegador ou use o Live Server do VS Code.
- Nota: Para funcionar localmente, as credenciais do Supabase precisam estar preenchidas no código. Sem isso, o site mostra uma mensagem amigável pedindo configuração em vez de tela branca.

## 📄 Licença
- MIT

## 💡 Desenvolvido com tecnologia, carinho e foco no sucesso do negócio da minha mãe. Se tiver sugestões, abra uma Issue ou entre em contato.
