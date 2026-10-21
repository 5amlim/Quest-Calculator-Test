/* Lightweight, original schematic illustrations for the Cedars prototype.
   These are NOT photographs or a substitute for current Cedars kit instructions.
   Each visual is inferred from a named container, with fallback for unknown kits. */
(function () {
  'use strict';
  const safe = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const R = (x,y,w,h,fill,rx=0,stroke='#8ba3ac') =>
    '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.3"/>';
  const L = (x1,y1,x2,y2,stroke='#79909a',w=1.4) =>
    '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linecap="round"/>';
  const T = (x,y,word,fill='#47616e',size=9) =>
    '<text x="'+x+'" y="'+y+'" font-size="'+size+'" text-anchor="middle" font-family="Arial,sans-serif" fill="'+fill+'" font-weight="700">'+safe(word)+'</text>';
  const shadow = '<ellipse cx="64" cy="88" rx="47" ry="4" fill="#e5edf1"/>';
  function tube(x,y,cap='#f7f8f8',width=19,label='',body='#e8f2f7',height=56) {
    const top=y+10;
    return R(x,top,width,height,body,4)+R(x-1,y,width+2,12,cap,3,'#708893')+
      R(x+4,top+15,width-8,22,'#ffffff',2,'#d0dbe0')+
      (label?T(x+width/2,top+29,label,'#426272',6):'')+
      L(x+4,top+5,x+4,top+height-6,'#ffffff',2);
  }
  function cup(x=37,y=18,lid='#e5e9eb',lab='STERILE') {
    return '<path d="M '+(x+2)+' '+(y+12)+' L '+(x+6)+' '+(y+61)+' Q '+(x+7)+' '+(y+65)+' '+(x+15)+' '+(y+65)+' L '+(x+47)+' '+(y+65)+' Q '+(x+55)+' '+(y+65)+' '+(x+55)+' '+(y+61)+' L '+(x+59)+' '+(y+12)+' Z" fill="#edf5f7" stroke="#91a8b0" stroke-width="1.5"/>'+
      R(x-1,y,64,15,lid,5,'#8ba0a8')+R(x+11,y+26,40,20,'#ffffff',2,'#cedce1')+
      T(x+31,y+38,lab,'#4c6572',7)+L(x+14,y+18,x+15,y+59,'#ffffff',2);
  }
  function cultureBottle(x,y,cap='#4c8d7a',lab='BACTEC') {
    return '<path d="M'+(x+9)+' '+(y+14)+' L'+(x+9)+' '+(y+21)+' C'+(x-1)+' '+(y+27)+' '+(x-1)+' '+(y+64)+' '+(x+6)+' '+(y+72)+' L'+(x+30)+' '+(y+72)+' C'+(x+37)+' '+(y+64)+' '+(x+37)+' '+(y+27)+' '+(x+27)+' '+(y+21)+' L'+(x+27)+' '+(y+14)+' Z" fill="#edf5f5" stroke="#94a9af" stroke-width="1.5"/>'+
      R(x+9,y,18,16,cap,3,'#5f7880')+R(x+7,y+39,22,22,'#ffffff',2,'#c9d5da')+
      T(x+18,y+51,lab,'#536571',6)+L(x+6,y+32,x+6,y+67,'#ffffff',2);
  }
  function swab(x,y,cap='#f4f5f5',lab='') {
    return tube(x,y,cap,20,lab,'#ecf6f9',54)+
      L(x+33,y+13,x+33,y+74,'#778a94',2)+
      '<ellipse cx="'+(x+33)+'" cy="'+(y+11)+'" rx="4" ry="7" fill="#f8fbfb" stroke="#8298a1" stroke-width="1.2"/>';
  }
  function box(x,y,lab='KIT',band='#b7d9df') {
    return R(x,y,67,52,'#ffffff',5,'#abbfc6')+R(x,y,67,11,band,4,'#abbfc6')+
      R(x+8,y+21,51,20,'#f0f5f6',2,'#d8e1e4')+
      T(x+33,y+34,lab,'#3a5967',8);
  }
  function kind(value) {
    const s=String(value||'').toLowerCase();
    if (/gray[- ]top.*urine culture|urine culture.*gray[- ]top/.test(s)) return 'gray-urine';
    if (/red.*yellow.*swirl|swirl.*urinalysis|swirl.*ua/.test(s)) return 'ua-swirl';
    if (/pediatric blood culture|peds blood culture/.test(s)) return 'peds-culture';
    if (/adult blood culture set/.test(s)) return 'blood-pair';
    if (/boritex/.test(s)) return 'boritex';
    if (/4-tube|four qft|quanti.?feron|qft collection/.test(s)) return 'qft';
    if (/bactec aerobic.*anaerobic|one aerobic and one anaerobic/.test(s)) return 'blood-pair';
    if (/myco\/f|bactec/.test(s)) return 'culture';
    if (/parapak|para-pak/.test(s)) return 'parapak';
    if (/formalin|z-pva/.test(s)) return 'preservative';
    if (/eswab or sterile|eswab or sterile|e.?swab or sterile/.test(s)) return 'choice';
    if (/e.?swab/i.test(s)) return 'eswab';
    if (/utm|viral transport/.test(s)) return 'utm';
    if (/cobas.*(?:swab|pcr media)|pcr media dual swab/.test(s)) return 'cobas-swab';
    if (/cobas.*urine/.test(s)) return 'cobas-urine';
    if (/affirm|atts/.test(s)) return 'affirm';
    if (/fobt|fit bottle|sampling bottle/.test(s)) return 'fit';
    if (/surepath/.test(s)) return 'pap';
    if (/sterile container|sterile cup|urine cup/.test(s)) return 'cup';
    if (/sterile.*urine/.test(s)) return 'cup';
    if (/swab|aptima/.test(s)) return 'eswab';
    if (/urine|container/.test(s)) return 'cup';
    if (/verify/.test(s)) return 'unknown';
    return 'unknown';
  }
  function artwork(type) {
    switch(type) {
      case 'eswab': return swab(45,13,'#f7f8f8','eSwab');
      case 'utm': return swab(45,13,'#c7474c','UTM');
      case 'gray-urine': return tube(49,14,'#8f9b9f',30,'URINE','#e8f3f7',58);
      case 'ua-swirl': return tube(49,14,'#eed15b',30,'UA','#e8f3f7',58) +
        '<path d="M49 22 Q57 13 64 20 T79 20" fill="none" stroke="#ca464b" stroke-width="4"/>';
      case 'peds-culture': return cultureBottle(46,9,'#e3a5b5','PEDS');
      case 'boritex': return cup(33,16,'#e88924','BORITEX');
      case 'cup': return cup(33,16,'#f7f8f8','STERILE');
      case 'parapak': return tube(19,20,'#e6b636',22,'C&S','#edf5f9',48) +
        tube(53,20,'#c56d9b',22,'PVA','#edf5f9',48) +
        tube(87,20,'#f6f6f6',22,'CLEAN','#edf5f9',48);
      case 'preservative': return tube(38,19,'#c6729e',22,'PVA','#edf5f9',49)+
        tube(72,19,'#f0e5db',22,'FIX','#edf5f9',49);
      case 'qft': return tube(14,17,'#8b8e94',20,'NIL','#f2f7f9',52) +
        tube(41,17,'#449e83',20,'TB1','#f2f7f9',52)+
        tube(68,17,'#e6bd47',20,'TB2','#f2f7f9',52)+
        tube(95,17,'#967db9',20,'MIT','#f2f7f9',52);
      case 'blood-pair': return cultureBottle(30,10,'#65a6a5','AERO')+
        cultureBottle(66,10,'#b077a6','ANA');
      case 'culture': return cultureBottle(46,10,'#bd737e','MYCO');
      case 'cobas-swab': return box(14,25,'cobas','#d9eaee') + swab(88,16,'#e7d44b','PCR');
      case 'cobas-urine': return cup(16,23,'#f2f4f4','URINE') +
        tube(91,18,'#e6d14a',18,'PCR','#edf6f8',53);
      case 'choice': return swab(13,21,'#f1f3f4','eSwab')+cup(67,22,'#f3f4f4','STERILE');
      case 'affirm': return box(15,25,'AFFIRM','#d2e5eb') +
        swab(88,17,'#f5f6f5','ATTS');
      case 'fit': return tube(49,18,'#449581',29,'FIT','#f1f7f8',50);
      case 'pap': return cup(33,16,'#cb88b0','PAP');
      default: return R(38,20,52,56,'#f3f6f7',7,'#aebfc5')+
        T(64,53,'?','#8b9da3',27)+T(64,70,'VERIFY','#7c909a',7);
    }
  }
  const descriptors={
    'eswab':'eSwab specimen transport tube with collection swab',
    'utm':'Universal transport medium tube with collection swab',
    'gray-urine':'Gray-top urine culture preservative tube',
    'ua-swirl':'Red-and-yellow swirl-top urinalysis preservative tube',
    'peds-culture':'Pediatric blood culture bottle schematic',
    'boritex':'BORITEX urine culture transport container',
    'cup':'Sterile specimen cup',
    'parapak':'Three-vial stool collection kit',
    'preservative':'Stool specimen preservative vials',
    'qft':'Four-tube QuantiFERON collection set',
    'blood-pair':'Aerobic and anaerobic blood culture bottles',
    'culture':'Specialized blood culture bottle',
    'cobas-swab':'cobas swab PCR kit',
    'cobas-urine':'Urine PCR collection container and tube',
    'choice':'eSwab or sterile collection container options',
    'affirm':'Affirm vaginitis collection kit',
    'fit':'Fecal immunochemical test sampling bottle',
    'pap':'SurePath cervical cytology vial',
    'unknown':'Collection container pending verification'
  };
  window.CEDARS_CONTAINER_ART = function (name, size) {
    const key=kind(name);
    const label=descriptors[key]||descriptors.unknown;
    const sz=['table','card','print','detail','small'].includes(size)?size:'card';
    return '<span class="cedars-container-art cedars-container-art-'+sz+
      '" role="img" aria-label="'+safe('Illustration: '+label)+
      '" title="Illustration only. Confirm actual Cedars container and kit.">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 96" focusable="false" aria-hidden="true" preserveAspectRatio="xMidYMid meet">'+
      shadow+artwork(key)+'</svg></span>';
  };
})();
