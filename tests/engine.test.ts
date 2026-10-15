import { describe, expect, it } from 'vitest';
import { analyzeScenario, validateScenario } from '../src/engine';
import { createDemoScenario } from '../src/data';
import type { Analysis, Plan, Scenario } from '../src/shared/types';

const EPS = 1e-5;
const close = (actual: number, expected: number) => expect(actual).toBeCloseTo(expected, 5);

/** Independent checker: does not call engine validation or metric helpers. */
export function checkPlan(s: Scenario, p: Plan): void {
  const batchUse = new Map<string, number>();
  const marketUse = new Map<string, number>();
  const demandUse = new Map<string, number>();
  let revenue = 0, transport = 0, handling = 0, allocated = 0;
  for (const a of p.allocations) {
    const b = s.batches.find((batch) => batch.id === a.batchId);
    const m = s.markets.find((market) => market.id === a.marketId);
    expect(b).toBeDefined(); expect(m).toBeDefined();
    if (!b || !m) throw new Error('Unknown allocation reference');
    expect(Number.isFinite(a.qtyKg)).toBe(true);
    expect(a.qtyKg).toBeGreaterThanOrEqual(-EPS);
    expect(b.shelfLifeHours).toBeGreaterThan(0);
    const arrival = m.travelHours + s.handlingHours;
    expect(arrival).toBeLessThanOrEqual(Math.min(b.shelfLifeHours, s.horizonHours) + EPS);
    close(a.arrivalHours, arrival);
    close(a.unitPrice, m.priceByCommodity[b.commodity]);
    batchUse.set(b.id, (batchUse.get(b.id) ?? 0) + a.qtyKg);
    marketUse.set(m.id, (marketUse.get(m.id) ?? 0) + a.qtyKg);
    const key = JSON.stringify([m.id, b.commodity]);
    demandUse.set(key, (demandUse.get(key) ?? 0) + a.qtyKg);
    allocated += a.qtyKg;
    revenue += a.qtyKg * m.priceByCommodity[b.commodity];
    transport += a.qtyKg * m.transportCostPerKg;
    handling += a.qtyKg * m.handlingCostPerKg;
  }
  let spoiled = 0, disposal = 0, leftover = 0;
  for (const b of s.batches) {
    const used = batchUse.get(b.id) ?? 0;
    expect(used).toBeLessThanOrEqual(b.qtyKg + EPS);
    const remaining = b.qtyKg - used;
    leftover += remaining;
    if (b.shelfLifeHours <= s.horizonHours) { spoiled += remaining; disposal += remaining * b.disposalCostPerKg; }
    const reported = p.unallocated.filter((u) => u.batchId === b.id).reduce((sum, u) => sum + u.qtyKg, 0);
    close(reported, remaining);
  }
  for (const m of s.markets) {
    expect(marketUse.get(m.id) ?? 0).toBeLessThanOrEqual(m.capacityKg + EPS);
    for (const [commodity, demand] of Object.entries(m.demandByCommodity)) {
      expect(demandUse.get(JSON.stringify([m.id, commodity])) ?? 0).toBeLessThanOrEqual(demand + EPS);
    }
  }
  expect(allocated).toBeLessThanOrEqual(s.transportCapacityKg + EPS);
  close(p.metrics.revenue, revenue); close(p.metrics.transportCost, transport);
  close(p.metrics.handlingCost, handling); close(p.metrics.spoilageCost, disposal);
  close(p.metrics.netRevenue, revenue - transport - handling - disposal);
  close(p.metrics.allocatedKg, allocated); close(p.metrics.spoiledKg, spoiled);
  close(p.metrics.unallocatedKg, leftover);
  const demand = s.markets.reduce((sum, market) => sum + Object.values(market.demandByCommodity).reduce((a, b) => a + b, 0), 0);
  close(p.metrics.demandFulfillmentPct, demand ? allocated / demand * 100 : 0);
}

