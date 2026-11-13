---
name: quality-release
description: Run the repository's static, browser, content-preservation, Android packaging, and release-readiness checks and report evidence accurately.
---

# Quality and Release Skill

## Use this skill when
Reviewing a change, diagnosing CI, preparing a release, checking content preservation, validating Android parity or writing a test/build report.

## Quality gates
1. Static contract: `python tests/verify-build.py`.
2. Browser regression: from `tests/`, run `npm ci` if needed, then `npm run test:all`.
3. Android asset parity: `cmp index.html android/app/src/main/assets/index.html`, and the same byte comparison for `manifest.json`, `sw.js`, the PWA icons, and `bg/`.
4. Android build: from `android/`, run `./gradlew --no-daemon clean :app:assembleDebug`.
5. Patch hygiene: `git diff --check`.
6. Review changed learning text, page structure, links, exercises, answer keys and source references separately from visual/code changes.

## Content integrity
- Treat educational content as protected.
- Identify learner-facing text changes explicitly in the review.
- Do not auto-approve or silently normalize changed learning text.
- Never fabricate legal/source references.
- If a content diff is intentional, require traceable rationale and human review.

## Release discipline
- Read `docs/RELEASE_PROCESS.md` and current version metadata.
- Do not create tags, releases, publish artifacts or alter signing credentials unless asked.
- Distinguish CI build success, APK signature verification, emulator tests and physical-device installation.
- Never mark a release ready when a required check is missing or failed.

## Reporting
Produce a concise evidence-based report with pass/fail/skipped status, command, relevant output and remaining risk. Do not infer successful tests from configuration alone.