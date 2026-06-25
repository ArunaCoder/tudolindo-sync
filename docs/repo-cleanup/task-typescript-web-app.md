---
type: task
status: implemented
context: repo-cleanup
---

> Migra a página web de JavaScript para TypeScript com build via `tsc` (sem Vite) e cobre a lógica pura com Vitest.
> Depende do saneamento dos configs (task 1) para que tsconfig/biome apontem para `web/`.

# task-typescript-web-app

O usuário quer que o repositório tenha "apenas TypeScript e página web", mas a página foi escrita em `web/main.js` (JavaScript) e a toolchain de build (`vite.config.ts`, `vitest.config.ts`, `tsconfig.json`) ainda aponta para um app Tauri inexistente (`src/`, `src-tauri`, `IpcClient`). Esta task migra o código para TypeScript, estabelece um build mínimo com `tsc` e remove o Vite.

## Checklist

- [x] 1. Migrar web/main.js para web/main.ts
- [x] 2. Ajustar tsconfig.json para web/
- [x] 3. Adicionar build e scripts npm
- [x] 4. Reconfigurar vitest.config.ts e cobrir funções puras
- [x] 5. Remover vite.config.ts

_Cada item corresponde a uma seção `## N.` acionável abaixo, conforme [ref-documentation-convention](../ref-documentation-convention.md)._

<!-- ── seções descritivas ─────────────────────────────────────────────── -->

## Objetivo

Ter a página web escrita em TypeScript tipado (sem `any`), compilada para JS de navegador por um único comando, com as funções puras testadas.

## Depende de

[task-purge-foreign-toolchain](task-purge-foreign-toolchain.md) — `tsconfig.json` e `biome.json` precisam estar saneados e apontando para `web/` antes de compilar.

## Escopo

`web/main.js`, `tsconfig.json`, `vitest.config.ts`, `vite.config.ts`, os scripts de build/teste em `package.json` e os `<script>` dos HTML em `web/`.

## Não inclui

- Não redesenha a UI nem altera o layout/CSS.
- Não documenta o contrato de dados (fica na task 3).

## Decisões já tomadas

- Build: **apenas `tsc`**, commitando o JS gerado; **Vite é removido**.
- Testes: **Vitest mínimo**, ambiente `node`, cobrindo só funções puras (sem DOM).

## Armadilhas conhecidas

- **`tsc` precisa emitir.** O `tsconfig.json` atual tem `noEmit: true` e `allowImportingTsExtensions: true` (que exige `noEmit`). Para gerar JS é preciso `noEmit: false`, remover `allowImportingTsExtensions` e definir `outDir`. Manter o type-check estrito com um script `typecheck` usando `tsc --noEmit` à parte (ou um segundo tsconfig).
- **`init` global vs. módulo ES.** Hoje os HTML chamam `init(...)` como função global (`<script src="main.js">` clássico). Se `main.ts` passar a usar `export` (necessário para testar), o JS emitido vira módulo e `init` deixa de ser global. Solução prescrita: emitir como módulo ES e trocar os `<script>` para `type="module"`, importando `init` do `main.js` compilado.
- **`noNonNullAssertion` é erro no Biome.** `document.getElementById(...)` retorna `HTMLElement | null`; não usar `!`. Estreitar com checagem explícita e tipar o elemento (ex.: `HTMLInputElement`, `HTMLSelectElement`, `HTMLTableElement`).
- **Hospedagem dos módulos.** `type="module"` exige MIME `text/javascript`; funciona no Cloudflare Pages (hospedagem confirmada em [con-repo-purpose](con-repo-purpose.md)), mas **não** via `raw.githubusercontent.com`, que serve como `text/plain` — por isso os dados continuam vindo do raw, mas o HTML/JS é servido pelo Pages.

<!-- ── seções entregáveis ─────────────────────────────────────────────── -->

## 1. Migrar web/main.js para web/main.ts

