# Classroom pilot acceptance

Reviewed 22 November 2026 against Part 14 of the development brief. The current build is ready for a local educator demonstration with fictional data. School pilot acceptance remains open.

| Requirement from the brief | Evidence in the current build |
| --- | --- |
| Install and build | Node.js 24 builds the static site without runtime dependencies. The regular local server returned HTTP 200. |
| Navigation and three applications | Browser acceptance traversed all seven main destinations and opened all twelve activities. |
| Working interactive experiences and model state | Node tests checked all nine simulation models. Browser acceptance exercised forces, flooding, solar, water and history. Separate browser checks exercised circuit construction and Earth–Moon controls. |
| Enter and preserve student reasoning | Browser acceptance verified a written prediction persisted after reload and was carried into teacher evidence. History mission choices and notes were checked separately. |
| Connect activities to outcomes and trace sources | Every activity has a source-checked default outcome. The curriculum register names the official document, code and relevant activity. Browser acceptance verified a selected Year 9 outcome through lesson generation, student submission and teacher review. |
| Generate reports and review evidence | Browser sessions confirmed report and CSV downloads. Browser acceptance verified the teacher review receives the chosen outcome and case source, saves feedback, retains focus and requests printing on the report. Saving and inspecting an actual PDF from the print dialog remains open. |
| Desktop and mobile-size workflows | Tested in the desktop in-app browser, including key investigations at a 390 px viewport. Physical Android, Microsoft Edge and classroom hardware tests remain open. |
| Accessibility and reduced motion | Verified keyboard navigation and focus in the affected workflows, and reduced motion after reload. A screen-reader audit and broader accessibility review remain open. |
| Clear errors | Browser acceptance verified an empty outcome search and a request to submit without a recorded trial. |
| No exposed API secrets and fictional demonstration data | The bundled browser code contains no API provider integration or keys. Demo records are fictional and isolated from normal browser-local work. |

## Reproduce the checks

1. Run `node --test --test-isolation=none` for the 22 model and content checks.
2. Run `node scripts/serve.mjs --qa`. Open the local test route at http://127.0.0.1:4174/__qa for the nine browser acceptance checks.
3. Use **Run the 5-minute demo** on the homepage. Record the two cart trials, inspect the Roman mosaic, compare the fictional coastal intervention, check the three outcome links and review the live cart evidence.

## Remaining pilot checks

- Confirm the older official syllabus references are the versions used by the participating school for 2026–27.
- Test print output, screen-reader use, Android and Edge on representative equipment.
- Review the 2.5D scenes, locally stored fictional evidence and scripted guidance against pilot teaching needs. Authenticated multi-device submissions, true 3D environments and provider-backed tutoring remain outside the current demonstration.
