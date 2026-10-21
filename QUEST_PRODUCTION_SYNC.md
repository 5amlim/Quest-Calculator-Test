# Quest test-page sync

Quest side of this test site mirrors the main calculator in `5amlim/Lab-Calculator`, **v11.92**, as of October 21, 2026.

Copied byte-for-byte from the production repository:
- `assets/js/data.js` (full production Quest catalog)
- `assets/js/app.js` (search, add tests, pooling, alerts, full print generation)
- `assets/js/portal-selects.js`
- `assets/css/styles.css`
- `assets/css/experience.css`

`index.html` is identical to the production page except for one extra navigation link to `cedars.html`.
`docs/Sam_Hay_Workplace_Use_Agreement.docx` points to the exact existing agreement blob, as in production.

The **separate** Cedars prototype files are preserved, and its clinical rules remain separate. No changes were made to `5amlim/Lab-Calculator`.

Note: legacy root-level `app.js`, `data.js`, `styles.css`, `experience.css`, and `print.css` are left untouched for backward compatibility; the Quest entry page uses only production-style `assets/` paths. These legacy files are not authoritative for Quest.
