/* Additional Labcorp-verified coagulation and immunology tests. */
(()=>{'use strict';
const additions=[
  {
    "id": "labcorp-020321",
    "testCode": "020321",
    "testName": "Prothrombin Time (PT/INR) and Activated Partial Thromboplastin Time (aPTT)",
    "specimenType": "Whole Blood",
    "drawContainer": "Light Blue Sodium Citrate",
    "alternativeContainer": "",
    "transportContainer": "Submit in Original Tube",
    "preferredVolume": "Full light-blue citrate tube (1.8, 2.7 or 4.5 mL, per tube size)",
    "minimumVolume": "At least 90% full",
    "transportTemperature": "Room Temperature",
    "transportTemperatureRaw": "Room Temperature",
    "stability": "Room temperature 24 hours; DO NOT refrigerate",
    "spin": "No",
    "specialInstructions": "Fill the 3.2% sodium citrate blue-top tube completely (at least 90% full). Gently invert at least SIX times. Labcorp does not require a discard tube for a routine direct venipuncture. Do NOT refrigerate. If delay >24 hours, prepare platelet-poor plasma and freeze in a separate purple PP Transpak (49482). Heparin patients have a one-hour processing constraint. Hematocrit over 55% requires adjusted citrate volume.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory 2026-10-22 • https://www.labcorp.com/tests/020321/prothrombin-time-pt-and-partial-thromboplastin-time-ptt"
  },
  {
    "id": "labcorp-006684",
    "testCode": "006684",
    "testName": "Thyroid Antibodies Panel (TPO and Thyroglobulin Antibody)",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum",
    "transportContainer": "SST / Gold (spun)",
    "preferredVolume": "2 mL serum",
    "minimumVolume": "0.8 mL",
    "transportTemperature": "Room Temperature",
    "transportTemperatureRaw": "Room Temperature",
    "stability": "Room temperature, refrigerated, frozen: 14 days",
    "spin": "Yes",
    "specialInstructions": "Includes anti-TPO and thyroglobulin antibody. Red-top or gel barrier serum. EDTA and heparin plasma NOT accepted. High-dose biotin may interfere. Do not confuse with standalone TPO antibody testing.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory reviewed 2026-10-22 • https://www.labcorp.com/tests/006684/thyroid-antibodies"
  },
  {
    "id": "labcorp-164914",
    "testCode": "164914",
    "testName": "Anti-CCP Antibodies, IgG and IgA (ELISA)",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum",
    "transportContainer": "SST / Gold (spun)",
    "preferredVolume": "1 mL serum",
    "minimumVolume": "0.3 mL",
    "transportTemperature": "Room Temperature",
    "transportTemperatureRaw": "Room Temperature",
    "stability": "Room temperature 7 days; refrigerated/frozen 14 days",
    "spin": "Yes",
    "specialInstructions": "Anti-CCP IgG/IgA by ELISA. Red top or gel barrier; separate serum from clot. Not identical to Quest IgG-only CCP test. Avoid hemolysis and preservative additives.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory reviewed 2026-10-22 • https://www.labcorp.com/tests/164914/anti-ccp-cyclic-citrullinated-peptide-antibodies-igg-and-iga-elisa"
  },
  {
    "id": "labcorp-520008",
    "testCode": "520008",
    "testName": "Anti-CCP Antibodies, IgG and IgA (RDL)",
    "specimenType": "Serum",
    "drawContainer": "SST / Gold",
    "alternativeContainer": "Red-top serum",
    "transportContainer": "Plastic Serum Transport Tube",
    "preferredVolume": "1 mL serum",
    "minimumVolume": "0.5 mL",
    "transportTemperature": "Refrigerated",
    "transportTemperatureRaw": "Refrigerated",
    "stability": "Room temperature 7 days; refrigerated 14 days; frozen 60 days",
    "spin": "Yes",
    "specialInstructions": "Separate serum from cells within one hour and transfer to plastic transport tube. Refrigerate or freeze. Separate frozen specimen if multiple tests ordered. Distinct RDL performing lab.",
    "fastingStatus": "",
    "fastingInstructions": "",
    "status": "active",
    "source": "Labcorp official test directory reviewed 2026-10-22 • https://www.labcorp.com/tests/520008/anti-ccp-cyclic-citrullinated-peptide-antibodies-igg-and-iga-rdl"
  }
];
const catalog=Array.isArray(window.SEED_TESTS)?window.SEED_TESTS:[];
const known=new Set(catalog.map(test=>String(test.testCode)));
for(const test of additions){if(!known.has(test.testCode)){catalog.push(test);known.add(test.testCode);}}
window.SEED_TESTS=catalog;
})();
