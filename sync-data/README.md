# Dados de Sincronização (`sync-data/`)

## Responsabilidade

Armazena os dados JSON de **produção** que são publicados via push e consumidos pela página web `web/index.html` através de `raw.githubusercontent.com`. O diretório `sync-data-dev/` espelha esta mesma estrutura para **desenvolvimento** e é consumido por `web/dev/index.html`.

## Mapa de Arquivos

### `observers.json`

Lista de vídeos gravados exibida pela página. É o **único arquivo cujo schema está confirmado pelo código** (`web/main.js`). Cada entrada do array tem:

- `recording_id` — número sequencial do vídeo (exibido como `#N` e usado no filtro "Nº do vídeo").
- `recorded_at` — data/hora ISO da gravação (ex.: `2026-06-25T14:30:00`); a página ordena por ela (desc) e deriva o filtro por mês (`YYYY-MM`).
- `title` — título do vídeo (busca textual).
- `id` — identificador em texto do vídeo (busca textual).

Estado atual: `[]` (nenhum vídeo publicado ainda).

### `hooks.json`, `published.json`, `subtitles.json`

Arquivos de dados versionados, atualmente `[]`. O schema **ainda não está confirmado** por nenhum consumidor neste repositório — ver Dívidas Conhecidas.

### `questions/`

Diretório de perguntas organizado em subpastas (ver commit "migra questions/ para estrutura de subpastas"). Mantém um `.gitkeep` enquanto vazio. Estrutura interna ainda **não documentada** — ver Dívidas Conhecidas.

### `backups/`

Diretório de backups gerados. Mantém um `.gitkeep`; os arquivos `*.bak` em si são ignorados pelo `.gitignore` (não versionados).

## Decisões de Dados

- **Git como transporte**: os dados trafegam por push/pull; não há banco nem API. A página lê os JSON crus do raw do GitHub.
- **Separação prod/dev**: `sync-data/` (produção) e `sync-data-dev/` (desenvolvimento) são diretórios irmãos com a mesma estrutura, cada um servido por uma página distinta (`web/` e `web/dev/`).
- **Dados fora do lint**: os JSON daqui **não** são formatados pelo Biome (não estão no `files.includes` do `biome.json`) — são dados, não código-fonte.

## Dívidas Conhecidas

- **Schemas não confirmados**: `hooks.json`, `published.json` e `subtitles.json` não têm consumidor neste repositório que fixe o formato. Documentar o schema de cada um quando o produtor/consumidor for definido.
- **Estrutura de `questions/`**: a organização em subpastas precisa ser documentada (nomenclatura das pastas, formato dos arquivos).
- **`recorded_at` sem formato canônico fixado**: a página usa `new Date(...)`, que aceita variações de ISO; vale fixar e validar o formato exato na publicação.
