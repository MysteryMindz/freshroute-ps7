import solver from 'javascript-lp-solver';
import type { Allocation, Analysis, Batch, Discount, Market, Metrics, Plan, Scenario } from '../shared/types';

const EPS = 1e-6;
const LIMIT = 1e9;
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);
const text = (v: unknown) => typeof v === 'string' && v.trim().length > 0 && v.length <= 160;
const numeric = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= LIMIT;
const close = (a: number, b: number) => Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));
const excess = (used: number, capacity: number) => used > capacity + EPS * Math.max(1, capacity);

export function validateScenario(input: unknown): string[] {
  const errors: string[] = [];
  if (!record(input)) return ['Scenario must be a JSON object.'];
  if (input.schemaVersion !== 1) errors.push('schemaVersion must be 1.');
  for (const key of ['id', 'label']) if (!text(input[key])) errors.push(`${key} must be nonempty text (max 160 characters).`);
  if (input.source !== 'synthetic' && input.source !== 'imported') errors.push('source must be synthetic or imported.');
  for (const key of ['horizonHours', 'handlingHours', 'transportCapacityKg']) {
    if (!numeric(input[key])) errors.push(`${key} must be a finite number between 0 and ${LIMIT}.`);
  }
  if (typeof input.horizonHours === 'number' && input.horizonHours <= 0) errors.push('horizonHours must be greater than zero.');
  if (!Array.isArray(input.batches) || input.batches.length > 50) errors.push('batches must be an array with at most 50 entries.');
  if (!Array.isArray(input.markets) || input.markets.length > 10) errors.push('markets must be an array with at most 10 entries.');
  if (!Array.isArray(input.batches) || !Array.isArray(input.markets)) return errors;
  if (input.batches.length > 50 || input.markets.length > 10) return errors;
  const batchIds = new Set<string>();
  input.batches.forEach((b: unknown, i: number) => {
    const path = `batches[${i}]`;
    if (!record(b)) { errors.push(`${path} must be an object.`); return; }
    for (const key of ['id', 'commodity']) if (!text(b[key])) errors.push(`${path}.${key} must be nonempty text.`);
    if (typeof b.id === 'string') { if (batchIds.has(b.id)) errors.push(`${path}.id is a duplicate batch ID.`); batchIds.add(b.id); }
    for (const key of ['qtyKg', 'shelfLifeHours', 'disposalCostPerKg']) if (!numeric(b[key])) errors.push(`${path}.${key} must be a finite nonnegative number <= ${LIMIT}.`);
  });
  const marketIds = new Set<string>();
  input.markets.forEach((m: unknown, i: number) => {
    const path = `markets[${i}]`;
    if (!record(m)) { errors.push(`${path} must be an object.`); return; }
    for (const key of ['id', 'name']) if (!text(m[key])) errors.push(`${path}.${key} must be nonempty text.`);
    if (typeof m.id === 'string') { if (marketIds.has(m.id)) errors.push(`${path}.id is a duplicate market ID.`); marketIds.add(m.id); }
    for (const key of ['travelHours', 'capacityKg', 'transportCostPerKg', 'handlingCostPerKg']) if (!numeric(m[key])) errors.push(`${path}.${key} must be a finite nonnegative number <= ${LIMIT}.`);
    const demand = m.demandByCommodity;
    const prices = m.priceByCommodity;
    for (const key of ['demandByCommodity', 'priceByCommodity']) {
      const obj = m[key];
      if (!record(obj)) { errors.push(`${path}.${key} must be an object.`); continue; }
      if (Object.keys(obj).length > 100) errors.push(`${path}.${key} supports at most 100 commodities.`);
      for (const [commodity, value] of Object.entries(obj)) {
        if (!text(commodity) || !numeric(value)) errors.push(`${path}.${key}[${commodity}] must have a nonempty commodity name and finite nonnegative value <= ${LIMIT}.`);
      }
    }
    if (record(demand) && record(prices)) for (const commodity of Object.keys(demand)) {
      if (!own(prices, commodity) || !numeric(prices[commodity])) errors.push(`${path}.priceByCommodity is missing a valid price for ${commodity}.`);
    }
  });
  return errors;
}

