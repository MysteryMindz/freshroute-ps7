# FreshRoute — submission and demo

**Problem:** PS7, perishable produce distribution decision support.

**Live:** https://mysterymindz.github.io/freshroute-ps7/

**Source:** https://github.com/MysteryMindz/freshroute-ps7

## What to say

FreshRoute is a browser-based planning simulator. It allocates produce batches to destinations while respecting commodity demand, receiving capacity, shared transport capacity and arrival-before-expiry constraints. It compares a documented FEFO baseline with a net-revenue allocation objective and explains leftovers, disruptions and price-review recommendations.

## Two-minute demonstration

1. Open the landing page, try the real-engine delay demo, then choose Launch planner. Open the normal synthetic scenario. Point out the six batches, two commodities and three destinations, and the provenance label.
2. Show the calculated flow and baseline comparison. The normal sample has modeled net revenue ₹12,490 versus ₹10,510 for FEFO. Both dispatch 360 kg. The revenue-first plan has 90 kg spoilage versus zero for FEFO: explain this trade-off rather than claiming every metric improves.
3. Add four hours of travel delay. Point out that results become stale, then recalculate. Inspect changed feasible deliveries and leftovers.
4. Reduce transport capacity. Recalculate and inspect why stock cannot move.
5. Show a price-review recommendation. Explain that price suggestions do not create assumed extra demand or revenue.
6. Download the allocation CSV and full report. Mention that inputs can be edited or imported as JSON.

## Useful judge answers

**What is optimized?** Supplied sales revenue less per-kg transport, handling and disposal costs. The model uses divisible kilograms and fixed destination travel times for one immediate dispatch.

**Why can spoilage increase?** The objective is net revenue under supplied costs, not minimum spoilage. A higher-margin destination can win capacity over a low-margin short-lived batch. The app reports the increase and includes a trade-off warning. Disposal cost assumptions affect these decisions.

**What does optimal mean here?** A feasible LP solution for the disclosed linear model. The model does not represent all real-world logistics. Solver failure switches to a validated plan labeled heuristic, with no optimality claim.

**Are these real savings?** No. The bundled data is synthetic and results are modeled. No distributor dataset or operational trial was supplied.

**What is missing?** Actual road routing, fixed truck activation costs, multi-trip schedules, temperature-dependent decay, learned demand response, acquisition/storage costs and calibrated uncertainty. Organizer data can be imported if it matches the disclosed model; a different cost/constraint structure needs adaptation.

**How is correctness checked?** Independent allocation/accounting checks, a hand-calculated case, a known-optimum case, 30 generated scenarios, malformed-input tests and four solver-failure cases. All 54 automated tests pass; main flows and deployment have also been exercised in a browser.

## Account status

Guest access includes the complete simulator. Real email/password account creation, login, session restoration and sign-out are now configured and live-verified. GitHub OAuth is not offered. Email confirmation is disabled by the owner for immediate hackathon signup; email ownership is not verified. Password reset and cloud scenario storage are not implemented.

## Submission checklist

- Paste the live and repository URLs into the organizer's required fields.
- Include the source archive if requested.
- Supply sample input/output files if requested; label all examples synthetic.
- Use actual tested results; do not claim held-out competition performance.
- Confirm the portal reports successful submission before its deadline. Publishing to GitHub/Pages does not submit the competition entry.
- Confirm any organizer-specific participation, upload and prize eligibility requirements separately.
