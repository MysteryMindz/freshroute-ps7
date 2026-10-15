import { beforeEach, describe, expect, it, vi } from 'vitest';
const mockSolve = vi.hoisted(() => vi.fn());
vi.mock('javascript-lp-solver', () => ({ default: { Solve: mockSolve } }));
import { analyzeScenario } from '../src/engine';
import { createDemoScenario } from '../src/data';

describe('Untrusted solver output', () => {
  beforeEach(() => { mockSolve.mockReset(); });
  it.each(['throws', 'infeasible', 'unbounded', 'impossible-quantity'] as const)('labels and validates fallback when solver %s', (mode) => {
    if (mode === 'throws') mockSolve.mockImplementation(() => { throw new Error('Deliberate test failure'); });
    else if (mode === 'infeasible') mockSolve.mockReturnValue({ feasible: false, bounded: true, result: 0 });
    else if (mode === 'unbounded') mockSolve.mockReturnValue({ feasible: true, bounded: false, result: Infinity });
    else mockSolve.mockReturnValue({ feasible: true, bounded: true, result: 1e10, x0: 1e8 });
    const s = createDemoScenario(); const r = analyzeScenario(s);
    expect(r.status).toBe('ok'); expect(r.optimized?.method).toBe('heuristic');
    expect(r.warnings.join(' ')).toMatch(/fallback|heuristic/i);
    const p = r.optimized!;
    expect(p.metrics.netRevenue + 1e-5).toBeGreaterThanOrEqual(r.baseline!.metrics.netRevenue);
    let allocated = 0;
    for (const a of p.allocations) {
      const b = s.batches.find((b) => b.id === a.batchId)!;
      const m = s.markets.find((m) => m.id === a.marketId)!;
      expect(a.qtyKg).toBeGreaterThan(0);
      expect(a.arrivalHours).toBeLessThanOrEqual(Math.min(b.shelfLifeHours, s.horizonHours));
      expect(a.arrivalHours).toBe(m.travelHours + s.handlingHours);
      allocated += a.qtyKg;
    }
    expect(allocated).toBeLessThanOrEqual(s.transportCapacityKg + 1e-5);
    for (const b of s.batches) expect(p.allocations.filter((a) => a.batchId === b.id).reduce((sum, a) => sum + a.qtyKg, 0)).toBeLessThanOrEqual(b.qtyKg + 1e-5);
    for (const m of s.markets) {
      expect(p.allocations.filter((a) => a.marketId === m.id).reduce((sum, a) => sum + a.qtyKg, 0)).toBeLessThanOrEqual(m.capacityKg + 1e-5);
      for (const [commodity, demand] of Object.entries(m.demandByCommodity)) expect(p.allocations.filter((a) => a.marketId === m.id && s.batches.find((b) => b.id === a.batchId)!.commodity === commodity).reduce((sum, a) => sum + a.qtyKg, 0)).toBeLessThanOrEqual(demand + 1e-5);
    }
  });
});
