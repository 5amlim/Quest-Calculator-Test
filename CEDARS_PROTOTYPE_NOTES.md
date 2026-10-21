# Cedars Calculator: Test-Site Prototype

## Entry point
Open `cedars.html` from the test repository's GitHub Pages site (if Pages is enabled). The Quest page now includes a link to the Cedars test page.

## What was changed
- Added `cedars.html`, `cedars.css`, `cedars-data.js`, `cedars-app.js`.
- Added a single navigation link in `index.html`.
- Did **not** modify Quest `app.js`, `data.js`, or its calculations, storage, print layouts, or styling.
- Kept Cedars selections separate from Quest; no patient identifiers or patient-specific data are solicited.

## Data source and limitations
Source supplied by the app owner: **Cedars Specimen Collection and Transport Guide (2023)**, a 30-slide PowerPoint. Each starter record identifies the relevant slide. This is a limited **historical reference**, not the current Cedars/Lexicomp test catalog.

All built-in rows are treated as requiring re-verification. The app does not claim any listed specimen rules are current. No direct access to Lexicomp's current directory or a downloadable validated feed was available during this build.

- Exact preferred/minimum volumes, patient preparation, centrifugation, transport temperatures, stability, STAT eligibility, and courier schedules are often missing.
- **Unknown temperatures remain unknown.** The app does not silently substitute ambient transport.
- Where a source explicitly offers a room/refrigerated stability range, the app shows a separate choice-pending-confirmation category, not an assumed bag.
- **No automatic pooling or shared tubes.** Collection quantities are conservative, separate per test. Pooling requires current, test-specific validation.
- Searches suggest matches. Batch additions happen automatically only for unambiguous exact code or name matches. Suggestions require user action.
- Manual entries and cart selections are saved in this browser using the dedicated `cedarsCollectionCalculator.state.v1` localStorage key, separate from Quest. They are labeled as unverified and are not synchronized across browsers or devices.
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


### Follow-up print safety adjustment
- Printout displays an early **Check before collection** section for records with fill-line, immediate mixing, rejection, collection timing, or other collection-critical instructions. The full source text is retained.
- These notes are not duplicated in the final additional handling section. Staff see handling alerts before the collection and submission cards.
- Unknown transport temperatures are never treated as confirmed shipping bags.
- Verified in a simulated UI workflow using urine culture, stool bacterial PCR, QuantiFERON, and an intentionally blocked C. difficile record. Browser and printer-specific page-break behavior still needs end-user review.


## Cart refresh persistence (October 21, 2026)
- Cedars now saves selected test IDs and browser-created manual test records in a dedicated localStorage key: `cedarsCollectionCalculator.state.v1`. Quest's existing data keys are not modified.
- State is restored before the first render, so refreshing or reopening Cedars on the same browser retains the cart.
- Adding, removing, batch-adding, and clearing selections updates saved state immediately. Manual test records remain in the local browser catalog after Clear all, but they are removed from the selected cart.
- Missing IDs and built-in tests marked as verification-only are ignored during restore. Restored manual records are restricted to the expected fields and length limits.
- If browser storage is unavailable, a small message warns that the cart may reset, but collection planning still works during the current page session.
- Browser state does not follow the user between devices or private/incognito browser sessions. Clearing browser site data removes the saved cart.
- Simulated reload checks confirmed additions, removals, Clear all, manual record restoration, held-test blocking, and the storage-denied fallback.


## Container illustrations (October 21, 2026)
- Added `cedars-container-art.js` with original lightweight SVG drawings for common Cedars collection/transport categories: eSwab, UTM, BORITEX urine culture transport, sterile specimen cups, three-vial ParaPak, preserved stool collection vials, cobas PCR kits, BACTEC blood culture bottles, QuantiFERON four-tube sets, Affirm, FIT, and SurePath.
- The drawings appear beside collection containers in the search list, Draw Plan, What to Submit, selected-test details and print summaries. Visuals are embedded as SVG, so they also print without separate image downloads.
- The app includes explicit notes that illustrations are representative only, not actual kit photographs. Do not rely on cap colors, vial size, label art or these renderings to select supplies. Always confirm current Cedars/Lexicomp instructions and the exact manufacturer kit.
- Unknown or ambiguous specimen types display a neutral "VERIFY" illustration rather than a guessed kit. No clinical processing, pooling, storage, or transport rules were changed.
- Functional checks: 29 library thumbnails rendered, six collection and six submission illustrations appeared for a six-test cart, 12 SVG visuals appeared in the generated print HTML, and the cart/illustrations survived a refresh in a simulated browser environment.


## Sollis-performed Cedars menu restriction (October 21, 2026)
- Workflow owner confirmed **Affirm / ATTS** for vaginitis/vaginosis.
- Approved collection workflows now include: culture with eSwab; gray-top urine culture; red/yellow swirl-top urinalysis; three-vial ParaPak stool PCR (bacterial and parasite entries); cobas GC/CT (swab or urine); Affirm/ATTS vaginitis/vaginosis; adult and pediatric blood culture options. These are **workflow selections**, not independent verification that Cedars currently accepts each kit.
- All other historical catalog entries have `hold: true` and are labeled **"Not performed at Sollis."** They are listed behind a dedicated Do Not Perform button and cannot enter the cart or printout.
- Previously saved unsupported cart selections are purged on reload. Older browser-created manual records remain viewable in Do Not Perform but cannot bypass the approved list. The manual-add buttons are hidden and form submissions are inert until the approved catalog is updated.
- New diagrams illustrate gray-top urine culture, red/yellow swirl-top UA and pediatric blood culture collection containers.
- The source notice includes the user's SharePoint PowerPoint reference link, intended for staff with appropriate SharePoint permissions.
- The pediatric culture set count, accepted kit/bottle types, specimen volume and temperature still require current Cedars/Lexicomp and age-appropriate SOP confirmation before clinical use.
- UI/unit checks passed: only the 10 approved workflows appear in default search, 22 historical records are blocked, formerly saved prohibited tests are purged, allowed tests can be added/printed, and PowerPoint reference is preserved.


