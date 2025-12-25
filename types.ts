
export interface SimulationConfig {
  pressure: number; // PSI
  nozzleDiameter: number; // micrometers
  viscosity: number; // centipoise
  temperature: number; // Celsius
  fluidType: 'Synthetic Silk' | 'Organic Polymer' | 'Nano-Carbon';
}

export interface AnalysisResult {
  velocity: number;
  solidificationRate: number;
  tensileStrength: number;
  explanation: string;
  chemicalStructure?: string;
}

export enum SimulationStatus {
  IDLE = 'IDLE',
  CHARGING = 'CHARGING',
  FIRING = 'FIRING',
  FAILED = 'FAILED'
}
