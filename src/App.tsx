import { lazy, Suspense, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ArrowRight, Leaf, LogOut, UserRound } from 'lucide-react';
import { oauthReturnError, readAuthConfig, readRoute } from './auth/config';
import type { Route } from './auth/config';
import type { Scenario } from './shared/types';
import './styles/shell.css';
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SignIn = lazy(() => import('./pages/SignIn'));
const authAvailable = !!readAuthConfig(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
function hasSavedSession() { try { return !!localStorage.getItem('freshroute-auth'); } catch { return false; } }
export default function App() {
  const [route, setRoute] = useState<Route>(() => readRoute(window.location.hash));
  const [dashboardOpened, setDashboardOpened] = useState(() => readRoute(window.location.hash) === 'dashboard');
  const [launchScenario, setLaunchScenario] = useState<Scenario>();
  const [session, setSession] = useState<Session | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(() => oauthReturnError(window.location.search));
  const navigate = (next: Route) => { window.location.hash = next === 'home' ? '/' : `/${next}`; setRoute(next); };
  const launch = (scenario?: Scenario) => { if (scenario) setLaunchScenario(structuredClone(scenario)); navigate('dashboard'); };
  useEffect(() => {
    const update = () => setRoute(readRoute(window.location.hash));
    window.addEventListener('hashchange', update);
    if (oauthReturnError(window.location.search)) navigate('signin');
    return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    if (route === 'dashboard') setDashboardOpened(true);
    document.title = route === 'home' ? 'FreshRoute — Plan the dispatch. See every trade-off.' : route === 'signin' ? 'Sign in — FreshRoute' : 'Dispatch planner — FreshRoute';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);
  useEffect(() => {
    const callback = new URLSearchParams(window.location.search).has('code');
    if (!authAvailable || (route !== 'signin' && !hasSavedSession() && !callback)) return;
    let active = true;
    let unsubscribe: (() => void) | undefined;
    import('./auth/client').then(async ({ supabase }) => {
      if (!active || !supabase) return;
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, next) => {
        if (!active) return;
        setSession(next);
        if (event === 'SIGNED_IN' && route === 'signin') { setAuthBusy(false); setAuthError(null); navigate('dashboard'); }
      });
      unsubscribe = () => subscription.unsubscribe();
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      if (error) { setAuthError('Your sign-in session could not be restored. Please sign in again or continue as a guest.'); }
      else if (data.session && callback) navigate('dashboard');
      if (callback) window.history.replaceState(null, '', `${window.location.pathname}${window.location.hash}`);
    }).catch(() => { if (active) setAuthError('Sign-in could not load. The guest planner remains available.'); });
    return () => { active = false; unsubscribe?.(); };
  }, [route]);
  const signOut = async () => {
    setAuthBusy(true);
    try {
      const { supabase } = await import('./auth/client');
      if (!supabase) return;
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;
      setSession(null);
    } catch { setAuthError('Sign-out could not complete. Please try again.'); }
    finally { setAuthBusy(false); }
  };
  const accountControl = <div className="account-control">{session ? <><span className="account-name"><UserRound size={15}/>{String(session.user.user_metadata.user_name || session.user.user_metadata.full_name || 'Signed in').slice(0,30)}</span><button onClick={signOut} disabled={authBusy} title="Sign out of this browser"><LogOut size={15}/><span>Sign out</span></button></> : <><span className="guest-badge">Guest workspace</span><button onClick={() => navigate('signin')}>Sign in <ArrowRight size={15}/></button></>}</div>;
  return <><a href="#page-content" className="shell-skip" onClick={event => { event.preventDefault(); const target = document.getElementById(route === 'home' ? 'landing-main' : route === 'dashboard' ? 'overview' : 'auth-entry'); if (target) { target.setAttribute('tabindex','-1'); target.focus(); target.scrollIntoView({behavior:'instant'}); } }}>Skip to content</a><div id="page-content" tabIndex={-1}><Suspense fallback={<div className="shell-loading" role="status"><Leaf size={28}/><p>Opening FreshRoute…</p></div>}>
    {route === 'home' ? <Landing onLaunch={launch} onSignIn={() => navigate(session ? 'dashboard' : 'signin')} isSignedIn={!!session}/> : route === 'signin' ? <SignIn configured={authAvailable} busy={authBusy} error={authError} onGuest={() => navigate('dashboard')} onHome={() => navigate('home')}/> : null}
    {(dashboardOpened || route === 'dashboard') && <div hidden={route !== 'dashboard'}><Dashboard onHome={() => navigate('home')} accountControl={accountControl} initialScenario={launchScenario}/></div>}
    {route === 'dashboard' && authError && <div className="shell-auth-error" role="alert">{authError}<button onClick={() => setAuthError(null)}>Dismiss</button></div>}
  </Suspense></div></>;
}
