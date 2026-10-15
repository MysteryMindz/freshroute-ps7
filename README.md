# FreshRoute

A browser-only produce-distribution planning simulator built for Bugged Out PS7. It compares a first-expiry-first-out (FEFO) baseline with constrained allocation, accounts for shelf life and disposal, and explores transport disruptions.

**Live app:** https://mysterymindz.github.io/freshroute-ps7/ · **Source:** https://github.com/MysteryMindz/freshroute-ps7

**Demonstration data is synthetic. All outcomes are modeled, not evidence of real distributor savings.**

The judge-facing landing page opens with an interactive dispatch manifest: stock, allocation evidence, disruption controls and the FEFO comparison. It uses actual engine results, with no decorative particle loop. Launch the full planner directly as a guest. The redesigned dispatch workspace separates Overview, Inventory & Markets, Allocations, Scenario Lab, Stock Reviews and Model Notes into focused hash routes. It retains shared editable scenarios, honest comparisons and downloads.

**Account status:** real email/password sign-in and account creation use the configured Supabase project. Guest access remains complete. Session restoration and sign-out are included. Email verification follows the project setting; cloud scenario storage and password reset are outside this submission. GitHub OAuth is not offered because that provider is not enabled.

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

React/TypeScript/Vite, `javascript-lp-solver`, Vitest, Lucide, Supabase client and plain CSS. Source responsibilities: `src/engine` (optimization, validation, accounting), `src/data` (synthetic scenarios), `src/io` (validated import and safe exports), `src/pages` (landing, sign-in and dashboard), `src/auth` (optional account integration), `src/App.tsx` (navigation and session handling).

Planning runs entirely in the browser; optional accounts use an external Supabase authentication service once configured. There is no cloud scenario storage, live pricing, geographic route search, learned demand response, temperature decay or stochastic shelf-life prediction. Costs are supplied per kg; fixed truck activation fees and multi-trip schedules need a different model. The flow diagram visualizes allocations rather than real road routes. Results assist simulation and require review before operational use. Workspace edits survive in-app navigation but are held in memory: export before closing or refreshing the tab.

## GitHub Pages

The Actions workflow runs locked dependency installation, tests and a production build before deployment. In repository Settings → Pages, use **GitHub Actions** as the publishing source. It builds with `GITHUB_PAGES_BASE=/<repository-name>/`. Hash navigation supports refresh at the same repository URL. Optional auth uses browser-public project configuration; never put service-role keys or GitHub client secrets into a Vite build.

## Two-minute demo

1. Explore the landing page's live delay simulation, then **Launch planner**.
2. Compare modeled net revenue, spoilage and demand fulfillment against FEFO.
3. Inspect a selected allocation and leftover-stock reason.
4. Add a delay or reduce transport capacity, rerun, and explain changed outcomes.
5. Show price-review limitations and export the scenario and allocations.

## Attribution

Uses open-source React, Vite, TypeScript, javascript-lp-solver, Lucide, Supabase client and Vitest under their respective licenses. Manrope and DM Sans are self-hosted from the official Google Fonts repository under the bundled SIL Open Font Licenses. Particle and allocation visuals are authored Canvas/SVG implementations, inspired by the React Bits interaction direction rather than copied components. AI coding assistance was used. Source and model assumptions are provided for reproducibility.