## eSwab swab-culture scope expansion (October 21, 2026)
- Lab workflow owner clarified that **all swab cultures at Sollis use the white-top eSwab**. The selectable Cedars catalog now includes a general swab culture as well as throat, wound/aerobic, anaerobic, and fungal/yeast **swab-based** cultures, each with white-top eSwab as the collection and submission container.
- This does not expand approved use to fungal blood cultures, other blood cultures, non-swab tissue/fluid cultures, or molecular PCR swabs. Cobas GC/CT and Affirm/ATTS retain their dedicated kits.
- MRSA/VRE **screening** entries remain in Do Not Perform because the assay method and approval are not established by a statement about culture swabs; confirm separately before allowing them.
- The default performed menu now lists 14 tests and the Do Not Perform list has 18 historical entries. Existing saved carts and source-PowerPoint reference remain intact.
- Simulated UI QA confirmed collection cartoons, search/selection, preserved transport restrictions, blocked PCR entries, cart persistence and print inclusion for the newly allowed swab cultures.


## Actual container photos (October 21, 2026)
- Replaced schematic container illustrations with a small locally hosted WebP photo atlas assembled from the user's 11 supplied container photos. Stored at `assets/images/cedars/container-photo-atlas.webp`.
- Photos are mapped to: adult BACTEC bottle pair, pediatric BACTEC bottle, Myco/F Lytic fungal bottle (Do Not Perform), white-top eSwab, UTM (Do Not Perform), cobas urine, cobas swab, BD Affirm/ATTS, gray urine culture, 3-vial ParaPak stool collection kit, and red/yellow swirl-top UA preservative tube. Unknown containers keep a neutral Verify placeholder rather than a misleading photo.
- Both performed and Do Not Perform test details use the appropriate photo when available; blocked tests are still unselectable.
- Print summaries use the same photo source as the app. The image sheet is hosted within GitHub Pages and does not require a third-party image URL.
- Stool PCR records now spell out the three vial types and caps shown: C & S Medium (yellow), 10% Formalin (pink), and Clean Vial (white).
- Uploaded photos are illustrative reference assets, **not** verified substitutes for the current manufacturer/Cedars kit. Other lab-specific specimen rules, approved scope, and Quest production files are unchanged.
- Simulated UI checks passed: performed-test list (14 rows), correct photo labels and sprite offsets, cart, collection/submission cards, 18 images in the sample printout, blocked fungal blood culture, and retained SharePoint PowerPoint reference.


## October 21: Expanded Cedars menu, drawn icon filtering, and external references
- Added the user's newly confirmed **body fluid culture with Gram stain** (sterile specimen cup, refrigerated), **enteric virus stool PCR** (all three ParaPak vials), and screenshot-supported options, including **Ureaplasma urealyticum culture MYCC** (urethral/vaginal/endometrial swab in UTM immediately) and **CSF routine culture LAB268** (sterile cup, 1 mL preferred / 0.5 mL minimum, immediate delivery).
- Preserved CSF as a separate urgent workflow, rather than applying the refrigerated body fluid instructions to it.
- Expanded the screen-supported swab culture, MRSA/VRE culture-screen, blood culture, Myco/F Lytic, stool sample, UTM, and QuantiFERON entries. Some historical assay/media information still requires current-monograph confirmation.
- Kept C. difficile blocked and explicitly labeled **Collection instructions conflict**: the provided references disagree about clean vial versus three-vial ParaPak. Do not assign a container from these sources alone.
- Added data-level `containerType` and visual filter choices with buttons showing the matching inline SVG drawings. User-selected container type filters the active directory, supports reset, and does not change saved-cart behavior.
- Replaced the previously deployed photo tiles with original inline SVG **drawings** designed to match the shape and cap colors shown in the owner's photos: adult/peds/fungal BACTEC, white eSwab, red UTM, yellow cobas urine/swab kits, Affirm/ATTS, gray urine culture, red/yellow UA swirl cap, three-vial ParaPak, clean stool vial, sterile cup and other supported containers. Actual photos are still stored as reference assets but no longer rendered.
- Moved the PowerPoint link out of the reference warning and into a separate **Collection references** section alongside a Lexicomp login link. **No credentials or passwords** were included in page code or stored in the repository.
- The collection and printout continue to use the same drawings with warnings that they are visual references only.
- Simulated JavaScript/DOM checks passed: 35 selectable records and 5 holds, 16 illustrated container choices, CSF/body-fluid sterile filter, enteric virus ParaPak filter, named test codes, printout inclusion, old cart cleanup, and absence of embedded Lexicomp credentials.
- Not independently tested in a live browser or real printer. Current Cedars/Lexicomp monographs must still be checked before operational use.
