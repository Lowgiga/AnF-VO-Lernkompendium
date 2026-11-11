# Architecture
## Runtime architecture
index.html is the self-contained application shell and offline runtime. Existing learning content, navigation, search, progress, notes, quizzes and print behavior remain inside the preserved application.
algorithm/robot-navigation.js is the maintained source module for the deterministic RobotNav algorithm. The embedded runtime in index.html remains authoritative until a tested build pipeline proves that extraction and bundling preserve offline operation.
## Logical components
1. Content layer: existing learning pages and learning assets.
2. Presentation layer: hybrid book stage plus conventional accessible reading interface.
3. Navigation layer: table of contents, page navigation, search and progress.
4. RobotNav layer: DOM inventory, obstacle cache, position planner, motion controller and event scheduler.
5. Persistence layer: existing browser-local progress and note storage.
6. Quality layer: static build verification and browser harness.
## RobotNav contract
- Deterministic browser-side behavior; no LLM, agent loop or external service.
- Treat text, buttons, inputs, dialogs, media, links and logos as hard obstacles.
- Place the mascot only in verified free space near page margins.
- Debounce or schedule layout/scroll events; avoid continuous expensive DOM scans.
- Stop or rest while reading and honor reduced-motion preferences.
- Fail closed: if safe placement cannot be established, hide the mascot rather than cover content.
## Target repository structure
See the root directory tree in README. assets/book and assets/robot are reserved for local visual assets. Keep the HTML self-contained until asset extraction is validated.
## Change boundaries
Visual and navigation changes must not rewrite learning text. Content changes require a separate review and a content-diff report. Preserve sources and prior release archives.

[executed on device: lowpc (ecc80e91-2d19-4992-afcf-09a4342182c2)]