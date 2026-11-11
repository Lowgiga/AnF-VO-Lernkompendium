# AnF-VO-Lernkompendium

A local-first digital learning compendium for § 8 AnFöVO NRW.

## Product direction
A hybrid learning experience: a premium 3D book with a readable, accessible learning interface. The mascot is a white-silver metallic decorative robot with a graphite visor and restrained ice-blue eye lighting. Existing learning content is preserved.

## Start
Open `index.html` in a modern browser. The core application is designed to work locally without external runtime dependencies.

## Project structure
See [Architecture](docs/ARCHITECTURE.md), [Design System](docs/DESIGN_SYSTEM.md), and [Content Preservation](docs/CONTENT_PRESERVATION.md).

## Validation
```powershell
python tests/verify-build.py
```
Browser interaction tests are separate and must be run with the optional Playwright dependency installed. Static checks do not establish browser-runtime correctness.

## Mascot and navigation
RobotNav is a deterministic browser-side layout helper. The white-silver metallic robot is decorative and does not make network requests or act as an AI agent.

## License
No license is declared yet. Public visibility does not grant reuse rights. Select a license explicitly before publishing a reuse grant.

[executed on device: lowpc (ecc80e91-2d19-4992-afcf-09a4342182c2)]