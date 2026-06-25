# AGENTS.md - Diretrizes de Desenvolvimento (tudolindo-sync)

Regras obrigatórias de arquitetura, qualidade e estabilidade. Nenhuma entrega é aceita sem cumpri-las integralmente. O propósito e o stack do repositório estão em [`docs/repo-cleanup/con-repo-purpose.md`](docs/repo-cleanup/con-repo-purpose.md) — leia antes de qualquer tarefa.

## 1. O que este repositório é

`tudolindo-sync` é um **hub de sincronização de dados JSON** com uma **página web estática de leitura** para observadores. Não há backend, banco de dados, Python nem Rust: o Git é o mecanismo de transporte (push escreve os dados, `fetch` os consome). O stack é apenas **TypeScript + página web estática + Biome + Vitest**.

## 2. Terminal

O terminal primário é **PowerShell** (Windows). Há um Bash disponível para scripts POSIX, com sua própria sintaxe. Não misture as duas sintaxes no mesmo comando.

## 3. Verificação Obrigatória

Todo código entregue deve passar em `npm run lint` (Biome), sem erros e sem novas supressões (`biome-ignore`). O `biome.json` é a fonte da verdade — é proibido alterá-lo para silenciar erros.

A migração da página de JavaScript para TypeScript está planejada em [`docs/repo-cleanup/task-typescript-web-app.md`](docs/repo-cleanup/task-typescript-web-app.md); quando concluída, `npm run typecheck` e `npm test` passam a ser obrigatórios na mesma régua.

## 4. Idioma

- **Português**: documentação (`.md`) e comentários inline.
- **Inglês**: todo o resto — identificadores, constantes, chaves JSON, logs e mensagens de erro.

## 5. TypeScript

- Proibido `any`. Cada estrutura de dados tem `interface` ou `type` dedicado.
- Vanilla TS: manipulação direta do DOM, com a lógica encapsulada em funções/módulos.
- Sem asserção de não-nulo (`!`): estreite `document.getElementById(...)` com checagem explícita e tipe o elemento (`HTMLInputElement`, `HTMLSelectElement`, etc.).

## 6. Contrato de sincronização de dados

- **`sync-data/`** — dados de **produção**, consumidos pela página `web/index.html`.
- **`sync-data-dev/`** — espelho de **desenvolvimento**, consumido por `web/dev/index.html`.
- O schema de cada arquivo está documentado em [`sync-data/README.md`](sync-data/README.md). Mantenha-o em paridade com o que o código da página realmente lê.
- Publicar é fazer push dos JSON; o observador consome via `raw.githubusercontent.com`. O HTML/JS é servido pelo Cloudflare Pages.

## 7. Documentação

Todo documento `.md` deve seguir [`docs/ref-documentation-convention.md`](docs/ref-documentation-convention.md) — nomenclatura kebab-case com prefixo, frontmatter `type`/`status`, política root/context e README por tipo.

- **Tabelas**: usar apenas com exatamente 2 colunas e conteúdo curto. Para 3+ colunas ou texto longo, usar seções e listas.
- **Quebra de linha em prose**: proibido inserir `\n` dentro de parágrafos — cada parágrafo é uma única linha contínua (o editor faz soft-wrap).
- **Progresso de tasks**: a seção `## Checklist` no topo é a fonte única de progresso (itens `- [ ] N. <título>` / `- [x] N. <título>` espelhando as seções `## N.` acionáveis), e o estado vive em `status:` no frontmatter.

## 8. Checklist de Entrega

- [ ] `npm run lint` passa, sem novas supressões.
- [ ] Idioma conforme a Seção 4.
- [ ] Documentação segue a convenção ([`docs/ref-documentation-convention.md`](docs/ref-documentation-convention.md)).
- [ ] Recursos liberados: listeners e timers registrados têm remoção simétrica.
- [ ] `sync-data/README.md` atualizado se algum schema de dados mudou.