function demand(m: Market, commodity: string): number { return own(m.demandByCommodity, commodity) ? m.demandByCommodity[commodity] : 0; }
function price(m: Market, commodity: string): number { return own(m.priceByCommodity, commodity) ? m.priceByCommodity[commodity] : 0; }
function eligible(s: Scenario, b: Batch, m: Market): boolean {
  const arrival = m.travelHours + s.handlingHours;
  return b.shelfLifeHours > 0 && arrival <= b.shelfLifeHours && arrival <= s.horizonHours && demand(m, b.commodity) > 0;
}
function contribution(s: Scenario, b: Batch, m: Market): number {
  return price(m, b.commodity) - m.transportCostPerKg - m.handlingCostPerKg + (b.shelfLifeHours <= s.horizonHours ? b.disposalCostPerKg : 0);
}
function pairs(s: Scenario) {
  return s.batches.flatMap((b, bi) => s.markets.flatMap((m, mi) => eligible(s, b, m) && b.qtyKg > 0 ? [{ b, m, bi, mi, benefit: contribution(s, b, m) }] : []));
}
function allocation(s: Scenario, b: Batch, m: Market, qtyKg: number, reason: string): Allocation {
  return { batchId: b.id, marketId: m.id, qtyKg, arrivalHours: m.travelHours + s.handlingHours, unitPrice: price(m, b.commodity), reason };
}

function greedy(s: Scenario, method: 'fefo' | 'heuristic'): Allocation[] {
  const candidates = pairs(s).filter(p => p.benefit > 0);
  candidates.sort((a, b) => method === 'fefo'
    ? a.b.shelfLifeHours - b.b.shelfLifeHours || a.b.id.localeCompare(b.b.id) || a.m.travelHours - b.m.travelHours || a.m.id.localeCompare(b.m.id)
    : b.benefit - a.benefit || a.b.shelfLifeHours - b.b.shelfLifeHours || a.b.id.localeCompare(b.b.id) || a.m.id.localeCompare(b.m.id));
  const stock = new Map(s.batches.map(b => [b.id, b.qtyKg]));
  const capacity = new Map(s.markets.map(m => [m.id, m.capacityKg]));
  const remaining = new Map<string, number>();
  let fleet = s.transportCapacityKg;
  const result: Allocation[] = [];
  for (const p of candidates) {
    const key = JSON.stringify([p.m.id, p.b.commodity]);
    const need = remaining.get(key) ?? demand(p.m, p.b.commodity);
    const qty = Math.min(stock.get(p.b.id)!, capacity.get(p.m.id)!, need, fleet);
    if (qty <= 0) continue;
    result.push(allocation(s, p.b, p.m, qty, method === 'fefo' ? 'Earliest-expiring batch; earliest feasible destination under the shared constraints.' : 'Feasible greedy fallback, ranked by incremental modeled net value; not guaranteed optimal.'));
    stock.set(p.b.id, stock.get(p.b.id)! - qty);
    capacity.set(p.m.id, capacity.get(p.m.id)! - qty);
    remaining.set(key, need - qty);
    fleet -= qty;
  }
  return result;
}

