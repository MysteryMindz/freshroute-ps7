export interface Batch { id: string; commodity: string; qtyKg: number; shelfLifeHours: number; disposalCostPerKg: number }
export interface Market { id: string; name: string; travelHours: number; capacityKg: number; transportCostPerKg: number; handlingCostPerKg: number; demandByCommodity: Record<string, number>; priceByCommodity: Record<string, number> }
export interface Scenario { schemaVersion: 1; id: string; label: string; source: 'synthetic' | 'imported'; horizonHours: number; handlingHours: number; transportCapacityKg: number; batches: Batch[]; markets: Market[] }
export interface Allocation { batchId: string; marketId: string; qtyKg: number; arrivalHours: number; unitPrice: number; reason: string }
export interface Metrics { revenue: number; transportCost: number; handlingCost: number; spoilageCost: number; netRevenue: number; allocatedKg: number; spoiledKg: number; unallocatedKg: number; demandFulfillmentPct: number }
export interface Unallocated { batchId: string; qtyKg: number; reason: string }
export interface Plan { method: 'fefo' | 'lp' | 'heuristic'; allocations: Allocation[]; metrics: Metrics; unallocated: Unallocated[]; violations: string[] }
export interface Discount { batchId: string; marketId: string; discountPct: number; proposedPrice: number; reason: string }
export interface Analysis { status: 'ok' | 'invalid' | 'failed'; errors: string[]; warnings: string[]; baseline: Plan | null; optimized: Plan | null; discounts: Discount[] }
