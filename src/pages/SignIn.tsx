import { ArrowLeft, ArrowRight, Github, Leaf, ShieldCheck, Sprout } from 'lucide-react';
import '../styles/auth.css';
type Props = { configured: boolean; busy: boolean; error: string | null; onSignIn: () => void; onGuest: () => void; onHome: () => void };
export default function SignIn({ configured, busy, error, onSignIn, onGuest, onHome }: Props) {
  return <main className="auth-page">
    <section className="auth-story" aria-label="FreshRoute introduction">
      <button className="auth-brand" onClick={onHome} aria-label="FreshRoute home"><Leaf size={30} />FreshRoute<span>.</span></button>
      <div className="auth-story-content"><div className="auth-orbit" aria-hidden="true"><Sprout size={80} /><span /><span /><span /></div><h1>Good decisions.<br /><em>Fresh possibilities.</em></h1><p>Bring clarity to every batch, every destination and every tradeoff.</p></div>
      <p className="auth-story-footer">Produce distribution, thoughtfully modeled.</p>
    </section>
    <section className="auth-entry" id="auth-entry">
      <button className="auth-back" onClick={onHome}><ArrowLeft size={16} /> Back to FreshRoute</button>
      <div className="auth-form">
        <span className="auth-leaf" aria-hidden="true"><Leaf size={26} /></span>
        <h2>A fresher perspective<br />starts here.</h2><p>Open your planning workspace. Explore every possibility.</p>
        {!configured && <div className="auth-setup-note"><strong>Account sign-in is coming soon</strong><p>Authentication setup is pending. The complete planner is available as a guest right now.</p></div>}
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="auth-github" onClick={onSignIn} disabled={!configured || busy}><Github size={20} />{busy ? 'Connecting to GitHub…' : 'Continue with GitHub'}<ArrowRight size={18} /></button>
        <div className="auth-divider"><span />or explore first<span /></div>
        <button className="auth-guest" onClick={onGuest}>Explore the guest demo <ArrowRight size={18} className="auth-guest-arrow" /></button>
        <div className="auth-privacy"><ShieldCheck size={17} /><p>No sign-in needed for the demo. Scenarios stay in your browser; use downloads to keep your work. {configured && 'GitHub handles your password. Export your scenario before signing in: the redirect reloads this page. Accounts do not enable cloud storage.'}</p></div>
      </div>
      <footer className="auth-entry-footer">Independent decisions. Transparent evidence.</footer>
    </section>
  </main>;
}
