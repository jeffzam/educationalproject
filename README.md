# Malta Learningverse

A browser-based educational platform for Maltese primary and lower-secondary classrooms. It contains twelve interactive activities across Science Lab 360, Time Portal Malta and Malta 2050.

## Run locally

Requires Node.js 24. The application has no third-party runtime dependencies. From the project folder run:

```powershell
node --test --test-isolation=none
node scripts/serve.mjs
```

Open http://127.0.0.1:4173/. The server builds the static site into `dist/` when it starts. Run `node scripts/build.mjs` after source edits, then reload the browser.

For repeatable browser acceptance checks, run `node scripts/serve.mjs --qa` and open http://127.0.0.1:4174/__qa. The suite uses a separate local origin and fictional evidence. The test runner is excluded from the deployable files.

## Use it in a lesson

- **Educators** can select a sourced or proposed outcome, generate a 20–60 minute differentiated lesson, preview the activity and share a link. Use a shared HTTPS host for links intended for other devices.
- **Students** can use a model or evidence desk, keep a notebook and download a report. On the same browser they can submit the notebook for educator review.
- **Educator review** shows the submitted notebook, a proposed rubric, editable teacher judgement, feedback, and outcome coverage. It exports text reports and CSV. The print control uses the browser's Save as PDF destination.
- **Demo** starts from the homepage. Step through the five prompts. Reset returns the demonstration to its initial state. The demo uses a temporary session and fictional evidence.
- **Teaching materials** are in the Resource Library and [classroom guide](docs/TEACHING.md).

## Deploy the static files

Run `node scripts/build.mjs` and deploy `dist/` to an approved static HTTPS host. For Netlify, use a connected repository with the provided `netlify.toml`, or upload the built `dist/` folder in the Netlify dashboard. Set the build runtime to Node 24 if needed. Links use hash routing along with the deployment's own base URL.

This version uses browser storage for anonymous demonstration work. All users of the same browser profile and origin share that local data. The educator area applies no sign-in or access control. Use fictional learner IDs and sample work. For a school-wide rollout with pupil records, the project requires authenticated roles, a teacher-controlled sharing model, retention controls, accessible deletion and school data-protection review. Source links open external sites independently of the app.

## Source and verification

- [Curriculum source register](docs/CURRICULUM.md)
- [Technical specification and extension guide](docs/ARCHITECTURE.md)
- [Development checkpoint and testing report](PROGRESS.md)