function linear(s: Scenario): Allocation[] {
  const candidates = pairs(s).filter(p => p.benefit > 0);
  if (!candidates.length || s.transportCapacityKg === 0) return [];
  const constraints: Record<string, { max: number }> = { fleet: { max: s.transportCapacityKg } };
  const variables: Record<string, Record<string, number>> = {};
  s.batches.forEach((b, i) => { constraints[`b${i}`] = { max: b.qtyKg }; });
  s.markets.forEach((m, i) => {
    constraints[`m${i}`] = { max: m.capacityKg };
    Object.keys(m.demandByCommodity).forEach((commodity, j) => { constraints[`d${i}_${j}`] = { max: demand(m, commodity) }; });
  });
  candidates.forEach((p, i) => {
    const ci = Object.keys(p.m.demandByCommodity).indexOf(p.b.commodity);
    variables[`x${i}`] = { value: p.benefit, fleet: 1, [`b${p.bi}`]: 1, [`m${p.mi}`]: 1, [`d${p.mi}_${ci}`]: 1 };
  });
  const solution = solver.Solve({ optimize: 'value', opType: 'max', constraints, variables, options: { timeout: 1500 } });
  if (!solution.feasible || solution.bounded === false || !Number.isFinite(solution.result)) throw new Error('The optimizer did not return a finite feasible bounded result.');
  return candidates.flatMap((p, i) => {
    const raw = solution[`x${i}`] ?? 0;
    if (typeof raw !== 'number' || !Number.isFinite(raw) || raw < -EPS) throw new Error('The optimizer returned an invalid quantity.');
    return raw > 0 ? [allocation(s, p.b, p.m, raw, `Feasible arrival in ${p.m.travelHours + s.handlingHours} h; modeled incremental value ₹${p.benefit.toFixed(2)}/kg, including avoided disposal only where applicable. Selected jointly under demand and capacity constraints.`)] : [];
  });
}

function evaluate(s: Scenario, allocations: Allocation[]): Metrics {
  const batches = new Map(s.batches.map(b => [b.id, b]));
  const markets = new Map(s.markets.map(m => [m.id, m]));
  const used = new Map<string, number>();
  let revenue = 0, transportCost = 0, handlingCost = 0, allocatedKg = 0;
  for (const a of allocations) {
    const b = batches.get(a.batchId)!, m = markets.get(a.marketId)!;
    revenue += a.qtyKg * price(m, b.commodity);
    transportCost += a.qtyKg * m.transportCostPerKg;
    handlingCost += a.qtyKg * m.handlingCostPerKg;
    allocatedKg += a.qtyKg;
    used.set(b.id, (used.get(b.id) ?? 0) + a.qtyKg);
  }
  let unallocatedKg = 0, spoiledKg = 0, spoilageCost = 0;
  for (const b of s.batches) {
    const left = Math.max(0, b.qtyKg - (used.get(b.id) ?? 0));
    unallocatedKg += left;
    if (b.shelfLifeHours <= s.horizonHours) { spoiledKg += left; spoilageCost += left * b.disposalCostPerKg; }
  }
  const totalDemand = s.markets.reduce((sum, m) => sum + Object.values(m.demandByCommodity).reduce((a, b) => a + b, 0), 0);
  return { revenue, transportCost, handlingCost, spoilageCost, netRevenue: revenue - transportCost - handlingCost - spoilageCost, allocatedKg, spoiledKg, unallocatedKg, demandFulfillmentPct: totalDemand > 0 ? allocatedKg / totalDemand * 100 : 0 };
}

function buildPlan(s: Scenario, allocations: Allocation[], method: Plan['method']): Plan {
  const used = new Map<string, number>();
  allocations.forEach(a => used.set(a.batchId, (used.get(a.batchId) ?? 0) + a.qtyKg));
  const metrics = evaluate(s, allocations);
  const unallocated = s.batches.flatMap(b => {
    const left = Math.max(0, b.qtyKg - (used.get(b.id) ?? 0));
    if (left <= EPS) return [];
    const viable = s.markets.filter(m => eligible(s, b, m));
    let reason: string;
    if (b.shelfLifeHours <= 0) reason = 'Already expired at dispatch; no delivery is allowed.';
    else if (!viable.length) reason = 'No destination has commodity demand and an arrival within shelf life and the planning horizon.';
    else if (metrics.allocatedKg >= s.transportCapacityKg - EPS) reason = 'Shared transport capacity is exhausted; a discount does not create transport capacity.';
    else if (viable.every(m => contribution(s, b, m) <= 0)) reason = 'No eligible sale has positive incremental modeled net value at the listed prices and costs.';
    else reason = 'Remaining destination demand/receiving capacity or competing allocations limit this batch; inspect destination totals.';
    reason += b.shelfLifeHours <= s.horizonHours ? ' Remaining quantity expires within this horizon and incurs disposal cost.' : ' Remaining quantity is carried as unexpired inventory, not counted as spoilage.';
    return [{ batchId: b.id, qtyKg: left, reason }];
  });
  const result: Plan = { method, allocations, metrics, unallocated, violations: [] };
  result.violations = validatePlan(s, result);
  return result;
}

