import { validateScenario } from '../engine';
import type { Scenario, Analysis, Plan } from '../shared/types';

export function parseScenarioJson(text: string): Scenario {
  let parsed: unknown;
  try { parsed = JSON.parse(text); }
  catch { throw new Error('Invalid JSON. Check quotation marks, commas and brackets.'); }
  const errors = validateScenario(parsed);
  if (errors.length) throw new Error(`Invalid scenario:\n${errors.join('\n')}`);
  return parsed as Scenario;
}

export function scenarioToJson(scenario: Scenario): string {
  return JSON.stringify(scenario, null, 2);
}

function cell(value: string | number): string {
  // Quote every cell; protect text that spreadsheet programs could interpret as a formula.
  let text = String(value);
  if (typeof value === 'string' && (/^\s*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text))) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function allocationsToCsv(plan: Plan): string {
  const rows: (string | number)[][] = [
    ['batch_id', 'market_id', 'quantity_kg', 'arrival_hours', 'unit_price_inr_per_kg', 'reason'],
    ...plan.allocations.map((allocation) => [allocation.batchId, allocation.marketId, allocation.qtyKg, allocation.arrivalHours, allocation.unitPrice, allocation.reason]),
  ];
  return rows.map((row) => row.map(cell).join(',')).join('\r\n');
}

export function analysisToJson(scenario: Scenario, analysis: Analysis): string {
  return JSON.stringify({
    reportVersion: 1,
    provenance: scenario.source,
    units: { quantity: 'kg', money: 'INR', time: 'hours from immediate dispatch' },
    assumptions: [
      'Simulation using supplied scenario inputs; synthetic scenarios are not operational observations.',
      'Divisible kilograms, fixed destination travel times and one planning horizon.',
      'Net revenue excludes acquisition and storage costs because these are not provided.',
      'Leftover inventory spoils only when its remaining shelf life is within the planning horizon.',
      'Discount recommendations do not increase modeled demand, sales or revenue.',
    ],
    scenario,
    analysis,
  }, null, 2);
}
