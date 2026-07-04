# Biscoitos Kauê Web

Painel administrativo web do sistema **Biscoitos Kauê**, desenvolvido em React para acompanhamento e gerenciamento dos pedidos realizados pelos representantes comerciais.

Este projeto faz parte do Projeto de Desenvolvimento de Software do curso de Análise e Desenvolvimento de Sistemas.

---

## Sobre o projeto

A empresa Biscoitos Kauê possui representantes comerciais que realizam pedidos de produtos para clientes. O painel web foi desenvolvido para que a administração possa acompanhar os pedidos enviados pelo aplicativo mobile, gerenciar produtos, controlar representantes comerciais e alterar o status dos pedidos.

A solução completa é composta por:

* **Mobile:** aplicativo Flutter para representantes comerciais;
* **Backend:** API REST em Java com Spring Boot;
* **Web:** painel administrativo em React;
* **Banco de dados:** PostgreSQL;
* **Ambiente online de homologação:** backend publicado no Render, banco PostgreSQL no Neon, painel web na Vercel e envio de e-mails pelo Resend.

---

## Funcionalidades do painel

* Login de administrador;
* Armazenamento de token JWT;
* Redirecionamento automático em caso de token expirado;
* Dashboard com métricas;
* Listagem de pedidos;
* Busca e filtros de pedidos;
* Detalhe do pedido;
* Alteração de status do pedido;
* Listagem de produtos;
* Cadastro de produtos;
* Edição de produtos;
* Inativação de produtos;
* Listagem de representantes;
* Cadastro de representantes;
* Inativação de representantes;
* Interface visual com identidade da Biscoitos Kauê;
* Logo oficial aplicada no login e no menu lateral;
* Integração com a API online de homologação.

---

## Tecnologias utilizadas

* React
* TypeScript
* Vite
* Axios
* React Router DOM
* CSS
* Node.js
* npm
* Vercel

---

## Integração com o backend

O painel web consome a API backend do sistema Biscoitos Kauê.

Durante o desenvolvimento local, a API pode rodar em:

```text
http://localhost:8080
```

No ambiente online de homologação, o painel consome a API hospedada no Render:

```text
https://biscoitos-kaue-backend.onrender.com
```

A URL da API é configurada por meio da variável de ambiente:

```env
VITE_API_BASE_URL=https://biscoitos-kaue-backend.onrender.com
```

---

## Ambiente de homologação online

O painel administrativo foi publicado na Vercel para permitir testes em ambiente online de homologação.

URL do painel web:

```text
https://biscoitos-kaue-web.vercel.app/login
```

Serviços utilizados na homologação:

* **Painel web:** Vercel
* **Backend:** Render
* **Banco de dados:** Neon PostgreSQL
* **Envio de e-mail:** Resend
* **Aplicativo mobile:** APK Android configurado para consumir a API online

Este ambiente tem finalidade acadêmica e de demonstração, não representando uma implantação em produção real da empresa.

---

## Pré-requisitos

Antes de rodar o projeto localmente, é necessário ter instalado:

* Node.js;
* npm;
* Backend do projeto rodando localmente ou API online disponível.

---

## Como rodar o projeto localmente

Clone o repositório:

```bash
git clone https://github.com/KaueMagnus/biscoitos-kaue-web.git
```

Acesse a pasta do projeto:

```bash
cd biscoitos-kaue-web
```

Instale as dependências:

```bash
npm install
```

Rode o painel em ambiente de desenvolvimento:

```bash
npm run dev
```

O painel ficará disponível em:

```text
http://localhost:5173
```

---

