# FreshRoute interface

## Product context
Operate mode: a produce distributor reviews inventory, destination demand and capacity, calculates a plan, and evaluates disruptions. The first viewport must expose the scenario, actual comparison metrics and the allocation mechanism. All examples are labeled synthetic.

## Visual system
- Cream workspace (#f6f7f2), white work surfaces, dark forest actions (#214e36), olive allocation accents and warm amber for attention.
- Text uses DM Sans/Manrope with functional sans-serif fallback. Body and operational secondary text must meet 4.5:1 contrast; no information depends on color alone.
- Fixed desktop navigation, central allocation diagram and adjacent disruption controls; narrow screens stack the controls and expose labeled, focusable horizontal scrolling for diagrams/tables.
- Input/output grouping follows the dispatch workflow. Use compact controls, consistent Lucide line icons, visible keyboard focus and tabular numbers.
- Avoid decorative heading eyebrows. Status tags describe provenance or solver method; field labels remain explicit.

## Behavior and proof
- Results always refer to the analyzed input snapshot. New edits show a stale banner and disable results exports until recalculation.
- Unfavorable metric changes remain visible. A revenue-first plan can increase spoilage; this is explicitly explained.
- The SVG represents allocations, not geographic roads. Discount recommendations are separate from modeled sales.
- Product/model notes are reachable via navigation and scroll into view. Reduced-motion preferences are respected.

## Review
Desktop and mobile inspected. An independent review requested higher contrast, discoverable horizontal scrolling, working assumptions navigation and removal of decorative eyebrows. These changes were applied; final verdict is recorded in docs/evaluation.md.
