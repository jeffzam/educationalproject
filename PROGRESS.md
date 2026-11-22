# Development checkpoint

**Release status: in development.**

## Malta 2050 comparison and curriculum · 22 November 2026

Students can select a baseline and an option from their recorded scenarios, compare their settings and measures, and examine signed changes in cost, exposure, habitat, water or electricity. Reports include that comparison. Sustainable Energy now includes a Year 10 Geography mapping and an Energy and Water Agency source. Urban Planning includes a Year 7 Science mapping and guidance from Malta’s Environment and Resources Authority. All twelve activities now have a source-checked default outcome.

The build, 22 automated tests and six browser acceptance checks passed. Browser checks included selecting earlier plans, persistence on reload, recovery after removing a selected trial, the Energy and Urban Planning curriculum links and the comparison table at a 390 px viewport. Model results and costs are fictional.

## Classroom accessibility and browser acceptance · 22 November 2026

The simulation toolbar now has a keyboard-operable shortcut to its variables. Small-screen visual order follows the reading order. Curriculum filtering announces the number of matches, teacher review keeps focus after saving, and the continuous science illustrations stop when reduced motion is enabled or the tab is hidden.

A local browser acceptance suite passed all five checks: the seven navigation destinations, phone-width layout and forces evidence, the Mdina keyboard and portal workflow, reduced motion after reload, and preservation of the Year 9 water outcome through teacher review. The build and 21 Node tests passed. The ordinary server returned 404 for the test route, and the production build excludes the runner.

## Cross-subject curriculum assignments · 22 November 2026

The planner now supports multiple outcome mappings for the same activity. Assignment links carry the selected outcome through the student mission, submission, review and exports. Three verified mappings add Year 6 Social Studies for Roman Malta, Year 7 Science for States of Matter, and Year 9 Geography for Water Management. The Water Management lesson also includes a source from Malta’s Energy and Water Agency. Earlier water submissions retain the proposed outcome under which they were recorded.

The build and 21 automated tests passed. Browser checks verified the Year 9 filter, lesson and assignment link, water case recording, submission and teacher report, and both alternate outcome links.

## Time Portal history missions · 22 November 2026

Roman Malta now asks students to test claims against the scope of the archaeological evidence. Medieval Mdina records comparisons at all three stops. Malta Under the Knights adds a keyboard-operable timeline with feedback and links to the curriculum, Heritage Malta and the Order’s own historical account. Student choices and notes are included in teacher review and exports.

The build and 20 automated tests passed. Browser checks verified incorrect and correct chronology feedback, keyboard reordering, saved order after reload, the historian report download, source-reliability feedback, Mdina note persistence and layout at a 390 px viewport.

## Electricity circuit workbench · 22 November 2026

Students can wire the terminals of six bench components directly, remove individual wires and load series or parallel examples. The solver calculates current and bulb power from those connections, with explicit open, short and disconnected battery states. The investigation records wiring and results in its report. Component positions are fixed and the model uses ideal DC components.

The build and 19 automated tests passed. Browser checks verified a hand-wired single-bulb circuit, series and parallel readings, draft wiring after reload, short circuit detection and recovery, report download, and phone-width layout.

## Space and Earth investigation · 22 November 2026

The globe and result cards now share the same solar geometry. Students can move Malta between the lit and dark sides, switch to an orbital view to examine seasonal position and tilt, and see the illuminated fraction of the Moon change in a separate inset. The day-and-night activity maps to 5.9.1 in the October 2026 Year 5 Primary Science outcomes. Sizes, distances and the lunar orientation are illustrative.

The build and 17 automated tests passed, including day, night, horizon, seasonal daylight and lunar illumination checks. A browser check verified the midnight and new Moon responses, orbital viewpoint, recorded trials, curriculum link and layout at a 390 px viewport.

## Forces and Motion teacher demonstration · 22 November 2026

The lab now shows the prediction before the controls reveal a two-second result. The smoother and rougher presets change only friction, and the latest comparison names every setting that changed. The classroom demo carries the recorded prediction and trials into educator review and the downloadable investigation report. A fictional example remains available.

The build and 17 automated tests passed. Browser checks followed the five demo stages, verified a 9.20 m versus 2.49 m comparison with all other settings fixed, and confirmed that the live prediction, comparison and teacher feedback carried through to the report. The cart animation remains schematic.

## Medieval Mdina checkpoint · 22 November 2026

Students can walk between three illustrated stops using buttons or the arrow keys. The portal preserves the selected stop when switching eras. Each on-scene evidence button opens and focuses the corresponding dossier entry, which students can record in their notebook.

The fixed viewpoint lets students compare the same point on the street in both eras. The scene uses perspective drawing on Canvas 2D and three discrete camera positions so it works without WebGL. Each view is an educational illustration. The dossier provides a way to check claims and distinguish them from imagined details.

The build and 16 automated tests passed. Browser checks verified movement in both directions, the first and last stop boundaries, era switching at the same stop, opening and focusing the matching evidence, marking evidence examined, and layout at a 390 px viewport. The full project acceptance review is still pending.

## 22 November 2026

The first working local release includes twelve investigations: five science models, three historical reconstructions and four sustainability scenarios. All main areas are navigable. Seven curriculum records link verified identifiers to official documents and four objectives are marked as proposed. Teaching materials, timed differentiation, deep links, local evidence notebooks, teacher review, text and CSV exports, browser print, and a resettable five-minute demo are in place.

## Tests executed

- Build and local HTTP smoke check passed with Node 24.22.1. The homepage returned HTTP 200.
- 15 Node tests passed using `node --test --test-isolation=none`. Coverage includes curriculum-link integrity, all nine simulation models at default and extreme inputs, and numerical checks for force, current, phases, seasons, flooding, water, solar, urban planning and ecosystem behaviour.
- In the desktop in-app browser, verified seven navigation destinations, two force trials, portal transition and source recording, interpreter response, two flood scenarios with budget changes, lesson generation, teacher feedback, demo reset and exit.
- Verified notebook persistence after reload and submission to the local educator view. Confirmed the report and evidence CSV produced browser downloads.
- At a 390 by 844 browser viewport, verified current changed after closing a circuit, entered and navigated the Medieval Mdina scene and confirmed no horizontal overflow on the tested views. Reduced-motion mode was toggled during the demo.
- Browser testing exposed a demo control panel that disappeared after assessment. The fix passed the full demo retest.

## Remaining work

- Add a richer 3D presentation and accessible interaction layer. Current scenes are illustrated Canvas 2D with scripted animations. Mdina has a three-stop perspective tour and interactive evidence. Continuous camera movement and richer reconstruction detail remain open.
- Confirm school adoption of older curriculum documents for 2026–27 and extend mappings where pilot teachers need additional coverage.
- Extend the historical missions with further source types and qualified perspectives. Historical characters use scripted questions.
- Add an optional provider-backed tutor and aggregate misconception reporting if needed for a later release. The current package uses contextual scripted hints and individual teacher feedback.
- Extend English text extraction for future Maltese translation, low-spec device profiling, physical Android/Edge testing, assistive-technology testing and print-layout verification. Saving a PDF in the browser print dialog was not independently tested.
- Multi-device submission sync requires authenticated storage and school data-protection review. The current working flow uses local browser storage and downloadable files.

Next implementation priority: review the original acceptance brief against the current build, run print and accessibility checks where supported, and identify the remaining decisions for a school pilot.