function analyze(s: Scenario): Analysis & { baseline: Plan; optimized: Plan } {
  const result = analyzeScenario(s);
  expect(result.status).toBe('ok');
  expect(result.baseline).not.toBeNull(); expect(result.optimized).not.toBeNull();
  const valid = result as Analysis & { baseline: Plan; optimized: Plan };
  checkPlan(s, valid.baseline); checkPlan(s, valid.optimized);
  if (valid.optimized.method === 'lp') expect(valid.optimized.metrics.netRevenue + EPS).toBeGreaterThanOrEqual(valid.baseline.metrics.netRevenue);
  return valid;
}

function simple(): Scenario {
  return { schemaVersion: 1, id: 'test', label: 'Synthetic test', source: 'synthetic', horizonHours: 24, handlingHours: 1, transportCapacityKg: 5,
    batches: [{ id: 'expire', commodity: 'Tomato', qtyKg: 10, shelfLifeHours: 10, disposalCostPerKg: 2 }, { id: 'keep', commodity: 'Tomato', qtyKg: 8, shelfLifeHours: 40, disposalCostPerKg: 2 }],
    markets: [{ id: 'M', name: 'Test market', travelHours: 2, capacityKg: 20, transportCostPerKg: 1, handlingCostPerKg: 1, demandByCommodity: { Tomato: 20 }, priceByCommodity: { Tomato: 10 } }] };
}

