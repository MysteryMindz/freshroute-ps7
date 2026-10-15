# FreshRoute evaluation

## Provenance and limits

All bundled scenarios are **synthetic**, authored for demonstration. They do not establish field performance or a real distributor's economic benefits. Four fixtures share approximately six batches, two commodities and three destinations: normal inputs, a four-hour travel delay, reduced fleet capacity and a city demand increase. Exported JSON retains input provenance.

The simulation uses divisible kilograms, fixed destination travel times, immediate dispatch and one planning horizon. Net revenue means sales minus transport, handling and modeled disposal costs. Acquisition and storage costs are absent. Leftovers that expire after the horizon remain inventory; they are not automatically spoilage. Price-review recommendations do not change demand or simulated sales. Practical loading, vehicle routing and uncertainty require additional work.

## Checks

Run `npm test` for the automated suite. Engine tests reconstruct resource use and financial totals independently, rather than delegating assertions to the engine's validator. They include:

- Hand-calculated accounting: ₹50 sales, ₹5 transport, ₹5 handling, ₹10 disposal, ₹30 net revenue, 5 kg modeled spoilage and 13 kg total leftover inventory.
- A small routing example with a known best net revenue of ₹136.
- Stock, commodity demand, receiving/fleet capacity, shelf life and planning-horizon constraints.
- Distinct commodities, equality at expiry, zero demand/capacity, expired stock, impossible travel and negative incremental value.
- Thirty deterministic generated small scenarios checked independently, with LP net revenue compared against the feasible FEFO baseline.
- Malformed roots, negative/non-finite values, duplicate identifiers and absent commodity prices.
- Solver exceptions, infeasible/unbounded results and impossible quantities: feasible fallback must be labeled heuristic.
- JSON round trips, provenance, CSV quotation and spreadsheet-formula protection.

## Execution status

`npm test` completed successfully on 15 October 2026. After upgrading the test runner to patched Vitest 5.0.4, all checks passed again:

```text
Test Files  3 passed (3)
     Tests  28 passed (28)
  Duration  507ms
```

The 28 tests include one test that independently checks thirty deterministic generated scenarios. The known accounting and known-optimum assertions passed, as did all four deliberately untrusted solver cases. These checks establish behavior on the tested inputs; they do not establish field savings, general performance guarantees or deployment readiness. Browser/deployment verification is handled separately.

The restricted runner initially prevented the build tool from spawning (`EPERM`); the test command succeeded with permitted process execution. An initial test-hook error was corrected: a `beforeEach` callback accidentally returned the mock function, which Vitest interpreted as teardown. No product assertions were removed or weakened.

## Browser checks

The local app was exercised in a real browser: initial analysis, stale state after delay edits, recalculation, zero transport capacity, normal-preset reset, baseline accounting table, allocation CSV download and rejection of a negative planning horizon all passed. Desktop (1440px) and narrow (390px) layouts were captured; the narrow page had no document-level horizontal overflow. Deployment checks are recorded after publication.

The normal synthetic fixture illustrates a real modeled trade-off: maximizing the supplied net-revenue objective can increase spoilage relative to FEFO. The app reports that increase and explicitly warns about the trade-off. No fixture benefits are hard-coded.

## Deployment verification

Source: https://github.com/MysteryMindz/freshroute-ps7

Live app: https://mysterymindz.github.io/freshroute-ps7/

GitHub Actions run 38686838986 passed locked installation, all 28 tests, production compilation and Pages deployment. The live app was opened in a browser. All four presets returned LP solutions without validation errors. The assumptions navigation scrolled into view on mobile, horizontal-scroll guidance was visible, and the 390px document had no horizontal overflow. Browser console reported zero errors on that live session.

The dependency update to Vitest 5.0.4 reported zero known npm vulnerabilities at installation time. This is a point-in-time dependency check, not a security guarantee.
