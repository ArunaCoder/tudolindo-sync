---
type: task
status: implemented
context: repo-cleanup
---

> Realinha a documentação e a governança ao stack real: reescreve AGENTS.md e README, adapta a convenção de docs e documenta o contrato de dados.
> Pode rodar em paralelo às tasks 1 e 2, mas deve refletir o estado final delas.

# task-realign-docs-governance

A documentação herdada descreve outro projeto: `AGENTS.md` fala de "Projeto Temas" com Python/Rust/Tauri/tkinter/grafo; `ref-documentation-convention.md` exige paridade `.py` e cita `lint_docs.py`, `graph/REPORT.md` e `requirements.txt`; os templates linkam para `governance/adr-task-checklist-anchor.md` e `generate_migration_status.py`, que não existem. O `README.md` tem uma única linha. Esta task alinha tudo a [con-repo-purpose](con-repo-purpose.md).

## Checklist

- [x] 1. Reescrever AGENTS.md para o stack real
- [x] 2. Criar README.md de visão geral (Tipo 1)
- [x] 3. Adaptar ref-documentation-convention.md
- [x] 4. Podar templates e referências órfãs
- [x] 5. Documentar o contrato de dados (README Tipo 4)

_Cada item corresponde a uma seção `## N.` acionável abaixo, conforme [ref-documentation-convention](../ref-documentation-convention.md)._

<!-- ── seções descritivas ─────────────────────────────────────────────── -->

## Objetivo

Que qualquer leitor — humano ou agente — entenda corretamente o repositório a partir de `AGENTS.md`, `README.md` e `docs/`, sem regras ou referências de outro projeto.

## Depende de

Conceitualmente nenhuma, mas as seções de stack/comandos devem refletir o resultado de [task-purge-foreign-toolchain](task-purge-foreign-toolchain.md) e [task-typescript-web-app](task-typescript-web-app.md). Recomenda-se finalizar por último.

## Escopo

`AGENTS.md`, `README.md`, `docs/ref-documentation-convention.md`, `docs/templates/`, `docs/ref-ui-patterns.md` e um novo README de dados em `sync-data/`.

## Não inclui

- Não altera código nem configs (tasks 1 e 2).
- Não inventa schemas de dados; campos desconhecidos são marcados como tal.

<!-- ── seções entregáveis ─────────────────────────────────────────────── -->

## 1. Reescrever AGENTS.md para o stack real

**O que fazer:**

1. Remover todas as seções de Python, Rust, tkinter, grafo de conhecimento, taxonomia do app desktop, vocabulário de domínio de Temas e os diretórios `offline/`/`desktop/`/`src/`/`scripts/`.
2. Corrigir a seção "Terminal": o terminal real é **PowerShell** (Windows), com Bash disponível para scripts POSIX — não "Git Bash".
3. Manter e adaptar: regra de idioma (docs em português, identificadores/JSON em inglês), regras de TypeScript (proibido `any`, vanilla TS), verificação obrigatória e a referência à convenção de documentação. Implementação: como a [task-typescript-web-app](task-typescript-web-app.md) está pendente, só `npm run lint` é obrigatório agora; `npm run typecheck`/`npm test` ficam registrados no AGENTS como obrigatórios **após** a migração TS.
4. Adicionar uma seção curta sobre o contrato de sincronização (push escreve `sync-data/`, observador consome via raw; separação prod vs. dev) e sobre o build da web (`tsc`, sem Vite).
5. Remover referências a documentos inexistentes (`con-business-rules.md`, `ref-app-taxonomy.md`, `graph/REPORT.md`, `offline/ui/README.md`, smoke test Python).

**Critérios de Pronto:**

- `AGENTS.md` não cita Python, Rust, Tauri, tkinter, grafo nem diretórios ausentes.
- Todos os links internos do `AGENTS.md` resolvem para arquivos existentes.

## 2. Criar README.md de visão geral (Tipo 1)

