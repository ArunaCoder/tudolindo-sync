const OWNER = 'ArunaCoder';
const REPO = 'tudolindo-sync';

function init(dataPath) {
  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${dataPath}`;

  const statusEl = document.getElementById('status');
  const countEl = document.getElementById('count');
  const tableEl = document.getElementById('table');
  const tbodyEl = document.getElementById('tbody');
  const textInput = document.getElementById('filter-text');
  const ridInput = document.getElementById('filter-recording-id');
  const monthSelect = document.getElementById('filter-month');

  let entries = [];

  fetch(rawUrl)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      entries = data.slice().sort((a, b) =>
        b.recorded_at.localeCompare(a.recorded_at)
      );

      const months = [...new Set(entries.map(e => e.recorded_at.slice(0, 7)))]
        .sort()
        .reverse();
      months.forEach(ym => {
        const opt = document.createElement('option');
        opt.value = ym;
        opt.textContent = formatMonth(ym);
        monthSelect.appendChild(opt);
      });

      render();
    })
    .catch(() => {
      setStatus('Dados indisponíveis no momento. Tente novamente mais tarde.', true);
    });

  function render() {
    const text = textInput.value.toLowerCase();
    const rid = ridInput.value.trim();
    const month = monthSelect.value;

    const filtered = entries.filter(e => {
      if (month && !e.recorded_at.startsWith(month)) return false;
      if (rid && !String(e.recording_id).includes(rid)) return false;
      if (text && !e.title.toLowerCase().includes(text) && !e.id.toLowerCase().includes(text)) return false;
      return true;
    });

    tbodyEl.innerHTML = '';

    if (filtered.length === 0) {
      tableEl.hidden = true;
      countEl.hidden = true;
      setStatus(
        entries.length === 0
          ? 'Nenhum vídeo gravado ainda.'
          : 'Nenhum vídeo corresponde aos filtros selecionados.',
        false
      );
      return;
    }

    statusEl.hidden = true;
    tableEl.hidden = false;
    countEl.hidden = false;
    countEl.textContent = `${filtered.length} vídeo${filtered.length !== 1 ? 's' : ''}`;

    filtered.forEach(e => {
      const tr = document.createElement('tr');
      tr.appendChild(cell(`#${e.recording_id}`, 'col-rid'));
      tr.appendChild(cell(formatDate(e.recorded_at), 'col-date'));
      tr.appendChild(cell(e.title, 'col-title'));
      tr.appendChild(cell(e.id, 'col-id'));
      tbodyEl.appendChild(tr);
    });
  }

  function setStatus(msg, isError) {
    statusEl.textContent = msg;
    statusEl.className = isError ? 'status-msg error' : 'status-msg';
    statusEl.hidden = false;
    tableEl.hidden = true;
    countEl.hidden = true;
  }

  textInput.addEventListener('input', render);
  ridInput.addEventListener('input', render);
  monthSelect.addEventListener('change', render);
}

function cell(content, className) {
  const td = document.createElement('td');
  td.className = className;
  td.textContent = content;
  return td;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatMonth(ym) {
  const [y, m] = ym.split('-');
  return new Date(Number(y), Number(m) - 1, 1)
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}
