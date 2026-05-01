# DesbravaCash App
WebApp do projeto DesbravaCash feito em Next.JS

## Objetivo
Este projeto faz parte da solução DesbravaCash, um sistema que gerencia a pontuação de Unidades dentro de um [Clube de Desbravadores](https://clubes.adventistas.org/br/about-pathfinder/). Cada Unidade adquire uma quantidade de pontos ao longo dos meses e eles podem trocar estes pontos por prêmios no fim do ano. Como este processo era feito de forma física, a ideia foi transformar este processo numa solução digital moderna que vários outros clubes podem aderir.

## Arquitetura
A arquitetura deste sistema foi pensado de forma simples para que o custo de mantê-lo seja o mais baixo possível.

Temos um FrontEnd (este projeto) feito em NextJs e um [BackEnd](https://github.com/TigreDoMexico/project-desbravacash-api) feito em C# que depende de um banco de dados.

## Executar Local

Este projeto depende das seguintes tecnologias:

| Tecnologia | Versão mínima | Link                  |
| ---------- | ------------- | --------------------- |
| Node.js    | 18.x          | https://nodejs.org    |
| npm        | 9.x           | Incluso com o Node.js |

## Variáveis de ambiente

| Nome Variável                  | Descrição                  | Valor Exemplo           |
| ------------------------------ | -------------------------- | ----------------------- |
| `NEXT_PUBLIC_DESBRAVA_API_URL` | URL da API do DesbravaCash | `http://localhost:5101` |

## Como executar
Para iniciar o projeto localmente, basta executar o comando:

```bash
npm install
npm run dev
```

> A simulação da API do DesbravaCash está disponível no arquivo [docker compose](docker-compose.yaml) através do [Wiremock](https://wiremock.org/)

## Como executar os testar

```bash
npm run test
```

## Open Source

Este projeto é open source e está disponível sob a licença MIT. Contribuições são bem-vindas!
