🌸 Vivi Boty
Vitrine digital de perfumes, cosméticos e presentes com atendimento direto pelo WhatsApp.

Link: vivicarvalhoboty.com.br

💖 O que é a Vivi Boty?
Mãe, a Vivi Boty é o seu novo espaço na internet para o seu negócio. Eu criei esse site para ser a sua vitrine virtual — agora os seus clientes podem ver seus produtos, conferir preços, aproveitar promoções e, com um clique, já são direcionados para falar com você pelo WhatsApp e fechar a compra. Fiz com muito carinho pra te ajudar a vender mais, alcançar novos clientes e facilitar o seu dia a dia.

📌 Sobre o Projeto
A Vivi Boty é uma plataforma de catálogo digital desenvolvida para pequenos empreendedores do nicho de beleza e perfumaria. O projeto nasceu da necessidade real de digitalizar um negócio físico, tornando o processo de escolha do produto visual, informativo e integrado ao canal de venda que a empreendedora já usa (WhatsApp).

Sem pagamento online, sem complexidade. O cliente escolhe, adiciona à sacola e manda um orçamento pronto pelo WhatsApp. A Vivi confirma a disponibilidade e fecha a venda.

Para o meu portfólio, este projeto demonstra competência em:

UI/UX focado em conversão: Layout limpo que destaca fotos, preços e selos de promoção para prender a atenção do cliente
Funil de vendas click-to-chat: Integração com WhatsApp para reduzir a fricção entre o interesse e a compra
Autenticação e controle de acesso: Painel administrativo protegido com Supabase Auth + RLS
Gerenciamento de conteúdo por usuário final: A Vivi cadastra produtos, troca fotos e preços sem precisar tocar no código
Mobile-first: Interface pensada para quem chega pelo link do Instagram ou WhatsApp no celular
🛠️ Tecnologias
Tecnologia	Uso
HTML5	Estrutura semântica da SPA (Single Page Application)
CSS3	Estilização com variáveis, animações e layout responsivo
Tailwind CSS (CDN)	Framework de utilitários CSS para prototipagem rápida
JavaScript ES6+	Roteamento por hash, renderização dinâmica, gerenciamento de estado
Supabase (PostgreSQL)	Banco de dados relacional para produtos e usuários admin
Supabase Auth	Autenticação por e-mail/senha para o painel administrativo
Supabase Storage	Armazenamento de imagens dos produtos
Supabase RLS	Row Level Security para controle de acesso no banco
Font Awesome (CDN)	Ícones
Google Fonts	Playfair Display + Lato
Netlify	Hospedagem estática com deploy automático via GitHub
✨ Funcionalidades
Para o cliente

🛍️ Catálogo de produtos com foto, nome, marca, preço e descrição
🔍 Busca por nome do produto
🏷️ Filtros por categoria, marca, gênero (masculino/feminino/unissex) e promoções
👁️ Página de detalhe do produto com todas as informações
🛒 Sacola de orçamento — adiciona vários produtos com quantidade
📲 Envio pelo WhatsApp — mensagem formatada com todos os itens e total estimado
📲 Pedido individual pelo WhatsApp — um clique no produto abre conversa pronta
📱 100% responsivo — otimizado para celular, tablet e desktop
Para a administradora (painel #/admin)

🔐 Login seguro com e-mail e senha (Supabase Auth)
➕ Cadastrar produto com nome, marca, categoria, gênero, preço, descrição e imagem
✏️ Editar produto — alterar qualquer campo, incluindo troca de foto
🗑️ Excluir produto com confirmação
🟢 Ativar/desativar produto sem excluir
⭐ Marcar como destaque, promoção ou pronta entrega
📸 Upload de imagens direto pelo painel (validação de tipo e tamanho)
📊 Lista completa de produtos com status e ações rápidas
📱 Como o cliente usa
Acessa o link do site
Navega pelos produtos ou usa os filtros para encontrar o que quer
Adiciona à sacola ou clica em "Quero no WhatsApp" direto no produto
O WhatsApp abre com a mensagem pronta: "Olá, Vivi! Tenho interesse neste produto: [nome] - [preço]. Pode me passar mais informações?"
A Vivi responde, confirma a disponibilidade e fecha a venda
🗂️ Estrutura do Projeto
vivi-boty/
├── index.html # Arquivo único com todo o frontend
├── README.md # Este arquivo
└── .gitignore # Ignora arquivos locais
