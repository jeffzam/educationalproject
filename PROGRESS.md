# Development checkpoint

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

- Add a richer 3D presentation and accessible interaction layer. Current scenes are illustrated Canvas 2D with perspective, panning and scripted animations. Prioritise a walkable Mdina street with interactive evidence objects and more distinct present-day and reconstructed views.
- Extend curriculum mapping and confirm school adoption of older documents for 2026–27. Add subject-level mappings for Social Studies and lower-secondary Science, and broader coverage for Geography and Environmental Studies.
- Expand astronomy visuals, circuit construction and historical enquiry missions. The current circuit uses configurable templates, and historical characters use scripted questions.
- Add an optional provider-backed tutor and aggregate misconception reporting if needed for a later release. The current package uses contextual scripted hints and individual teacher feedback.
- Extend English text extraction for future Maltese translation, browser acceptance automation, low-spec device profiling, physical Android/Edge testing, assistive-technology testing and print-layout verification. Saving a PDF in the browser print dialog was not independently tested.
- Multi-device submission sync requires authenticated storage and school data-protection review. The current working flow uses local browser storage and downloadable files.

Next implementation priority from the original concept brief: polish the Forces and Motion teacher demonstration and develop Medieval Mdina into a richer same-viewpoint portal with source-based comparison of past and present. Preserve the shared outcome, reasoning and evidence workflow across all three modules.
