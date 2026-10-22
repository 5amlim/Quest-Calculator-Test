/* Two distinct iodine urine order codes and no-preservative collection workflows. */
(()=>{'use strict';const additions=[
  {
    "id": "labcorp-070222",
    "testCode": "070222",
    "testName": "Iodine, 24-Hour Urine",
    "specimenType": "Urine",
    "drawContainer": "Sterile Urine Cup",
    "alternativeContainer": "",
    "transportContainer": "Plastic Urine Aliquot Container, No Preservative",
    "preferredVolume": "5 mL aliquot from 24-hour urine",
    "minimumVolume": "2 mL",
    "transportTemperature": "Room Temperature",
    "transportTemperatureRaw": "Room Temperature",
    "stability": "Room/refrigerated/frozen 28 days",
    "spin": "No",
    "specialInstructions": "Collect total 24-hour urine WITHOUT preservative. Discard first void, then collect all urine through same time next day. Record start, end, and TOTAL urine volume. Mix and submit aliquot in clean plastic urine container. Keep at room temperature. Do not share collection with an acid-preserved test.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory, checked 2026-10-22 • https://www.labcorp.com/tests/070222/iodine-24-hour-urine"
  },
  {
    "id": "labcorp-070172",
    "testCode": "070172",
    "testName": "Iodine, Urine With Creatinine Ratio",
    "specimenType": "Urine",
    "drawContainer": "Sterile Urine Cup",
    "alternativeContainer": "",
    "transportContainer": "Plastic Urine Aliquot Container, No Preservative",
    "preferredVolume": "15 mL urine",
    "minimumVolume": "10 mL",
    "transportTemperature": "Room Temperature",
    "transportTemperatureRaw": "Room Temperature",
    "stability": "Room/refrigerated/frozen 28 days",
    "spin": "No",
    "specialInstructions": "Collect urine WITHOUT preservative in clean plastic container. Record 24-hour total volume if a timed collection was ordered. Keep at room temperature. Do not share with acid-preserved urine collections.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory, checked 2026-10-22 • https://www.labcorp.com/tests/070172/iodine-urine-with-creatinine-ratio"
  }
];const rows=Array.isArray(window.SEED_TESTS)?window.SEED_TESTS:[];const existing=new Set(rows.map(x=>String(x.testCode)));for(const item of additions){if(!existing.has(item.testCode)){rows.push(item);existing.add(item.testCode);}}window.SEED_TESTS=rows;})();