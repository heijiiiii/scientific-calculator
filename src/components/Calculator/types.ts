export interface CalculatorState {
  expression: string;
  result: string;
  mode: 'RAD' | 'DEG';
  shift: boolean;
  memory: number;
}

export type CalculatorAction =
  | { type: 'APPEND'; payload: string }
  | { type: 'DELETE' }
  | { type: 'CLEAR_ALL' }
  | { type: 'CALCULATE' }
  | { type: 'TOGGLE_SHIFT' }
  | { type: 'TOGGLE_MODE' }
  | { type: 'MEMORY_CLEAR' }
  | { type: 'MEMORY_PLUS' }
  | { type: 'MEMORY_MINUS' }
  | { type: 'MEMORY_RECALL' }
  | { type: 'MEMORY_STORE' }; 