/* Verified hormonal Labcorp options corresponding to tests in user's Quest worksheet. */
(()=>{'use strict';
const additions=[
  {
    "id": "labcorp-004549",
    "testCode": "004549",
    "testName": "Estrogens, Total",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum",
    "transportContainer": "SST / Gold (spun)",
    "preferredVolume": "0.8 mL serum",
    "minimumVolume": "0.5 mL",
    "transportTemperature": "Room Temperature",
    "transportTemperatureRaw": "Room Temperature",
    "stability": "Verify current Labcorp detailed stability for transport",
    "spin": "Yes",
    "specialInstructions": "If a tube other than SST is used, separate and transfer serum to a plastic transport container. Avoid gross hemolysis, lipemia, icterus.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory, checked 2026-10-22 • https://www.labcorp.com/tests/004549/estrogens-total"
  },
  {
    "id": "labcorp-070001",
    "testCode": "070001",
    "testName": "Testosterone, Total, LC/MS-MS (Sensitive)",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum",
    "transportContainer": "Plastic Serum Transport Tube",
    "preferredVolume": "0.8 mL serum",
    "minimumVolume": "0.6 mL",
    "transportTemperature": "Room Temperature",
    "transportTemperatureRaw": "Room Temperature",
    "stability": "Room temperature/refrigerated 28 days; frozen 5.58 years",
    "spin": "Yes",
    "specialInstructions": "LC/MS-MS assay for women, children and hypogonadal men. Separate serum from cells within ONE HOUR of collection and transfer to plastic transport tube. Provide age and sex.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory, checked 2026-10-22 • https://www.labcorp.com/tests/070001/testosterone-total-women-children-and-hypogonadal-males-lc-ms-ms"
  },
  {
    "id": "labcorp-070282",
    "testCode": "070282",
    "testName": "Testosterone, Free and Weakly Bound (Bioavailable), With Total LC/MS-MS",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum",
    "transportContainer": "Plastic Serum Transport Tube",
    "preferredVolume": "2 mL serum",
    "minimumVolume": "1.4 mL",
    "transportTemperature": "Room Temperature",
    "transportTemperatureRaw": "Room Temperature",
    "stability": "Room temperature or refrigerated 7 days",
    "spin": "Yes",
    "specialInstructions": "Measures free + albumin-bound bioavailable and total testosterone. Does NOT measure SHBG as a standalone analyte. Separate serum within one hour and transfer to plastic transport tube.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory, checked 2026-10-22 • https://www.labcorp.com/tests/070282/testosterone-free-and-weakly-bound-with-total-testosterone-lc-ms-ms"
  }
];
const catalog=Array.isArray(window.SEED_TESTS)?window.SEED_TESTS:[];
const known=new Set(catalog.map(t=>String(t.testCode)));
for(const test of additions){if(!known.has(test.testCode)){catalog.push(test);known.add(test.testCode);}}
window.SEED_TESTS=catalog;
})();
