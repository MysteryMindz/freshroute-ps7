---
name: FreshRoute
description: A light cream and forest green workspace for produce dispatch decisions.
colors:
  forest: "#234d35"
  forest-hover: "#326342"
  cream-workspace: "#f6f7f2"
  white-surface: "#ffffff"
  primary-ink: "#28352b"
  operational-ink: "#4c5d40"
  divider: "#e6e8df"
  featured-surface: "#edf2df"
  lab-surface: "#f0f2e6"
  allocation-olive: "#a0ba71"
  warning-surface: "#faf3e4"
  warning-ink: "#695019"
  focus-olive: "#7e9c4a"
  nav-selected-surface: "#edf2e6"
  nav-selected-ink: "#305036"
  field-ink: "#536849"
  chip-surface: "#f7f9f2"
  chip-ink: "#607848"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "34px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-1.6px"
  metric:
    fontFamily: "Manrope, sans-serif"
    fontSize: "30px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-1.3px"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "17px"
    fontWeight: 650
    letterSpacing: "-0.5px"
  body:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "14px"
    fontWeight: 400
  button:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "11px"
    fontWeight: 600
  field:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "11px"
  nav-selected:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "12px"
    fontWeight: 700
  chip:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "9px"
rounded:
  chip: "4px"
  field: "5px"
  button: "7px"
  navigation: "8px"
  metric: "10px"
  card: "11px"
spacing:
  control-gap: "8px"
  compact-gap: "12px"
  metric-gap: "15px"
  panel-gap: "20px"
  desktop-gutter: "40px"
  mobile-gutter: "13px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.white-surface}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "0 14px"
  button-primary-hover:
    backgroundColor: "{colors.forest-hover}"
  button-secondary:
    backgroundColor: "{colors.white-surface}"
    textColor: "#52634c"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "0 14px"
  input-number:
    backgroundColor: "{colors.white-surface}"
    textColor: "{colors.field-ink}"
    typography: "{typography.field}"
    rounded: "{rounded.field}"
    padding: "8px 7px"
  nav-selected:
    backgroundColor: "{colors.nav-selected-surface}"
    textColor: "{colors.nav-selected-ink}"
    typography: "{typography.nav-selected}"
    rounded: "{rounded.navigation}"
    padding: "13px"
  provenance-chip:
    backgroundColor: "{colors.chip-surface}"
    textColor: "{colors.chip-ink}"
    typography: "{typography.chip}"
    rounded: "{rounded.chip}"
    padding: "5px 7px"
  card:
    backgroundColor: "{colors.white-surface}"
    rounded: "{rounded.card}"
  metric-featured:
    backgroundColor: "{colors.featured-surface}"
    rounded: "{rounded.metric}"
    padding: "18px 20px 15px"
---

# Design System: FreshRoute

## Overview

FreshRoute uses a light cream workspace, white operational surfaces and forest green actions. Compact controls, measured typography and an allocation diagram support the work of reviewing produce inventory and comparing calculated dispatch outcomes.

The interface uses subdued olive accents and flat tonal grouping. Provenance labels, visible trade-offs and explicit field labels carry operational meaning; decorative heading eyebrows have been removed from the implemented page.

**Key Characteristics:**
- Cream and forest operational palette.
- Compact, bordered surfaces with restrained corner rounding.
- Tabular metric figures and explicit units.
- Allocation links rather than geographic route imagery.

This document records the implemented App and stylesheet. The final independent finish review marked four requested fixes Ship: operational text contrast, discoverable sideways scrolling, assumptions navigation and decorative eyebrow removal. That verdict is bounded to those fixes; it is not a comprehensive accessibility or operational validation.

## Colors

The palette pairs forest actions with cream and white surfaces, using olive for allocation cues and warm amber for attention. Exact extracted values are normative in the frontmatter.

### Primary
- **Forest:** primary calculation actions and brand icon; its lighter hover variant signals availability.
- **Allocation Olive:** allocation legend links, reinforced by labels and quantities.

### Secondary
- **Warning Ink / Warning Surface:** stale-result and trade-off notices use dark amber text on a pale warm surface.

### Neutral
- **Cream Workspace / White Surface:** distinguish the application canvas from work panels.
- **Primary Ink / Operational Ink:** headings and readable secondary operational information. The final operational ink overrides many earlier muted declarations in the stylesheet.
- **Divider:** thin panel borders and separators.
- **Featured Surface / Lab Surface:** distinguish the featured metric and disruption controls without elevation.

**The Meaning with Labels Rule.** Color accompanies text, units, labels or icons; it does not carry a result's meaning alone.

## Typography

