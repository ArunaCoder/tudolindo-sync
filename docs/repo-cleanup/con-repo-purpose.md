---
type: concept
status: active
context: repo-cleanup
---

# con-repo-purpose

Define o que este repositório **é de fato**, para servir de fonte da verdade durante o saneamento. Hoje o `AGENTS.md` herdado descreve outro projeto (Temas/Tauri, com Python e Rust) e induz qualquer leitor — humano ou agente — ao erro.

## O que o repositório é

`tudolindo-sync` é um **hub de sincronização de dados JSON** com uma **página web estática de leitura** para observadores. Não há backend, banco de dados, Python nem Rust: o versionamento Git é o próprio mecanismo de transporte (push escreve dados, pull/`fetch` os consome).

## Stack real

- **TypeScript** compilado para JavaScript de navegador via `tsc` (sem bundler, sem Vite).
- **Página web estática** (`web/`) que busca os JSON publicados via `raw.githubusercontent.com` e renderiza uma tabela filtrável.
- **Biome** para lint e formatação; **Vitest** para a lógica pura.
- Nenhum runtime de servidor: os arquivos `web/` são servidos como site estático (Cloudflare pages que consome o repositório do Github).

## Atores

- **Publicador** — escreve os JSON em `sync-data/` (produção) e `sync-data-dev/` (desenvolvimento) e faz push.
- **Observador** — abre a página web, que lê os JSON publicados e exibe os vídeos gravados.

## Diretórios de dados

- **`sync-data/`** — dados de produção consumidos pela página principal.
- **`sync-data-dev/`** — espelho de desenvolvimento, consumido pela página `web/dev/`.
- Cada um contém `observers.json`, `hooks.json`, `published.json`, `subtitles.json`, além de `questions/` e `backups/`. O schema de cada arquivo é documentado em [task-realign-docs-governance](task-realign-docs-governance.md).

## O que NÃO pertence a este repositório

Tudo que veio por arrasto do projeto de origem e deve ser removido no saneamento: Python (Ruff, mypy, `pyproject.toml`), Rust (cargo, clippy, `*/target`), Tauri (`vite.config.ts`, `src-tauri`, `desktop/`), tkinter, `offline/`, grafo de dependências (`graph/`) e o vocabulário de domínio de Temas.

## Iniciativa de saneamento

O trabalho de alinhar o repositório a esta definição está dividido em três tasks: [task-purge-foreign-toolchain](task-purge-foreign-toolchain.md), [task-typescript-web-app](task-typescript-web-app.md) e [task-realign-docs-governance](task-realign-docs-governance.md).
