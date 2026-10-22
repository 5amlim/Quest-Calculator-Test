/* New verified Labcorp equivalents from Quest Lab Calculator workbook (2026-10-22). */
(()=>{
'use strict';
const additions=[
  {
    "id": "labcorp-007054",
    "testCode": "007054",
    "testName": "Ammonia, Plasma",
    "specimenType": "Plasma",
    "drawContainer": "Lavender EDTA",
    "alternativeContainer": "",
    "transportContainer": "Plastic Plasma Transport Tube",
    "preferredVolume": "1 mL plasma",
    "minimumVolume": "0.5 mL",
    "transportTemperature": "Frozen",
    "stability": "Refrigerated 2 hours; frozen 3 days; room temperature unstable",
    "spin": "Yes",
    "specialInstructions": "Fill EDTA tube completely. Immediately place on ice. Separate plasma within 15 minutes, transfer to plastic transport tube, freeze promptly. Write draw date and time on specimen and requisition. Submit dedicated frozen specimen; avoid hemolysis. Fasting 12-14 hours recommended.",
    "transportTemperatureRaw": "Frozen",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory verified 2026-10-22 • https://www.labcorp.com/tests/007054/ammonia-plasma"
  },
  {
    "id": "labcorp-123234",
    "testCode": "123234",
    "testName": "Pancreatic Elastase, Fecal",
    "specimenType": "Stool",
    "drawContainer": "Sterile Stool Container",
    "alternativeContainer": "",
    "transportContainer": "Screw-cap Plastic Stool Container",
    "preferredVolume": "3 g stool",
    "minimumVolume": "1 g",
    "transportTemperature": "Frozen",
    "stability": "Room temperature 8 hours; refrigerated 7 days; frozen 12 months",
    "spin": "No",
    "specialInstructions": "Collect unpreserved random stool in clean screw-cap vial. Do not add preservatives or contaminate with urine. Transport frozen.",
    "transportTemperatureRaw": "Frozen",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory verified 2026-10-22 • https://www.labcorp.com/tests/123234/pancreatic-elastase-fecal"
  },
  {
    "id": "labcorp-123255",
    "testCode": "123255",
    "testName": "Calprotectin, Fecal",
    "specimenType": "Stool",
    "drawContainer": "Sterile Stool Container",
    "alternativeContainer": "",
    "transportContainer": "Screw-cap Plastic Stool Container",
    "preferredVolume": "1 g stool",
    "minimumVolume": "0.5 g",
    "transportTemperature": "Frozen",
    "stability": "Room temperature 2 days; refrigerated 3 days; frozen 4 months",
    "spin": "No",
    "specialInstructions": "Collect unpreserved random stool, including loose stool, in clean screw-cap vial. Do not add preservatives or contaminate with urine. Freeze for shipping; refrigerated samples over 72 hours may be rejected.",
    "transportTemperatureRaw": "Frozen",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory verified 2026-10-22 • https://www.labcorp.com/tests/123255/calprotectin-fecal"
  },
  {
    "id": "labcorp-500142",
    "testCode": "500142",
    "testName": "Dihydrotestosterone (DHT), LC/MS-MS",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum, lavender EDTA or green heparin",
    "transportContainer": "Plastic Serum Transport Tube",
    "preferredVolume": "1 mL serum",
    "minimumVolume": "0.5 mL",
    "transportTemperature": "Frozen",
    "stability": "Room temperature 7 days; refrigerated 7 days; frozen 19 months",
    "spin": "Yes",
    "specialInstructions": "Separate serum or plasma from cells within 1 hour. Transfer to plastic tube and freeze. Submit a dedicated frozen tube for each frozen test.",
    "transportTemperatureRaw": "Frozen",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory verified 2026-10-22 • https://www.labcorp.com/tests/500142/dihydrotestosterone-dht-endocrine-sciences"
  }
,
  {
    "id": "labcorp-146712",
    "testCode": "146712",
    "testName": "Leptin, Serum or Plasma",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum or lavender EDTA plasma",
    "transportContainer": "Plastic Serum Transport Tube",
    "preferredVolume": "0.5 mL serum",
    "minimumVolume": "0.2 mL",
    "transportTemperature": "Room Temperature",
    "transportTemperatureRaw": "Room Temperature",
    "stability": "Room temperature 14 days; refrigerated 30 days; frozen 21 days",
    "spin": "Yes",
    "specialInstructions": "Separate serum or plasma from cells and transfer to plastic transport tube. Avoid gross hemolysis or lipemia.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory verified 2026-10-22 • https://www.labcorp.com/tests/146712/leptin-serum-or-plasma"
  }
];
const catalog=Array.isArray(window.SEED_TESTS)?window.SEED_TESTS:[];
const known=new Set(catalog.map(test=>String(test.testCode)));
for(const test of additions){if(!known.has(test.testCode)){catalog.push(test);known.add(test.testCode);}}
window.SEED_TESTS=catalog;
})();