**Display Font:** Manrope, with generic sans-serif fallback.
**Body Font:** DM Sans, with generic sans-serif fallback.

The stylesheet requests both families from Google Fonts with `display=swap`. A blocked or unavailable request renders the browser's sans-serif fallback; no particular installed fallback family is guaranteed. The token stacks describe source requests, not proof that remote fonts loaded.

### Hierarchy
- **Display:** page heading with compact negative tracking; its base token scales to smaller screens and wide desktops.
- **Metric:** prominent Manrope figures use tabular numerals and separate, smaller unit text.
- **Title:** Manrope section titles; the disruption card uses a larger title.
- **Body:** the root size is a base, not the universal content size. Operational descriptions and table content commonly use explicit sizes between 10 and 12px after the final overrides.
- **Label:** buttons, navigation, fields and provenance chips use compact DM Sans. Metric baseline and difference text is 11px on desktop and 10px at widths up to 800px.

## Layout

The fixed left navigation is 225px wide at the base desktop size. The main workspace has a maximum width of 1580px and a 40px horizontal gutter. Four metric columns precede a two-column planning area; its diagram-to-controls ratio is 2.2:1 with a minimum 265px control column and 20px gap.

Responsive thresholds are 1600px for wide screens and maximum widths of 1250px, 1020px, 800px and 520px. Navigation narrows to 190px, then a 72px icon rail, then a 54px mobile rail. At 800px and below, metrics become two columns, the planning panels stack and insights become a single column. The narrowest workspace uses 13px horizontal gutters.

Diagram and table regions retain the width needed for their content and scroll independently. At widths up to 800px they display explicit sideways-scroll guidance. Regions are labeled and keyboard focusable, with an inset focus outline. The diagram retains a 430px minimum width on narrow screens and a 490px maximum scrolling region height.

## Elevation & Depth

Panels have no box shadows. Depth comes from cream, white, pale olive and warm off-white surfaces, thin borders and spacing. Focus outlines provide a separate interaction layer. Button color changes use a 150ms transition; reduced-motion preference disables transitions and smooth CSS scrolling. Programmatic assumptions/input scrolling also checks the reduced-motion preference and uses immediate scrolling when requested.

## Shapes

Small chips are the tightest rounded elements, fields and buttons are modestly curved, and cards use slightly larger corners. Borders are generally 1px. Small circular status markers, produce dots and the avatar complement the rectangular work panels. Rounding differentiates component roles rather than creating pill-shaped controls throughout.

## Components

### Buttons
Primary actions use forest with white text; secondary actions use white with a subtle border. The base minimum height is 38px, with compact variants for exports and narrow-screen heading actions. Hover changes the fill. Keyboard focus uses a 3px olive outline offset by 3px. Disabled buttons use 45% opacity and a disabled cursor.

### Chips
Compact bordered provenance and solver-method tags sit on pale surfaces. Text states provenance or solver method; a dot is supplemental. Amber method/status variants use warm fills and borders.

### Cards / Containers
White bordered cards group each operational stage. The featured metric and disruption lab use tonal surfaces. Header padding is commonly 22px by 23px at the base desktop size, with responsive reductions. Content padding varies by panel purpose rather than using one universal inset.

### Inputs / Fields
Numeric inputs sit in white bordered wrappers with a trailing unit. The focused field receives an inset 2px olive outline. Invalid fields use a red-toned border and an adjacent message. Range controls use olive accents with visible values and end labels.

### Navigation
Desktop navigation uses labeled Lucide icons with a pale selected fill; the current planner entry has heavier text and a dot. The compact rail hides visible labels but preserves icon control text in the markup. Inventory opens its editor; model notes open and scroll into view. The planner's selected styling is static rather than a scroll-tracking active-section system.

### Allocation Diagram and Results
The SVG connects batch inventory to destination allocations with quantities and arrival information. It is a schematic, not a road map. Table tabs switch between allocations and baseline accounting. Input edits show a stale banner and previous-result labels; result exports remain disabled until recalculation. Unfavorable changes remain visible. Price-review suggestions are explicitly separate from modeled sales.

## Do's and Don'ts

### Do:
- **Do** retain cream, white and forest as the main operational hierarchy.
- **Do** give secondary operational copy the final dark text treatment.
- **Do** preserve explicit units, provenance labels and unfavorable metric changes.
- **Do** keep wide diagrams and tables labeled, focusable and visibly scrollable on narrow screens.

### Don't:
- **Don't** reintroduce decorative heading eyebrows.
- **Don't** use color as the only explanation of a result or status.
- **Don't** present allocation links as geographic routes or simulated results as field evidence.
- **Don't** imply that a requested web font necessarily loaded in the user's browser.

