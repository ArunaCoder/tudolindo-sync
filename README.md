# tudolindo-sync

Hub de sincronização de dados JSON com uma página web estática de leitura para observadores. Não há backend nem banco de dados: o Git é o mecanismo de transporte — quem publica faz push dos JSON, e a página os consome via `raw.githubusercontent.com`.

## Stack

- **Dados**: arquivos JSON versionados em `sync-data/` (produção) e `sync-data-dev/` (desenvolvimento).
- **Página web**: HTML/CSS estático em `web/`, com lógica em TypeScript (hoje ainda `web/main.js`; migração para TS em andamento).
- **Tooling**: Biome (lint/format) e Vitest (testes da lógica pura).
- **Hospedagem**: Cloudflare Pages serve `web/`; os dados continuam vindo do raw do GitHub.

## Estrutura do Repositório

```
tudolindo-sync/
├── sync-data/       # Dados de produção (consumidos por web/index.html)
├── sync-data-dev/   # Dados de desenvolvimento (consumidos por web/dev/)
├── web/             # Página estática (HTML, CSS, JS/TS)
└── docs/            # Documentação técnica e convenções
```

## Fluxo

1. O **publicador** escreve os JSON em `sync-data/` e faz push.
2. O **observador** abre a página web, que busca os dados via raw do GitHub e renderiza uma tabela filtrável de vídeos gravados.
3. `sync-data-dev/` espelha a estrutura de produção para testes, servido pela página `web/dev/`.

O schema de cada arquivo de dados está documentado em [`sync-data/README.md`](sync-data/README.md).

## Comandos Principais

```bash
npm install        # instala o tooling (Biome)
npm run lint       # checa lint e formatação (Biome)
npm run lint:fix   # aplica correções seguras
npm run format     # formata os arquivos
```

## Documentação

- [`docs/repo-cleanup/con-repo-purpose.md`](docs/repo-cleanup/con-repo-purpose.md) — propósito e stack reais do repositório.
- [`docs/ref-documentation-convention.md`](docs/ref-documentation-convention.md) — convenção de documentação.
- [`AGENTS.md`](AGENTS.md) — diretrizes obrigatórias de desenvolvimento.
