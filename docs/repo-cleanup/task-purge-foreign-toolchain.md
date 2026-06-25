---
type: task
status: implemented
context: repo-cleanup
---

> Remove de todos os arquivos de configuração as referências a Python, Rust e Tauri herdadas do projeto de origem.
> Pré-requisito das demais tasks: deixa lint, ignore e estilo coerentes com um repo só de TypeScript + web estática.

# task-purge-foreign-toolchain

Os arquivos de configuração da raiz (`package.json`, `biome.json`, `.gitignore`, `.editorconfig`, `.gitattributes`) foram copiados de um projeto Python/Rust/Tauri. A maior parte das regras aponta para diretórios e ferramentas que não existem aqui (`desktop/src`, `*/target`, Ruff, mypy, cargo). Esta task limpa esses arquivos para que reflitam apenas o stack real descrito em [con-repo-purpose](con-repo-purpose.md).

## Checklist

- [x] 1. Sanear package.json
- [x] 2. Sanear biome.json
- [x] 3. Sanear .gitignore
- [x] 4. Sanear .editorconfig e .gitattributes

_Cada item corresponde a uma seção `## N.` acionável abaixo, conforme [ref-documentation-convention](../ref-documentation-convention.md)._

<!-- ── seções descritivas ─────────────────────────────────────────────── -->

## Objetivo

Garantir que nenhum arquivo de configuração mencione ferramenta, linguagem ou diretório ausente do repositório, eliminando ruído e falsos positivos de lint.

## Depende de

Nenhuma. É a primeira task da iniciativa.

## Escopo

Apenas os cinco arquivos de configuração da raiz. A criação de scripts de build/teste de TypeScript fica em [task-typescript-web-app](task-typescript-web-app.md); a documentação fica em [task-realign-docs-governance](task-realign-docs-governance.md).

## Não inclui

- Não cria `web/main.ts` nem altera código (task 2).
- Não reescreve `AGENTS.md` nem README (task 3).
- Não adiciona dependências de TypeScript/Vitest ao `package.json` (task 2 faz isso; aqui apenas se removem entradas).

<!-- ── seções entregáveis ─────────────────────────────────────────────── -->

## 1. Sanear package.json

**O que fazer:**

1. Renomear `"name"` de `temas-tooling` para `tudolindo-sync` e reescrever `"description"` para algo como "Hub de sincronização de dados JSON e página web estática para observadores".
2. Remover os scripts de outras stacks: `py:lint`, `py:format`, `py:fix`, `py:type`, `py:check`, `deny`, `app`, `app:build`.
3. Manter `lint`, `lint:fix`, `format` (Biome). Os scripts `build`/`test`/`typecheck` serão adicionados na task 2.
4. Manter `@biomejs/biome` em `devDependencies` (as deps de TypeScript/Vitest entram na task 2).

**Critérios de Pronto:**

- `package.json` não menciona Ruff, mypy, cargo, tauri ou `desktop`.
- `npm run lint` continua executável.

## 2. Sanear biome.json

**O que fazer:**

1. Substituir `files.includes` por padrões que existam aqui. Decisão de implementação: `["web/**/*.ts", "*.json"]`. Ficou `*.ts` (não `*.{ts,js}`) porque `web/main.js` é JS legado a ser substituído na [task-typescript-web-app](task-typescript-web-app.md); lintá-lo agora só geraria ruído (falso-positivo de `init` "não usado" — ele é chamado pelo `<script>` inline do HTML — e estilo que a migração reescreve). Assim que `main.ts` existir, fica coberto automaticamente.
2. Remover os ignores órfãos do projeto de origem: `!_canal`, `!_cenarios`, `!_contexto`, `!_personas`, `!_templates`, `!_comentarios`, `!backup_*`, `!antigos`, `!Aleatorios`.
3. JSON de dados (`sync-data/`, `sync-data-dev/`): ficam **fora** do escopo do Biome (não são casados por `*.json`, que só pega a raiz). São dados, não código — não devem ser formatados como fonte.

**Critérios de Pronto:**

- `npm run lint` cobre `web/` e os configs da raiz, sem apontar para diretórios inexistentes.
- Nenhum glob refere caminho ausente (`desktop/src`).

## 3. Sanear .gitignore

**O que fazer:**

1. Remover os blocos de Python (byte-compiled, virtualenvs, Django/Flask/Scrapy/Jupyter, poetry/pdm/pipenv, mypy/pyre/pytype, `__pycache__`, `*.egg-info`), Rust (`*/target`, `Cargo.lock` em attributes é à parte) e Tauri/deploy (`fly.toml`).
2. Remover ignores de diretórios que não existem aqui: `offline/`, `desktop/`, `report-type.txt`, `report-lint.txt`, `report-deny.txt`, `report-clippy.txt`, `debug_clicks.md`, `pastas_processadas.txt`, auditorias de `offline/scripts` e `desktop/scripts`.
3. Manter e consolidar: Node/TypeScript (`node_modules/`, `dist/`, `*.tsbuildinfo`), saídas de teste/coverage, segredos/`.env`, arquivos temporários e de backup, e os blocos de SO (Windows/macOS/Linux) e editores (VS Code, JetBrains).
4. Eliminar duplicatas resultantes (vários blocos repetem `*.bak`, `*.swp`, `*.log`, `*.db`).

**Critérios de Pronto:**

- `.gitignore` não cita Python, Rust, Tauri nem diretórios ausentes.
- Sem regras duplicadas.

## 4. Sanear .editorconfig e .gitattributes

**O que fazer:**

1. `.editorconfig`: remover a regra `[*.rs]` (não há Rust). Manter charset/EOL/indent globais, a exceção de Markdown e as regras de JSON/YAML.
2. `.gitattributes`: remover a linha de `Cargo.lock` (Rust). Manter `* text=auto eol=lf`, `package-lock.json`, as regras de binário e as de shell se forem mantidas.
3. Opcional: enxugar extensões binárias não usadas neste repo, mantendo as plausíveis para a web (imagens, fontes, PDF).

**Critérios de Pronto:**

- Nenhuma referência a Rust em `.editorconfig` ou `.gitattributes`.
- `eol=lf` global preservado (consistente com `.editorconfig`).

<!-- ── fechamento ─────────────────────────────────────────────────────── -->

## Referências

- [con-repo-purpose](con-repo-purpose.md) — definição do stack real.
- [ref-documentation-convention](../ref-documentation-convention.md) — convenção de documentos.
