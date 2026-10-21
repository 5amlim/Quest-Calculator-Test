# Cedars Calculator: Test-Site Prototype

## Entry point
Open `cedars.html` from the test repository's GitHub Pages site (if Pages is enabled). The Quest page now includes a link to the Cedars test page.

## What was changed
- Added `cedars.html`, `cedars.css`, `cedars-data.js`, `cedars-app.js`.
- Added a single navigation link in `index.html`.
- Did **not** modify Quest `app.js`, `data.js`, or its calculations, storage, print layouts, or styling.
- Kept Cedars selections in memory for the open page only; no patient identifiers or patient-specific data are solicited.

## Data source and limitations
Source supplied by the app owner: **Cedars Specimen Collection and Transport Guide (2023)**, a 30-slide PowerPoint. Each starter record identifies the relevant slide. This is a limited **historical reference**, not the current Cedars/Lexicomp test catalog.

All built-in rows are treated as requiring re-verification. The app does not claim any listed specimen rules are current. No direct access to Lexicomp's current directory or a downloadable validated feed was available during this build.

- Exact preferred/minimum volumes, patient preparation, centrifugation, transport temperatures, stability, STAT eligibility, and courier schedules are often missing.
- **Unknown temperatures remain unknown.** The app does not silently substitute ambient transport.
- Where a source explicitly offers a room/refrigerated stability range, the app shows a separate choice-pending-confirmation category, not an assumed bag.
- **No automatic pooling or shared tubes.** Collection quantities are conservative, separate per test. Pooling requires current, test-specific validation.
- Searches suggest matches. Batch additions happen automatically only for unambiguous exact code or name matches. Suggestions require user action.
- Manual entries exist only in the current page session and are labeled as unverified.
- All printable summaries repeat the current-directory verification warning.

## Records held from automated collection instructions
- **C. difficile**: source slides 3 and 13 show different containers (ParaPak vs clean vial).
- **Mycoplasma / Ureaplasma**: source slides 2 and 3 specify conflicting collection media depending on assay (UTM vs sterile container/Aptima).
- **Mpox**: older eSwab statement requires current assay-specific confirmation.
- **Traditional O&P**: historical media/three-vial instructions and discussion of replacement with molecular panel need resolution.

These records are visible for investigation but cannot be added to a collection plan.

## What needs to happen before operational use
1. Confirm test codes, available assays, collection containers and kits against Cedars' current directory.
2. Confirm preparation, preferred/minimum volume, centrifugation, specimen stability, transport temperature, and rejection criteria per test.
3. Define STAT eligibility, site-specific courier handoff, specimen bag separation, cutoff times, and after-hours contingencies.
4. Review new logic and data with Cedars laboratory representatives and Sollis lab leadership.
5. Add multi-test pooling only when explicitly approved for each specimen type and combination.

## Quick functional QA (test-build)
- JavaScript parsed successfully.
- Starter records populated the table.
- Adding urine culture updated the collection and transport summaries.
- Search by test code `STSTPCRB` returned the intended record.
- Exact batch add (code plus name) added both items.
- Print action generated the selected-test summary.
- Quest page only gained a Cedars navigation link.

This is a prototype, not clinical validation or a live-browser cross-device test.


## October 21 visual synchronization
- Replaced the Cedars prototype's older visual shell with the current production calculator (Lab-Calculator v11.92) HTML component patterns and a self-contained copy of its stylesheets: `cedars-main-styles.css` and `cedars-main-experience.css`.
- Cedars uses its own `cedars.css` overrides and `cedars-app.js`; no Quest production files or clinical calculations were changed.
- Reworked the batch search area, collapsed Filters menu, six-column test table, compact Cart, Show details control, collapsible Draw plan and What to submit sections, and print-card presentation.
- Removed the visible skip-link artifact while retaining keyboard-focus accessibility.
- Printouts now include two-column What to collect and What to submit cards followed by test-specific instructions, with verification warnings.
- Still deliberately **not implemented**: Quest-specific pooling, SST/UriSponge toggles, STAT eligibility, standard blood-tube quantities, and any unverified Cedars-specific processing logic.
- Static and simulated DOM functional tests passed for search, selection, batch addition, held-test blocking, filter opening/closing, cart detail toggling, and print assembly. Not a full live cross-browser validation.


## Filter and print usability update
- Anchored the Filters popover to the **left** edge of its trigger instead of the right edge, fixing the off-screen overflow shown on desktop. Width is limited to the current viewport.
- Restructured the printout with the Quest-style hierarchy: **1. What to collect**, **2. What to submit**, and **3. Collection precautions & handling**.
- Each collection card states the conservative container count and associated tests. Submission cards group tests by the transport temperature status and required submission container.
- Unknown or flexible transport temperatures are plainly marked as pending. They are **not** presented as ready-to-pack bags.
- Source-specific handling notes remain intact in a compact two-column section, including source attribution and dated-reference warning.
- Added a conditional page break for large collections; small orders can remain on the same page. No confirmed volume, temperature, centrifugation, pooling, or STAT cutoff was inferred from the guide.
- Functional test passed with urine culture, enteric bacteria PCR and QuantiFERON: all sections appeared in order, important collection instructions printed, and conflicting C. difficile guidance remained blocked.
- Live browser screenshot review and physical/mobile printer checks were not performed.
