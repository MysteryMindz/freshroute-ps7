import { lazy, Suspense, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { MotionConfig } from 'motion/react';
import { ArrowRight, Leaf, LogOut, UserRound } from 'lucide-react';
import { supabase, authRedirectUrl } from './auth/client';
import { oauthReturnError, readRoute } from './auth/config';
import type { Route } from './auth/config';
import SignIn from './pages/SignIn';
import './styles/shell.css';
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
export default function App() {
  const [route, setRoute] = useState<Route>(() => readRoute(window.location.hash));
  const [dashboardOpened, setDashboardOpened] = useState(() => readRoute(window.location.hash) === 'dashboard');
  const [session, setSession] = useState<Session | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(() => oauthReturnError(window.location.search));
  const navigate = (next: Route) => { window.location.hash = next === 'home' ? '/' : `/${next}`; setRoute(next); };
  useEffect(() => {
    const update = () => setRoute(readRoute(window.location.hash));
    window.addEventListener('hashchange', update);
    if (oauthReturnError(window.location.search)) navigate('signin');
    return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    if (route === 'dashboard') setDashboardOpened(true);
    document.title = route === 'home' ? 'FreshRoute — Fresh produce. Smarter moves.' : route === 'signin' ? 'Sign in — FreshRoute' : 'Dispatch planner — FreshRoute';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, next) => {
      if (!active) return;
      setSession(next);
      if (event === 'SIGNED_IN') { setAuthBusy(false); setAuthError(null); navigate('dashboard'); }
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setSession(data.session);
      if (error) { setAuthError('Your sign-in session could not be restored. Please try signing in again.'); navigate('signin'); }
      else if (data.session && new URLSearchParams(window.location.search).has('code')) navigate('dashboard');
      if (new URLSearchParams(window.location.search).has('code')) window.history.replaceState(null, '', `${window.location.pathname}${window.location.hash}`);
    }).catch(() => { if (active) setAuthError('Sign-in is unavailable. You can still explore the guest demo.'); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  const signIn = async () => {
    if (!supabase || authBusy) return;
    if (dashboardOpened && !window.confirm('GitHub sign-in opens a new page. Your workspace is held in memory, so export any scenario you want to keep before continuing. Continue to GitHub?')) return;
    setAuthBusy(true); setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: authRedirectUrl(), scopes: 'read:user user:email' } });
      if (error) throw error;
    } catch { setAuthError('GitHub sign-in could not start. Please try again, or continue as a guest.'); setAuthBusy(false); }
  };
  const signOut = async () => {
    if (!supabase) return;
    setAuthBusy(true);
    try { const { error } = await supabase.auth.signOut({ scope: 'local' }); if (error) throw error; setSession(null); }
    catch { setAuthError('Sign-out could not complete. Please try again.'); }
    finally { setAuthBusy(false); }
  };
  const accountControl = <div className="account-control">{session ? <><span className="account-name"><UserRound size={14} />{String(session.user.user_metadata.user_name || session.user.user_metadata.full_name || 'Signed in').slice(0,30)}</span><button onClick={signOut} disabled={authBusy} title="Sign out of this browser"><LogOut size={14} /><span>Sign out</span></button></> : <><span className="guest-badge">Guest workspace</span><button onClick={() => navigate('signin')}>Sign in <ArrowRight size={14} /></button></>}</div>;
  return <MotionConfig reducedMotion="user"><a href="#page-content" className="shell-skip" onClick={event => { event.preventDefault(); const target = document.getElementById(route === "home" ? "landing-main" : route === "dashboard" ? "overview" : "auth-entry"); if (target) { target.setAttribute("tabindex", "-1"); target.focus(); target.scrollIntoView({ behavior: "instant" }); } }}>Skip to content</a><div id="page-content" tabIndex={-1}><Suspense fallback={<div className="shell-loading" role="status"><Leaf size={32} /><p>Opening FreshRoute…</p></div>}>
    {route === 'home' ? <Landing onLaunch={() => navigate('dashboard')} onSignIn={() => navigate(session ? 'dashboard' : 'signin')} isSignedIn={!!session} /> : route === 'signin' ? <SignIn configured={!!supabase} busy={authBusy} error={authError} onSignIn={signIn} onGuest={() => navigate('dashboard')} onHome={() => navigate('home')} /> : null}
    {(dashboardOpened || route === 'dashboard') && <div hidden={route !== 'dashboard'}><Dashboard onHome={() => navigate('home')} accountControl={accountControl} /></div>}
    {route === 'dashboard' && authError && <div className="shell-auth-error" role="alert">{authError}<button onClick={() => setAuthError(null)}>Dismiss</button></div>}
  </Suspense></div></MotionConfig>;
}
