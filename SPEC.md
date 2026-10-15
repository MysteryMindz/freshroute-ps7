# FreshRoute shared contract — frozen v1

Browser-only produce planning simulator, React/TypeScript/Vite. All quantities kg; money INR; travel/shelf life/horizon hours from immediate dispatch. Synthetic data labeled. No backend, account system or live feeds. Types in src/shared/types.ts are authoritative; ports in src/shared/ports.ts.

## Ownership after bootstrap
A: src/shared/**, src/engine/**, root configuration, src/main.tsx, PRODUCT.md, SPEC.md, README.md, .github/** and Git.
B: src/App.tsx, src/components/**, src/styles/**, src/index.css, handoff/B.md.
C: src/data/**, src/io/**, tests/**, public/samples/**, docs/evaluation.md, handoff/C.md.
Only A installs dependencies, changes shared contracts or performs Git operations. Report handoff before releasing ownership. No filesystem-wide formatting. Root work/ and outputs/ are scratch/deliverables and not published.

## Exact exports
src/engine/index.ts: validateScenario(input: unknown): string[]; analyzeScenario(scenario: Scenario): Analysis; validatePlan(scenario: Scenario, plan: Plan): string[].
src/data/index.ts: createDemoScenario(kind?: 'normal'|'delay'|'capacity'|'demand-spike'): Scenario.
src/io/index.ts: parseScenarioJson(text: string): Scenario; scenarioToJson(scenario: Scenario): string; allocationsToCsv(plan: Plan): string; analysisToJson(scenario: Scenario, analysis: Analysis): string.

## Accounting / constraints
Maximize modeled net revenue = revenue - transport - handling - disposal. Nonnegative continuous allocation by batch/market, bounded by stock, market/commodity demand, market receiving capacity and fleet capacity. Eligible arrival = travelHours + handlingHours <= min(shelfLifeHours, horizonHours), shelfLifeHours > 0. Variable contribution = unit price - transport - handling + avoided disposal only if shelfLifeHours <= horizonHours. Disposal constant included in reported net revenue, not raw objective. Leftovers with shelfLifeHours <= horizonHours spoil; others remain inventory. Both plans use identical assumptions; fractional kg allowed; round display only. Numerical absolute tolerance 1e-6, scale-aware comparisons where appropriate. Limits 50 batches, 10 markets; each commodity demand requires a finite nonnegative price. Horizon > 0, other quantities nonnegative finite, unique IDs, positive commodity/label strings. Do not coerce invalid inputs. Empty demand yields 0% plus warning.

FEFO baseline: expiry then batch ID; earliest eligible arrival then market ID; skip nonpositive incremental economic contribution. LP solver via javascript-lp-solver; independent plan validation; fallback contribution-ranked deterministic greedy labeled heuristic. Never claim heuristic optimal.

Discounts: at-risk leftovers expiring within 24h suggest 10%, within 12h 20%, price floor transport+handling. Only eligible market with unmet commodity demand; explain transport/receiving-capacity blockers. Do not apply recommendations to simulation demand or revenue.

## UI and data
Editable inputs, comparison, allocation SVG (not geographic routing), table, unallocated reasons, delay and fleet capacity controls, imports/exports. Input changes mark results stale. Use engine results, never invented metrics. All generated fixtures synthetic, approximately six batches/two commodities/three markets/24h; normal/delay/capacity/demand-spike presets. Preserve provenance during imports. CSV safely escaped, text cells protected against spreadsheet formulas. Main functions safe for empty or infeasible-to-serve scenarios; zero allocations can still be feasible. Synthetic metrics are modeled, not field performance.
