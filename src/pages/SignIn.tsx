import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Leaf, LockKeyhole, ShieldCheck } from 'lucide-react';
import { supabase, authRedirectUrl } from '../auth/client';
import '../styles/auth.css';
type Props = { configured: boolean; busy: boolean; error: string | null; onGuest: () => void; onHome: () => void };
export default function SignIn({ configured, busy, error, onGuest, onHome }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [failure, setFailure] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase || pending || busy) return;
    setPending(true); setFailure(''); setMessage('');
    try {
      const result = mode === 'signup'
        ? await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: authRedirectUrl() } })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) {
        const code = result.error.code;
        setFailure(code === 'invalid_credentials' ? 'Email or password is incorrect. Check your details and try again.' : code === 'email_not_confirmed' ? 'Confirm your email first, then sign in. You can use the guest demo meanwhile.' : code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' ? 'Too many attempts. Please wait a moment, or use the guest demo.' : code === 'email_address_not_authorized' ? 'Email delivery is not configured for this address. Use the guest demo or ask the project owner to configure email confirmation.' : result.error.message);
      } else if (result.data.session) { setPassword(''); window.location.hash = '/dashboard'; }
      else { setMessage('Check your email for a confirmation link, then return here to sign in.'); setPassword(''); }
    } catch { setFailure('Unable to connect to sign-in. Check your connection or continue as a guest.'); }
    finally { setPending(false); }
  }
  return <main className="auth-page">
    <section className="auth-story" aria-label="FreshRoute introduction">
      <button className="auth-brand" onClick={onHome} aria-label="FreshRoute home"><Leaf size={30} />FreshRoute<span>.</span></button>
      <div className="auth-story-content"><h1>Your next dispatch,<br /><em>with a clear plan.</em></h1><p>Compare feasible allocations. Understand the trade-offs. Keep the evidence.</p><div className="auth-proof"><span>Constrained produce allocation</span><span>Transparent FEFO comparison</span><span>Scenario and report downloads</span></div></div>
      <p className="auth-story-footer">Produce distribution, thoughtfully modeled.</p>
    </section>
    <section className="auth-entry" id="auth-entry">
      <button className="auth-back" onClick={onHome}><ArrowLeft size={16} /> Back to FreshRoute</button>
      <div className="auth-form">
        <span className="auth-leaf" aria-hidden="true"><LockKeyhole size={24} /></span>
        <h2>{mode === 'signin' ? 'Welcome back.' : 'A fresh start.'}</h2><p>{mode === 'signin' ? 'Sign in to your FreshRoute workspace.' : 'Create your account and start planning.'}</p>
        <div className="auth-modes" aria-label="Account action"><button className={mode === 'signin' ? 'selected' : ''} aria-pressed={mode === 'signin'} disabled={pending} onClick={() => { setMode('signin'); setFailure(''); setMessage(''); }}>Sign in</button><button className={mode === 'signup' ? 'selected' : ''} aria-pressed={mode === 'signup'} disabled={pending} onClick={() => { setMode('signup'); setFailure(''); setMessage(''); }}>Create account</button></div>
        {!configured && <div className="auth-setup-note"><strong>Account setup is unavailable</strong><p>The complete planner is available as a guest.</p></div>}
        {(failure || error) && <div className="auth-error" role="alert">{failure || error}</div>}
        {message && <div className="auth-success" role="status">{message}</div>}
        <form onSubmit={submit} className="auth-email-form">
          <label htmlFor="auth-email">Email address</label><input id="auth-email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} disabled={pending} />
          <label htmlFor="auth-password">Password{mode === 'signup' && <span>At least 8 characters</span>}</label><div className="auth-password-wrap"><input id="auth-password" type={visible ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={mode === 'signup' ? 8 : 1} maxLength={128} disabled={pending} /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          <button type="submit" className="auth-github" disabled={!configured || busy || pending}>{pending ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}<ArrowRight size={18} /></button>
        </form>
        <div className="auth-divider"><span />or explore first<span /></div>
        <button className="auth-guest" onClick={onGuest}>Explore the guest demo <ArrowRight size={18} className="auth-guest-arrow" /></button>
        <div className="auth-privacy"><ShieldCheck size={17} /><p>Authentication is handled by Supabase. Planning works as a guest too. Scenarios stay in browser memory; export to keep your work. Accounts do not enable cloud storage.</p></div>
      </div>
      <footer className="auth-entry-footer">Independent decisions. Transparent evidence.</footer>
    </section>
  </main>;
}
