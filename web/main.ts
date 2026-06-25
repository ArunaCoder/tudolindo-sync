const OWNER = "ArunaCoder";
const REPO = "tudolindo-sync";

/** Uma entrada de vídeo gravado, conforme servido em `observers.json`. */
export interface Observer {
  recording_id: number;
  recorded_at: string;
  title: string;
  id: string;
}

/** Valores brutos dos campos de filtro da página. */
export interface Filters {
  text: string;
  rid: string;
  month: string;
}

/** Ordena as entradas por `recorded_at` (desc) sem mutar a lista original. */
export function sortByRecordedAtDesc(entries: Observer[]): Observer[] {
  return entries
    .slice()
    .sort((a, b) => b.recorded_at.localeCompare(a.recorded_at));
}

/** Aplica os filtros de texto, número do vídeo e mês às entradas. */
export function filterEntries(
  entries: Observer[],
  filters: Filters,
): Observer[] {
  const text = filters.text.toLowerCase();
  const rid = filters.rid.trim();
  const { month } = filters;

  return entries.filter((e) => {
    if (month && !e.recorded_at.startsWith(month)) {
      return false;
    }
    if (rid && !String(e.recording_id).includes(rid)) {
      return false;
    }
    if (
      text &&
      !e.title.toLowerCase().includes(text) &&
      !e.id.toLowerCase().includes(text)
    ) {
      return false;
    }
    return true;
  });
}

/** Lista de meses (`YYYY-MM`) presentes nas entradas, mais recente primeiro. */
export function uniqueMonths(entries: Observer[]): string[] {
  return [...new Set(entries.map((e) => e.recorded_at.slice(0, 7)))]
    .sort()
    .reverse();
}

/** Formata uma data ISO como `dd/mm/aaaa` (pt-BR); devolve a entrada se inválida. */
export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Formata um mês `YYYY-MM` como "mês de aaaa" (pt-BR). */
export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

function cell(content: string, className: string): HTMLTableCellElement {
  const td = document.createElement("td");
  td.className = className;
  td.textContent = content;
  return td;
}

/** Obtém um elemento pelo id, garantindo o tipo esperado (sem `!`). */
function requireElement<T extends HTMLElement>(
  id: string,
  ctor: new () => T,
): T {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) {
    throw new Error(`Elemento #${id} ausente ou de tipo inesperado.`);
  }
  return el;
}

/** Monta a página de vídeos a partir do JSON em `dataPath`. */
export function init(dataPath: string): void {
  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${dataPath}`;

  const statusEl = requireElement("status", HTMLParagraphElement);
  const countEl = requireElement("count", HTMLParagraphElement);
  const tableEl = requireElement("table", HTMLTableElement);
  const tbodyEl = requireElement("tbody", HTMLTableSectionElement);
  const textInput = requireElement("filter-text", HTMLInputElement);
  const ridInput = requireElement("filter-recording-id", HTMLInputElement);
  const monthSelect = requireElement("filter-month", HTMLSelectElement);

  let entries: Observer[] = [];

  function setStatus(msg: string, isError: boolean): void {
    statusEl.textContent = msg;
    statusEl.className = isError ? "status-msg error" : "status-msg";
    statusEl.hidden = false;
    tableEl.hidden = true;
    countEl.hidden = true;
  }

  function render(): void {
    const filtered = filterEntries(entries, {
      text: textInput.value,
      rid: ridInput.value,
      month: monthSelect.value,
    });

    tbodyEl.innerHTML = "";

    if (filtered.length === 0) {
      tableEl.hidden = true;
      countEl.hidden = true;
      setStatus(
        entries.length === 0
          ? "Nenhum vídeo gravado ainda."
          : "Nenhum vídeo corresponde aos filtros selecionados.",
        false,
      );
      return;
    }

    statusEl.hidden = true;
    tableEl.hidden = false;
    countEl.hidden = false;
    const plural = filtered.length !== 1 ? "s" : "";
    countEl.textContent = `${filtered.length} vídeo${plural}`;

    for (const e of filtered) {
      const tr = document.createElement("tr");
      tr.appendChild(cell(`#${e.recording_id}`, "col-rid"));
      tr.appendChild(cell(formatDate(e.recorded_at), "col-date"));
      tr.appendChild(cell(e.title, "col-title"));
      tr.appendChild(cell(e.id, "col-id"));
      tbodyEl.appendChild(tr);
    }
  }

  fetch(rawUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json() as Promise<Observer[]>;
    })
    .then((data) => {
      entries = sortByRecordedAtDesc(data);
      for (const ym of uniqueMonths(entries)) {
        const opt = document.createElement("option");
        opt.value = ym;
        opt.textContent = formatMonth(ym);
        monthSelect.appendChild(opt);
      }
      render();
    })
    .catch(() => {
      setStatus(
        "Dados indisponíveis no momento. Tente novamente mais tarde.",
        true,
      );
    });

  textInput.addEventListener("input", render);
  ridInput.addEventListener("input", render);
  monthSelect.addEventListener("change", render);
}
