# Release Process

1. Work only in a new versioned directory; retain previous releases unchanged.
2. Run `python tests/verify-build.py` and require zero failures.
3. Run browser tests in Chromium/Playwright when dependencies are available; record environment and results.
4. Verify all expected ZIP entries, especially `index.html`, `algorithm/robot-navigation.js`, `tests/` and `docs/`.
5. Generate SHA-256 checksums after final file changes.
6. Reopen the ZIP and verify entry count and checksums.
7. Publish a tagged GitHub release only after runtime tests and the license decision are complete.

Never label static checks as browser tests. Keep browser-runtime status explicit in the manifest and release notes.
