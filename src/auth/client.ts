import { createClient } from '@supabase/supabase-js';
import { readAuthConfig } from './config';
export const authConfig = readAuthConfig(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
export const supabase = authConfig ? createClient(authConfig.url, authConfig.publishableKey, {
  auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true, storageKey: 'freshroute-auth' },
}) : null;
export function authRedirectUrl(): string {
  return new URL(import.meta.env.BASE_URL, window.location.origin).href;
}
