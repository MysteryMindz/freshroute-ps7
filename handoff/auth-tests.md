# Auth tests and setup documentation handoff

Released for integration:

- `tests/auth-config.test.ts`: 26 independent config/routing/error tests; all credentials are format fixtures, not real keys.
- `docs/auth-setup.md`: precise future Supabase project, GitHub OAuth callback and app-root redirect setup; public build variable names; explicit pending-provider status; owner verification checklist and official documentation links.
- `docs/evaluation.md`: previous sections preserved; appended current auth suite results and limitations.

`npm test` passed: **4 files, 54 tests, 431ms, Vitest 5.0.4**. No test assertions weakened and no auth code changes made. Existing 28 planner/IO/fallback tests remain passing.

Critical status boundary: no Supabase project or keys exist for this deployment. Real sign-in is not configured or tested. Guest planning is the complete demonstration. Deployment workflow must pass repository variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` into the build; no secret/service-role or GitHub OAuth client secret belongs in the frontend.

Only the three assigned documentation/test files and this handoff were changed. UI, engine, package files, workflow and Git remain with their owners.
