---
name: web-learning-app
description: Safely inspect, maintain, and improve the standalone HTML learning application, its UI, accessibility, offline behavior, and preserved educational content.
---

# Web Learning Application Skill

## Use this skill when
Working on `index.html`, HTML/CSS/JavaScript behavior, learning-page navigation, search, local progress, notes, quizzes, printing, responsive layout or accessibility.

## Workflow
1. Read `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md` and `docs/CONTENT_PRESERVATION.md`.
2. Inspect the relevant DOM, styles, event handlers and existing behavior before editing.
3. Separate presentation changes from educational content changes.
4. Make the smallest change that preserves the standalone offline application.
5. Validate desktop and narrow-screen behavior, keyboard operation and reduced motion where relevant.

## Non-negotiable constraints
- Root `index.html` remains the authoritative, self-contained runtime.
- Do not add mandatory CDN, remote font, network request, backend or external runtime dependency.
- Preserve all learning text, page structure, exercises, answer keys, citations and legal references.
- Keep the Android asset copy byte-identical, including `manifest.json`, `sw.js`, icons, and `bg/` when those PWA files change.
- Keep manifest and service-worker URLs relative so the app can be hosted under `/AnFoVO-Lernkompendium/`. Register the service worker only for `http:`/`https:` and skip `android_asset`.
- Preserve search, navigation, local notes/progress, quiz and print behavior.
- Use semantic elements and accessible labels/focus states.

## Validation
Run `python tests/verify-build.py`, `npm run test:all` from `tests/`, and compare the Android asset copy with `cmp index.html android/app/src/main/assets/index.html`. Report commands that were not run.