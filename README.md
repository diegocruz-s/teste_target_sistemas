# Desafio Técnico — Target Sistemas

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tests](https://img.shields.io/badge/tests-43%20passed-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-98.33%25-brightgreen)

API REST desenvolvida com Node.js e TypeScript como solução para um desafio técnico de desenvolvimento.

A aplicação reúne funcionalidades de cálculo de comissões, gerenciamento de movimentações de estoque e cálculo de juros por atraso. O projeto utiliza Express para disponibilizar os endpoints HTTP, Zod para validação de dados e Jest para testes automatizados.

## Sumário

- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Endpoints disponíveis](#endpoints-disponíveis)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e execução](#instalação-e-execução)
- [Testes automatizados](#testes-automatizados)
- [Considerações finais](#considerações-finais)

## Tecnologias utilizadas

- **Node.js** — ambiente de execução.
- **TypeScript** — tipagem estática e desenvolvimento com maior segurança de tipos.
- **Express 5** — criação e gerenciamento das rotas HTTP.
- **Zod** — validação de dados.
- **Jest** — execução dos testes automatizados e geração de relatórios de cobertura.
- **SWC** — ferramenta de transformação de código utilizada na infraestrutura de testes.
- **TSX** — execução do TypeScript durante o desenvolvimento.
- **JSON** — armazenamento dos dados utilizados pela aplicação.

## Funcionalidades

### 1. Cálculo de comissões

**Endpoint:** `GET /api/comissao`

Calcula a comissão total de cada vendedor a partir das vendas registradas no sistema.

A comissão é calculada individualmente para cada venda, de acordo com as seguintes regras:

| Valor da venda                              | Percentual de comissão |
| ------------------------------------------- | ---------------------- |
| Abaixo de R$ 100,00                         | 0%                     |
| A partir de R$ 100,00 e abaixo de R$ 500,00 | 1%                     |
| A partir de R$ 500,00                       | 5%                     |

Após o cálculo individual, os valores das comissões são agrupados por vendedor para determinar o total devido a cada um.

**Exemplo de resposta:**

```json
{
  "message": "Comissões calculadas com sucesso",
  "data": [
    {
      "vendedor": "Vendedor Exemplo 1",
      "comissaoTotal": 495.69
    },
    {
      "vendedor": "Vendedor Exemplo 2",
      "comissaoTotal": 465.96
    }
  ]
}
```

> Os valores apresentados são ilustrativos e demonstram o formato da resposta da API.

### 2. Movimentação de estoque

**Endpoint:** `POST /api/movimentacao`

Registra movimentações de entrada e saída de produtos, atualizando a quantidade disponível em estoque.

Cada movimentação possui um identificador único, uma descrição, o código do produto, o tipo de operação e a quantidade movimentada.

**Tipos de movimentação:**

- **Entrada** (`entrada`): adiciona unidades ao estoque.
- **Saída** (`saida`): subtrai unidades do estoque.

**Exemplo de requisição:**

```json
{
  "codigoProduto": 101,
  "quantidade": 10,
  "tipoMovimentacao": "entrada"
}
```

**Exemplo de resposta:**

```json
{
  "message": "Movimentação gerada com sucesso",
  "data": {
    "id": "id-da-movimentacao",
    "descricao": "Entrada de produto",
    "codigoProduto": 101,
    "tipo": "entrada",
    "quantidade": 10,
    "quantidadeTotalEstoque": 160
  }
}
```

> O exemplo considera um estoque inicial de 150 unidades e a entrada de mais 10 unidades. O identificador e a descrição são ilustrativos.

**Campos retornados:**

| Campo                    | Descrição                                      |
| ------------------------ | ---------------------------------------------- |
| `id`                     | Identificador único da movimentação.           |
| `descricao`              | Descrição da movimentação realizada.           |
| `codigoProduto`          | Código do produto movimentado.                 |
| `tipo`                   | Tipo da operação: `entrada` ou `saida`.        |
| `quantidade`             | Quantidade movimentada.                        |
| `quantidadeTotalEstoque` | Quantidade total disponível após a movimentação. |

### 3. Cálculo de juros por atraso

**Endpoint:** `POST /api/juros`

Calcula os juros de uma dívida com base no valor original e na data de vencimento, considerando uma taxa de **2,5% ao dia** de atraso.

**Exemplo de requisição:**

```json
{
  "valorInicial": 1000,
  "dataVencimento": "2026-10-01"
}
```

A data de vencimento deve ser informada no formato `AAAA-MM-DD`.

**Exemplo de resposta:**

```json
{
  "message": "Juros calculado com sucesso",
  "data": {
    "valorOriginal": 1000,
    "dataVencimento": "2026-10-01",
    "dataAtual": "2026-10-12",
    "diasAtraso": 11,
    "percentualJuros": "27.5%",
    "valorJuros": 275,
    "valorFinal": 1275
  }
}
```

> O exemplo ilustra um cálculo de juros simples, considerando 11 dias de atraso e a aplicação de 2,5% ao dia sobre o valor original da dívida. Os valores demonstram a regra de cálculo e devem ser compatíveis com o comportamento efetivamente implementado.

**Campos retornados:**

| Campo             | Descrição                                |
| ----------------- | ---------------------------------------- |
| `valorOriginal`   | Valor inicial da dívida.                 |
| `dataVencimento`  | Data de vencimento informada.            |
| `dataAtual`       | Data de referência utilizada no cálculo. |
| `diasAtraso`      | Quantidade de dias em atraso.            |
| `percentualJuros` | Percentual total de juros aplicado.      |
| `valorJuros`      | Valor monetário dos juros calculados.    |
| `valorFinal`      | Valor original acrescido dos juros.      |

## Endpoints disponíveis

| Método HTTP | Endpoint             | Descrição                                |
| ----------- | -------------------- | ---------------------------------------- |
| `GET`       | `/api/comissao`      | Calcula as comissões dos vendedores.     |
| `POST`      | `/api/juros`         | Calcula os juros de uma dívida em atraso. |
| `POST`      | `/api/movimentacao`  | Registra uma entrada ou saída de estoque. |

## Arquitetura do projeto

O projeto possui uma estrutura organizada em camadas, separando os casos de uso, as entidades de domínio e os componentes de infraestrutura.

```text
.
├── jest.config.cjs
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── src
    ├── application
    │   └── use-cases
    │       ├── calcularComissao
    │       ├── calcularJuros
    │       ├── errors
    │       └── movimentarEstoque
    ├── app.ts
    ├── domain
    │   ├── entities
    │   │   ├── Movimentacao.ts
    │   │   ├── Produto.ts
    │   │   └── Venda.ts
    │   └── services
    │       ├── CalcularComissao.spec.ts
    │       └── CalcularComissao.ts
    ├── infra
    │   ├── database
    │   │   ├── databasePaths.ts
    │   │   ├── estoque.json
    │   │   ├── movimentacoes.json
    │   │   └── vendas.json
    │   ├── factories
    │   │   ├── CalcularComissaoFactory.ts
    │   │   ├── CalcularJurosFactory.ts
    │   │   └── MovimentacaoFactory.ts
    │   ├── http
    │   │   ├── handlers
    │   │   └── routes.ts
    │   └── repositories
    │       └── json
    └── server.ts
```

### Organização das responsabilidades

- **`application/use-cases/`** — reúne os casos de uso responsáveis pelas operações de negócio, incluindo cálculo de comissões, cálculo de juros e movimentação de estoque.
- **`domain/entities/`** — contém as entidades centrais do domínio, como produtos, vendas e movimentações.
- **`domain/services/`** — concentra serviços de domínio, incluindo a lógica de cálculo de comissões.
- **`infra/database/`** — contém os arquivos JSON utilizados para armazenar os dados de vendas, estoque e movimentações.
- **`infra/factories/`** — reúne as fábricas responsáveis pela criação dos componentes associados aos casos de uso.
- **`infra/http/`** — contém os componentes responsáveis pelo tratamento das requisições HTTP e pelo registro das rotas.
- **`infra/repositories/json/`** — diretório destinado aos repositórios relacionados ao armazenamento em JSON.
- **`app.ts`** — arquivo de configuração da aplicação.
- **`server.ts`** — ponto de entrada do servidor.

Essa organização favorece a separação de responsabilidades e facilita a manutenção e a evolução das funcionalidades.

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

## Instalação e execução

### 1. Clone o repositório

```bash
git clone https://github.com/diegocruz-s/teste_target_sistemas
```

### 2. Acesse o diretório do projeto

```bash
cd teste_target_sistemas
```

> Os comandos seguintes devem ser executados na raiz do projeto, onde está localizado o arquivo `package.json`.

### 3. Instale as dependências

```bash
npm install
```

### 4. Execute em ambiente de desenvolvimento

```bash
npm run dev:start
```

Esse comando inicia o servidor utilizando TSX, com monitoramento de alterações nos arquivos durante o desenvolvimento.

### 5. Compile e execute a aplicação

Para compilar o TypeScript para JavaScript:

```bash
npm run build
```

Após a compilação, inicie a aplicação:

```bash
npm run start
```

O processo de compilação utiliza o compilador TypeScript e copia os arquivos JSON de `src/infra/database/` para o diretório correspondente em `dist/infra/database/`.

## Testes automatizados

O projeto utiliza Jest para verificar o comportamento das funcionalidades e dos componentes da aplicação.

### Executar os testes

Para executar toda a suíte de testes:

```bash
npm test
```

Para executar os testes e gerar o relatório de cobertura:

```bash
npm run test:coverage
```

### Resultados da cobertura

Na execução realizada durante o desenvolvimento, foram obtidos os seguintes resultados:

| Métrica                 | Cobertura |
| ----------------------- | --------- |
| Statements (instruções) | 98,33%    |
| Branches (ramificações) | 96,05%    |
| Functions (funções)     | 91,11%    |
| Lines (linhas)          | 98,33%    |

### Resultado da execução

- **Suítes de testes:** 7 aprovadas.
- **Testes:** 43 aprovados.
- **Falhas:** nenhuma.
- **Tempo de execução:** aproximadamente 2,9 segundos.

### Destaques da cobertura

Os resultados demonstram ampla cobertura dos componentes da aplicação, incluindo regras de negócio, casos de uso, entidades e componentes HTTP.

Entre os componentes com 100% de cobertura nas quatro métricas estão:

- Casos de uso de cálculo de comissões.
- Caso de uso de cálculo de juros.
- Caso de uso de movimentação de estoque.
- Exceções específicas do domínio de estoque e cálculo financeiro.
- Entidade de vendas.
- Serviço de cálculo de comissões.
- Componentes de configuração dos caminhos dos arquivos JSON.
- Configuração das rotas HTTP.

> Os percentuais apresentados correspondem à execução dos testes no momento em que o relatório foi gerado e podem variar conforme alterações futuras no código.

## Considerações finais

O projeto demonstra a aplicação de conceitos de desenvolvimento de APIs REST com Node.js e TypeScript, com foco na organização do código, na implementação de regras de negócio e na validação do comportamento da aplicação por meio de testes automatizados.

As funcionalidades desenvolvidas abrangem cálculos financeiros e operações de controle de estoque, organizadas em componentes com responsabilidades distintas.

A cobertura de testes obtida reforça a preocupação com a qualidade e a confiabilidade da solução implementada.