export function validatePlan(s: Scenario, plan: Plan): string[] {
  const errors = validateScenario(s);
  if (errors.length) return errors;
  if (!plan || !Array.isArray(plan.allocations)) return ['Plan allocations must be an array.'];
  const batchUsed = new Map<string, number>(), marketUsed = new Map<string, number>(), demandUsed = new Map<string, number>();
  let total = 0;
  for (const [i, a] of plan.allocations.entries()) {
    if (!a || typeof a !== 'object') { errors.push(`Allocation ${i} must be an object.`); continue; }
    const b = s.batches.find(b => b.id === a.batchId), m = s.markets.find(m => m.id === a.marketId);
    if (!b || !m) { errors.push(`Allocation ${i} references an unknown batch or market.`); continue; }
    if (!numeric(a.qtyKg) || a.qtyKg <= 0) { errors.push(`Allocation ${i} has an invalid quantity.`); continue; }
    if (!eligible(s, b, m)) errors.push(`Allocation ${i} violates shelf life, horizon or commodity demand.`);
    if (!Number.isFinite(a.arrivalHours) || !close(a.arrivalHours, m.travelHours + s.handlingHours)) errors.push(`Allocation ${i} has an incorrect arrival time.`);
    if (!Number.isFinite(a.unitPrice) || !close(a.unitPrice, price(m, b.commodity))) errors.push(`Allocation ${i} has an incorrect price.`);
    batchUsed.set(b.id, (batchUsed.get(b.id) ?? 0) + a.qtyKg);
    marketUsed.set(m.id, (marketUsed.get(m.id) ?? 0) + a.qtyKg);
    const key = JSON.stringify([m.id, b.commodity]);
    demandUsed.set(key, (demandUsed.get(key) ?? 0) + a.qtyKg);
    total += a.qtyKg;
  }
  for (const b of s.batches) if (excess(batchUsed.get(b.id) ?? 0, b.qtyKg)) errors.push(`Stock exceeded for ${b.id}.`);
  for (const m of s.markets) {
    if (excess(marketUsed.get(m.id) ?? 0, m.capacityKg)) errors.push(`Receiving capacity exceeded for ${m.id}.`);
    for (const commodity of Object.keys(m.demandByCommodity)) if (excess(demandUsed.get(JSON.stringify([m.id, commodity])) ?? 0, demand(m, commodity))) errors.push(`Demand exceeded for ${m.id}/${commodity}.`);
  }
  if (excess(total, s.transportCapacityKg)) errors.push('Total transport capacity exceeded.');
  if (!errors.length) {
    const expected = evaluate(s, plan.allocations);
    for (const key of Object.keys(expected) as (keyof Metrics)[]) if (!plan.metrics || !Number.isFinite(plan.metrics[key]) || !close(plan.metrics[key], expected[key])) errors.push(`Incorrect accounting for ${key}.`);
  }
  return errors;
}