**O que fazer:**

1. Renomear para `web/main.ts` e adicionar uma `interface` para a entrada consumida de `observers.json` (campos observados hoje: `recording_id: number`, `recorded_at: string` ISO, `title: string`, `id: string`).
2. Tipar os elementos do DOM com narrowing explícito (sem `!`, sem `any`) e os parâmetros de `cell`, `formatDate`, `formatMonth`, `setStatus`, `render`.
3. Ajustar o estilo ao Biome: aspas duplas, ponto e vírgula, vírgula final, parênteses em arrow.
4. `export` das funções puras (`formatDate`, `formatMonth`) e da lógica de filtro/ordenação extraída em função testável, além de `init`.
5. Conferir a constante `OWNER` (`ArunaCoder`) contra o owner real do GitHub e o `REPO`.

**Critérios de Pronto:**

- `web/main.ts` sem `any` e sem `!`.
- `npm run lint` passa em `web/`.

## 2. Ajustar tsconfig.json para web/

**O que fazer:**

1. Trocar `include` de `["src", "vite.config.ts"]` para `["web"]`.
2. Configurar emissão: `noEmit: false`, `outDir` apropriado, remover `allowImportingTsExtensions`; manter `strict` e os checks rígidos atuais.
3. Revisar `types: ["node"]` — necessário só para os testes Vitest; manter se `@types/node` for instalado, senão remover do build de navegador.

**Critérios de Pronto:**

- `tsc` emite `web/main.js` a partir de `web/main.ts`.
- `tsc --noEmit` (type-check) passa sem erros.

## 3. Adicionar build e scripts npm

**O que fazer:**

1. Adicionar a `package.json`: `"build": "tsc"`, `"typecheck": "tsc --noEmit"`, `"test": "vitest run"`, `"test:watch": "vitest"`.
2. Adicionar `devDependencies`: `typescript`, `vitest`, e `@types/node` se mantido em `types`. **Não** adicionar `happy-dom` (ambiente de teste é `node`).
3. Decidir e documentar se `web/main.js` (gerado) é commitado (recomendado, pois o site é servido estático) ou ignorado no `.gitignore`. Se commitado, garantir que não seja formatado/lintado como fonte conflitante.

**Critérios de Pronto:**

- `npm run build`, `npm run typecheck` e `npm test` funcionam.
- Estratégia do JS gerado (commit vs. ignore) registrada no commit e coerente com `.gitignore`.

## 4. Reconfigurar vitest.config.ts e cobrir funções puras

**O que fazer:**

1. Reescrever `vitest.config.ts`: `include: ["web/**/*.test.ts"]`, `environment: "node"`, removendo o comentário e as referências a Tauri/`IpcClient`/`EventBus`/`src`.
2. Criar `web/main.test.ts` cobrindo: ordenação por `recorded_at` desc, filtro por texto/`recording_id`/mês, e formatação de `formatDate`/`formatMonth`.

**Critérios de Pronto:**

- `npm test` roda os testes em verde.
- Sem dependência de DOM nos testes.

## 5. Remover vite.config.ts

**O que fazer:**

1. Apagar `vite.config.ts` (config de webview Tauri, sem uso aqui).
2. Trocar os `<script>` em `web/index.html` e `web/dev/index.html` para `type="module"` importando `init` do `main.js` compilado, mantendo as chamadas `init("sync-data/observers.json")` e `init("sync-data-dev/observers.json")`.

**Critérios de Pronto:**

- `vite.config.ts` não existe mais; nenhum arquivo importa `vite`.
- As duas páginas carregam e renderizam os dados localmente.

<!-- ── fechamento ─────────────────────────────────────────────────────── -->

## Referências

- [con-repo-purpose](con-repo-purpose.md) — stack alvo.
- [task-purge-foreign-toolchain](task-purge-foreign-toolchain.md) — pré-requisito de configs.
