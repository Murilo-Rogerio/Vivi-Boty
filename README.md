# 🌸 Vivi Boty
Uma vitrine digital de perfumes, cosméticos e presentes com atendimento direto pelo WhatsApp.

🔗 **Link do Projeto:** [vivicarvalhoboty.com.br](https://vivicarvalhoboty.com.br/)

---

## 💖 O que é a Vivi Boty?
Mãe, a Vivi Boty é o seu novo espaço na internet para o seu negócio. Eu criei esse site para ser a sua vitrine virtual — agora os seus clientes podem ver seus produtos, conferir preços, aproveitar promoções e, com um clique, já são direcionados para falar com você pelo WhatsApp e fechar a compra. Fiz com muito carinho pra te ajudar a vender mais, alcançar novos clientes e facilitar o seu dia a dia.

---

## 📌 Sobre o Projeto
A Vivi Boty é uma plataforma de catálogo digital desenvolvida para pequenos empreendedores do nicho de beleza e perfumaria. O projeto nasceu da necessidade real de digitalizar um negócio físico, tornando o processo de escolha do produto visual, informativo e integrado ao canal de venda que a empreendedora já usa (WhatsApp).

**Sem pagamento online, sem complexidade.** O cliente escolhe, adiciona à sacola e manda um orçamento pronto pelo WhatsApp. A Vivi confirma a disponibilidade e fecha a venda.

Para o meu portfólio, este projeto demonstra competência em:
* **UI/UX focado em conversão:** Layout limpo que destaca fotos, preços e selos de promoção para prender a atenção do cliente.
* **Funil de vendas *click-to-chat*:** Integração com WhatsApp para reduzir a fricção entre o interesse e a compra.
* **Autenticação e controle de acesso:** Painel administrativo protegido com Supabase Auth + RLS.
* **Gerenciamento de conteúdo por usuário final:** A Vivi cadastra produtos, troca fotos e preços sem precisar tocar no código.
* **Mobile-first:** Interface pensada para quem chega pelo link do Instagram ou WhatsApp no celular.

---

## 🛠️ Tecnologias e Recursos

| Tecnologia / Recurso | Descrição e Uso no Projeto |
| :--- | :--- |
| **HTML5** | Estrutura semântica da SPA (*Single Page Application*). |
| **CSS3** | Estilização com variáveis, animações e layout responsivo. |
| **Tailwind CSS (CDN)** | Framework de utilitários CSS para prototipagem e estilização rápida. |
| **JavaScript (ES6+)** | Roteamento por *hash*, renderização dinâmica e gerenciamento de estado. |
| **Supabase (PostgreSQL)** | Banco de dados relacional para armazenamento de produtos e usuários admin. |
| **Supabase Auth** | Autenticação por e-mail/senha para o painel administrativo. |
| **Supabase Storage** | Armazenamento otimizado das imagens dos produtos. |
| **Supabase RLS** | *Row Level Security* para controle rígido de acesso direto no banco. |
| **Font Awesome (CDN)** | Biblioteca de ícones da interface. |
| **Google Fonts** | Tipografia elegante utilizando *Playfair Display* + *Lato*. |
| **Vercel** | Hospedagem de alta performance com deploy automático via GitHub. |

---

## ✨ Funcionalidades

### 🛍️ Para o Cliente
* **Catálogo Completo:** Visualização de produtos com foto, nome, marca, preço e descrição detalhada.
* **Busca Inteligente:** Barra de pesquisa por nome do produto em tempo real.
* **Filtros Avançados:** Filtragem por categoria, marca, gênero (masculino/feminino/unissex) e promoções.
* **Sacola de Orçamento:** Permite adicionar múltiplos produtos com controle de quantidade.
* **Integração WhatsApp:**
    * *Envio de Sacola:* Mensagem formatada enviada ao WhatsApp com todos os itens selecionados e o total estimado.
    * *Pedido Individual:* Um clique direto no produto abre a conversa com a mensagem pronta daquele item.
* **100% Responsivo:** Experiência mobile-first otimizada perfeitamente para celulares, tablets e desktops.

### 🔐 Para a Administradora (Painel `#/admin`)
* **Login Seguro:** Autenticação robusta via e-mail e senha.
* **CRUD de Produtos:** Cadastrar, editar e excluir produtos (com confirmação) de forma simples.
* **Controle de Estoque/Visibilidade:** Ativar ou desativar a exibição de um produto sem precisar excluí-lo.
* **Selos Destacados:** Opção de marcar produtos como *Destaque*, *Promoção* ou *Pronta Entrega*.
* **Upload de Imagens:** Upload direto pelo painel com validações automáticas de formato e tamanho.
* **Dashboard Gerencial:** Lista completa de produtos com status visual claro e ações rápidas.

---

## 📱 Fluxo de Uso do Cliente

1. O cliente acessa o link do site.
2. Navega pelos produtos ou utiliza os filtros para encontrar o que deseja.
3. Adiciona os itens à sacola ou clica em **"Quero no WhatsApp"** direto no card do produto.
4. O WhatsApp abre automaticamente com a mensagem formatada: 
   > *"Olá, Vivi! Tenho interesse neste produto: [Nome] - [Preço]. Pode me passar mais informações?"*
5. A Vivi responde, confirma a disponibilidade e finaliza a venda de forma humanizada.

---

## 🗂️ Estrutura do Projeto

```text
vivi-boty/
├── index.html     # Arquivo único contendo todo o frontend da SPA
└── README.md      # Documentação do projeto
```

Tudo em um único arquivo `index.html` é uma escolha deliberada: elimina a necessidade de etapas complexas de build, simplifica drasticamente o deploy e permite que a administradora compreenda facilmente que o site é composto por um único arquivo — sem dependências externas ou configurações robustas.

---

### ⚙️ Configuração

As credenciais do Supabase e a logo principal ficam localizadas logo no topo da tag `<script>` dentro do `index.html`:

```js
const VIVI_LOGO = 'URL_DA_IMAGEM';
const SUPABASE_URL = '[https://SEU-PROJETO.supabase.co](https://SEU-PROJETO.supabase.co)';
const SUPABASE_ANON_KEY = 'SUA-ANON-KEY';
````
- 💡 Nota sobre segurança: A chave pública (anon key) é exposta por design no frontend. Toda a segurança e integridade do sistema são garantidas pelas políticas de RLS (Row Level Security) configuradas diretamente no banco de dados do Supabase, e não pela ocultação dessa chave

## 🚀 Deploy
**O site está hospedado na Vercel com domínio próprio e configurado com deploy automático integrado ao GitHub:**
* Edita o index.html
* Envia para o GitHub
* O Netlify detecta a mudança e republica automaticamente
* Para alterar produtos, preços e imagens: entra no site → #/admin → edita pelo painel. Não precisa mexer no código nem no GitHub.

## 🔒 Segurança
| Camada | Mecanismo de Proteção |
| :--- | :--- |
| **Produtos** (tabela `products`) | RLS ativo. O público geral possui apenas permissão de leitura para itens ativos. Operações de escrita (criar, editar, excluir) exigem autenticação admin. |
| **Imagens** (bucket `products`) | RLS ativo. Leitura pública liberada; uploads, substituições e exclusões restritos à conta admin. |
| **Autenticação** | Supabase Auth estruturado apenas com o método `signInWithPassword`. A criação de novas contas (`signUp`) está desabilitada no frontend. |
| **Controle de Admin** | Validação severa na tabela `admin_users` a cada nova requisição ou acesso ao painel. |
| **Upload de Arquivos** | Validação rigorosa de formato (`image/*`) e limitação de tamanho (máximo de 5MB) tratadas diretamente no cliente. |
| **Proteção contra XSS** | Dados dinâmicos de produtos são renderizados utilizando propriedades seguras como `textContent` para evitar injeção de scripts maliciosos. |
| **Injeção de SQL** | Camada blindada nativamente, já que o cliente do Supabase utiliza queries parametrizadas por padrão. |

## 🧪 Como Rodar Localmente
* Para testar ou desenvolver novas funcionalidades na sua máquina, siga os passos abaixo:
1. Clone o repositório:
```js
git clone [https://github.com/Murilo-Rogerio/Vivi-Boty.git](https://github.com/Murilo-Rogerio/Vivi-Boty.git)
```
2. Acesse a pasta do projeto:
```js
cd Vivi-Boty
```
3. Abra o arquivo index.html diretamente no seu navegador de preferência ou utilize a extensão Live Server no VS Code para um feedback em tempo real.
* ⚠️ Atenção: Para que a aplicação funcione localmente e os dados sejam carregados, certifique-se de que as credenciais do Supabase estejam preenchidas no código. Caso contrário, o site exibirá uma tela amigável instruindo sobre a configuração, evitando quebras inesperadas ou telas em branco.

## 📄 Licença
* Este projeto está sob a licença MIT.

## Este projeto foi desenvolvido unindo tecnologia, carinho e foco total no sucesso do negócio da minha mãe. Se tiver alguma sugestão de melhoria, sinta-se à vontade para abrir uma Issue ou entrar em contato direto!