function discounts(s: Scenario, plan: Plan): Discount[] {
  return plan.unallocated.flatMap(left => {
    const b = s.batches.find(b => b.id === left.batchId)!;
    if (b.shelfLifeHours <= 0 || b.shelfLifeHours > 24) return [];
    const markets = s.markets.filter(m => eligible(s, b, m) && demand(m, b.commodity) - plan.allocations.filter(a => a.marketId === m.id && s.batches.find(b => b.id === a.batchId)!.commodity === b.commodity).reduce((sum, a) => sum + a.qtyKg, 0) > EPS);
    markets.sort((a, z) => contribution(s, b, z) - contribution(s, b, a) || a.id.localeCompare(z.id));
    const m = markets[0];
    if (!m || price(m, b.commodity) <= 0) return [];
    const pct = b.shelfLifeHours <= 12 ? 20 : 10;
    const currentPrice = price(m, b.commodity);
    const proposedPrice = Math.max(currentPrice * (1 - pct / 100), m.transportCostPerKg + m.handlingCostPerKg);
    if (proposedPrice >= currentPrice - EPS) return [];
    const usedAtMarket = plan.allocations.filter(a => a.marketId === m.id).reduce((sum, a) => sum + a.qtyKg, 0);
    const blocked = plan.metrics.allocatedKg >= s.transportCapacityKg - EPS || usedAtMarket >= m.capacityKg - EPS;
    return [{ batchId: b.id, marketId: m.id, discountPct: (1 - proposedPrice / currentPrice) * 100, proposedPrice, reason: `${left.qtyKg.toFixed(2)} kg remains with ${b.shelfLifeHours} h shelf life. Rule-based price review, capped by delivery/handling costs. ${blocked ? 'Capacity is binding: discounting alone cannot move this stock. ' : ''}Demand response is unknown; no extra sales or revenue are assumed.` }];
  });
}

export function analyzeScenario(s: Scenario): Analysis {
  const errors = validateScenario(s);
  if (errors.length) return { status: 'invalid', errors, warnings: [], baseline: null, optimized: null, discounts: [] };
  const warnings: string[] = [];
  if (s.source === 'synthetic') warnings.push('Synthetic demonstration data. Outcomes are modeled, not observed operational results.');
  if (!s.batches.length) warnings.push('No inventory batches are present.');
  if (!s.markets.length) warnings.push('No destinations are present.');
  if (!s.markets.some(m => Object.values(m.demandByCommodity).some(n => n > 0))) warnings.push('Total demand is zero; fulfillment is defined as 0%.');
  if (s.transportCapacityKg === 0) warnings.push('Transport capacity is zero. No stock can be dispatched.');
  const baseline = buildPlan(s, greedy(s, 'fefo'), 'fefo');
  let optimized: Plan;
  try {
    optimized = buildPlan(s, linear(s), 'lp');
    if (optimized.violations.length || optimized.metrics.netRevenue + EPS * Math.max(1, Math.abs(baseline.metrics.netRevenue)) < baseline.metrics.netRevenue) throw new Error('Optimizer output failed validation or the baseline comparison.');
  } catch {
    optimized = buildPlan(s, greedy(s, 'heuristic'), 'heuristic');
    if (optimized.metrics.netRevenue < baseline.metrics.netRevenue) optimized = buildPlan(s, baseline.allocations.map(a => ({ ...a, reason: 'Validated FEFO baseline retained as the stronger feasible fallback; no optimality claim.' })), 'heuristic');
    warnings.push('The LP optimizer could not be trusted for this run. A validated feasible heuristic fallback is shown; optimality is not claimed.');
  }
  if (baseline.violations.length || optimized.violations.length) return { status: 'failed', errors: [...baseline.violations, ...optimized.violations], warnings, baseline: null, optimized: null, discounts: [] };
  if (optimized.metrics.unallocatedKg > EPS) warnings.push('Some stock remains unallocated. Review its explanations before acting.');
  if (optimized.metrics.spoiledKg > baseline.metrics.spoiledKg + EPS) warnings.push('Trade-off: this revenue-first plan has more modeled spoilage than FEFO. Review disposal costs and business priorities; higher net revenue does not imply less waste.');
  return { status: 'ok', errors: [], warnings, baseline, optimized, discounts: discounts(s, optimized) };
}
