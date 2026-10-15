# FreshRoute

A browser-only produce-distribution planning simulator built for Bugged Out PS7. It compares a first-expiry-first-out (FEFO) baseline with constrained allocation, accounts for shelf life and disposal, and explores transport disruptions.

**Live app:** https://mysterymindz.github.io/freshroute-ps7/ · **Source:** https://github.com/MysteryMindz/freshroute-ps7

**Demonstration data is synthetic. All outcomes are modeled, not evidence of real distributor savings.**

## Run locally

Use Node.js 22.12+ or 24+ and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. To verify a production build:

```sh
npm test
npm run build
npm run preview
```

## What the model does

- Continuous kilograms of each batch may be divided between destinations.
- Maximize sales revenue less transport, handling and disposal costs, subject to batch stock, destination/commodity demand, destination receiving capacity and shared transport capacity.
- Dispatch is immediate. Arrival plus common handling time must fit within remaining shelf life and the single planning horizon.
- Leftover stock expiring within the horizon incurs its supplied disposal cost; other leftover stock remains inventory. Input acquisition costs are not supplied and are not modeled. Net revenue is not full business profit.
- LP variable contributions include avoided disposal for batches expiring within the horizon. Displayed metrics are independently recomputed from allocations, including disposal's constant term.
- FEFO sorts batches by expiry then ID and destinations by arrival then ID, skips nonpositive incremental economic value, and obeys identical constraints/costs. It is a disclosed comparison policy, not a claim about a particular distributor's current operations.
- If the LP solver fails feasibility/accounting checks or underperforms the feasible baseline, the app uses a validated greedy/FEFO fallback labeled **heuristic**. It does not claim optimality for that fallback.
- Price reviews suggest up to 20% within 12 hours or 10% within 24 hours, bounded by transport/handling costs. **Discount suggestions do not create extra demand or change modeled sales/revenue.** Capacity or timing blockers are shown.

Quantities are kg, time is hours from immediate dispatch, and money is INR (prices/costs per kg). Prices and other numeric inputs are finite, nonnegative and <=1e9; horizon is positive. There are at most 50 batches, 10 markets and 100 commodity entries per market map. IDs are unique in each entity list. Numerical validation tolerance is 1e-6, scaled for accumulated capacity/accounting comparisons; display rounding never changes the underlying plan.

## Data and evaluation

Use the built-in normal, delay, capacity and demand-spike scenarios or import a schemaVersion 1 JSON scenario. Samples are in `public/samples/`. Provenance is preserved; a JSON upload does not turn synthetic data into observed data. The interface exports input scenarios, allocation CSVs and results JSONs.

See [SPEC.md](SPEC.md) for the shared contract and [docs/evaluation.md](docs/evaluation.md) for independent tests and actual run evidence. No held-out organizer dataset was supplied, so no competition accuracy or operational performance is claimed.

## Architecture and limitations

React/TypeScript/Vite, `javascript-lp-solver`, Vitest and plain CSS. Source responsibilities: `src/engine` (optimization, validation, accounting), `src/data` (synthetic scenarios), `src/io` (validated import and safe exports), `src/App.tsx` (interface).

No server, database, account system, live prices, geographic route search, learned demand response, temperature decay or stochastic shelf-life prediction. Costs are supplied per kg; fixed truck activation fees and multi-trip schedules need a different model. The flow diagram visualizes allocations rather than real road routes. Results assist simulation and require review before operational use.

## GitHub Pages

The Actions workflow runs locked dependency installation, tests and a production build before deployment. In repository Settings → Pages, use **GitHub Actions** as the publishing source. It builds with `GITHUB_PAGES_BASE=/<repository-name>/`. The app uses no path router or browser-exposed credentials.

## Two-minute demo

1. Load the normal synthetic dataset and generate the plan.
2. Compare modeled net revenue, spoilage and demand fulfillment against FEFO.
3. Inspect a selected allocation and leftover-stock reason.
4. Add a delay or reduce transport capacity, rerun, and explain changed outcomes.
5. Show price-review limitations and export the scenario and allocations.

## Attribution

Uses open-source React, Vite, TypeScript, javascript-lp-solver, Lucide and Vitest under their respective licenses. AI coding assistance was used. Source and model assumptions are provided for reproducibility.
