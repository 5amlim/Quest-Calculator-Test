/* Two Labcorp sex-hormone equivalents verified with official test-menu requirements. */
(()=>{'use strict';
const additions=[
  {
    "id": "labcorp-140244",
    "testCode": "140244",
    "testName": "Estradiol, Sensitive, LC/MS-MS",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum",
    "transportContainer": "SST / Gold (spun)",
    "preferredVolume": "1.5 mL serum",
    "minimumVolume": "1.2 mL",
    "transportTemperature": "Refrigerated",
    "transportTemperatureRaw": "Refrigerated",
    "stability": "Room temperature, refrigerated, or frozen 14 days",
    "spin": "Yes",
    "specialInstructions": "Sensitive estradiol LC/MS-MS for low E2 levels, not equivalent to routine ECLIA estradiol. Gel-barrier or red top. If red top, separate and transfer to plastic tube. Refrigerate for shipping.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory • https://www.labcorp.com/tests/140244/estradiol-sensitive-lc-ms"
  },
  {
    "id": "labcorp-004614",
    "testCode": "004614",
    "testName": "Estriol, Unconjugated, Serum",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum",
    "transportContainer": "SST / Gold (spun)",
    "preferredVolume": "1 mL serum",
    "minimumVolume": "0.3 mL",
    "transportTemperature": "Refrigerated",
    "transportTemperatureRaw": "Refrigerated",
    "stability": "Room temperature, refrigerated, or frozen 14 days",
    "spin": "Yes",
    "specialInstructions": "Unconjugated estriol. If red-top draw used, separate serum and transfer to plastic transport tube. For trending, draw at a consistent time of day. Refrigerate for transport.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory • https://www.labcorp.com/tests/004614/estriol"
  }
];
const catalog=Array.isArray(window.SEED_TESTS)?window.SEED_TESTS:[];
const known=new Set(catalog.map(x=>String(x.testCode)));
for(const t of additions){if(!known.has(t.testCode)){catalog.push(t);known.add(t.testCode);}}
window.SEED_TESTS=catalog;
})();
