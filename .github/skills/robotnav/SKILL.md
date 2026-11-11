---
name: robotnav
description: Maintain the deterministic RobotNav browser-side mascot positioning engine, obstacle cache, observers, scrolling, scheduling, and lifecycle safely.
---

# RobotNav Engineering Skill

## Use this skill when
Changing `algorithm/robot-navigation.js`, its embedded copy in `index.html`, mascot placement, obstacle discovery, scroll roots, observers, cache invalidation, scheduling, motion or teardown.

## Required context
Read `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md` and `tests/run-browser-tests.cjs`. Inspect the current harness and engine before proposing changes.

## Behavioral contract
- RobotNav is deterministic client-side UI behavior, not an autonomous agent.
- No network requests, LLM integration, remote service or learning-content interpretation.
- Interactive content, text, buttons, form controls, dialogs, media, links and logos are hard obstacles.
- Place the mascot only in measured safe space near page margins. Fail closed by hiding it when safe placement is uncertain.
- Avoid polling, continuous DOM scans, observer self-trigger loops and layout thrashing.
- Respect nested scrolling, reduced motion, page changes and destruction/cleanup.
- Every observer, listener, scheduled callback and cache reference must have a defined lifecycle and teardown path.

## Change protocol
1. State the invariant being changed and the regression risk.
2. Prefer targeted updates over a full engine rewrite.
3. Extend `tests/robotnav-harness.html` or the existing browser test when a new invariant is introduced.
4. Keep the maintained source and embedded runtime synchronized.
5. Do not change educational content to make a navigation test pass.

## Validation
Run `python tests/verify-build.py` and `npm run test:all` from `tests/`. Verify that tests cover cache cleanup, nested scrolling, observer stability and `RobotNav.destroy()`. Report actual results only.