**O que fazer:**

1. Usando [readme-overview](../templates/readme-overview.md), escrever o README da raiz: propósito (hub de sync + página de observadores), stack (TypeScript + web estática + JSON), estrutura de diretórios (`sync-data/`, `sync-data-dev/`, `web/`, `docs/`) e comandos principais (`lint`, `build`, `typecheck`, `test`).
2. Explicar brevemente o fluxo: publicador faz push dos JSON; observador abre a página, que busca os dados via raw e renderiza a tabela.
3. Não incluir frontmatter (Tipo 1 não usa, conforme convenção §7).

**Critérios de Pronto:**

- `README.md` cobre as seções do template Tipo 1.
- Comandos listados coincidem com os scripts reais do `package.json`.

## 3. Adaptar ref-documentation-convention.md

**O que fazer:**

1. Substituir/remover a regra de **paridade** (§8: todo `.md`/`.txt` fora de `docs/` exige `.py` em snake_case) — não há Python; definir uma regra que faça sentido aqui ou remover.
2. Limpar as **isenções** (§6) específicas de Python: `requirements.txt`, `size-report.md`/`.py`, `graph/REPORT.md`, e a menção a `lint_docs.py` no fluxo (§9) — não existe linter de docs no repo; marcar como aspiracional ou remover.
3. Manter as regras úteis e agnósticas: nomenclatura com prefixo, matriz de status, política root/context, frontmatter, README por tipo.

**Critérios de Pronto:**

- A convenção não pressupõe Python nem ferramentas ausentes.
- As tasks desta própria iniciativa permanecem em conformidade com a convenção revisada.

## 4. Podar templates e referências órfãs

**O que fazer:**

1. Corrigir em `docs/templates/task-template.md` os links/menções a `governance/adr-task-checklist-anchor.md` e `generate_migration_status.py` (inexistentes): apontar para a convenção ou remover.
2. Revisar os demais templates (`adr`, `bug`, `audit`, `rev`, `con`, `tut`, `ref`, `readme-*`) e remover menções a artefatos de Temas.
3. Avaliar `docs/ref-ui-patterns.md`. Decisão de implementação: **removido**. O documento era inteiramente sobre o app desktop Tauri de outro projeto (`desktop/src/components/dropdown.ts`, `ResourceBag`, `IpcClient`, "Tela B", campos gerados por IA) e referenciava `ref-design-style-decisions.md`, inexistente aqui — nada se aplica à página estática simples deste repo.

**Critérios de Pronto:**

- Nenhum template aponta para arquivo/script inexistente.
- Decisão sobre `ref-ui-patterns.md` registrada (mantido, deprecado ou removido).

## 5. Documentar o contrato de dados (README Tipo 4)

**O que fazer:**

1. Usando [readme-data](../templates/readme-data.md), criar `sync-data/README.md` mapeando cada arquivo: `observers.json` (schema consumido pela web: `recording_id`, `recorded_at`, `title`, `id`), `hooks.json`, `published.json`, `subtitles.json`, e as pastas `questions/` e `backups/`.
2. Para arquivos cujo schema ainda não é conhecido, descrever o que se sabe e marcar o restante como dívida/desconhecido em vez de inventar.
3. Documentar a separação `sync-data/` (produção) vs. `sync-data-dev/` (desenvolvimento) e qual página consome cada um.

**Critérios de Pronto:**

- `sync-data/README.md` cobre todos os arquivos do diretório.
- O schema usado por `web/main.ts` está documentado e coincide com o código.

<!-- ── fechamento ─────────────────────────────────────────────────────── -->

## Referências

- [con-repo-purpose](con-repo-purpose.md) — fonte da verdade do propósito.
- [ref-documentation-convention](../ref-documentation-convention.md) — convenção a adaptar.
- [readme-overview](../templates/readme-overview.md) e [readme-data](../templates/readme-data.md) — templates a usar.
