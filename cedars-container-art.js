/* Cedars container pictograms, matched to the lab owner's photos.
   Illustrations only; never use cap color alone to identify a clinical kit.
   Inline SVG means the same art prints and works offline after page load. */
(function () {
  'use strict';
  const E = (v) => String(v == null ? '' : v).replace(/[&<>"']/g,
    c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rect=(x,y,w,h,fill,rx=0,stroke='#8fa5af') =>
    '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.3"/>';
  const line=(x,y,x2,y2,c='#8fa3aa',sw=1.4)=>
    '<line x1="'+x+'" y1="'+y+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+sw+'" stroke-linecap="round"/>';
  const txt=(x,y,t,fill='#3f5866',sz=7)=>
    '<text x="'+x+'" y="'+y+'" fill="'+fill+'" text-anchor="middle" font-family="Arial,sans-serif" font-size="'+sz+'" font-weight="700">'+E(t)+'</text>';
  const path=(d,fill,stroke='#849ba5')=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.4"/>';
  function tube(x,y,w,h,cap,label,media='#edf5f7',labelColor='#ffffff') {
    return rect(x,y+12,w,h-12,media,Math.min(5,w/4))+
      rect(x-1,y,w+2,14,cap,4,'#70858f')+
      rect(x+3,y+25,w-6,Math.min(32,h-29),labelColor,1,'#d3dde1')+
      line(x+5,y+16,x+5,y+h-6,'#ffffff',1.7)+
      txt(x+w/2,y+42,label,'#425965',Math.min(w<24?6:7,7));
  }
  function bottle(x,y,cap,band,label,wide=33) {
    const cx=x+wide/2, neck=Math.max(9,wide*.27);
    return path('M '+(cx-neck)+' '+(y+17)+' V '+(y+29)+
      ' C '+(x-1)+' '+(y+40)+' '+x+' '+(y+47)+' '+x+' '+(y+54)+
      ' V '+(y+74)+' Q '+x+' '+(y+82)+' '+(x+8)+' '+(y+82)+
      ' H '+(x+wide-8)+' Q '+(x+wide)+' '+(y+82)+' '+(x+wide)+' '+(y+74)+
      ' V '+(y+54)+' C '+(x+wide)+' '+(y+47)+' '+(x+wide+1)+' '+(y+40)+
      ' '+(cx+neck)+' '+(y+29)+' V '+(y+17)+' Z','#f2f6f7')+
      rect(cx-neck-1,y,neck*2+2,18,cap,3,'#718590')+
      rect(x+3,y+53,wide-6,20,band,1,'#9cabb3')+
      txt(cx,y+65,label,band==='#c03444'?'#ffffff':'#29475c',6);
  }
  function cup() {
    return path('M 29 30 H 99 L 94 82 Q 93 88 85 88 H 43 Q 35 88 34 82 Z','#eef5f8')+
      rect(26,21,76,13,'#e8e9e7',4,'#98a7ad')+
      rect(38,49,53,23,'#ffffff',2,'#dae5e8')+
      txt(64,63,'STERILE', '#415d69',9)+line(41,34,43,78,'#ffffff',2);
  }
  function swab(cap='#f7f7f4',fluid='#eef4f8',word='eSwab') {
    return tube(51,6,23,83,cap,word,fluid)+line(86,21,86,80,'#829ca3',2.4)+
      '<ellipse cx="86" cy="17" rx="4.1" ry="7" fill="#fff" stroke="#96a5ab" stroke-width="1.4"/>';
  }
  function qft() {
    return tube(9,17,20,71,'#7b858b','NIL')+
      tube(39,17,20,71,'#39a079','TB1')+
      tube(69,17,20,71,'#e8c546','TB2')+
      tube(99,17,20,71,'#a77bb3','MIT');
  }
  function kit(base='cobas',accent='#e4d65e') {
    return rect(7,25,71,38,'#f8fbfc',5,'#b7cbd2')+
      rect(7,25,71,9,'#d6e8ed',3,'#aec4c9')+
      rect(13,40,58,14,'#ffffff',2,'#dce5e7')+
      txt(42,50,base,'#405b66',10)+tube(88,13,20,71,accent,'PCR','#eef3f7');
  }
  function art(key) {
    switch(key) {
      case 'adult': return bottle(25,7,'#ad77bc','#a586c3','ANA',34)+bottle(70,7,'#278fce','#9fd0ed','AERO',34);
      case 'peds': return bottle(48,7,'#eb9fb5','#e49fac','PEDS',35);
      case 'fungal': return bottle(46,4,'#d8dedc','#c03444','MYCO',39);
      case 'eswab': return swab('#f5f5f1','#eff6f7','eSwab');
      case 'utm': return swab('#c83137','#f5d8d5','UTM');
      case 'cobasUrine': return kit('cobas urine','#e8cf28')+line(112,46,118,84,'#93a7ae',2);
      case 'cobasSwab': return rect(7,25,68,36,'#f8fbfc',3,'#a7bec8')+
        rect(7,25,68,9,'#eef1f2',2,'#a4bac2')+txt(39,47,'cobas','#405d65',9)+
        tube(80,13,20,71,'#e3d030','PCR')+
        line(113,19,113,83,'#b3babe',2)+'<ellipse cx="113" cy="17" rx="3" ry="6" fill="#fff" stroke="#a9b9c1"/>';
      case 'affirm': return rect(10,24,75,38,'#e4f1f7',4,'#a8c5ce')+
        rect(13,30,69,23,'#f7fbfc',3,'#adc6d3')+
        txt(46,44,'AFFIRM','#49758a',9)+tube(91,13,18,73,'#f6f7f5','ATTS');
      case 'urine': return tube(49,6,30,83,'#a1a9a7','URINE','#f4f6f8');
      case 'ua': return tube(49,6,30,83,'#e5c654','UA','#f2f5f6')+
        path('M 48 12 Q 54 4 62 12 T 80 12','none','#d33138');
      case 'parapak': return tube(10,20,28,68,'#efd12a','C&S','#f3f5f5')+
        tube(50,20,28,68,'#ca93aa','10%','#f6eded')+
        tube(90,20,28,68,'#eef1ee','CLEAN','#f4f5f6');
      case 'cleanStool': return tube(47,7,34,82,'#eef1ee','CLEAN','#f4f5f6');
      case 'formalin': return tube(47,7,34,82,'#c987a1','10%','#f8f0f4');
      case 'sterile': return cup();
      case 'qft': return qft();
      case 'aptima': return tube(48,6,30,83,'#eac0c6','APTIMA','#f5f6f6');
      case 'fit': return tube(48,7,32,81,'#83b8ad','FIT');
      case 'surepath': return tube(46,8,36,80,'#cb87a9','PAP');
      default: return rect(35,25,58,58,'#f0f4f5',8,'#afc2c9')+
        txt(64,54,'?', '#83959b',25)+txt(64,73,'VERIFY','#748b95',7);
    }
  }
  const descriptions={
    adult:'Two adult BACTEC bottles: purple anaerobic and blue aerobic',
    peds:'Pink-cap pediatric blood culture bottle',
    fungal:'Red-label Myco/F Lytic BACTEC bottle',
    eswab:'Long white-cap eSwab tube with swab',
    utm:'Red-cap UTM tube with pink transport medium',
    cobasUrine:'Yellow-cap cobas urine PCR tube and collection kit',
    cobasSwab:'Yellow-cap cobas swab PCR kit with swabs',
    affirm:'BD Affirm ATTS swab and pale blue transport package',
    urine:'Gray-cap urine culture preservative tube',
    ua:'Red and yellow swirl-top urinalysis tube',
    parapak:'Three ParaPak stool vials with yellow, pink and white caps',
    cleanStool:'White-cap clean stool collection vial',
    formalin:'Pink-cap 10 percent Formalin stool vial',
    sterile:'Clear specimen cup with white lid',
    qft:'Four QuantiFERON tubes',
    aptima:'Aptima swab transport tube, provisional illustration',
    fit:'FIT collection bottle, provisional illustration',
    surepath:'SurePath vial, provisional illustration',
    unknown:'Collection container requires identification'
  };
  function kind(value) {
    const s=String(value||'').toLowerCase();
    if (/myco\/?f|lytic|fungal blood/.test(s)) return 'fungal';
    if (/pediatric|peds/.test(s)&&/culture|bottle/.test(s))return 'peds';
    if (/adult blood culture|aerobic.*anaerobic.*bottle|blood.?pair/.test(s))return 'adult';
    if (/quanti|qft|four qft|all 4/.test(s))return 'qft';
    if (/parapak.*clean|clean stool vial|clean vial.*white/.test(s) && !/3.vial|three para/.test(s))return 'cleanStool';
    if (/para.?pak|parapak|3.vial|all three para/.test(s))return 'parapak';
    if (/10% formalin|10 percent formalin/.test(s))return 'formalin';
    if (/red.*yellow.*swirl|swirl.top|urinalysis preservative|ua preservative/.test(s))return 'ua';
    if (/gray.top|gray[- ]cap.*urine/.test(s))return 'urine';
    if (/cobas.*urine|urine.*cobas/.test(s))return 'cobasUrine';
    if (/cobas.*swab|cobas.*pcr media|pcr.*dual swab/.test(s))return 'cobasSwab';
    if (/affirm|atts/.test(s))return 'affirm';
    if (/utm|universal transport|viral transport/.test(s))return 'utm';
    if (/eswab|e.?swab/.test(s))return 'eswab';
    if (/aptima/.test(s))return 'aptima';
    if (/sterile cup|sterile container|sterile specimen cup/.test(s))return 'sterile';
    if (/fit|fobt.chek/.test(s))return 'fit';
    if (/surepath/.test(s))return 'surepath';
    return 'unknown';
  }
  window.CEDARS_CONTAINER_ART = function (container,size) {
    const key=kind(container),label=descriptions[key]||descriptions.unknown;
    const sizeClass=['table','card','print','detail','small'].includes(size)?size:'card';
    return '<span class="cedars-container-art cedars-container-art-'+sizeClass+' cedars-container-drawing" role="img"'+
      ' aria-label="'+E('Illustration: '+label)+'" title="'+E('Drawing based on supplied container photos; verify exact kit')+'">'+
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 96" role="presentation" aria-hidden="true" focusable="false">'+
      '<ellipse cx="64" cy="91" rx="47" ry="3" fill="#e5ebee"/>'+art(key)+'</svg></span>';
  };
  window.CEDARS_CONTAINER_KIND=kind;
})();
