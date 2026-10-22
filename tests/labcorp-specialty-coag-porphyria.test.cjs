const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const batch = 'labcorp-specialty-coag-porphyria-20261022.js';
const html = read('labcorp.html');
const included = [...html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"/g)].map(m => m[1]);
assert(included.indexOf(batch) >= 0 && included.indexOf(batch) < included.indexOf('labcorp-app.js'),
  'New data must load before Labcorp calculator app');
const codes = [
  '123225','003065','003103','007364','096354','117140','144012',
  '550672','164519','004648','120220','500033','164517','015057',
  '015594','080465','283655','086298','086314','086322','520085',
  '164530','015045'
];
const makeContext = mode => vm.createContext({
  window: { SEED_TESTS: [] },
  document: { getElementById: () => null, querySelectorAll: () => [] },
  localStorage: {
    getItem: key => key.includes('sstMode') ? mode : null,
    setItem: () => {},
    removeItem: () => {}
  },
  console
});
for (const mode of ['gold', 'tiger']) {
  const ctx = makeContext(mode);
  vm.runInContext(read(batch), ctx, { filename: batch });
  const raws = ctx.window.SEED_TESTS;
  assert.equal(raws.length, codes.length);
  assert.equal(new Set(raws.map(t => t.testCode)).size, raws.length, 'No duplicate order codes');
  assert(codes.every(c => raws.some(t => t.testCode === c)), 'Missing test code');
  vm.runInContext(read(batch), ctx, { filename: batch });
  assert.equal(ctx.window.SEED_TESTS.length, codes.length, 'Repeated script load must be idempotent');
  const app = read('labcorp-app.js').replace('  init();',
    '  window.api = { normalizeRecord, buildTransportBagPlan, buildCollectionPlan, menuContainerBadges };');
  vm.runInContext(app, ctx, { filename: 'labcorp-app.js' });
  const api = ctx.window.api;
  const normalized = raws.map(t => api.normalizeRecord(t));
  const byCode = code => normalized.find(t => t.testCode === code);
  for (const t of normalized) {
    assert.match(t.source, new RegExp('/tests/' + t.testCode + '/'));
    assert(t.preferredVolume && t.transportContainer && t.drawContainer && t.specialInstructions);
    const bags = api.buildTransportBagPlan([t]);
    const plan = api.buildCollectionPlan([t], bags);
    assert(bags.length && plan.length && api.menuContainerBadges(t),
      t.testCode + ' requires valid transport and collection instructions');
    if (t.transportTemperature === 'Frozen')
      assert(bags.some(b => b.key.includes('frozen')), t.testCode + ' must ship frozen');
  }
  assert.match(byCode('003065').specialInstructions, /below 6/);
  assert.match(byCode('550672').specialInstructions, /144012/);
  assert.match(byCode('003103').drawContainer, /24-Hour/);
  assert.equal(byCode('283655').collectionCount, 2);
  assert.equal(byCode('283655').submissionCount, 2);
  const two = byCode('283655');
  assert(api.buildCollectionPlan([two], api.buildTransportBagPlan([two]))
    .some(card => card.count >= 2), 'Protein C deficiency profile requires two source tubes');
  for (const [code, count] of (mode === 'gold'
    ? [['123225', 2], ['520085', 2]]
    : [['123225', 1], ['520085', 2]])) {
    const test = byCode(code);
    const plan = api.buildCollectionPlan([test], api.buildTransportBagPlan([test]));
    assert.equal(plan.find(card => /sst|gold|tiger/i.test(card.label))?.count, count,
      'High-yield serum assay ' + code + ', SST mode ' + mode);
  }
  const regular = api.normalizeRecord({
    id:'single',testCode:'999999',testName:'one-test safeguard',
    specimenType:'Serum',drawContainer:'SST / Gold',
    transportContainer:'Plastic Serum Transport Tube',
    preferredVolume:'5 mL serum',minimumVolume:'0.5 mL',transportTemperature:'Refrigerated'
  });
  const normalPlan = api.buildCollectionPlan([regular], api.buildTransportBagPlan([regular]));
  assert.equal(normalPlan.find(card => /sst|gold|tiger/i.test(card.label))?.count, 1,
    'Legacy single-test SST rule stays unchanged without explicit specialty exception');
}
console.log('PASS: 23 Labcorp specialty records, dedup, specimen handling, 2-tube plasma, Gold/Tiger volume logic');
