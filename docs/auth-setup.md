# Current account implementation

The submitted app now uses email/password authentication against the owner-provided Supabase project. It supports sign-in, account creation, confirmation-required feedback, session restoration, sign-out and full guest access. No cloud scenario storage or password reset is implemented. GitHub is not enabled and is not offered by the current screen. The browser-public URL/key are configured as GitHub Actions repository variables. Email ownership is not verified when Confirm email is disabled.

The instructions below describe optional future GitHub OAuth setup, not the current active login method.

# GitHub sign-in: setup still required

**Current status:** the sign-in interface and Supabase client integration are implemented. No Supabase project or real provider keys have been provisioned for this app, and real GitHub sign-in has not been configured or tested. Guest access remains the complete working demonstration. The dashboard is intentionally accessible to guests; signing in does not currently enable cloud storage or a protected data service.

## Configure a free Supabase project

1. Sign in at [Supabase](https://supabase.com/dashboard), create a project on its Free plan, and wait for provisioning. Review the current plan details before choosing any paid option. This setup requires the owner's interactive account access.
2. Copy the project's HTTPS URL and **publishable key** from its connection/API-key settings. Prefer a key beginning `sb_publishable_`. A legacy public `anon` key is also supported by this app. Do not copy a secret key or `service_role` key.
3. Under Authentication → URL Configuration, set Site URL to:

   ```text
   https://mysterymindz.github.io/freshroute-ps7/
   ```

4. Add that exact root URL, including the repository path and trailing slash, to the allowed redirect URLs. For local testing, also add the actual Vite development origin, such as `http://127.0.0.1:5173/`. If the port changes, add that exact URL too. Do not use broad production wildcard redirects.

The app uses hash navigation. Its OAuth `redirectTo` is the deployed **application root above**, not `#/dashboard` and not the Supabase callback. Supabase returns the browser to the root; the client exchanges the PKCE code and then navigates to the dashboard.

## Register the GitHub OAuth application

1. Open [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers) and register a new OAuth App named FreshRoute.
2. Set Homepage URL to `https://mysterymindz.github.io/freshroute-ps7/`.
3. In Supabase Authentication → Sign In / Providers → GitHub, copy the project's Callback URL. It has this form:

   ```text
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

4. Use that **Supabase callback URL** as GitHub's Authorization callback URL. Leave GitHub Device Flow disabled.
5. Copy GitHub's OAuth Client ID and generate a Client Secret. Enter both **only in Supabase's GitHub provider settings**, enable the provider and save. Never place the GitHub client secret in this repository, GitHub repository variables or a frontend environment file.

The GitHub callback URL and the final app redirect are different: GitHub calls Supabase; Supabase returns to FreshRoute.

## Supply browser-public build configuration

In the GitHub repository, open Settings → Secrets and variables → Actions → **Variables** and add:

| Repository variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | The project's browser-public `sb_publishable_...` key |

The deployment workflow must pass both repository variables into the build environment under those exact names. Repository variables alone do not become Vite environment variables automatically. Trigger a new deployment after adding or changing them; Vite embeds these values at build time.

For local development, put the same two names in a local `.env.local` file, ensure that file remains ignored by Git, and restart Vite. Never commit environment files containing credentials. The two browser-public values are visible in a deployed build by design; **secret, service-role and OAuth client-secret values must never be included**.

The build fails before bundling when supplied auth configuration is invalid or privileged. The runtime configuration gate also rejects obvious secret/service-role formats and unsafe URL forms. It is a format check, not JWT signature verification or proof that a key belongs to a real project. Supabase performs real authentication. No application tables are required for this auth-only integration. If cloud scenario storage is added later, configure row-level security and least-privilege grants before exposing any table to clients.

## Verification checklist after owner setup

- Deploy with both public variables and confirm the sign-in button is enabled.
- Complete GitHub consent; confirm return to the production root and navigation to the dashboard with the correct signed-in identity.
- Refresh the page and confirm the session restores.
- Sign out and confirm the browser returns to guest identity; guest planning remains usable.
- Cancel GitHub consent and confirm a safe error message plus working guest entry.
- Check desktop and mobile views and verify no secrets appear in the repository, build configuration or browser bundle.

Until these steps are completed against the real project, describe sign-in as **integration ready, provider setup and live verification pending**.

## Official references

- [Supabase GitHub sign-in setup](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [Supabase redirect URL configuration](https://supabase.com/docs/guides/auth/redirect-urls)
- [Supabase API keys and browser/server boundaries](https://supabase.com/docs/guides/api/api-keys)
- [Supabase API-key migration guidance](https://supabase.com/docs/guides/platform/api-keys)
