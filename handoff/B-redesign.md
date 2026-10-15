# Dashboard redesign handoff

Complete. Ownership released to parent for integration and deployment.

## Files owned and changed
- `src/pages/Dashboard.tsx`: copied all current App behavior before root-shell changes, corrected relative imports, default export renamed Dashboard.
- `src/styles/dashboard.css`: scoped `.living-dashboard` operational restyle, preserving global CSS foundation.

## Integration API
`<Dashboard onHome={() => ...} accountControl={...} />`

- `onHome` is optional, wired to sidebar brand and breadcrumb FreshRoute button.
- `accountControl` is optional ReactNode, rendered in header in place of the default FR avatar.
- Dashboard imports its own stylesheet. Parent should continue importing `src/index.css` as global foundation.
- No root shell, auth, shared domain types, engine, IO, data, dependency or Git files changed.

## Design and preserved behavior
- Forest sidebar with acid-lime active navigation, ivory workspace, dark revenue feature, larger and more legible typography and controls.
- Real allocation SVG redrawn with produce-colored source batches and forest market nodes, faint network grid and moving dashes following actual allocation paths. Animation is illustrative, not live tracking; heading explicitly says calculated allocations. Widths remain quantity-dependent.
- Reduced-motion preference disables particles/entrance motion. Numeric tables and large valid diagrams remain scrollable.
- All engine calculations, editing, scenario presets/import/export, staleness tracking, disruption controls, accounting comparison and explanations retained.
- Final contrast pass darkened supporting labels on light backgrounds.

## Verification
- `npx tsc --noEmit` passed after migration and prop wiring.
- Parent owns integrated browser verification with landing/auth/root shell; B has not claimed a completed rendered inspection.
- Dashboard does not add auth itself; header is ready for real auth controls supplied by the parent.
