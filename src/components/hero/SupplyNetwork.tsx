import { ArrowUpRight, Leaf, PackageCheck } from 'lucide-react';
import type { Analysis, Scenario } from '../../shared/types';

export default function SupplyNetwork({ scenario, analysis }: { scenario: Scenario; analysis: Analysis }) {
  const plan = analysis.optimized;
  const format = (value: number) => value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  const destinationY = [110, 255, 400];
  const batchY = [76, 145, 214, 283, 352, 421];
  return <div className="landing-network" aria-label="Synthetic dispatch allocation preview">
    <div className="landing-network-heading"><span><span className="landing-live-dot" /> The next move, connected.</span><ArrowUpRight size={18} /></div>
    <svg className="landing-network-svg" viewBox="0 0 570 500" role="img" aria-labelledby="landing-network-title landing-network-desc">
      <title id="landing-network-title">A synthetic harvest connected to destination markets</title>
      <desc id="landing-network-desc">Six produce batches and three destination markets. Curves represent calculated allocations, not geographic routes.</desc>
      <defs><linearGradient id="landing-route-gradient" x1="0" x2="1"><stop offset="0" stopColor="#779b65" stopOpacity=".4" /><stop offset=".7" stopColor="#c9f574" stopOpacity=".8" /><stop offset="1" stopColor="#c9f574" stopOpacity=".5" /></linearGradient></defs>
      {plan?.allocations.map((allocation, i) => {
        const batchIndex = scenario.batches.findIndex(batch => batch.id === allocation.batchId);
        const marketIndex = scenario.markets.findIndex(market => market.id === allocation.marketId);
        const route = `M 156 ${batchY[batchIndex]} C 245 ${batchY[batchIndex]}, 280 ${destinationY[marketIndex]}, 380 ${destinationY[marketIndex]}`;
        return <g key={`${allocation.batchId}-${allocation.marketId}`}><path className="landing-route" d={route} fill="none" stroke="url(#landing-route-gradient)" strokeWidth={Math.max(1.2, allocation.qtyKg / 35)} /><circle className="landing-route-packet" r="3" fill="#d5ff8f"><animateMotion dur={`${4 + i * .57}s`} repeatCount="indefinite" path={route} begin={`${i * -.9}s`} /></circle></g>;
      })}
      {scenario.batches.map((batch, i) => <g key={batch.id} className="landing-batch-node"><rect x="15" y={batchY[i] - 22} width="141" height="44" rx="9" fill="#173e2b" stroke="#42603e" /><circle cx="35" cy={batchY[i]} r="5" fill={batch.commodity === 'Tomato' ? '#e8aa7a' : '#c9e77d'} /><text x="49" y={batchY[i] - 3} className="landing-node-name">{batch.commodity}</text><text x="49" y={batchY[i] + 11} className="landing-node-detail">{batch.id} · {batch.qtyKg} kg</text><circle cx="156" cy={batchY[i]} r="3.5" fill="#badb8c" /></g>)}
      {scenario.markets.map((market, i) => <g key={market.id}><rect x="380" y={destinationY[i] - 37} width="174" height="74" rx="11" fill={i === 1 ? '#c9f574' : '#214832'} stroke={i === 1 ? '#c9f574' : '#557047'} /><circle cx="380" cy={destinationY[i]} r="4" fill="#d5ff8f" /><text x="396" y={destinationY[i] - 11} className={`landing-node-market ${i === 1 ? 'is-lime' : ''}`}>{market.name === 'Regional distribution hub' ? 'Regional hub' : market.name}</text><text x="396" y={destinationY[i] + 12} className={`landing-node-quantity ${i === 1 ? 'is-lime' : ''}`}>{format(plan?.allocations.filter(a => a.marketId === market.id).reduce((sum, a) => sum + a.qtyKg, 0) ?? 0)} kg</text><text x="459" y={destinationY[i] + 12} className={`landing-node-detail ${i === 1 ? 'is-lime' : ''}`}>{market.travelHours + scenario.handlingHours}h arrival</text></g>)}
      <text x="15" y="481" className="landing-diagram-caption">BATCH INVENTORY</text><text x="380" y="481" className="landing-diagram-caption">DESTINATION ALLOCATION</text>
    </svg>
    <div className="landing-network-footer"><span><Leaf size={14} /> Synthetic harvest · {scenario.batches.reduce((sum, b) => sum + b.qtyKg, 0)} kg</span><span><PackageCheck size={14} /> {format(plan?.metrics.allocatedKg ?? 0)} kg allocated</span></div>
  </div>;
}
