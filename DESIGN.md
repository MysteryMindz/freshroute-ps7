---
name: FreshRoute — Living Supply Chain
description: Expressive forest-and-lime landing, paired with a calm ivory dispatch workspace.
colors:
  forest-hero: '#0d2d1e'
  forest-workspace: '#123f2e'
  lime: '#c9f574'
  paper: '#f6f7f0'
  ink: '#173c29'
  warm-warning: '#faf3e4'
typography:
  display: 'Manrope variable, self-hosted'
  body: 'DM Sans variable, self-hosted'
---

# Direction and authority

The user approved the Living Supply Chain redesign: a bold, animated landing page, a sign-in entry and a more professional dashboard. Product truth, calculations, data provenance and existing planner capabilities remain authoritative. Landing is Persuade; dashboard is Operate; sign-in is a focused entry flow.

## Landing

Deep forest and luminous lime form a large asymmetric first viewport. The headline leads, with actual batch-to-market quantities and paths beside it. A deterministic Canvas field responds to the pointer; the allocation paths carry traveling markers. The subsequent narrative explains inventory, allocation trade-offs and disruptions. A delay slider recomputes the shared engine on synthetic data. Metrics are actual modeled outputs, with unfavorable spoilage outcomes shown plainly. No customer proof, field savings or fabricated usage numbers.

## Dashboard

The fixed forest navigation and ivory workspace share the landing identity. Net revenue receives a dark feature surface; the remaining metrics stay quieter. The allocation network connects the actual computed batches and markets. Editors, capacity/delay controls, accounting comparisons, explanations and exports keep their original behavior. Navigation uses local scroll actions so section links cannot interfere with hash routing. Workspace edits survive internal home/sign-in navigation; refresh and OAuth navigation require exporting to preserve inputs.

## Account entry

A split forest/ivory composition frames GitHub entry and a prominent guest action. Current deployment has no provider project configuration. The disabled account button and explicit pending message prevent a false sign-in claim. When configured, PKCE returns to the repository root. No cloud scenario storage is implied.

## Tokens and implementation

Manrope and DM Sans variable fonts are self-hosted from the official Google Fonts repository, with SIL Open Font License text in public/fonts. Lucide is the icon system. Landing, dashboard and account styles are scoped to avoid collisions; existing foundational planner CSS remains. Browser focus and selection use the product palette. Responsive layouts collapse to a compact dashboard rail and stacked landing/account sections. Wide data tables and diagrams remain labeled scroll regions.

## Motion and accessibility

The hero is the principal expressive moment. Canvas animation pauses offscreen and on unmount; reduced-motion preference produces a static field and disables route animations. Scroll actions honor reduced motion. Controls retain labels, focus styling and text states. Do not imply an exhaustive accessibility certification from the bounded desktop/mobile checks.

## Invariants

- Keep synthetic provenance, units and stale-result messages visible.
- Export previous results only after current inputs are recalculated.
- Preserve baseline ties, negative changes and revenue/waste trade-offs.
- Never portray allocation geometry as geographic routing.
- Do not add decorative heading eyebrows or gradient text.
- Keep real account status explicit until live provider verification passes.


## Focused dashboard pages

Dashboard routes now separate Overview, Inventory & Markets, Allocations & Comparison, Scenario Lab, Stock & Price Reviews and Model & Assumptions. Only the current page content mounts; shared draft and result state stay in the parent dashboard. Navigation uses real hash links, browser history and aria-current. Overview shows the comparison and allocation network; detailed editors, tables and methodology no longer compete on one long page. Planning notes collapse behind a readable disclosure. Page entry uses a brief 180ms opacity/4px movement transition; reduced-motion disables movement. No new dependency was added.
