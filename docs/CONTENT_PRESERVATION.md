# Content Preservation Contract

This project is a learning compendium for § 8 AnFöVO NRW. Existing curriculum text and its structure are protected during visual and architectural work.

## Protected material
- All 70 existing learning pages.
- Learning objectives, explanations, examples, exercises and answer keys.
- Citations, source notes and legal references.
- Existing navigation, search, local notes/progress, quiz behavior and print behavior.

## Change protocol
1. Create a versioned working copy and preserve source snapshots.
2. Record a baseline inventory before editing.
3. Make visual changes independently of learning text.
4. Compare page count, headings, exercise count, solution count and source links after every content-affecting change.
5. Require explicit review for any proposed wording change or removal.
6. Never fabricate missing source content. Flag unresolved discrepancies.

## Current baseline
- HTML entry: `index.html`.
- Existing learning articles: 70 (verified in v2.9.0 static inspection).
- Static build checks: 20 passed / 0 failed after restoring the expected RobotNav marker.
- Real browser interaction tests: not yet verified; Playwright is not installed successfully in the current Windows environment.

[executed on device: lowpc (ecc80e91-2d19-4992-afcf-09a4342182c2)]