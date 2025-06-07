import { CalculatorState, CalculatorAction } from './types';

export const initialState: CalculatorState = {
  expression: '',
  result: '0',
  mode: 'RAD',
  shift: false,
  memory: 0,
};

export function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'APPEND':
      return {
        ...state,
        expression: state.expression + action.payload,
      };
    
    case 'DELETE':
      return {
        ...state,
        expression: state.expression.slice(0, -1),
      };
    
    case 'CLEAR_ALL':
      return {
        ...initialState,
        memory: state.memory,
      };
    
    case 'CALCULATE':
      try {
        // TODO: Implement actual calculation
        return {
          ...state,
          result: '계산 결과',
        };
      } catch (error) {
        return {
          ...state,
          result: 'Error',
        };
      }
    
    case 'TOGGLE_SHIFT':
      return {
        ...state,
        shift: !state.shift,
      };
    
    case 'TOGGLE_MODE':
      return {
        ...state,
        mode: state.mode === 'RAD' ? 'DEG' : 'RAD',
      };
    
    case 'MEMORY_CLEAR':
      return {
        ...state,
        memory: 0,
      };
    
    case 'MEMORY_PLUS':
      return {
        ...state,
        memory: state.memory + Number(state.result),
      };
    
    case 'MEMORY_MINUS':
      return {
        ...state,
        memory: state.memory - Number(state.result),
      };
    
    case 'MEMORY_RECALL':
      return {
        ...state,
        expression: state.expression + state.memory.toString(),
      };
    
    case 'MEMORY_STORE':
      return {
        ...state,
        memory: Number(state.result),
      };
    
    default:
      return state;
  }
} 