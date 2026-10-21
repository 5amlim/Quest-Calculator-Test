/* Cedars test-site prototype. Do not mix with Quest data or localStorage. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const published = Array.isArray(window.CEDARS_TESTS) ? window.CEDARS_TESTS : [];
  const manual = [];
  const selected = new Set();
  let manualIndex = 0;
  let showCartDetails = false;
  const byId = (id) => published.concat(manual).find((t) => t.id === id);
  const clean = (value) => String(value == null ? '' : value).trim();
  const esc = (value) => clean(value).replace(/[&<>"']/g, (ch) =>
    ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const norm = (value) => clean(value).toLowerCase().normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const compact = (value) => norm(value).replace(/\s/g, '');
  const records = () => published.concat(manual);
  const chosen = () => Array.from(selected).map(byId).filter(Boolean);
  const source = (test) => test.manual ? 'Manual entry (this session)' : 'Cedars 2023 guide, slide ' + test.slide;
  const isUnknown = (t) => !t.temp || t.temp === 'Verify' || t.temp === 'Room / Refrigerated';
  const transportBucket = (test) => {
    if (test.temp === 'Room Temperature') return 'Room temperature';
    if (test.temp === 'Refrigerated') return 'Refrigerated';
    if (test.temp === 'Frozen') return 'Frozen';
    if (test.temp === 'Room / Refrigerated') return 'Room or refrigerated: select after confirming stability';
    return 'Transport temperature: verify in current directory';
  };
  const bagClass = (bucket) => bucket === 'Refrigerated' ? 'temp-refrigerated' :
    bucket === 'Frozen' ? 'temp-frozen' : bucket === 'Room temperature' ? 'temp-room' : 'temp-unknown';

  function editDistance(a, b) {
    if (!a || !b || Math.abs(a.length - b.length) > 2 || a.length > 55 || b.length > 55) return 99;
    const prior = Array.from({length: b.length + 1}, (_, i) => i);
    for (let i = 1; i <= a.length; i += 1) {
      let diag = prior[0];
      prior[0] = i;
      for (let j = 1; j <= b.length; j += 1) {
        const old = prior[j];
        prior[j] = Math.min(prior[j] + 1, prior[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
        diag = old;
      }
    }
    return prior[b.length];
  }

  function rank(test, query) {
    const q = norm(query);
    if (!q) return 1;
    const n = norm(test.name);
    const c = compact(test.code);
    const aliases = norm(test.aliases || '');
    const text = norm([test.name, test.code, test.specimen, test.collect, test.submit, test.aliases].join(' '));
    if (compact(q) === c && c) return 100;
    if (q === n) return 99;
    if (n.startsWith(q)) return 90;
    if (n.includes(q)) return 75;
    if (aliases.includes(q)) return 65;
    const words = q.split(' ').filter(Boolean);
    if (words.every((word) => text.includes(word))) return 45 + Math.min(words.length, 10);
    if (q.length > 4 && editDistance(compact(q), compact(n)) <= 2) return 30;
    if (words.length === 1 && words[0].length > 4 &&
        n.split(' ').some((w) => editDistance(w, words[0]) <= 1)) return 25;
    return 0;
  }

  function exactMatches(query) {
    const q = compact(query);
    if (!q) return [];
    return records().filter((test) =>
      (test.code && compact(test.code) === q) ||
      compact(test.name) === q ||
      (test.aliases || '').split('|').some((alias) => alias.trim() && compact(alias) === q));
  }

  function makeRows() {
    const q = $('cedarsSearch').value;
    const cat = $('cedarsType').value;
    const showHolds = $('showHolds').checked;
    const rows = records().map((test) => ({test, score: rank(test, q)}))
      .filter(({test, score}) => score && (!cat || test.category === cat) && (showHolds || !test.hold))
      .sort((a, b) => q ? b.score - a.score || a.test.name.localeCompare(b.test.name) :
        a.test.name.localeCompare(b.test.name));
    $('recordCount').textContent = records().filter((t) => !t.hold).length + ' tests';
    $('libraryStatus').textContent = rows.length + ' matching tests · ' +
      records().filter((t) => t.hold).length + ' records requiring verification';
    $('cedarsLibraryBody').innerHTML = rows.map(({test}) =>
      '<tr><td class="code-cell">' + esc(test.code || '—') + '</td>' +
      '<td><div class="test-name">' + esc(test.name) + '</div>' +
      '<div class="subtext cedars-row-source">' + esc(source(test)) + '</div>' +
      (test.hold ? '<span class="cedars-hold">Verify-only</span>' : '') + '</td>' +
      '<td><div class="cedars-specimen-name">' + esc(test.specimen) + '</div>' +
      '<div class="subtext">' + esc(test.collect) + '</div></td>' +
      '<td><span class="badge ' + (isUnknown(test) ? 'temp-unknown' : bagClass(transportBucket(test))) + '">' +
      esc(test.temp || 'Verify') + '</span></td>' +
      '<td class="cedars-volume-unknown">Verify</td>' +
      '<td class="row-actions"><button class="mini-button edit" type="button" data-info="' +
      esc(test.id) + '">Details</button>' +
      (!test.hold ? '<button class="mini-button" type="button" data-add="' + esc(test.id) + '">' +
      (selected.has(test.id) ? '✓ Added' : 'Add') + '</button>' : '') +
      '</td></tr>').join('');
    if (!rows.length) $('cedarsLibraryBody').innerHTML =
      '<tr><td colspan="6" class="cedars-empty">No matches. Check spelling or add a verified manual record.</td></tr>';
  }

  function renderCart() {
    const tests = chosen();
    $('selectedCount').textContent = String(tests.length);
    $('cedarsCartCount').textContent = tests.length + ' tests';
    $('mobileCount').textContent = tests.length + ' tests';
    $('cedarsPrint').disabled = $('cedarsCsv').disabled = !tests.length;
    $('cedarsDetailsToggle').setAttribute('aria-expanded', String(showCartDetails));
    $('cedarsDetailsToggleText').textContent = showCartDetails ? 'Hide details' : 'Show details';
    $('cedarsCart').innerHTML = tests.length ? tests.map((test) =>
      '<article class="cedars-cart-item"><div class="cedars-cart-top">' +
      '<div class="cedars-cart-heading"><strong>' + esc(test.name) +
      '</strong>' + (test.code ? '<small>' + esc(test.code) + '</small>' : '') + '</div>' +
      '<button type="button" class="mini-button remove" data-remove="' + esc(test.id) +
      '" aria-label="Remove ' + esc(test.name) + '">Remove</button></div>' +
      (showCartDetails ? '<div class="cedars-cart-details"><div><b>Collect</b> ' + esc(test.collect) +
        '</div><div><b>Submit</b> ' + esc(test.submit) + '</div><div><b>Transport</b> ' +
        esc(test.temp) + '</div><p>' + esc(test.notes || 'Verify current requirements.') +
        '</p><span class="cedars-source">' + esc(source(test)) + '</span></div>' : '') +
      '</article>').join('') :
      '<div class="cedars-empty">No tests selected.</div>';

    const groups = new Map();
    tests.forEach((test) => {
      const key = test.collect;
      if (!groups.has(key)) groups.set(key, {count:0, tests:[]});
      const row = groups.get(key);
      row.count += Math.max(1, Number(test.qty) || 1);
      row.tests.push(test.name);
    });
    $('cedarsDrawCount').textContent = groups.size ?
      groups.size + ' collection types' : 'No collection types';
    $('cedarsDraw').innerHTML = tests.length ?
      Array.from(groups, ([container, group]) =>
        '<div class="cedars-plan-row"><span class="cedars-count">' + group.count + '×</span>' +
        '<div><strong>' + esc(container) + '</strong><small>' +
        esc(group.tests.join('; ')) + '</small></div></div>').join('') :
      '<div class="cedars-empty">Add tests to view collection containers.</div>';

    const bags = new Map();
    tests.forEach((test) => {
      const key = transportBucket(test);
      if (!bags.has(key)) bags.set(key, []);
      bags.get(key).push(test);
    });
    $('cedarsBagsCount').textContent = bags.size ? bags.size + ' temperature groups' : 'No transport groups';
    $('cedarsBags').innerHTML = tests.length ?
      '<p class="cedars-mini-note">Keep containers separate. Temperature grouping is not permission to combine specimens.</p>' +
      Array.from(bags, ([bucket, items]) =>
        '<div class="cedars-bag"><div class="cedars-bag-header"><span class="badge ' +
        bagClass(bucket) + '">' + esc(bucket) + '</span><span>' + items.length + ' tests</span></div>' +
        items.map((test) => '<div class="cedars-bag-line"><strong>' + esc(test.name) +
          '</strong><small>' + esc(test.submit) + '</small></div>').join('') + '</div>').join('') :
      '<div class="cedars-empty">Add tests to view transport groups.</div>';
  }
  function render() { makeRows(); renderCart(); }

  function add(id) {
    const test = byId(id);
    if (!test || test.hold) return;
    selected.add(id);
    render();
  }
  function detail(id) {
    const test = byId(id);
    if (!test) return;
    $('cedarsInfoTitle').textContent = test.name;
    $('cedarsInfoBody').innerHTML =
      '<div class="cedars-summary-notice"><strong>' +
      (test.hold ? 'Verification required: do not use this record to plan collection.' :
        '2023 reference only: verify the current Cedars/Lexicomp instructions.') +
      '</strong></div>' +
      '<dl>' +
      '<dt>Test code</dt><dd>' + esc(test.code || 'Not supplied') + '</dd>' +
      '<dt>Specimen</dt><dd>' + esc(test.specimen) + '</dd>' +
      '<dt>What to collect</dt><dd>' + esc(test.collect) + '</dd>' +
      '<dt>What to submit</dt><dd>' + esc(test.submit) + '</dd>' +
      '<dt>Transport</dt><dd>' + esc(test.temp) + '</dd>' +
      '<dt>Handling notes</dt><dd>' + esc(test.notes || 'Verify current requirements.') + '</dd>' +
      '<dt>Source</dt><dd>' + esc(source(test)) + '</dd></dl>';
    $('cedarsInfoDialog').showModal();
  }
  function batchLines() {
    return $('batchInput').value.split(/[\n\r]+/).map(clean).filter(Boolean).slice(0, 150);
  }
  function batchAdd(reviewOnly) {
    const lines = batchLines();
    if (!lines.length) { $('batchFeedback').classList.add('hidden'); return; }
    let added = 0;
    const feedback = lines.map((line) => {
      const exact = exactMatches(line).filter((t) => !t.hold);
      if (!reviewOnly && exact.length === 1) {
        selected.add(exact[0].id); added += 1;
        return '<div><strong>' + esc(line) + '</strong> → Added ' + esc(exact[0].name) + '</div>';
      }
      const suggestions = records().map((t) => ({t, s:rank(t, line)}))
        .filter(({s}) => s > 0).sort((a,b) => b.s - a.s).slice(0, 3);
      if (!suggestions.length) return '<div><strong>' + esc(line) + '</strong> → No matches. Verify before manual entry.</div>';
      return '<div><strong>' + esc(line) + '</strong> → ' +
        suggestions.map(({t}) => esc(t.name) + (t.hold ? ' (verify-only)' :
          ' <button type="button" class="mini-button" data-add="' + esc(t.id) + '">Add</button>')).join(' · ') +
        '</div>';
    });
    $('batchFeedback').innerHTML = (reviewOnly ? 'Review suggested matches:' :
      added + ' exact matches added. Review unresolved entries:') + feedback.join('');
    $('batchFeedback').classList.remove('hidden');
    render();
  }

  function csvSafe(value) {
    const s = clean(value);
    const guarded = /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
    return '"' + guarded.replace(/"/g, '""') + '"';
  }
  function saveCsv() {
    const tests = chosen();
    if (!tests.length) return;
    const heads = ['Test code', 'Test', 'Specimen', 'What to collect', 'What to submit', 'Container count (conservative)', 'Transport', 'Special notes', 'Source', 'Verification'];
    const rows = tests.map((t) => [t.code, t.name, t.specimen, t.collect, t.submit, t.qty, t.temp,
      t.notes, source(t), 'Verify in current Cedars/Lexicomp directory']);
    const csv = '\uFEFF' + [heads].concat(rows).map((row) => row.map(csvSafe).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
    const a = document.createElement('a');
    a.href = url; a.download = 'cedars-collection-summary.csv'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function printPlan() {
    const tests = chosen();
    if (!tests.length) return;
    const collection = new Map();
    const transport = new Map();
    tests.forEach((t) => {
      const key = t.collect;
      if (!collection.has(key)) collection.set(key, {qty:0, tests:[]});
      collection.get(key).qty += Math.max(1, Number(t.qty) || 1);
      collection.get(key).tests.push(t);
      const bucket = transportBucket(t);
      if (!transport.has(bucket)) transport.set(bucket, []);
      transport.get(bucket).push(t);
    });
    const collectCards = Array.from(collection, ([container, group]) =>
      '<article class="cedars-print-card"><div class="cedars-print-card-heading"><span class="cedars-print-total">' +
      group.qty + '</span><strong>' + esc(container) + '</strong></div>' +
      '<div class="cedars-print-card-detail">Separate collection sets; no pooling assumed.</div>' +
      '<ul>' + group.tests.map((t) => '<li>' + esc(t.code ? t.code + ' · ' : '') +
      esc(t.name) + '</li>').join('') + '</ul></article>').join('');
    const submitCards = Array.from(transport, ([bucket, items]) =>
      '<article class="cedars-print-card"><div class="cedars-print-card-heading"><span class="badge ' +
      bagClass(bucket) + '">' + esc(bucket) + '</span></div>' +
      '<div class="cedars-print-card-detail">Check the required destination and transport conditions. Do not combine different specimens.</div>' +
      '<ul>' + items.map((t) => '<li><strong>' + esc(t.submit) + '</strong> · ' +
      esc(t.name) + '</li>').join('') + '</ul></article>').join('');
    const rows = tests.map((t) =>
      '<tr><td>' + esc(t.code || '—') + '</td><td><strong>' + esc(t.name) +
      '</strong><div class="cedars-print-source">' + esc(source(t)) +
      '</div></td><td>' + esc(t.specimen) + '</td><td>' + esc(t.collect) +
      '</td><td>' + esc(t.submit) + '</td><td>' + esc(transportBucket(t)) +
      '</td><td>' + esc(t.notes || 'Verify') + '</td></tr>').join('');
    $('cedarsPrintSheet').innerHTML =
      '<div class="print-header"><div><h1 class="print-title">Lab Collection Summary</h1>' +
      '<div class="print-subtitle">Cedars send-out workflow · test build</div></div>' +
      '<div class="print-meta">Generated ' + esc(new Date().toLocaleString()) +
      '<span class="print-selected-count">' + tests.length + ' selected tests</span></div></div>' +
      '<div class="cedars-print-warning"><strong>Current-directory confirmation required.</strong> ' +
      'These entries are from a 2023 reference or manually entered. Confirm each test, collection kit, volume, stability, transport temperature and courier routing in current Cedars/Lexicomp. ' +
      'Unknown temperatures are not assigned to transport bags. No pooling assumed.</div>' +
      '<section class="cedars-print-section"><div class="cedars-print-section-heading"><strong>What to collect</strong><span>' +
      Array.from(collection.values()).reduce((n, group) => n + group.qty, 0) + ' collection containers (conservative)</span></div>' +
      '<div class="cedars-print-grid">' + collectCards + '</div></section>' +
      '<section class="cedars-print-section cedars-print-submit-section"><div class="cedars-print-section-heading"><strong>What to submit after processing</strong><span>' +
      transport.size + ' transport groups · verify before packing</span></div>' +
      '<div class="cedars-print-grid">' + submitCards + '</div></section>' +
      '<section class="cedars-print-detail-section"><h2>Test-specific collection and handling details</h2>' +
      '<table><thead><tr><th>Code</th><th>Test</th><th>Specimen</th><th>Collect</th><th>Submit</th><th>Transport</th><th>Handling / precautions</th></tr></thead><tbody>' +
      rows + '</tbody></table></section>' +
      '<p class="cedars-print-footer">Reference only. No patient identifiers required. Source: Cedars 2023 specimen guide and individually labeled manual entries.</p>';
    window.print();
  }
  function openManual() { $('cedarsManualDialog').showModal(); }
  function closeManual() { $('cedarsManualDialog').close(); }
  function submitManual(event) {
    event.preventDefault();
    const name = clean($('manualName').value);
    const collect = clean($('manualCollect').value);
    const submit = clean($('manualSubmit').value);
    if (!name || !collect || !submit) return;
    const test = {
      id:'cedars-manual-' + (++manualIndex), name, code:clean($('manualCode').value),
      category:$('manualType').value, specimen:clean($('manualSpecimen').value) || $('manualType').value,
      collect, submit, qty:Math.min(20, Math.max(1, Number($('manualQty').value) || 1)),
      temp:$('manualTemp').value, notes:clean($('manualNotes').value) ||
        'Manual record. Confirm all requirements in current Cedars/Lexicomp directory.',
      manual:true, aliases:''
    };
    manual.push(test);
    selected.add(test.id);
    $('cedarsManualForm').reset();
    closeManual();
    render();
  }
  $('cedarsLibraryBody').addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add]');
    const infoButton = event.target.closest('[data-info]');
    if (addButton) add(addButton.dataset.add);
    else if (infoButton) detail(infoButton.dataset.info);
  });
  $('batchFeedback').addEventListener('click', (event) => {
    const button = event.target.closest('[data-add]');
    if (button) add(button.dataset.add);
  });
  $('cedarsCart').addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    selected.delete(button.dataset.remove);
    render();
  });
  $('cedarsSearch').addEventListener('input', makeRows);
  $('cedarsType').addEventListener('change', makeRows);
  const filterButton = $('cedarsFilterButton');
  const filterPanel = $('cedarsFilterPanel');
  const setFilterOpen = (open) => {
    filterPanel.classList.toggle('hidden', !open);
    filterButton.setAttribute('aria-expanded', String(open));
  };
  filterButton.addEventListener('click', () => setFilterOpen(filterPanel.classList.contains('hidden')));
  $('cedarsFilterDone').addEventListener('click', () => setFilterOpen(false));
  $('cedarsFilterReset').addEventListener('click', () => {
    $('cedarsType').value = '';
    $('showHolds').checked = true;
    makeRows();
    setFilterOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#cedarsFilterControl')) setFilterOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setFilterOpen(false);
  });
  $('showHolds').addEventListener('change', makeRows);
  $('batchAdd').addEventListener('click', () => batchAdd(false));
  $('batchReview').addEventListener('click', () => batchAdd(true));
  $('batchClear').addEventListener('click', () => {
    $('batchInput').value = '';
    $('batchFeedback').classList.add('hidden');
    $('batchFeedback').textContent = '';
  });
  $('batchInput').addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') batchAdd(false);
  });
  $('clearCart').addEventListener('click', () => { selected.clear(); render(); });
  $('cedarsCsv').addEventListener('click', saveCsv);
  $('cedarsPrint').addEventListener('click', printPlan);
  $('cedarsInfoClose').addEventListener('click', () => $('cedarsInfoDialog').close());
  $('cedarsInfoDone').addEventListener('click', () => $('cedarsInfoDialog').close());
  $('cedarsDetailsToggle').addEventListener('click', () => { showCartDetails = !showCartDetails; renderCart(); });
  $('manualCartButton').addEventListener('click', openManual);
  $('manualButton').addEventListener('click', openManual);
  $('manualClose').addEventListener('click', closeManual);
  $('manualCancel').addEventListener('click', closeManual);
  $('cedarsManualForm').addEventListener('submit', submitManual);
  render();
})();