describe('Independent allocation and accounting checks', () => {
  it('matches hand-calculated revenue, disposal and retained inventory', () => {
    const r = analyze(simple());
    for (const p of [r.baseline, r.optimized]) {
      close(p.metrics.revenue, 50); close(p.metrics.transportCost, 5); close(p.metrics.handlingCost, 5);
      close(p.metrics.spoiledKg, 5); close(p.metrics.spoilageCost, 10); close(p.metrics.unallocatedKg, 13); close(p.metrics.netRevenue, 30);
    }
  });
  it('reaches a known optimal objective with shelf-life-limited routes', () => {
    const s = simple(); s.transportCapacityKg = 16;
    s.batches = [{ id: 'early', commodity: 'Tomato', qtyKg: 8, shelfLifeHours: 3, disposalCostPerKg: 0 }, { id: 'later', commodity: 'Tomato', qtyKg: 8, shelfLifeHours: 20, disposalCostPerKg: 0 }];
    s.markets = [
      { id: 'near', name: 'Near', travelHours: 1, capacityKg: 8, transportCostPerKg: 0, handlingCostPerKg: 0, demandByCommodity: { Tomato: 8 }, priceByCommodity: { Tomato: 5 } },
      { id: 'far', name: 'Far', travelHours: 4, capacityKg: 8, transportCostPerKg: 0, handlingCostPerKg: 0, demandByCommodity: { Tomato: 8 }, priceByCommodity: { Tomato: 12 } },
    ];
    const r = analyze(s); expect(r.optimized.method).toBe('lp'); close(r.optimized.metrics.netRevenue, 136);
  });
  for (const kind of ['normal', 'delay', 'capacity', 'demand-spike'] as const) {
    it(`produces independently feasible ${kind} scenario plans`, () => { analyze(createDemoScenario(kind)); });
  }
  it('keeps commodity demand separate', () => {
    const s = simple(); s.transportCapacityKg = 100;
    s.batches[1].commodity = 'Banana'; s.markets[0].demandByCommodity = { Tomato: 2, Banana: 3 }; s.markets[0].priceByCommodity = { Tomato: 10, Banana: 20 };
    close(analyze(s).optimized.metrics.allocatedKg, 5);
  });
  it('does not ship expired or unreachable inventory', () => {
    const s = simple(); s.batches[0].shelfLifeHours = 0; s.batches[1].shelfLifeHours = 2;
    close(analyze(s).optimized.metrics.allocatedKg, 0);
  });
  it('permits delivery exactly at the shelf-life boundary', () => {
    const s = simple(); s.batches = [s.batches[0]]; s.batches[0].shelfLifeHours = 3;
    close(analyze(s).optimized.metrics.allocatedKg, 5);
  });
  for (const mode of ['demand', 'fleet', 'market', 'horizon'] as const) {
    it(`handles zero service from ${mode} restrictions`, () => {
      const s = simple();
      if (mode === 'demand') s.markets[0].demandByCommodity.Tomato = 0;
      if (mode === 'fleet') s.transportCapacityKg = 0;
      if (mode === 'market') s.markets[0].capacityKg = 0;
      if (mode === 'horizon') s.horizonHours = 2;
      const r = analyze(s); close(r.optimized.metrics.allocatedKg, 0);
      if (mode === 'demand') { close(r.optimized.metrics.demandFulfillmentPct, 0); expect(r.warnings.length).toBeGreaterThan(0); }
    });
  }
  it('does not ship economically harmful allocations unless avoided disposal justifies them', () => {
    const s = simple(); s.markets[0].priceByCommodity.Tomato = 1; s.batches.forEach((b) => { b.disposalCostPerKg = 0; });
    close(analyze(s).optimized.metrics.allocatedKg, 0);
    s.batches[0].disposalCostPerKg = 4;
    close(analyze(s).optimized.metrics.allocatedKg, 5);
  });
  it('keeps discount recommendations out of revenue and demand accounting', () => {
    const s = simple(); const snapshot = JSON.stringify(s); const r = analyze(s);
    expect(r.discounts.length).toBeGreaterThan(0);
    for (const d of r.discounts) { expect(d.discountPct).toBeGreaterThan(0); expect(d.proposedPrice).toBeGreaterThanOrEqual(2); }
    expect(JSON.stringify(s)).toBe(snapshot); close(r.optimized.metrics.revenue, 50);
  });
  it('handles empty stock and destinations', () => {
    const s = simple(); s.batches = []; s.markets = [];
    close(analyze(s).optimized.metrics.allocatedKg, 0);
  });
  it('checks 30 deterministic generated scenarios independently', () => {
    let seed = 7319;
    const random = (n: number) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % n; };
    for (let i = 0; i < 30; i++) {
      const s = createDemoScenario(); s.id = `generated-${i}`;
      s.transportCapacityKg = random(500);
      s.batches.forEach((b) => { b.qtyKg = random(120); b.shelfLifeHours = random(50); b.disposalCostPerKg = random(7); });
      s.markets.forEach((m) => { m.travelHours = random(20); m.capacityKg = random(200); m.transportCostPerKg = random(14); for (const c of ['Tomato', 'Banana']) { m.demandByCommodity[c] = random(120); m.priceByCommodity[c] = random(45); } });
      analyze(s);
    }
  });
});

describe('Scenario validation', () => {
  it('rejects malformed root values without throwing', () => {
    for (const input of [null, undefined, [], 'text', 7, {}, { batches: null, markets: null }]) expect(validateScenario(input).length).toBeGreaterThan(0);
  });
  it('rejects negative, NaN, infinity, duplicate and missing-price fields', () => {
    const bad: Scenario[] = [];
    let s = simple(); s.batches[0].qtyKg = -1; bad.push(s);
    s = simple(); s.transportCapacityKg = NaN; bad.push(s);
    s = simple(); s.markets[0].travelHours = Infinity; bad.push(s);
    s = simple(); s.batches[1].id = s.batches[0].id; bad.push(s);
    s = simple(); s.markets.push(structuredClone(s.markets[0])); bad.push(s);
    s = simple(); delete s.markets[0].priceByCommodity.Tomato; bad.push(s);
    s = simple(); s.horizonHours = 0; bad.push(s);
    for (const input of bad) { expect(validateScenario(input).length).toBeGreaterThan(0); expect(analyzeScenario(input).status).toBe('invalid'); }
  });
});