## Como rodar apontando para a API online

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_API_BASE_URL=https://biscoitos-kaue-backend.onrender.com
```

Depois execute:

```bash
npm run dev
```

---

## Como gerar a versão de produção

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos de build serão gerados na pasta:

```text
dist/
```

Para visualizar uma prévia local da versão de produção:

```bash
npm run preview
```

---

## Configuração na Vercel

Para publicação do painel web na Vercel, a variável de ambiente abaixo deve ser configurada no projeto:

```env
VITE_API_BASE_URL=https://biscoitos-kaue-backend.onrender.com
```

Após o deploy, o painel fica disponível em:

```text
https://biscoitos-kaue-web.vercel.app/login
```

---

## Scripts disponíveis

```bash
npm run dev
```

Roda o projeto em ambiente de desenvolvimento.

```bash
npm run build
```

Gera a versão de produção.

```bash
npm run preview
```

Executa uma prévia local da versão de produção.

```bash
npm run lint
```

Executa a verificação de lint.

---

## Fluxo principal do painel

1. O administrador acessa o painel web.
2. Faz login com suas credenciais.
3. Visualiza o dashboard com métricas do sistema.
4. Acompanha a listagem de pedidos.
5. Filtra pedidos por cliente, representante, status ou tipo.
6. Abre o detalhe de um pedido.
7. Altera o status do pedido.
8. Gerencia produtos.
9. Gerencia representantes comerciais.
10. As informações ficam centralizadas no backend e podem ser consultadas posteriormente.

---

## Dashboard

O dashboard apresenta uma visão geral do sistema, incluindo:

* total de pedidos;
* pedidos pendentes;
* pedidos enviados;
* pedidos cancelados;
* produtos ativos;
* representantes ativos.

Essas informações auxiliam a administração no acompanhamento operacional dos pedidos.

---

## Pedidos

A tela de pedidos permite:

* listar pedidos;
* buscar por cliente;
* buscar por representante;
* filtrar por status;
* filtrar por tipo;
* abrir detalhes do pedido;
* alterar status.

Status disponíveis:

```text
PENDENTE
ENVIADO
CANCELADO
```

Tipos de pedido:

```text
NORMAL
TROCA
```

Os pedidos são criados pelo aplicativo mobile e ficam disponíveis no painel administrativo para acompanhamento e alteração de status.

---

## Produtos

O painel permite:

* listar produtos;
* cadastrar produtos;
* editar produtos;
* inativar produtos.

Produtos inativados deixam de aparecer para novos pedidos, preservando o histórico de pedidos já realizados.

---

## Representantes

O painel permite:

* listar representantes;
* cadastrar representantes;
* inativar representantes.

Representantes inativados não conseguem acessar o aplicativo mobile.

---

## Usuário de teste

Usuário administrador utilizado para testes:

```text
ADMIN
E-mail: admin@biscoitoskaue.com
Senha: 123456
```

Observação: os usuários podem variar conforme os dados cadastrados no backend.

---

## Teste integrado com o aplicativo mobile

Para validar o fluxo completo:

1. Instale o APK do aplicativo mobile.
2. Faça login com o usuário representante.
3. Crie um pedido normal ou de troca.
4. Acesse o painel web.
5. Faça login com o usuário administrador.
6. Confira o pedido criado.
7. Abra os detalhes do pedido.
8. Altere o status.
9. Verifique se o status atualizado permanece salvo.

---

## Links importantes

Backend:

```text
https://github.com/KaueMagnus/biscoitos-kaue-backend
```

Mobile:

```text
https://github.com/KaueMagnus/biscoitos-kaue-mobile
```

Web:

```text
https://github.com/KaueMagnus/biscoitos-kaue-web
```

API online de homologação:

```text
https://biscoitos-kaue-backend.onrender.com
```

Painel web online:

```text
https://biscoitos-kaue-web.vercel.app/login
```

APK:

[Baixar APK do aplicativo mobile](https://drive.google.com/file/d/1H6BKzXM1XJhrsThZPU9eXw8oMcPUGkhT/view?usp=sharing)

---

## Autor

Desenvolvido por **Kaue Marques Magnus**.

Projeto desenvolvido para a disciplina de Projeto de Desenvolvimento de Software do curso de Análise e Desenvolvimento de Sistemas.

---

## Licença

Projeto acadêmico desenvolvido para fins educacionais.
