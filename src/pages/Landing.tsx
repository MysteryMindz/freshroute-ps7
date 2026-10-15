import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, Clock3, GitCompareArrows, Leaf, Package, ShieldCheck, Sprout, Truck, X } from 'lucide-react';
import { analyzeScenario } from '../engine';
import { createDemoScenario } from '../data';
import ParticleField from '../components/hero/ParticleField';
import SupplyNetwork from '../components/hero/SupplyNetwork';
import '../styles/landing.css';

export interface LandingProps { onLaunch: () => void; onSignIn: () => void; isSignedIn?: boolean }
const number = (value: number) => value.toLocaleString('en-IN', { maximumFractionDigits: 1 });
const money = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function Landing({ onLaunch, onSignIn, isSignedIn = false }: LandingProps) {
  const [delay, setDelay] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const base = useMemo(() => { const scenario = createDemoScenario(); return { scenario, analysis: analyzeScenario(scenario) }; }, []);
  const demo = useMemo(() => {
    const scenario = createDemoScenario();
    scenario.markets.forEach(market => { market.travelHours += delay; });
    return analyzeScenario(scenario);
  }, [delay]);
  const optimized = demo.optimized?.metrics;
  const baseline = demo.baseline?.metrics;
  const openSection = (id: string) => {
    setMenuOpen(false);
    // Let the compact menu collapse before measuring the destination.
    requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })));
  };

  return <div className="landing">
    <header className="landing-nav-wrap" onKeyDown={event => { if (event.key === 'Escape') setMenuOpen(false); }}><nav className="landing-nav" aria-label="FreshRoute navigation">
      <a className="landing-brand" href="#" aria-label="FreshRoute home"><span className="landing-brand-icon"><Sprout size={24} strokeWidth={1.8} /></span>FreshRoute<span className="landing-brand-period">.</span></a>
      <div className="landing-nav-links"><button onClick={() => openSection('landing-how')}>How it works</button><button onClick={() => openSection('landing-demo')}>Try a scenario</button></div>
      <div className="landing-nav-actions"><button className="landing-signin" onClick={isSignedIn ? onLaunch : onSignIn}>{isSignedIn ? 'Your workspace' : 'Sign in'}<ArrowUpRight size={15} /></button><button className="landing-nav-launch" onClick={onLaunch}>Launch planner<ArrowRight size={16} /></button><button className="landing-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="landing-mobile-menu" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>{menuOpen ? <X size={23} /> : <span><i /><i /></span>}</button></div>
    </nav>{menuOpen && <div className="landing-mobile-menu" id="landing-mobile-menu"><button onClick={() => openSection('landing-how')}>How it works<ChevronRight size={18} /></button><button onClick={() => openSection('landing-demo')}>Try a scenario<ChevronRight size={18} /></button><button onClick={() => { setMenuOpen(false); (isSignedIn ? onLaunch : onSignIn)(); }}>{isSignedIn ? 'Your workspace' : 'Sign in'}<ArrowUpRight size={18} /></button></div>}</header>

    <main id="landing-main">
      <section className="landing-hero" aria-labelledby="landing-title">
        <ParticleField />
        <div className="landing-hero-inner"><div className="landing-hero-copy">
          <h1 id="landing-title">Fresh produce.<br /><span>Smarter moves.</span></h1>
          <p>Every batch has a clock. Every market has a limit. Find a dispatch plan that sees both.</p>
          <div className="landing-hero-actions"><button className="landing-button landing-button-lime" onClick={onLaunch}>Launch planner<span><ArrowUpRight size={21} /></span></button><button className="landing-guest-link" onClick={() => openSection('landing-demo')}>Explore guest demo<ArrowRight size={17} /></button></div>
          <div className="landing-hero-assurance"><span><Check size={14} /> Try it without an account</span><span><ShieldCheck size={14} /> Calculated in your browser</span></div>
        </div><div className="landing-hero-visual"><SupplyNetwork scenario={base.scenario} analysis={base.analysis} /><div className="landing-visual-note"><span className="landing-note-line" /> Real calculations. Synthetic inputs. Clear trade-offs.</div></div></div>
        <div className="landing-hero-bottom"><button onClick={() => openSection('landing-how')}>Follow the journey<ArrowDown size={15} /></button><span>Built for the decisions between harvest and market.</span></div>
      </section>

      <div className="landing-principles" aria-label="Planning capabilities"><div><Clock3 size={20} /><span>Shelf-life aware</span></div><div><Truck size={20} /><span>Capacity constrained</span></div><div><GitCompareArrows size={20} /><span>Baseline compared</span></div><div><Leaf size={20} /><span>Trade-offs explained</span></div></div>

      <section className="landing-story" id="landing-how" aria-labelledby="landing-story-title">
        <div className="landing-story-heading"><h2 id="landing-story-title">A harvest of possibilities.<br /><span>A plan with perspective.</span></h2><p>Getting produce to market takes more than choosing the nearest destination. FreshRoute brings shelf life, demand, capacity and costs into one transparent decision.</p></div>
        <div className="landing-story-body"><div className="landing-harvest-mark" aria-hidden="true"><div className="landing-harvest-orbit landing-orbit-one" /><div className="landing-harvest-orbit landing-orbit-two" /><div className="landing-harvest-center"><Sprout size={66} strokeWidth={1.2} /></div><span className="landing-orbit-tag landing-tag-stock"><Package size={17} /> Inventory</span><span className="landing-orbit-tag landing-tag-time"><Clock3 size={17} /> Shelf life</span><span className="landing-orbit-tag landing-tag-market"><Truck size={17} /> Market demand</span></div>
          <div className="landing-steps"><article><span className="landing-step-icon"><Package size={23} strokeWidth={1.5} /></span><div><h3>Start with what you have.</h3><p>Review batches, remaining shelf life and destination demand. Use a synthetic scenario or import your own inputs.</p></div></article><article><span className="landing-step-icon"><GitCompareArrows size={23} strokeWidth={1.5} /></span><div><h3>See the whole trade-off.</h3><p>Compare a revenue-first allocation with first-expiring-first-out. Inspect quantities, arrival times and the accounting behind each plan.</p></div></article><article><span className="landing-step-icon"><ArrowUpRight size={25} strokeWidth={1.5} /></span><div><h3>Make room for the unexpected.</h3><p>Test a delay, a capacity squeeze or a demand spike. Recalculate and understand what changes before making a dispatch decision.</p></div></article></div>
        </div>
      </section>

      <section className="landing-demo" id="landing-demo" aria-labelledby="landing-demo-title"><div className="landing-demo-inner"><div className="landing-demo-copy"><h2 id="landing-demo-title">What if the journey<br />takes longer?</h2><p>Move the delay. Watch the plan respond.</p><p className="landing-demo-description">This is the actual planning engine running on a fictional harvest. Every number below is recalculated from the same inventory and constraints.</p><div className="landing-delay-control"><label htmlFor="landing-delay">Extra travel time<strong>+{delay}<span> hours</span></strong></label><input id="landing-delay" type="range" min="0" max="12" step="1" value={delay} onChange={event => setDelay(Number(event.target.value))} aria-valuetext={`${delay} extra hours of travel time`} /><div className="landing-range-labels"><span>No delay</span><span>+12 hours</span></div></div><button className="landing-demo-launch" onClick={onLaunch}>Open the full planner<ArrowUpRight size={19} /></button></div>
          <div className="landing-demo-results" aria-live="polite" aria-atomic="true"><div className="landing-demo-topline"><span><span className="landing-live-dot" /> Synthetic scenario</span><span>{demo.optimized?.method === 'lp' ? 'Linear programming' : demo.optimized?.method === 'heuristic' ? 'Feasible heuristic' : 'No plan'}</span></div><div className="landing-demo-table-wrap"><table><caption>Same harvest. Two ways to dispatch.</caption><thead><tr><th scope="col">Modeled outcome</th><th scope="col">FEFO baseline</th><th scope="col">FreshRoute plan</th></tr></thead><tbody>{optimized && baseline ? <><tr><th scope="row">Net revenue</th><td>{money(baseline.netRevenue)}</td><td>{money(optimized.netRevenue)}</td></tr><tr><th scope="row">Allocated produce</th><td>{number(baseline.allocatedKg)}<small> kg</small></td><td>{number(optimized.allocatedKg)}<small> kg</small></td></tr><tr><th scope="row">Modeled spoilage</th><td>{number(baseline.spoiledKg)}<small> kg</small></td><td>{number(optimized.spoiledKg)}<small> kg</small></td></tr></> : <tr><td colSpan={3}>This scenario could not be calculated. Open the planner to review the inputs.</td></tr>}</tbody></table></div><div className="landing-tradeoff"><GitCompareArrows size={19} /><p>{optimized && baseline ? optimized.spoiledKg > baseline.spoiledKg + .000001 ? 'A real trade-off: the revenue-first plan leaves more spoilage than FEFO. Higher net revenue does not always mean less waste.' : optimized.spoiledKg < baseline.spoiledKg - .000001 ? 'This scenario produces less modeled spoilage than FEFO. The outcome depends on the supplied demand, shelf life and costs.' : 'Both plans have the same modeled spoilage in this scenario. Compare the revenue and allocation outcomes alongside it.' : demo.errors[0] ?? 'Review the scenario before making a decision.'}</p></div><p className="landing-model-note">Net revenue = sales − transport − handling − disposal. Synthetic results demonstrate the model, not field performance.</p></div>
        </div></section>

      <section className="landing-honesty" aria-labelledby="landing-honesty-title"><div className="landing-honesty-lead"><ShieldCheck size={28} strokeWidth={1.4} /><h2 id="landing-honesty-title">Clear inputs.<br />Honest outcomes.</h2></div><div><p>Inspect the assumptions. Understand every allocation. Export a plan you can explain.</p><p className="landing-honesty-detail">FreshRoute is a planning simulation with fixed travel times and divisible quantities. It does not provide live prices, vehicle routing or promises of savings. Synthetic examples stay labeled.</p><button onClick={onLaunch}>See the model in the planner<ArrowUpRight size={18} /></button></div></section>

      <section className="landing-closing" aria-labelledby="landing-closing-title"><div className="landing-closing-leaf" aria-hidden="true"><Leaf size={230} strokeWidth={.55} /></div><h2 id="landing-closing-title">Give every batch<br />a considered next move<span>.</span></h2><button className="landing-button landing-button-lime" onClick={onLaunch}>Let's plan the next harvest<span><ArrowUpRight size={21} /></span></button><p>Explore as a guest. Start with a synthetic scenario.</p></section>
    </main>

    <footer className="landing-footer"><a className="landing-brand" href="#" aria-label="FreshRoute home"><Sprout size={23} strokeWidth={1.8} />FreshRoute<span className="landing-brand-period">.</span></a><p>Better decisions between harvest and market.</p><button onClick={isSignedIn ? onLaunch : onSignIn}>{isSignedIn ? 'Your workspace' : 'Sign in'}<ArrowUpRight size={16} /></button></footer>
  </div>;
}
