---
name: FreshRoute
description: A precise dispatch manifest for transparent produce allocation decisions.
colors:
  primary: '#164b43'
  primary-hover: '#0c3831'
  mineral-paper: '#f2f4f0'
  workspace: '#f5f6f3'
  surface: '#ffffff'
  operational-ink: '#20352f'
  manifest-ink: '#183c35'
  muted: '#55675f'
  divider: '#dce3dd'
  selected: '#e8f0eb'
  warning-paper: '#faf5e9'
  warning-ink: '#79551f'
  focus: '#317f71'
  manifest-focus: '#b78032'
typography:
  display:
    fontFamily: 'Manrope, sans-serif'
    fontSize: '40px'
    fontWeight: 650
    lineHeight: 1.13
    letterSpacing: '-.035em'
  headline:
    fontFamily: 'Manrope, sans-serif'
    fontSize: '29px'
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: '-.8px'
  title:
    fontFamily: 'Manrope, sans-serif'
    fontSize: '18px'
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: '-.3px'
  body:
    fontFamily: 'DM Sans, sans-serif'
    fontSize: '14px'
    lineHeight: 1.5
  label:
    fontFamily: 'DM Sans, sans-serif'
    fontSize: '13px'
    fontWeight: 600
rounded:
  field: '4px'
  control: '5px'
  panel: '7px'
  manifest: '12px'
spacing:
  compact: '8px'
  control: '13px'
  panel: '23px'
  workspace: '32px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
    rounded: '{rounded.control}'
    height: '40px'
    padding: '0 13px'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '#3f5b4d'
    rounded: '{rounded.control}'
    height: '40px'
    padding: '0 13px'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.operational-ink}'
    rounded: '{rounded.panel}'
  input-number:
    backgroundColor: '{colors.surface}'
    textColor: '#234c33'
    rounded: '{rounded.field}'
    padding: '9px'
  nav-selected:
    backgroundColor: '{colors.selected}'
    textColor: '{colors.primary}'
    rounded: '{rounded.control}'
    padding: '12px 11px'
---

# Design System: FreshRoute

## Overview

**Creative North Star: "The Dispatch Manifest"**

FreshRoute is a calm, readable decision surface. Mineral paper, forest and teal ink, fine horizontal rules and restrained brass warnings make inventory and accounting the visual focus. The current direction replaces the earlier oversized promotional hero, luminous lime and decorative particles.

The interface pairs compact operational controls with open space around decisions. Synthetic provenance, units, assumptions and unfavorable trade-offs are part of the hierarchy. This document records the implemented CSS; it does not claim a completed independent visual or accessibility review.

**Key Characteristics:**

- Precise ledgers with aligned quantities and explicit units.
- White operational panels over light mineral backgrounds.
- Forest actions and quiet selected states.
- Brass warnings paired with explanatory text.

## Colors

### Primary

Forest teal identifies actions, active navigation and calculation controls. The primary hover token describes the landing action; workspace primary buttons use their observed lighter hover treatment (`#246457`).

### Neutral

Mineral paper frames the manifest. Workspace and white surfaces separate the navigation, scenario bar and result panels. Operational ink carries body content; muted ink carries supporting labels. Dividers provide structure without heavy shadows.

### Secondary

Warm warning paper and warning ink identify revenue/waste compromises. They accompany readable descriptions and never replace them. Manifest focus uses brass while the global keyboard focus uses teal.

**The Meaning with Labels Rule.** Every result state retains text, units or an icon with an accessible label; color alone does not explain the result.

## Typography

Manrope supplies headings and brand text; DM Sans supplies controls, tables and body copy. Both variable fonts are self-hosted as TrueType files at `public/fonts/Manrope.ttf` and `public/fonts/DMSans.ttf`, with `font-display: swap` and accompanying OFL licenses. Both retain sans-serif fallbacks; loading behavior is not a guarantee that every browser has rendered the custom face.

