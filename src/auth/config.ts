export type AuthConfig = { url: string; publishableKey: string };
/** Only browser-public Supabase credentials belong in a Vite build. */
export function readAuthConfig(url: unknown, key: unknown): AuthConfig | null {
  if (typeof url !== 'string' || typeof key !== 'string' || !url || !key) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash) return null;
    const isPublishable = key.startsWith('sb_publishable_') && key.length > 25;
    let isAnon = false;
    if (key.split('.').length === 3) {
      const payload = JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      isAnon = payload.role === 'anon';
    }
    return isPublishable || isAnon ? { url: parsed.origin, publishableKey: key } : null;
  } catch { return null; }
}
export type Route = 'home' | 'signin' | 'dashboard';
export function readRoute(hash: string): Route {
  return /^#\/dashboard(?:\/(?:inventory|allocations|lab|insights|model))?$/.test(hash) ? 'dashboard' : hash === '#/signin' ? 'signin' : 'home';
}
export function oauthReturnError(search: string): string | null {
  const code = new URLSearchParams(search).get('error');
  if (!code) return null;
  return code === 'access_denied'
    ? 'GitHub sign-in was cancelled or access was declined. Try again, or enter the guest demo.'
    : 'Sign-in could not be completed. Try again, or enter the guest demo.';
}

export type DashboardPage = "overview" | "inventory" | "allocations" | "lab" | "insights" | "model";
export function readDashboardPage(hash: string): DashboardPage {
  const page = hash.split("/")[2];
  return ["inventory", "allocations", "lab", "insights", "model"].includes(page) ? page as DashboardPage : "overview";
}
