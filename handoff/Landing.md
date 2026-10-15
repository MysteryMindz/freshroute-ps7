# Landing handoff

Implemented `src/pages/Landing.tsx`, `src/styles/landing.css` and two components under `src/components/hero/`. Default export contract is `{ onLaunch, onSignIn, isSignedIn? }`. No App, dashboard, engine, auth, dependency or global stylesheet edits were made by this worker.

## Direction contract

THESIS: Living Supply Chain. A batch-to-market mechanism earns the hero; fresh produce and the dispatch decision lead instead of invented performance claims.

OWN-WORLD: deep forest `#0d2d1e`, luminous lime `#c9f574`, cream `#f6f7f0`, Manrope display and DM Sans body with generic sans-serif fallbacks. Large expressive type and crisp route geometry share a restrained professional language. CSS is scoped beneath `.landing`; keyframes and component classes carry the landing prefix.

STORY: understand the shelf-life/demand/capacity problem, inspect a real-engine synthetic delay comparison, and launch the planner as a guest or choose sign in.

FIRST VIEWPORT: an asymmetric desktop composition puts a roughly 91px headline and launch action on the left, actual synthetic allocation paths on the right, and a pointer-responsive particle field behind both. Mobile stacks content and preserves a compact menu plus the full route preview.

FORM: user-approved Living Supply Chain direction; no concept tournament or seed was run by this worker. The signature interaction is the delay control recalculating actual optimized and FEFO metrics. Motion follows product flow: an initial route draw, traveling packets and subtly displaced particles.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Implementation and behavior

- Hero nodes, destination quantities and edges come from `createDemoScenario()` plus `analyzeScenario()`; no allocation or benefit values are hard-coded. Curves explicitly represent allocations, not roads.
- Inline delay demo adds 0–12 hours to every destination's travel time and recomputes using the shared engine. Net revenue, allocated quantities, spoilage and method labels are actual calculated outputs. FEFO and the selected plan use identical inputs.
- The model's revenue/waste trade-off remains explicit, with alternate copy when modeled spoilage is lower or equal. Failed analysis has a readable recovery message. Values displayed in the table are rounded for presentation.
- `Launch planner` calls `onLaunch`. `Explore guest demo` scrolls to the inline demo. Sign-in buttons call `onSignIn`, or `onLaunch` when already signed in. Mobile menu supports Escape, closes after selection, and waits for the menu to collapse before measuring scroll destinations.
- Canvas uses 64 deterministic particles, device pixel ratio capped at 2, ResizeObserver, pointer movement and IntersectionObserver. It cancels animation offscreen and on unmount. Reduced-motion preference keeps a static field; route packets and entrance animations stop. Local programmatic scrolling also respects that preference.
- No stock image, raster asset, fabricated customer proof, live data, new package or server capability was introduced.

## Verification performed

- `npx tsc --noEmit` passed after implementation and again after the mobile navigation correction.
- Real Chrome inspection at emulated 1440×1000 desktop and 390×844 mobile. Both layouts fit their viewport without horizontal page overflow. Full-page mobile and desktop views plus desktop first viewport were inspected.
- Delay 0: FEFO ₹10,510 net / 360kg allocated / 0kg spoiled; selected LP plan ₹12,490 / 360kg / 90kg. Delay +4: FEFO ₹10,310 / 360kg / 90kg; selected LP plan ₹12,230 / 360kg / 150kg. The visible values were compared to a separate browser call to the shared engine.
- Mobile menu opened with correct expanded state, showed real navigation links, and closed when selecting the demo.
- A final small correction defers scrolling until mobile menu collapse completes. The confirmation pass reached the demo at viewport top (within 0.1px) with the menu closed and no overflow. Delay +12 was also exercised: FEFO ₹10,260 and selected plan ₹11,130, both with 170kg modeled spoilage; the copy correctly switched to the equal-spoilage explanation.

## Remaining finish work / boundaries

Parent owns the final independent finish verdict, integration tests, shipping screenshots and DESIGN.md reconciliation for the expanded landing world. This worker's browser observations are a bounded implementation pass, not a comprehensive accessibility audit. Chrome screenshot attachments were visually inspected inline; the tool rejected direct saves to this workspace path, so no screenshot file is claimed here. No wider operational performance claim is made.

Requested fonts may use the browser fallback if remote font requests are unavailable. No specific installed fallback family is assumed.