The normative frontmatter captures the current desktop roles. The landing headline is compact (40px, falling to 33px below 620px); the workspace heading is smaller and denser. Operational copy generally ranges from 12px to 14px, with supporting table labels as small as 11px. Quantities use tabular numerals. Account story headings remain distinct, using a responsive 33px–48px range on larger screens and 31px below 750px.

## Layout

The landing container is capped at 1440px with 42px horizontal padding; above 1600px its cap becomes 1500px. Its manifest uses inventory, allocation ledger and controls columns (245px, flexible, 265px). Below 960px controls move beneath the first two columns; below 620px all sections stack and inventory uses a two-column batch list. Tables scroll locally where necessary. The compact introductory composition leaves the live stock, allocations, disruption controls and FEFO comparison as the principal desktop evidence.

The workspace has a fixed white sidebar (212px), a 66px topbar and 32px content gutters. The content cap is 1530px. At 1200px the sidebar becomes 190px; at 950px it becomes a 65px icon rail. Below 650px the workspace gutters become 17px and editors, headers and notes stack. Wide result and input tables retain horizontal scrolling.

Six focused workspace pages share scenario and result state: Overview, Inventory & Markets, Allocations & Comparison, Scenario Lab, Stock & Price Reviews, and Model & Assumptions. Navigation indicates the current route. The landing handoff continues the actual scenario into the workspace.

## Elevation & Depth

Depth is primarily tonal and bordered. Workspace cards are flat. The landing manifest has a very faint ambient shadow (`0 10px 28px #213e2e05`). Transient shell authentication errors use a stronger shadow (`0 8px 32px #193b271a`) to distinguish their overlay position. Do not introduce glass, neon glows or heavy floating cards.

## Shapes

Fields have tight corners; panels and buttons use restrained rounding. The larger manifest container is gently rounded while interior rules remain straight. Produce dots and status markers are small circles with a specific labeling role, not background decoration.

## Components

### Buttons

Primary workspace buttons use the forest token, white text, a thin matching border and compact label weight. Secondary buttons are white with muted green ink and a fine border. Landing primary actions have a slightly larger 43px minimum height, 7px corners and 11px by 17px padding. Disabled controls visibly dim and use a disabled cursor. Keyboard focus remains explicit.

### Cards and ledgers

White bordered panels group related work. Headers use clear titles and short explanatory copy. Comparative tables align numerical columns to the right and keep FEFO, optimized values and trade-offs readable. Do not isolate a favorable number from its accounting context.

### Inputs and disruption controls

Number fields retain visible labels, trailing units and text errors. Range controls pair their label with the current numeric value and endpoint labels. Pending calculations and recalculation actions explain whether shown results match edited inputs.

### Navigation and account entry

The selected workspace item has a pale green background and an inset forest rule. Account entry uses pale green and mineral surfaces with the same restrained action hierarchy. Guest entry remains prominent. Account configuration and verification status must remain explicit; no cloud scenario storage is implied.

### Allocation evidence and motion

Allocation connections represent modeled assignments rather than geographic routes. The current interface does not use continuous decorative particles. Primary landing actions have short color and press transitions; reduced-motion preferences disable transitions and movement. Route and account code load on demand; guest use does not require account setup. Keep motion subordinate to reading and recalculation.

## Do's and Don'ts

- **Do** preserve visible synthetic provenance, assumptions, units and unfavorable comparisons.
- **Do** use the current CSS tokens and compact operational typography when extending a screen.
- **Do** keep tables and diagrams locally scrollable on narrow screens.
- **Do** preserve the live scenario when moving from the manifest into planning.
- **Don't** reintroduce oversized heroes, neon lime, fake maps or decorative particle fields.
- **Don't** portray simulated outcomes as validated operational performance.
- **Don't** imply completed provider verification or cloud scenario storage.
- **Don't** claim exhaustive visual, accessibility or performance certification from this documentation pass.
