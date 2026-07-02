# Biscoitos Kauê Web

Painel administrativo web do sistema **Biscoitos Kauê**, desenvolvido em React para acompanhamento e gerenciamento dos pedidos realizados pelos representantes comerciais.

Este projeto faz parte do Projeto de Desenvolvimento de Software do curso de Análise e Desenvolvimento de Sistemas.

---

## Sobre o projeto

A empresa Biscoitos Kauê possui representantes comerciais que realizam pedidos de produtos para clientes. O painel web foi desenvolvido para que a administração possa acompanhar os pedidos enviados pelo aplicativo mobile, gerenciar produtos e controlar representantes comerciais.

A solução completa é composta por:

* **Mobile:** aplicativo Flutter para representantes comerciais;
* **Backend:** API REST em Java com Spring Boot;
* **Web:** painel administrativo em React;
* **Banco de dados:** PostgreSQL.

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
* Logo oficial aplicada no login e no menu lateral.

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

---

## Integração com o backend

O painel web consome a API backend do sistema Biscoitos Kauê.

Durante o desenvolvimento local, a API roda em:

```text
http://localhost:8080
```

---

## Pré-requisitos

Antes de rodar o projeto, é necessário ter instalado:

* Node.js;
* npm;
* Backend do projeto rodando localmente.

---

## Como rodar o projeto

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

---

## Dashboard

O dashboard apresenta uma visão geral do sistema, incluindo:

* total de pedidos;
* pedidos pendentes;
* pedidos enviados;
* pedidos cancelados;
* produtos ativos;
* representantes ativos.

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

---

## Produtos

O painel permite:

* listar produtos;
* cadastrar produtos;
* editar produtos;
* inativar produtos.

---

## Representantes

O painel permite:

* listar representantes;
* cadastrar representantes;
* inativar representantes.

Representantes inativados não conseguem acessar o aplicativo mobile.

---

## Usuário de teste

Usuário utilizado durante o desenvolvimento:

```text
ADMIN
E-mail: admin@biscoitoskaue.com
Senha: 123456
```

Observação: os usuários podem variar conforme os dados cadastrados no backend.

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

APK:

```text
EM_BREVE
```

---

## Autor

Desenvolvido por **Kaue Marques Magnus**.

Projeto desenvolvido para a disciplina de Projeto de Desenvolvimento de Software do curso de Análise e Desenvolvimento de Sistemas.

---

## Licença

Projeto acadêmico desenvolvido para fins educacionais.
