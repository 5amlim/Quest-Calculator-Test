/* Additional independently checked Labcorp tests from Quest worksheet: dsDNA, DHEA, ultrasensitive PSA. */
(()=>{'use strict';
const additions=[
  {
    "id": "labcorp-096339",
    "testCode": "096339",
    "testName": "Anti-dsDNA (Double-Stranded DNA) Antibodies, IgG",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum",
    "transportContainer": "SST / Gold (spun)",
    "preferredVolume": "1 mL serum",
    "minimumVolume": "0.5 mL",
    "transportTemperature": "Room Temperature",
    "transportTemperatureRaw": "Room Temperature",
    "stability": "Room temperature, refrigerated, or frozen 14 days",
    "spin": "Yes",
    "specialInstructions": "IgG semi-quantitative dsDNA by multiplex flow immunoassay; biotin supplementation may interfere. Avoid hemolysis, lipemia, icterus and contamination.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test menu, checked 2026-10-22 • https://www.labcorp.com/tests/096339/anti-dsdna-double-stranded-antibodies"
  },
  {
    "id": "labcorp-004100",
    "testCode": "004100",
    "testName": "Dehydroepiandrosterone (DHEA), Unconjugated",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum",
    "transportContainer": "SST / Gold (spun)",
    "preferredVolume": "1 mL serum",
    "minimumVolume": "0.5 mL",
    "transportTemperature": "Refrigerated",
    "transportTemperatureRaw": "Refrigerated",
    "stability": "Room temperature 6 hours; refrigerated/frozen 14 days",
    "spin": "Yes",
    "specialInstructions": "Unconjugated DHEA, NOT DHEA-S. MUST SHIP REFRIGERATED (RT shipment rejected). If red top, separate and transfer serum into plastic transport tube. Freeze if unable to maintain refrigerated.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test menu, checked 2026-10-22 • https://www.labcorp.com/tests/004100/dehydroepiandrosterone-dhea"
  },
  {
    "id": "labcorp-140731",
    "testCode": "140731",
    "testName": "Prostate-Specific Antigen (PSA), Ultrasensitive",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum or green-top lithium heparin plasma",
    "transportContainer": "SST / Gold (spun)",
    "preferredVolume": "1 mL serum",
    "minimumVolume": "0.7 mL",
    "transportTemperature": "Room Temperature",
    "transportTemperatureRaw": "Room Temperature",
    "stability": "Room temperature/refrigerated 7 days; frozen 14 days",
    "spin": "Yes",
    "specialInstructions": "Ultrasensitive total PSA useful after prostatectomy. Do not confuse with routine PSA or reflex PSA free test. Maintain consistent assay for serial monitoring.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test menu, checked 2026-10-22 • https://www.labcorp.com/tests/140731/prostate-specific-antigen-psa-ultrasensitive"
  }
];
const catalog=Array.isArray(window.SEED_TESTS)?window.SEED_TESTS:[];
const known=new Set(catalog.map(t=>String(t.testCode)));
for(const test of additions){if(!known.has(test.testCode)){catalog.push(test);known.add(test.testCode);}}
window.SEED_TESTS=catalog;
})();
