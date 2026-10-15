import type { Scenario } from '../shared/types';

/** Fictional inputs, chosen to expose perishability, margins and capacity trade-offs. */
export function createDemoScenario(kind: 'normal' | 'delay' | 'capacity' | 'demand-spike' = 'normal'): Scenario {
  const scenario: Scenario = {
    schemaVersion: 1,
    id: `freshroute-demo-${kind}`,
    label: 'Synthetic produce distribution · normal day',
    source: 'synthetic',
    horizonHours: 24,
    handlingHours: 1,
    transportCapacityKg: 360,
    batches: [
      { id: 'T-101', commodity: 'Tomato', qtyKg: 90, shelfLifeHours: 5, disposalCostPerKg: 3 },
      { id: 'T-102', commodity: 'Tomato', qtyKg: 110, shelfLifeHours: 16, disposalCostPerKg: 3 },
      { id: 'T-103', commodity: 'Tomato', qtyKg: 100, shelfLifeHours: 36, disposalCostPerKg: 3 },
      { id: 'B-201', commodity: 'Banana', qtyKg: 60, shelfLifeHours: 7, disposalCostPerKg: 2 },
      { id: 'B-202', commodity: 'Banana', qtyKg: 80, shelfLifeHours: 20, disposalCostPerKg: 2 },
      { id: 'B-203', commodity: 'Banana', qtyKg: 90, shelfLifeHours: 48, disposalCostPerKg: 2 },
    ],
    markets: [
      { id: 'M-LOCAL', name: 'Town market', travelHours: 2, capacityKg: 140, transportCostPerKg: 2, handlingCostPerKg: 1, demandByCommodity: { Tomato: 90, Banana: 70 }, priceByCommodity: { Tomato: 23, Banana: 30 } },
      { id: 'M-CITY', name: 'City retailers', travelHours: 6, capacityKg: 220, transportCostPerKg: 5, handlingCostPerKg: 2, demandByCommodity: { Tomato: 140, Banana: 100 }, priceByCommodity: { Tomato: 38, Banana: 44 } },
      { id: 'M-HUB', name: 'Regional distribution hub', travelHours: 10, capacityKg: 200, transportCostPerKg: 8, handlingCostPerKg: 2, demandByCommodity: { Tomato: 120, Banana: 100 }, priceByCommodity: { Tomato: 44, Banana: 48 } },
    ],
  };
  if (kind === 'delay') {
    scenario.label = 'Synthetic produce distribution · 4-hour travel delay';
    scenario.markets.forEach((market) => { market.travelHours += 4; });
  } else if (kind === 'capacity') {
    scenario.label = 'Synthetic produce distribution · reduced fleet capacity';
    scenario.transportCapacityKg = 210;
  } else if (kind === 'demand-spike') {
    scenario.label = 'Synthetic produce distribution · city demand spike';
    scenario.markets[1].demandByCommodity = { Tomato: 230, Banana: 170 };
  }
  return scenario;
}
