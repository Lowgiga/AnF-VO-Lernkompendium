# Design System
## Product direction
Hybrid learning interface: a spatial 3D book is the visual anchor; conventional document navigation and readable learning pages remain the primary interaction model.
## Palette and materials
- Book: deep forest green with restrained red cover accent.
- Technical surfaces: graphite and neutral dark grey.
- Reading surface: warm ivory / paper white with high text contrast.
- Robot: silver metallic ceramic body, graphite visor and joints, ice-blue eye illumination; restrained red chest insignia.
- Controls: clear focus indicators, consistent touch targets, visible active states.
## Robot behavior
The mascot is decorative and deterministic. It is not an AI agent and does not make decisions about learning content. It may reposition around page margins, gesture on page transitions and rest while the learner reads. It must not cover text, controls, dialogs, logos or navigation.
## Accessibility and responsive behavior
- Preserve semantic learning content and keyboard navigation.
- Respect prefers-reduced-motion; disable nonessential motion.
- Hide or reduce the 3D stage on narrow screens when it competes with content.
- The learning interface must remain complete if 3D rendering or robot navigation is unavailable.
- Maintain readable contrast and visible keyboard focus.
## Runtime constraints
No external CDN, remote font, runtime network request or mandatory server dependency. The primary deliverable remains a self-contained HTML file until browser and offline tests validate any modular runtime split.

[executed on device: lowpc (ecc80e91-2d19-4992-afcf-09a4342182c2)]