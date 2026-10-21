# Lab Collection Calculator (test build)

This repository contains two independent collection planning views:

- **Quest**: `index.html`, with the same catalog, application scripts, stylesheets and printout behavior as the production `5amlim/Lab-Calculator` repository. A small header toggle is added here.
- **Cedars Lab Guide**: `cedars.html`, using an independent 41-entry directory, specimen-group badges, illustrated containers, clickable reference-photo viewer, separate cart storage and Cedars-specific print summary.

## Published pages

- Quest test: https://5amlim.github.io/Quest-Calculator-Test/
- Cedars Lab Guide: https://5amlim.github.io/Quest-Calculator-Test/cedars.html

## File map

| Files | Purpose |
|---|---|
| `index.html`, `assets/js/{app,data,portal-selects}.js`, `assets/css/{styles,experience}.css` | Quest view copied from production |
| `market-switch.css` | Quest/Cedars navigation |
| `cedars.html` | Cedars page |
| `cedars-data.js` | Cedars curated catalog |
| `cedars-app.js` | Cedars search/cart/print interactions |
| `cedars-container-art.js` | Crisp SVG container illustrations |
| `cedars.css` | Cedars appearance and print styling |
| `assets/images/cedars/container-photo-atlas.webp` | Compact photo reference atlas |

No patient information should be entered. The collection plan is not a substitute for the current destination laboratory test monograph. If a test is missing from the Cedars guide, request its addition through the contact shown on the page.

## Maintenance

The Quest production repository is `5amlim/Lab-Calculator`. When updating the Quest test page, keep the mirrored `assets/js` and `assets/css` files byte-for-byte aligned with production, and limit `index.html` differences to navigation.

Historical source files, test exports and duplicated files were moved out of the active `main` branch on 2026-10-21. For recovery, see the preserved branch `archive/before-runtime-cleanup-2026-10-21`.
