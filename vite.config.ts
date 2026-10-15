import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { readAuthConfig } from './src/auth/config';
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env };
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  // Reject before Vite substitutes any supplied key into public JavaScript.
  if ((url || key) && !readAuthConfig(url, key)) throw new Error('Invalid public auth configuration. Supply both the HTTPS project URL and a browser-public publishable/anon key. Privileged keys must never enter a frontend build.');
  return { plugins: [react()], base: process.env.GITHUB_PAGES_BASE || './', server: { watch: { ignored: ['**/.playwright-mcp/**', '**/work/**', '**/outputs/**'] } } };
});
