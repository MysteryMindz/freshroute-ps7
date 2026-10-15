import { describe, expect, it } from 'vitest';
import { createDemoScenario } from '../src/data';
import { analyzeScenario } from '../src/engine';
import { allocationsToCsv, analysisToJson, parseScenarioJson, scenarioToJson } from '../src/io';
import type { Plan } from '../src/shared/types';

describe('Data import, provenance and export', () => {
  it('round-trips scenario JSON without losing provenance or fractional inputs', () => {
    const s = createDemoScenario(); s.batches[0].qtyKg = 12.125;
    expect(parseScenarioJson(scenarioToJson(s))).toEqual(s);
    s.source = 'imported'; expect(parseScenarioJson(scenarioToJson(s)).source).toBe('imported');
  });
  it('rejects malformed JSON and valid JSON with invalid fields', () => {
    expect(() => parseScenarioJson('{bad')).toThrow(/Invalid JSON/);
    expect(() => parseScenarioJson('null')).toThrow(/Invalid scenario/);
    const s = createDemoScenario(); s.batches[0].qtyKg = -1;
    expect(() => parseScenarioJson(JSON.stringify(s))).toThrow(/Invalid scenario/);
  });
  it('creates independent demo objects and genuinely different disruption inputs', () => {
    const s = createDemoScenario(); const copy = createDemoScenario(); s.batches[0].qtyKg = 0;
    expect(copy.batches[0].qtyKg).toBeGreaterThan(0);
    expect(createDemoScenario('delay').markets[0].travelHours).toBeGreaterThan(copy.markets[0].travelHours);
    expect(createDemoScenario('capacity').transportCapacityKg).toBeLessThan(copy.transportCapacityKg);
    expect(createDemoScenario('demand-spike').markets[1].demandByCommodity.Tomato).toBeGreaterThan(copy.markets[1].demandByCommodity.Tomato);
  });
  it('CSV quotes punctuation/newlines and protects spreadsheet formulas in text cells', () => {
    const p = { allocations: [{ batchId: '=1+1', marketId: '  @SUM(A1)', qtyKg: 2.5, arrivalHours: 3, unitPrice: 7, reason: 'He said "go", then\nwait' }] } as Plan;
    const csv = allocationsToCsv(p);
    expect(csv).toContain('"\'=1+1"'); expect(csv).toContain('"\'  @SUM(A1)"');
    expect(csv).toContain('"He said ""go"", then\nwait"'); expect(csv).toContain('"2.5"');
  });
  it('report includes original inputs, actual output, units and assumptions', () => {
    const s = createDemoScenario(); const a = analyzeScenario(s); const r = JSON.parse(analysisToJson(s, a));
    expect(r.scenario).toEqual(s); expect(r.analysis).toEqual(a); expect(r.provenance).toBe('synthetic');
    expect(r.units.money).toBe('INR'); expect(r.assumptions.join(' ')).toMatch(/Discount recommendations do not/);
  });
});
