import { describe, expect, it } from 'vitest';
import { oauthReturnError, readAuthConfig, readRoute } from '../src/auth/config';

const PROJECT_URL = 'https://example-project.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_fixture_browser_public_key';
// Format fixtures only: no genuine project credential or signed user token is present.
function jwt(role: string): string {
  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ role, iss: 'supabase' })}.fixture-signature`;
}

describe('Browser-public authentication configuration', () => {
  it('accepts publishable-key configuration and normalizes the HTTPS origin', () => {
    expect(readAuthConfig(`${PROJECT_URL}/`, PUBLISHABLE_KEY)).toEqual({ url: PROJECT_URL, publishableKey: PUBLISHABLE_KEY });
  });
  it('accepts the legacy anon JWT format without treating it as a logged-in session', () => {
    const anon = jwt('anon');
    expect(readAuthConfig(PROJECT_URL, anon)).toEqual({ url: PROJECT_URL, publishableKey: anon });
  });
  it.each([
    'sb_secret_fixture_never_browser_public',
    jwt('service_role'),
    jwt('authenticated'),
    jwt('admin'),
    'sb_publishable_short',
    'not-a-key',
    'header.!!!!.signature',
    'header..signature',
    'header.only-two-parts',
    '',
  ])('rejects secret, privileged or malformed key fixture %#', (key) => {
    expect(readAuthConfig(PROJECT_URL, key)).toBeNull();
  });
  it.each([
    'http://example-project.supabase.co',
    'javascript:alert(1)',
    'data:text/html,example',
    'file:///etc/passwd',
    'https://user:password@example-project.supabase.co',
    `${PROJECT_URL}?secret=unexpected`,
    `${PROJECT_URL}#unexpected`,
    'not a URL',
    '',
  ])('rejects an unsafe or malformed project URL fixture %#', (url) => {
    expect(readAuthConfig(url, PUBLISHABLE_KEY)).toBeNull();
  });
  it('fails closed for absent and nonstring configuration', () => {
    for (const value of [undefined, null, 0, {}, []]) {
      expect(readAuthConfig(value, PUBLISHABLE_KEY)).toBeNull();
      expect(readAuthConfig(PROJECT_URL, value)).toBeNull();
    }
  });
});

describe('Static-site routes and safe OAuth errors', () => {
  it('recognizes the three supported hash routes and safely defaults unknown routes', () => {
    expect(readRoute('#/dashboard')).toBe('dashboard');
    expect(readRoute('#/signin')).toBe('signin');
    for (const hash of ['', '#/', '#/unknown', '#/dashboard/extra', '#access_token=example', '#/signin?next=external']) expect(readRoute(hash)).toBe('home');
  });
  it('reports cancelled OAuth as a fixed guest-compatible message', () => {
    const error = oauthReturnError('?error=access_denied&error_description=private-provider-details');
    expect(error).toMatch(/cancelled|declined/);
    expect(error).toMatch(/guest demo/);
    expect(error).not.toContain('private-provider-details');
  });
  it('does not reflect arbitrary provider errors or HTML into user-facing messages', () => {
    const raw = '<img src=x onerror=alert(1)>';
    const error = oauthReturnError(`?error=${encodeURIComponent(raw)}&error_description=${encodeURIComponent(raw)}`);
    expect(error).toBe('Sign-in could not be completed. Try again, or enter the guest demo.');
    expect(error).not.toContain(raw);
  });
  it('does not invent an OAuth error for an ordinary callback or an empty error code', () => {
    expect(oauthReturnError('?code=example-code')).toBeNull();
    expect(oauthReturnError('?error=&error_description=anything')).toBeNull();
    expect(oauthReturnError('')).toBeNull();
  });
});
