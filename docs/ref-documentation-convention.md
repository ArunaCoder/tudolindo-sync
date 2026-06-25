---
type: reference
status: active
---

# Guia de Convenção de Criação e Manutenção de Documentação

Este guia consolida as regras de governança para o ciclo de vida da documentação, garantindo que o conhecimento esteja estruturado para leitura humana e ingestão por agentes de IA.

## 1. Nomenclatura de Arquivos

Arquivos (`.md` e `.txt`) devem seguir o padrão **kebab-case** em **inglês**, com prefixo obrigatório.

| Tipo        | Prefixo  | Exemplo                        |
| :---------- | :------- | :----------------------------- |
| `concept`   | `con-`   | `con-architecture-overview.md` |
| `tutorial`  | `tut-`   | `tut-setup-environment.md`     |
| `reference` | `ref-`   | `ref-api-endpoints.md`         |
| `task`      | `task-`  | `task-implement-auth.md`       |
| `adr`       | `adr-`   | `adr-001-db-choice.md`         |
| `bug`       | `bug-`   | `bug-login-timeout.md`         |
| `audit`     | `audit-` | `audit-memory-usage.md`        |
| `review`    | `rev-`   | `rev-docs-content.md`          |

## 2. Matriz de Status por Tipo

Para garantir a consistência, cada `type` possui um conjunto restrito de `status` permitidos:

| Type        | Status Permitidos                                                        |
| :---------- | :----------------------------------------------------------------------- |
| `concept`   | `draft`, `active`, `deprecated`, `premature`                             |
| `tutorial`  | `draft`, `active`, `deprecated`                                          |
| `reference` | `draft`, `active`, `deprecated`                                          |
| `task`      | `draft`, `pending`, `in_progress`, `review`, `implemented`, `deprecated` |
| `adr`       | `draft`, `review`, `active`, `deprecated`                                |
| `bug`       | `draft`, `in_progress`, `implemented`                                    |
| `audit`     | `in_progress`, `active`, `deprecated`                                    |
| `review`    | `draft`, `in_progress`, `review`, `implemented`                          |

### 2.1 Distinção entre `draft` e `pending` (tasks)

Para `type: task`, `draft` e `pending` representam momentos diferentes do ciclo de vida de uma task:

- **`draft`** — conteúdo em modelagem, sem compromisso de execução. Autor ainda está definindo escopo, objetivos ou abordagem. Pode evoluir, ser reescrito ou descartado.
- **`pending`** — escopo acordado, aguardando início. A task está pronta para ser puxada para `in_progress`, mas ninguém está executando ainda.

A fronteira é o **compromisso de execução**: enquanto o autor pode livremente reescrever a task, ela é `draft`; a partir do momento em que o escopo está estabilizado e a task está priorizada para entrar em andamento, ela passa a `pending`.

## 3. Estrutura de Diretórios e Localização

- **Política `root` (`concept`, `tutorial`, `reference`):** Podem residir **diretamente na raiz** de `docs/`. Não é exigido que esses tipos estejam no root — apenas eles têm permissão para isso.
- **Política `context` (`task`, `adr`, `bug`, `audit`, `review`):** Devem residir dentro de subpastas de **contexto temático** (ex: `docs/nome-da-iniciativa/`).
- **Exceção `deprecated`:** Documentos com `status: deprecated` de qualquer tipo podem permanecer em subpastas de contexto, independentemente do `type`. A localização preserva o histórico da iniciativa à qual pertencem.
- **Templates:** Estruturas base para cada tipo de documento estão centralizadas em `./docs/templates/`. Utilize-os como referência para garantir a conformidade das seções obrigatórias.

## 4. Formato do Frontmatter

Todo documento `.md` com metadados deve conter um frontmatter YAML entre `---`. O esquema é composto pelos campos abaixo:

### Campos Obrigatórios

