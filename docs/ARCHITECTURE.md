# Technical specification

The platform is a dependency-free static application in browser-native JavaScript, HTML and CSS. Node runs the local HTTP server, build copy and tests. The browser uses structured outcome and activity records, deterministic models and a Canvas 2D layer for perspective illustrations. Every activity also has text controls, numeric or textual results and an evidence notebook. Reduced motion uses the device preference unless changed in the header.

## File responsibilities

| File | Purpose |
| --- | --- |
| `src/content.js` | Activity definitions, curriculum references, inquiry prompts, historical dossiers and rubric criteria |
| `src/models.js` | Control definitions and deterministic simulation functions |
| `src/scenes.js` | Procedural scenes and animation drawn from simulation inputs and outputs |
| `src/app.js` | Hash routing, assignment links, lesson generator, evidence collection, review, exports and demo |
| `public/style.css` | Responsive, keyboard focus, motion and print styles |
| `test/models.test.js` | Curriculum integrity and model behaviour tests |

## Extend an activity

1. Add or confirm the source record. Give it a stable ID, stage, year, subject, strand, official code where available, summary, URL, document/version and verification status. Keep proposed objectives explicitly marked.
2. Add the activity with a stable ID, group, title, outcome reference, inquiry question and task. Keep scope explicit if an activity only addresses part of an outcome.
3. Add a model with controls, assumptions and a deterministic input-to-results function, or add a source dossier with clearly identified interpretation. Extend the scene function and ensure equivalent text results and operable keyboard controls.
4. Add an edge-case or behaviour test where useful. Check the investigation, submission, review and report in the browser.

## Data flow

A draft stores the anonymous ID, notebook responses, current settings, trial results, inspected source identifiers, history conversations and differentiation level. A submission snapshots the draft. Teacher assessment is attached separately and can be revised. Lesson templates calculate timing from the requested duration, combine published curriculum references with local teaching guidance and produce an assignment deep link. Curriculum labels, source links and outcome paraphrases are maintained in source files. English UI strings are currently spread across the content and view modules, and a complete localisation dictionary is pending.

Scenario results are reproducible for a given input. The models are classroom approximations and their screens include the relevant assumptions. The visual layer uses no WebGL, external assets or tracking. A provider-backed tutor would require student-safety design and an authenticated server-side proxy holding the provider credential. Core lessons currently use scripted hints and differentiation.
