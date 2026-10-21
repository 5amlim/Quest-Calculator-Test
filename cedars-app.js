/* Cedars test-site prototype. Browser state uses a separate key from Quest. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const published = Array.isArray(window.CEDARS_TESTS) ? window.CEDARS_TESTS : [];
  const STORAGE_KEY = 'cedarsCollectionCalculator.state.v1';
  const manual = [];
  const selected = new Set();
  let manualIndex = 0;
  let showCartDetails = false;
  let selectedContainer = '';
  const byId = (id) => published.concat(manual).find((t) => t.id === id);
  const clean = (value) => String(value == null ? '' : value).trim();
  const esc = (value) => clean(value).replace(/[&<>"']/g, (ch) =>
    ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const norm = (value) => clean(value).toLowerCase().normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const compact = (value) => norm(value).replace(/\s/g, '');
  const records = () => published.concat(manual);
  const chosen = () => Array.from(selected).map(byId).filter(Boolean);
  const source = (test) => test.sourceNote || (test.manual ? 'Previously added manual entry (not approved)' : 'Cedars 2023 guide, slide ' + test.slide);
  const isUnknown = (t) => !t.temp || t.temp === 'Verify' || t.temp === 'Room / Refrigerated';
  const transportBucket = (test) => {
    if (test.temp === 'Room Temperature (deliver immediately)') return 'Room temperature · deliver immediately';
    if (test.temp === 'Room Temperature (refrigerate if delayed)') return 'Room temperature · refrigerate if delayed';
    if (test.temp === 'Room Temperature') return 'Room temperature';
    if (test.temp === 'Refrigerated') return 'Refrigerated';
    if (test.temp === 'Frozen') return 'Frozen';
    if (test.temp === 'Room / Refrigerated') return 'Room or refrigerated: select after confirming stability';
    return 'Transport temperature: verify in current directory';
  };
  const bagClass = (bucket) => bucket.includes('refrigerate if delayed') ? 'temp-delay' :
    bucket.includes('deliver immediately') ? 'temp-urgent' :
    bucket === 'Refrigerated' ? 'temp-refrigerated' :
    bucket === 'Frozen' ? 'temp-frozen' : bucket === 'Room temperature' ? 'temp-room' : 'temp-unknown';
  const containerArt = (container, size) => typeof window.CEDARS_CONTAINER_ART === 'function'
    ? window.CEDARS_CONTAINER_ART(container, size) : '';

  // Cropped source photos uploaded by the workflow owner. The 4×3 atlas is
  // packaged in this test repo; no third-party image hotlinks or credentials.
  const photoCatalog = {
    adult:      {col:0,row:0,label:'BD BACTEC adult aerobic and anaerobic culture bottle set'},
    peds:       {col:1,row:0,label:'BD BACTEC pediatric culture bottle'},
    fungal:     {col:2,row:0,label:'BD BACTEC Myco/F Lytic fungal blood culture bottle'},
    eswab:      {col:3,row:0,label:'White-top BD eSwab culture tube'},
    utm:        {col:0,row:1,label:'Red-top UTM viral transport medium tube'},
    cobasUrine: {col:1,row:1,label:'cobas PCR urine collection kit with transfer pipette'},
    cobasSwab:  {col:2,row:1,label:'cobas PCR Media Dual Swab kit'},
    affirm:     {col:3,row:1,label:'BD Affirm VPIII / ATTS swab kit'},
    urine:      {col:0,row:2,label:'Gray-top urine culture preservative tube'},
    parapak:    {col:1,row:2,label:'ParaPak three-vial stool collection set'},
    ua:         {col:2,row:2,label:'Red and yellow swirl-top urinalysis preservative tube'},
    cleanStool: {col:1,row:2,label:'Three-vial ParaPak kit, including clean stool vial'},
    formalin:   {col:1,row:2,label:'Three-vial ParaPak kit, including 10% formalin vial'}
  };
  const photoReference = (container) => {
    const key = typeof window.CEDARS_CONTAINER_KIND === 'function'
      ? window.CEDARS_CONTAINER_KIND(container) : 'unknown';
    return photoCatalog[key] ? {key, ...photoCatalog[key]} : null;
  };
  const photoArt = (container, size) => {
    const illustration = containerArt(container, size);
    const photo = photoReference(container);
    if (!photo) return illustration;
    const camera = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"' +
      ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"' +
      ' stroke-linejoin="round"><path d="M4 7h4l2-3h4l2 3h4v12H4z"/>' +
      '<circle cx="12" cy="13" r="3.3"/></svg>';
    return '<button type="button" class="cedars-photo-trigger"' +
      ' data-photo-key="' + esc(photo.key) + '" aria-haspopup="dialog"' +
      ' aria-label="' + esc('View actual photo: ' + photo.label) + '"' +
      ' title="' + esc('View actual photo: ' + photo.label) + '">' +
      illustration + '<span class="cedars-photo-chip" aria-hidden="true">' +
      camera + '</span></button>';
  };
  function openPhoto(key) {
    const photo = photoCatalog[key];
    if (!photo) return;
    const dialog = $('cedarsPhotoDialog');
    const viewport = $('cedarsPhotoViewport');
    const offsets = {'--photo-left':(-100 * photo.col) + '%',
      '--photo-top':(-100 * photo.row) + '%'};
    Object.entries(offsets).forEach(([name,value]) => viewport.style.setProperty(name,value));
    viewport.setAttribute('aria-label','Actual reference photo: ' + photo.label);
    $('cedarsPhotoTitle').textContent = photo.label;
    $('cedarsPhotoCaption').textContent = photo.label;
    if (!dialog.open) dialog.showModal();
  }
  function closePhoto() {
    const dialog = $('cedarsPhotoDialog');
    if (dialog.open) dialog.close();
  }


  // The Quest calculator uses its own storage keys. Cedars restores its cart
  // and browser-created test records without ever accessing Quest state.
  function storageMessage(saved) {
    const status = $('cedarsStorageStatus');
    if (status) status.textContent = saved
      ? 'Cart and manually added tests are saved in this browser.'
      : 'Browser storage is unavailable. Your cart may clear after refreshing.';
  }
  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 1,
        customTests: manual,
        selectedIds: Array.from(selected)
      }));
      storageMessage(true);
      return true;
    } catch (error) {
      console.warn('Cedars cart could not be saved in this browser.', error);
      storageMessage(false);
      return false;
    }
  }
  function restoreState() {
    let state;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      state = raw ? JSON.parse(raw) : null;
      storageMessage(true);
    } catch (error) {
      console.warn('Cedars saved cart could not be read.', error);
      storageMessage(false);
      return;
    }
    if (!state || state.version !== 1 || typeof state !== 'object') return;

    const knownManual = new Set();
    const types = ['Blood','Urine','Stool','Swab','Other'];
    const temperatures = ['Verify','Room Temperature','Refrigerated','Frozen','Room / Refrigerated'];
    const field = (value, max) => clean(typeof value === 'string' ? value : '').slice(0, max);
    const storedManual = Array.isArray(state.customTests) ? state.customTests : [];
    for (const record of storedManual.slice(0, 250)) {
      if (!record || typeof record !== 'object' || record.manual !== true) continue;
      const id = field(record.id, 40);
      if (!/^cedars-manual-[1-9][0-9]{0,8}$/.test(id) || knownManual.has(id)) continue;
      const name = field(record.name,150);
      const collect = field(record.collect,180);
      const submit = field(record.submit,180);
      if (!name || !collect || !submit) continue;
      const number = Number(id.slice('cedars-manual-'.length));
      manualIndex = Math.max(manualIndex, number);
      knownManual.add(id);
      manual.push({
        id, name, collect, submit, manual: true, hold: true, blockReason: 'Not performed at Sollis',
        code: field(record.code,40),
        category: types.includes(record.category) ? record.category : 'Other',
        specimen: field(record.specimen,120) || 'Verify',
        qty: Math.min(20, Math.max(1, Number(record.qty) || 1)),
        temp: temperatures.includes(record.temp) ? record.temp : 'Verify',
        notes: field(record.notes,1200) || 'Manual record. Confirm requirements in current Cedars/Lexicomp directory.',
        aliases: ''
      });
    }

    const validIds = new Set(published.filter(test => !test.hold).map(test => test.id));
    // Previous manual records remain in the Do Not Perform reference list.
    // Neither legacy manual records nor former selectable built-ins can be restored.
    const savedIds = Array.isArray(state.selectedIds) ? state.selectedIds : [];
    const hasDisallowed = savedIds.some(id => typeof id === 'string' && !validIds.has(id));
    const ids = savedIds;
    for (const id of ids.slice(0, 2000)) {
      if (typeof id === 'string' && validIds.has(id)) selected.add(id);
    }
    if (hasDisallowed) saveState();
  }

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
    const text = norm([test.name, test.code, test.secondaryCode, test.specimen, test.collect, test.submit, test.aliases, test.containerType].join(' '));
    if (compact(q) === c && c) return 100;
    if (test.secondaryCode && compact(q) === compact(test.secondaryCode)) return 100;
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
      (test.secondaryCode && compact(test.secondaryCode) === q) ||
      compact(test.name) === q ||
      (test.aliases || '').split('|').some((alias) => alias.trim() && compact(alias) === q));
  }

  // Use a closed set of specimen classes so dynamic data cannot become CSS.
  const specimenClass = (category) => {
    const value = String(category || '').toLowerCase();
    return ['swab','urine','stool','blood','other'].includes(value)
      ? 'type-' + value : 'type-other';
  };
  // Show the actual test identity, collection and transport instead of
  // a bare name in search suggestions and bulk-match review.
  const testCodes = (test) => [test.code, test.secondaryCode].filter(Boolean).join(' · ');
  function matchChoice(test) {
    const codes = testCodes(test);
    return '<div class="cedars-match-choice ' + specimenClass(test.category) + '">' +
      '<div class="cedars-match-info"><strong class="cedars-match-title">' + esc(test.name) + '</strong>' +
      '<div class="cedars-match-meta">' +
      (codes ? '<span class="cedars-match-code">' + esc(codes) + '</span>' : '') +
      '<span>' + esc(test.category) + ': ' + esc(test.specimen) + '</span>' +
      '<span>Collect: ' + esc(test.collect) + '</span>' +
      '<span>Transport: ' + esc(test.temp || 'Verify') + '</span></div></div>' +
      '<div class="cedars-match-actions"><button type="button" class="mini-button edit" data-info="' +
      esc(test.id) + '">Details</button>' +
      (test.hold ? '<span class="cedars-match-held">Verification required</span>' :
        '<button type="button" class="mini-button" data-add="' + esc(test.id) + '">' +
        (selected.has(test.id) ? '✓ Added' : 'Add') + '</button>') +
      '</div></div>';
  }
  function renderSearchSuggestions(rows, query) {
    const panel = $('cedarsSearchSuggestions');
    if (!clean(query)) {
      panel.innerHTML = '';
      panel.classList.add('hidden');
      return;
    }
    const best = rows.filter(({test}) => !test.hold)
      .sort((a,b) => b.score - a.score || a.test.name.localeCompare(b.test.name))
      .slice(0,3);
    panel.innerHTML = '<div class="cedars-match-heading"><strong>Top matches</strong><span>' +
      esc(String(rows.length)) + ' matching test' + (rows.length===1 ? '' : 's') +
      ' · More results in the directory below</span></div>' +
      (best.length ? best.map(({test}) => matchChoice(test)).join('') :
        '<p class="cedars-no-matches">No selectable matches. Try a code, abbreviation, specimen or collection container.</p>');
    panel.classList.remove('hidden');
  }

  function makeRows() {
    const q = $('cedarsSearch').value;
    const cat = $('cedarsType').value;
    const showHolds = $('showHolds').checked;
    const rows = records().map((test) => ({test, score: rank(test, q)}))
      .filter(({test, score}) => score && (!cat || test.category === cat) &&
        (!selectedContainer || test.containerType === selectedContainer) && (showHolds || !test.hold))
      .sort((a, b) => {
        const specimenOrder = {Swab: 0, Urine: 1, Stool: 2, Blood: 3, Other: 4};
        const aOrder = specimenOrder[a.test.category] ?? 99;
        const bOrder = specimenOrder[b.test.category] ?? 99;
        if (aOrder !== bOrder) return aOrder - bOrder;
        const byTest = a.test.name.localeCompare(b.test.name);
        if (byTest) return byTest;
        return (a.test.collect || '').localeCompare(b.test.collect || '');
      });
    renderSearchSuggestions(rows, q);
    $('recordCount').textContent = records().filter((t) => !t.hold).length + ' tests';
    $('libraryStatus').textContent = rows.length + ' matching tests' +
      (selectedContainer ? ' · container: ' + selectedContainer : '') + ' · ' +
      records().filter((t) => t.hold).length + ' restricted / needs verification';
    $('cedarsLibraryBody').innerHTML = rows.map(({test}, index) => {
      const heading = index === 0 || rows[index - 1].test.category !== test.category
        ? '<tr class="cedars-specimen-heading ' + specimenClass(test.category) + '"><td colspan="6">' + esc(test.category) + ' specimens</td></tr>'
        : '';
      return heading + '<tr class="cedars-test-row ' + specimenClass(test.category) + '"><td class="code-cell">' + esc(test.code || '—') + '</td>' +
      '<td><div class="test-name">' + esc(test.name) + '</div>' +
      (test.secondaryCode ? '<div class="cedars-secondary-code">Cedars code: ' + esc(test.secondaryCode) + '</div>' : '') +
      '<div class="subtext cedars-row-source">' + esc(source(test)) + '</div>' +
      (test.hold ? '<span class="cedars-hold">' + esc(test.blockReason || 'Not performed at Sollis') + '</span>' : '') + '</td>' +
      '<td><div class="cedars-container-cell">' + photoArt(test.collect, 'table') +
      '<div class="cedars-container-copy"><div class="cedars-specimen-name">' + esc(test.specimen) + '</div>' +
      '<div class="subtext">' + esc(test.collect) + '</div></div></div></td>' +
      '<td><span class="badge ' + (isUnknown(test) ? 'temp-unknown' : bagClass(transportBucket(test))) + '">' +
      esc(test.temp || 'Verify') + '</span></td>' +
      '<td class="cedars-volume-unknown">' + esc(test.volumeDisplay || 'Verify') + '</td>' +
      '<td class="row-actions"><button class="mini-button edit" type="button" data-info="' +
      esc(test.id) + '">Details</button>' +
      (!test.hold ? '<button class="mini-button" type="button" data-add="' + esc(test.id) + '">' +
      (selected.has(test.id) ? '✓ Added' : 'Add') + '</button>' : '') +
      '</td></tr>';
    }).join('');
    if (!rows.length) $('cedarsLibraryBody').innerHTML =
      '<tr><td colspan="6" class="cedars-empty">No matching tests. See Do Not Perform or contact Sam about new workflows.</td></tr>';
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
      '<article class="cedars-cart-item ' + specimenClass(test.category) + '"><div class="cedars-cart-top">' +
      '<div class="cedars-cart-heading"><strong>' + esc(test.name) +
      '</strong>' + (test.code ? '<small>' + esc(test.code) + '</small>' : '') + '</div>' +
      '<button type="button" class="mini-button remove" data-remove="' + esc(test.id) +
      '" aria-label="Remove ' + esc(test.name) + '">Remove</button></div>' +
      (showCartDetails ? '<div class="cedars-cart-details"><div class="cedars-cart-art-row">' +
        photoArt(test.collect, 'small') + '<div><b>Collect</b> ' + esc(test.collect) + '</div></div>' +
        '</div><div><b>Submit</b> ' + esc(test.submit) + '</div><div><b>Transport</b> ' +
        esc(test.temp) + '</div><p>' + esc(test.notes || 'Verify current requirements.') +
        '</p><span class="cedars-source">' + esc(source(test)) + '</span></div>' : '') +
      '</article>').join('') :
      '<div class="cedars-empty">No tests selected.</div>';

    const groups = new Map();
    tests.forEach((test) => {
      const key = test.collect;
      if (!groups.has(key)) groups.set(key, {count:0, tests:[], category:test.category});
      const row = groups.get(key);
      row.count += Math.max(1, Number(test.qty) || 1);
      row.tests.push(test.name);
      if (row.category !== test.category) row.category = 'Other';
    });
    $('cedarsDrawCount').textContent = groups.size ?
      groups.size + ' collection types' : 'No collection types';
    $('cedarsDraw').innerHTML = tests.length ?
      Array.from(groups, ([container, group]) =>
        '<div class="cedars-plan-row ' + specimenClass(group.category) + '"><span class="cedars-count">' + group.count + '×</span>' +
        photoArt(container, 'card') +
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
        items.map((test) => '<div class="cedars-bag-line ' + specimenClass(test.category) + '">' +
          photoArt(test.submit, 'card') +
          '<div><strong>' + esc(test.name) +
          '</strong><small>' + esc(test.submit) + '</small></div></div>').join('') + '</div>').join('') :
      '<div class="cedars-empty">Add tests to view transport groups.</div>';
  }
  function renderContainerFilters() {
    const counts = new Map();
    records().filter(test => !test.hold).forEach(test => {
      const container = test.containerType || 'Other / verify';
      counts.set(container, (counts.get(container) || 0) + 1);
    });
    const order = ['eSwab','UTM','cobas urine','cobas swab','Affirm / ATTS',
      'Gray-top urine culture','UA swirl-top','3-vial ParaPak','Clean stool vial',
      'Adult blood culture','Pediatric blood culture','Myco/F Lytic',
      'Sterile container','QuantiFERON 4-tube','Aptima','FIT bottle','SurePath','Other / verify'];
    const sorted = Array.from(counts).sort(([a],[b]) =>
      order.indexOf(a) - order.indexOf(b) || a.localeCompare(b));
    const entry = (container, count) => {
      const photo = photoReference(container);
      const photoButton = photo
        ? '<button type="button" class="cedars-filter-photo-button" data-photo-key="' +
          esc(photo.key) + '" aria-haspopup="dialog" aria-label="' +
          esc('View actual photo: ' + photo.label) + '" title="' +
          esc('View actual photo: ' + photo.label) +
          '"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none"' +
          ' stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M4 7h4l2-3h4l2 3h4v12H4z"/>' +
          '<circle cx="12" cy="13" r="3.3"/></svg></button>' : '';
      return '<div class="cedars-container-filter-item' + (photo ? ' has-reference-photo' : '') + '">' +
        '<button type="button" class="cedars-container-filter-option' +
        (selectedContainer === container ? ' is-selected' : '') +
        '" data-container="' + esc(container) + '" aria-pressed="' +
        (selectedContainer === container ? 'true' : 'false') + '">' +
        (container ? containerArt(container, 'small') : '<span class="cedars-container-filter-all">All</span>') +
        '<span class="cedars-container-filter-copy"><strong>' +
        esc(container || 'All containers') + '</strong><small>' + count +
        (count === 1 ? ' test' : ' tests') + '</small></span></button>' +
        photoButton + '</div>';
    };
    $('cedarsContainerFilters').innerHTML =
      entry('',records().filter(t => !t.hold).length) +
      sorted.map(([key,count]) => entry(key,count)).join('');
  }
  function renderBlockedList() {
    const items = records().filter(test => test.hold).sort((a,b) => a.name.localeCompare(b.name));
    $('cedarsBlockedButton').textContent = 'Do Not Perform list (' + items.length + ')';
    $('cedarsBlockedList').innerHTML = items.map(test =>
      '<div class="cedars-blocked-item"><div class="cedars-blocked-item-info"><strong>' +
      esc(test.name) + '</strong><small>' + esc(test.code || 'Code not listed') +
      ' · ' + esc(test.blockReason || 'Not performed at Sollis') + '</small></div>' +
      '<button type="button" class="mini-button edit" data-info="' + esc(test.id) +
      '">Details</button></div>').join('');
  }
  function render() { makeRows(); renderContainerFilters(); renderBlockedList(); renderCart(); }

  function add(id) {
    const test = byId(id);
    if (!test || test.hold) return;
    selected.add(id);
    saveState();
    render();
  }
  function detail(id) {
    const test = byId(id);
    if (!test) return;
    $('cedarsInfoTitle').textContent = test.name;
    $('cedarsInfoBody').innerHTML =
      '<div class="cedars-info-illustrations">' +
      '<div>' + photoArt(test.collect, 'detail') + '<span>Collection container</span></div>' +
      '<div>' + photoArt(test.submit, 'detail') + '<span>Submission container</span></div>' +
      '</div>' +
      '<p class="cedars-illustration-note">Color-matched illustration based on supplied kit photos. Verify the actual manufacturer container before collecting.</p>' +
      '<div class="cedars-summary-notice"><strong>' +
      (test.hold ? esc(test.blockReason || 'Not performed at Sollis') + '. Do not collect or submit until the workflow is approved.' :
        '2023 reference only: verify the current Cedars/Lexicomp instructions.') +
      '</strong></div>' +
      '<dl>' +
      '<dt>Test code</dt><dd>' + esc([test.code, test.secondaryCode].filter(Boolean).join(' / ') || 'Not supplied') + '</dd>' +
      '<dt>Specimen</dt><dd>' + esc(test.specimen) + '</dd>' +
      '<dt>Volume</dt><dd>' + esc(test.volumeDisplay || 'Verify current requirements') + '</dd>' +
      '<dt>What to collect</dt><dd>' + esc(test.collect) + '</dd>' +
      '<dt>Container filter</dt><dd>' + esc(test.containerType || 'Verify') + '</dd>' +
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
        selected.add(exact[0].id);
        added += 1;
        return '<div class="cedars-match-result"><strong>' + esc(line) + '</strong>' +
          '<span class="cedars-match-success">Added ' + esc(exact[0].name) + '</span></div>';
      }
      const suggestions = records().map((t) => ({t,score:rank(t,line)}))
        .filter(({score}) => score > 0).sort((a,b)=>b.score-a.score)
        .slice(0,4);
      if (!suggestions.length) return '<div class="cedars-match-result"><strong>' + esc(line) +
        '</strong><p>No match found. Confirm the test in the current Cedars directory or contact Sam.</p></div>';
      return '<div class="cedars-match-result"><div class="cedars-match-query">Search: <strong>' +
        esc(line) + '</strong> <span>Choose the correct test and container</span></div>' +
        '<div class="cedars-match-list">' + suggestions.map(({t})=>matchChoice(t)).join('') + '</div></div>';
    });
    $('batchFeedback').innerHTML = '<div class="cedars-match-heading"><strong>' +
      (reviewOnly ? 'Review suggested matches' : 'Batch search results') + '</strong>' +
      '<span>' + lines.length + ' search entr' + (lines.length===1?'y':'ies') +
      (added ? ' · ' + added + ' added' : '') + '</span></div>' + feedback.join('');
    $('batchFeedback').classList.remove('hidden');
    if (added) saveState();
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
    const rows = tests.map((t) => [[t.code,t.secondaryCode].filter(Boolean).join(' / '), t.name, t.specimen, t.collect, t.submit, t.qty, t.temp,
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

    // The Cedars 2023 reference often lacks verified tube volumes or shipping
    // temperatures. Counts are additive per test; never silently pool specimens.
    const collection = new Map();
    const transport = new Map();
    tests.forEach((test) => {
      if (!collection.has(test.collect)) collection.set(test.collect, []);
      collection.get(test.collect).push(test);
      const bucket = transportBucket(test);
      if (!transport.has(bucket)) transport.set(bucket, []);
      transport.get(bucket).push(test);
    });
    const countFor = (test) => Math.max(1, Number(test.qty) || 1);
    const testTag = (test) =>
      '<strong>' + esc(test.name) + '</strong>' +
      (test.code ? '<span class="cedars-print-test-code">' + esc(test.code) + '</span>' : '');
    const collectionCards = Array.from(collection, ([container, group]) => {
      const quantity = group.reduce((sum, test) => sum + countFor(test), 0);
      return '<article class="cedars-print-card cedars-print-collection-card">' +
        '<div class="cedars-print-card-heading"><span class="cedars-print-total">' + quantity +
        '</span>' + containerArt(container, 'print') +
        '<div class="cedars-print-card-name"><strong>' + esc(container) +
        '</strong><small>Separate collections; no pooling</small></div></div>' +
        '<div class="cedars-print-for-tests">For ' + group.length +
        (group.length === 1 ? ' test' : ' tests') + '</div>' +
        '<ul class="cedars-print-test-list">' +
        group.map((test) => '<li>' + testTag(test) +
          (countFor(test)>1 ? '<span class="cedars-print-count-note">' + countFor(test) + ' containers</span>' : '') +
          '</li>').join('') + '</ul></article>';
    }).join('');

    // Keep unknown and choice-of-temperature specimens OUT of a shipping bag
    // assignment. The visual groups are verification queues, not bag labels.
    const sortedTransport = Array.from(transport.entries()).sort(([a],[b]) => {
      const order = (str) => str.includes('deliver immediately') ? 0 :
        str.includes('refrigerate if delayed') ? 1 :
        str === 'Room temperature' ? 1 : str === 'Refrigerated' ? 2 :
        str === 'Frozen' ? 3 : str.startsWith('Room or') ? 4 : 5;
      return order(a) - order(b);
    });
    const pendingCount = sortedTransport.filter(([bucket]) =>
      bucket.startsWith('Transport temperature:') || bucket.startsWith('Room or')).length;
    const transportCards = sortedTransport.map(([bucket, group]) => {
      const pending = bucket.startsWith('Transport temperature:') || bucket.startsWith('Room or');
      const name = pending ?
        (bucket.startsWith('Room or') ? 'Transport choice needs confirmation' : 'Transport temperature not specified') :
        bucket;
      const byContainer = new Map();
      group.forEach((test) => {
        if (!byContainer.has(test.submit)) byContainer.set(test.submit, []);
        byContainer.get(test.submit).push(test);
      });
      return '<article class="cedars-print-card cedars-print-submit-card' +
        (pending ? ' is-unverified' : '') + '">' +
        '<div class="cedars-print-card-heading">' +
          '<span class="cedars-print-transport-pill ' + (pending ? 'pending' : 'known') + '">' +
            esc(name) + '</span>' +
          '<span class="cedars-print-group-count">' + group.length +
            (group.length===1 ? ' test' : ' tests') + '</span>' +
        '</div>' +
        (pending ?
          '<p class="cedars-print-pending-note">Do not assign to a transport bag until the current directory confirms requirements.</p>' :
          '<p class="cedars-print-pending-note">Temperature listed in the record. Reconfirm with current Cedars requirements before packing.</p>') +
        Array.from(byContainer, ([container, items]) =>
          '<div class="cedars-print-submit-item"><div class="cedars-print-submit-line">' +
          containerArt(container, 'print') + '<strong>' + esc(container) + '</strong></div>' +
          '<ul class="cedars-print-test-list">' +
          items.map(test => '<li>' + testTag(test) + '</li>').join('') +
          '</ul></div>').join('') +
        '</article>';
    }).join('');

    // Keep all source-specific directions available, but away from the main
    // collection/transport cards to reduce repeated instructions and clutter.
    const isPrecaution = (test) => /\b(fill|first[- ]morning|immediately|shake|avoid|reject\w*|discard|prime|do not|no swabs|no diapers)\b/i.test(test.notes || '');
    const noteCard = (test) =>
      '<article class="cedars-print-handling-item"><div class="cedars-print-handling-head">' +
      testTag(test) + '</div><p>' + esc(test.notes) + '</p><small>' +
      esc(source(test)) + '</small></article>';
    // Collection-critical notes come first, without duplicating them later.
    const precautionCards = tests.filter(test => clean(test.notes) && isPrecaution(test))
      .map(noteCard).join('');
    const handlingCards = tests.filter(test => clean(test.notes) && !isPrecaution(test))
      .map(noteCard).join('');

    const totalContainers = tests.reduce((sum,test) => sum + countFor(test), 0);
    $('cedarsPrintSheet').innerHTML =
      '<header class="cedars-print-header"><div><h1>Lab Collection Summary</h1>' +
        '<p>Cedars send-outs · Collection and transport plan</p></div>' +
        '<div class="cedars-print-meta"><span>' + esc(new Date().toLocaleString()) + '</span>' +
        '<strong>' + tests.length + (tests.length===1 ? ' test' : ' tests') + '</strong></div></header>' +
      (precautionCards ? '<section class="cedars-print-precautions">' +
        '<div class="cedars-print-precautions-title"><strong>Check before collection</strong>' +
        '<span>Source-specific requirements that can affect specimen acceptance</span></div>' +
        '<div class="cedars-print-handling-grid">' + precautionCards + '</div></section>' : '') +
      '<section class="cedars-print-section"><div class="cedars-print-section-heading">' +
        '<div><strong>1. What to collect</strong><small>Collection containers, grouped by type</small></div>' +
        '<span>' + totalContainers + ' total containers</span></div>' +
        '<div class="cedars-print-grid">' + collectionCards + '</div></section>' +
      '<section class="cedars-print-section' +
        (collection.size > 4 ? ' cedars-print-start-page' : '') + '">' +
        '<div class="cedars-print-section-heading"><div><strong>2. What to submit</strong>' +
          '<small>Transport containers, organized by temperature status</small></div>' +
          '<span>' + transport.size + ' groups' +
          (pendingCount ? ' · ' + pendingCount + ' pending' : '') + '</span></div>' +
        '<div class="cedars-print-grid">' + transportCards + '</div>' +
        '<p class="cedars-print-section-note">These are planning groups, not pre-approved bags. ' +
          'Do not combine specimens or assign unverified temperatures.</p></section>' +
      (handlingCards ? '<section class="cedars-print-section cedars-print-handling-section">' +
        '<div class="cedars-print-section-heading"><div><strong>3. Additional handling notes</strong>' +
        '<small>Test-specific instructions from the listed source</small></div></div>' +
        '<div class="cedars-print-handling-grid">' + handlingCards + '</div></section>' : '') +
      '<footer class="cedars-print-footer">For planning only. Check the current Cedars/Lexicomp directory and local SOP. ' +
        'Unknown volumes and temperatures are intentionally not filled in. No patient identifiers required.</footer>';
    window.print();
  }
  // Manual entry cannot bypass the published Sollis-performed menu.
  function openManual() { return; }
  function closeManual() { $('cedarsManualDialog').close(); }
  function submitManual(event) {
    event.preventDefault();
    return; // Manual additions require an approved catalog update.
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
    saveState();
    $('cedarsManualForm').reset();
    closeManual();
    render();
  }
  $('cedarsBlockedButton').addEventListener('click', () => {
    const panel = $('cedarsBlockedPanel');
    const open = panel.classList.contains('hidden');
    panel.classList.toggle('hidden', !open);
    $('cedarsBlockedButton').setAttribute('aria-expanded', String(open));
  });
  $('cedarsBlockedList').addEventListener('click', (event) => {
    const button = event.target.closest('[data-info]');
    if (button) detail(button.dataset.info);
  });
  $('cedarsLibraryBody').addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add]');
    const infoButton = event.target.closest('[data-info]');
    if (addButton) add(addButton.dataset.add);
    else if (infoButton) detail(infoButton.dataset.info);
  });
  const handleMatchAction = (event) => {
    const addButton = event.target.closest('[data-add]');
    const detailButton = event.target.closest('[data-info]');
    if (addButton) add(addButton.dataset.add);
    else if (detailButton) detail(detailButton.dataset.info);
  };
  $('batchFeedback').addEventListener('click', handleMatchAction);
  $('cedarsSearchSuggestions').addEventListener('click', handleMatchAction);
  $('cedarsCart').addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    selected.delete(button.dataset.remove);
    saveState();
    render();
  });
  $('cedarsSearch').addEventListener('input', makeRows);
  $('cedarsType').addEventListener('change', makeRows);
  $('cedarsContainerFilters').addEventListener('click', (event) => {
    const choice = event.target.closest('[data-container]');
    if (!choice) return;
    selectedContainer = choice.dataset.container || '';
    makeRows();
    renderContainerFilters();
  });
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
    $('showHolds').checked = false;
    selectedContainer = '';
    render();
    setFilterOpen(false);
  });
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-photo-key]');
    if (trigger) {
      event.preventDefault();
      openPhoto(trigger.dataset.photoKey);
    }
    if (event.target === $('cedarsPhotoDialog')) closePhoto();
    if (!event.target.closest('#cedarsFilterControl')) setFilterOpen(false);
  });
  $('cedarsPhotoClose').addEventListener('click', closePhoto);
  $('cedarsPhotoDone').addEventListener('click', closePhoto);
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
  $('clearCart').addEventListener('click', () => { selected.clear(); saveState(); render(); });
  $('cedarsCsv').addEventListener('click', saveCsv);
  $('cedarsPrint').addEventListener('click', printPlan);
  $('cedarsInfoClose').addEventListener('click', () => $('cedarsInfoDialog').close());
  $('cedarsInfoDone').addEventListener('click', () => $('cedarsInfoDialog').close());
  $('cedarsDetailsToggle').addEventListener('click', () => { showCartDetails = !showCartDetails; renderCart(); });
  $('manualClose').addEventListener('click', closeManual);
  $('manualCancel').addEventListener('click', closeManual);
  $('cedarsManualForm').addEventListener('submit', submitManual);
  restoreState();
  render();
})();
