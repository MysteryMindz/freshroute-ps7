import type { Scenario, Analysis, Plan } from './types';
export interface EnginePorts { validateScenario(input: unknown): string[]; analyzeScenario(scenario: Scenario): Analysis; validatePlan(scenario: Scenario, plan: Plan): string[] }
export interface DataPorts { createDemoScenario(kind?: 'normal' | 'delay' | 'capacity' | 'demand-spike'): Scenario }
export interface IoPorts { parseScenarioJson(text: string): Scenario; scenarioToJson(scenario: Scenario): string; allocationsToCsv(plan: Plan): string; analysisToJson(scenario: Scenario, analysis: Analysis): string }
