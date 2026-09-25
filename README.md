# Business Backoffice

Backoffice operacional reutilizável desenvolvido para apoiar cases completos de negócio.

A primeira implementação foi criada para a **Caderno D'Vinho**, empresa fictícia desenvolvida como parte de um portfólio de estratégia, branding, experiência digital, operação e Business Intelligence.

O objetivo deste projeto não é simular um ERP completo, mas representar de forma funcional como uma empresa poderia acompanhar sua operação interna através de módulos essenciais.

## Demo

Acesse a versão publicada:

https://wesomelo97.github.io/business-backoffice/

## Objetivo

Este backoffice foi criado para conectar a experiência digital do cliente à operação interna do negócio.

Na implementação da Caderno D'Vinho, o sistema representa o fluxo:

```text
Venda / Reserva
      ↓
Pedidos
      ↓
Clientes
      ↓
Estoque
      ↓
Operação
      ↓
Dashboard
```

A proposta é mostrar não apenas uma interface administrativa, mas como diferentes partes da operação se relacionam.

## Módulos

### Dashboard

Visão consolidada da operação.

Apresenta indicadores e informações como:

- pedidos registrados;
- receita associada aos pedidos;
- produtos abaixo do estoque mínimo;
- reservas ativas;
- pedidos recentes;
- estoque crítico;
- próximas experiências.

Os dados apresentados são derivados dos mesmos registros utilizados pelos demais módulos.

### Pedidos

Permite acompanhar pedidos realizados pelos diferentes canais da empresa.

Funcionalidades:

- busca por pedido, cliente ou canal;
- filtro por status;
- visualização de detalhes;
- atualização do status do pedido;
- persistência das alterações no navegador.

Fluxo de status utilizado:

```text
Recebido
↓
Pago
↓
Separação
↓
Enviado
↓
Entregue
```

Também é possível representar pedidos cancelados.

### Produtos & Estoque

Módulo responsável pelo acompanhamento dos produtos e da disponibilidade operacional.

Funcionalidades:

- consulta de produtos;
- filtros por categoria e situação;
- acompanhamento de estoque atual;
- definição de estoque mínimo;
- identificação automática de estoque normal, baixo ou crítico;
- entrada de estoque;
- saída de estoque;
- atualização automática do Dashboard após movimentações.

Exemplo:

```text
Estoque atual: 4

Entrada: +12

Novo estoque: 16

Situação:
Crítico → Normal
```

### Clientes

Permite acompanhar a relação comercial com os clientes da empresa.

Informações disponíveis:

- dados de contato;
- origem do cadastro;
- localização;
- perfil do cliente;
- quantidade de pedidos;
- total gasto;
- última compra;
- histórico de pedidos.

A segmentação utilizada pela Caderno D'Vinho segue três perfis:

- Descoberta;
- Repertório;
- Entusiasta.

Esses perfis representam diferentes níveis de relacionamento e conhecimento sobre vinho.

### Reservas

Módulo utilizado para acompanhar experiências presenciais da marca.

Funcionalidades:

- consulta de reservas;
- busca por cliente, experiência ou unidade;
- filtros por status;
- quantidade de participantes;
- local da experiência;
- observações;
- atualização de status.

Status disponíveis:

```text
Pendente
Confirmada
Concluída
Cancelada
```

## Integração entre módulos

Apesar de ser um protótipo frontend, os módulos compartilham a mesma fonte de dados operacional no navegador.

Por exemplo:

```text
Alteração de pedido
        ↓
localStorage
        ↓
Dashboard atualizado
```

```text
Movimentação de estoque
        ↓
novo saldo
        ↓
situação recalculada
        ↓
alerta no Dashboard
```

```text
Pedido
   ↓
cliente identificado pelo e-mail
   ↓
histórico de compras
   ↓
total gasto e recorrência
```

Essa integração foi criada para evitar que o projeto fosse apenas um conjunto de telas independentes.

## Persistência de dados

O protótipo utiliza `localStorage` para armazenar alterações feitas durante a utilização.

Isso permite que mudanças em:

- pedidos;
- estoque;
- clientes;
- reservas;

permaneçam salvas mesmo após atualizar a página.

Os dados iniciais da demonstração são definidos através de arquivos de seed.

## Arquitetura

O projeto foi estruturado para permitir reutilização em outros cases.

Estrutura simplificada:

```text
src/
├── components/
│   ├── layout/
│   ├── ui/
│   └── tables/
│
├── modules/
│   ├── dashboard/
│   ├── orders/
│   ├── inventory/
│   ├── customers/
│   └── reservations/
│
├── projects/
│   └── caderno-dvinho/
│       ├── config.js
│       ├── theme.js
│       └── seedData.js
│
├── services/
│   └── storage.js
│
├── App.jsx
└── main.jsx
```

A ideia central é separar:

```text
Sistema reutilizável
        +
Configuração específica da empresa
```

Assim, futuros projetos podem reutilizar os módulos operacionais com dados, identidade e regras próprias.

## Tecnologias

- React
- Vite
- JavaScript
- React Router
- Lucide React
- CSS
- LocalStorage
- Git
- GitHub
- GitHub Pages

## Contexto da primeira implementação

A primeira empresa configurada neste backoffice é a **Caderno D'Vinho**.

A Caderno D'Vinho é uma empresa fictícia de vinhos criada como um case completo de negócio.

O projeto inclui:

- estratégia de negócio;
- posicionamento;
- branding;
- e-commerce;
- Wine Finder;
- experiências;
- backoffice operacional;
- estrutura de dados;
- Business Intelligence;
- análise de desempenho;
- insights e recomendações.

Este repositório representa especificamente a camada de **operação interna** desse ecossistema.

## Limitações

Este projeto foi desenvolvido como um protótipo funcional para portfólio.

Não inclui:

- backend real;
- banco de dados em servidor;
- autenticação;
- controle de permissões;
- integração fiscal;
- gateway de pagamento;
- integração com transportadoras;
- controle financeiro completo;
- sincronização real com o e-commerce.

Em um ambiente de produção, a arquitetura esperada seria semelhante a:

```text
E-commerce
    ↓
API / Backend
    ↓
Banco de dados
    ↓
Backoffice
```

Neste projeto, os dados são simulados e armazenados localmente para demonstrar os fluxos de operação e experiência.

## Papel no case

O backoffice existe para responder uma pergunta central do projeto:

> Depois que o cliente compra, reserva ou interage com a empresa, como a operação acompanha aquilo?

Por isso, ele complementa as demais entregas da Caderno D'Vinho:

```text
Estratégia
    ↓
Marca
    ↓
Experiência digital
    ↓
Backoffice
    ↓
Dados
    ↓
Business Intelligence
```

O objetivo final é demonstrar a construção de uma empresa fictícia de forma integrada, utilizando tecnologia como ferramenta para materializar decisões de negócio.
