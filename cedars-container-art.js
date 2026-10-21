/* Source photos supplied by the lab workflow owner, packed into one lightweight
   image sheet. Each tile is the matching original photo; no external hotlinks.
   Images are reference photos, NOT a substitute for kit verification. */
(function () {
  'use strict';
  const PATH = 'assets/images/cedars/container-photo-atlas.webp';
  const pictures = {
    adult:  {col:0,row:0,label:'BD BACTEC adult blood culture aerobic and anaerobic bottle pair'},
    peds:   {col:1,row:0,label:'BD BACTEC pediatric blood culture bottle'},
    fungal: {col:2,row:0,label:'BD BACTEC Myco/F Lytic fungal blood culture bottle'},
    eswab:  {col:3,row:0,label:'White-top eSwab culture transport tube'},
    utm:    {col:0,row:1,label:'Red-top UTM viral transport tube'},
    cobasUrine:{col:1,row:1,label:'cobas yellow-top urine PCR collection kit'},
    cobasSwab: {col:2,row:1,label:'cobas yellow-top swab PCR collection kit'},
    affirm: {col:3,row:1,label:'BD Affirm / ATTS vaginitis collection kit'},
    urine:  {col:0,row:2,label:'Gray-top urine culture preservative tube'},
    parapak:{col:1,row:2,label:'Three-vial ParaPak set: yellow C and S Medium, pink 10 percent Formalin, white Clean Vial'},
    ua:     {col:2,row:2,label:'Red and yellow swirl-top urinalysis preservative tube'}
  };
  function classify(value) {
    const text = String(value || '').toLowerCase();
    if (/myco\/?f|lytic|fungal blood/.test(text)) return 'fungal';
    if (/pediatric|peds/.test(text) && /culture|bactec/.test(text)) return 'peds';
    if (/adult blood culture|aerobic\s*\+\s*anaerobic|aerobic.*anaerobic.*bottles|one aerobic and one anaerobic/.test(text)) return 'adult';
    if (/para.?pak|parapak/.test(text)) return 'parapak';
    if (/red.{0,20}yellow.{0,20}swirl|swirl.{0,20}ua|urinalysis.*preservative/.test(text)) return 'ua';
    if (/gray[- ]top.*urine culture|urine culture.*gray[- ]top/.test(text)) return 'urine';
    if (/cobas.*urine|urine.*cobas/.test(text)) return 'cobasUrine';
    if (/cobas.*swab|cobas.*pcr media|pcr.*dual swab|cobas.*pcr swab/.test(text)) return 'cobasSwab';
    if (/affirm|atts/.test(text)) return 'affirm';
    if (/\butm\b|viral transport/.test(text)) return 'utm';
    if (/eswab|e.?swab/.test(text)) return 'eswab';
    return null;
  }
  function escapeAttribute(s) {
    return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  window.CEDARS_CONTAINER_ART = function (container, size) {
    const key=classify(container);
    const visual=pictures[key];
    const chosen=['table','card','print','detail','small'].includes(size)?size:'card';
    if (!visual) return '<span class="cedars-container-art cedars-container-art-'+chosen+
      ' cedars-container-unknown" role="img" aria-label="Container photo not yet available">VERIFY</span>';
    return '<span class="cedars-container-art cedars-container-art-'+chosen+
      ' cedars-container-photo" role="img" aria-label="'+escapeAttribute('Photo reference: '+visual.label)+'"'+
      ' style="--atlas-col:'+visual.col+';--atlas-row:'+visual.row+'"'+
      ' title="'+escapeAttribute(visual.label+' — check current Cedars collection instructions')+'">'+
      '<img class="cedars-photo-atlas" alt="" aria-hidden="true" src="'+PATH+'" decoding="async" loading="eager">'+
      '</span>';
  };
})();