- **`type`** — tipo do documento conforme a [tabela de nomenclatura](#1-nomenclatura-de-arquivos) (ex: `concept`, `task`, `adr`).
- **`status`** — status do documento conforme a [matriz de status por tipo](#2-matriz-de-status-por-tipo).

### Campo `context`

- **Obrigatório** para documentos que seguem a **política `context`** — ou seja, `task`, `adr`, `bug`, `audit`, `review`.
- **Obrigatório** para **qualquer** documento fora da raiz `docs/`, independentemente do `type`. Documentos na raiz `docs/` (política `root`) **não** precisam de `context`.
- O valor deve corresponder a um **prefixo do caminho de pastas após `docs/`**, com os níveis unidos por hífen. Para `docs/repo-cleanup/sub/bar.md`:
  - `context: repo-cleanup` — forma simples, agrupa todo o conteúdo da iniciativa sob um único contexto.
  - `context: repo-cleanup-sub` — forma completa, identifica o subdomínio específico.
- Ambas as formas são válidas; escolha conforme a granularidade desejada. Quando o documento mora em uma subpasta dentro de uma iniciativa maior, **a forma simples é recomendada** para manter a agregação natural.

Exemplos para `repo-cleanup/`:

| Arquivo                                        | Formas válidas                              |
| :--------------------------------------------- | :------------------------------------------ |
| `repo-cleanup/con-repo-purpose.md`             | `context: repo-cleanup`                     |
| `repo-cleanup/task-purge-foreign-toolchain.md` | `context: repo-cleanup`                     |
| `repo-cleanup/adr/adr-foo.md`                  | `context: repo-cleanup`, `repo-cleanup-adr` |

### Modelos de Referência

Cada tipo possui um template de frontmatter em `docs/templates/`. O campo `context` aparece apenas nos tipos que seguem a política `context`, com um placeholder para o nome da subpasta:

| Template            | Frontmatter de Exemplo                                              |
| :------------------ | :------------------------------------------------------------------ |
| `con-template.md`   | `type: concept` / `status: active`                                  |
| `tut-template.md`   | `type: tutorial` / `status: active`                                 |
| `ref-template.md`   | `type: reference` / `status: active`                                |
| `task-template.md`  | `type: task` / `status: in_progress` / `context: nome-do-contexto`  |
| `adr-template.md`   | `type: adr` / `status: draft` / `context: nome-da-subpasta`         |
| `bug-template.md`   | `type: bug` / `status: in_progress` / `context: nome-do-contexto`   |
| `audit-template.md` | `type: audit` / `status: in_progress` / `context: nome-do-contexto` |
| `rev-template.md`   | `type: review` / `status: review` / `context: nome-do-contexto`     |

Consulte o template correspondente ao criar um novo documento para copiar o frontmatter base e substituir o placeholder do `context` pelo nome real da pasta pai.

## 5. Governança de Validação

- **Uso da Flag:** Utilize `_PENDING-REVIEW_` para sinalizar pontos específicos de documentos que necessitam de intervenção humana. Se `_PENDING-REVIEW_` estiver no topo, o arquivo inteiro carece de revisão. Se apenas partes carecem, aplique a flag localmente.
- **Restrição de Tipo:** Esta flag **é exclusiva** para documentos do `type: review`. O linter rejeitará seu uso em outros tipos.

## 6. Isenções de Validação

As regras deste documento **não se aplicam** aos seguintes arquivos:

- Arquivos ignorados pelo git (listados em `.gitignore`).
- `./AGENTS.md`.
- Qualquer arquivo chamado `TODO.md` (em qualquer nível do repositório).
- Qualquer arquivo chamado `README.md` — sujeito **apenas** à verificação de **seções obrigatórias** por tipo (seção 7); fica isento de nomenclatura, frontmatter e localização.

## 7. README.md — Tipos e Modelos

README.md se dividem em **4 tipos**, cada um com um template específico em `docs/templates/`:

### Tipo 1 — Visão Geral (raiz do repositório)

Template: [`readme-overview.md`](templates/readme-overview.md)

Apresenta o projeto como um todo: descrição, stack, estrutura de diretórios e comandos principais. Usado apenas na raiz. **Não requer frontmatter**.

### Tipo 2 — Módulo Arquitetural

Template: [`readme-module.md`](templates/readme-module.md)

Para diretórios que representam **módulos ou camadas com responsabilidade própria** (ex: `web/`). **Deve** conter as quatro seções:

- `## Responsabilidade` — propósito do diretório
- `## Decisões de arquitetura` — escolhas técnicas e trade-offs
- `## Guia de desenvolvimento` — setup, comandos, estrutura
- `## Armadilhas` — problemas comuns e como evitá-los

### Tipo 3 — Operacional / Configuração

Template: [`readme-operational.md`](templates/readme-operational.md)

Para ferramentas, hooks, scripts e processos (ex: `scripts/git-hooks/`). Setup, comandos, troubleshooting.

### Tipo 4 — Dados / Schema

Template: [`readme-data.md`](templates/readme-data.md)

Para diretórios com arquivos de dados estruturados (ex: `sync-data/`). Mapa de arquivos, decisões de dados, dívidas conhecidas.

## 8. Fluxo de Criação

1. Escolha o `type` e o prefixo correspondente.
2. Consulte o modelo base em `./docs/templates/` para o tipo escolhido.
3. Valide se o `status` escolhido é permitido para o `type` na matriz da seção 2.
4. Garanta a localização (`root` ou `context`).
5. Se `type: review`, use a flag `_PENDING-REVIEW_`.
6. Revise manualmente a conformidade (nomenclatura, frontmatter, seções obrigatórias) antes de commitar.
