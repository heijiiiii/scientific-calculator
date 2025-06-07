import { useReducer } from 'react';
import { evaluate, factorial, pow } from 'mathjs';

interface CalculatorState {
  display: string;
  mode: string;
  memory: number;
  expression: string;
  isNewNumber: boolean;
  shift: boolean;
  lastOperator: string;
  parenthesesCount: number;
}

type CalculatorAction = 
  | { type: 'NUMBER'; payload: string }
  | { type: 'OPERATOR'; payload: string }
  | { type: 'FUNCTION'; payload: string }
  | { type: 'MEMORY'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'EQUALS' }
  | { type: 'BACKSPACE' };

const initialState: CalculatorState = {
  display: '0',
  mode: 'DEG',
  memory: 0,
  expression: '',
  isNewNumber: true,
  shift: false,
  lastOperator: '',
  parenthesesCount: 0
};

const formatNumber = (num: number): string => {
  if (isNaN(num) || !isFinite(num)) return 'Error';
  if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-10 && num !== 0)) {
    return num.toExponential(6);
  }
  return Number(num.toFixed(10)).toString().replace(/\.?0+$/, '');
};

const toNumber = (value: any): number => {
  const num = parseFloat(value.toString());
  return isNaN(num) ? 0 : num;
};

const calculateExpression = (expr: string, mode: string): string => {
  try {
    if (!expr || expr.trim() === '') return '0';
    
    let processedExpr = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/(\d+(\.\d+)?)\s*\(/g, '$1*(')  // 2(3) -> 2*(3)
      .replace(/\)\s*(\d+)/g, ')*$1')  // (3)2 -> (3)*2
      .replace(/(\d+(\.\d+)?)\s*e/gi, '$1*e'); // 2e -> 2*e

    // mathjs 함수명으로 변환
    processedExpr = processedExpr
      .replace(/sin\(/g, 'sin(')
      .replace(/cos\(/g, 'cos(')
      .replace(/tan\(/g, 'tan(')
      .replace(/asin\(/g, 'asin(')
      .replace(/acos\(/g, 'acos(')
      .replace(/atan\(/g, 'atan(')
      .replace(/ln\(/g, 'log(')
      .replace(/log\(/g, 'log10(')
      .replace(/sqrt\(/g, 'sqrt(')
      .replace(/cbrt\(/g, 'cbrt(')
      .replace(/\^/g, '^');

    // 각도 변환 (DEG 모드일 때)
    if (mode === 'DEG') {
      processedExpr = processedExpr
        .replace(/sin\(([^)]+)\)/g, 'sin(($1) * pi / 180)')
        .replace(/cos\(([^)]+)\)/g, 'cos(($1) * pi / 180)')
        .replace(/tan\(([^)]+)\)/g, 'tan(($1) * pi / 180)')
        .replace(/asin\(([^)]+)\)/g, 'asin($1) * 180 / pi')
        .replace(/acos\(([^)]+)\)/g, 'acos($1) * 180 / pi')
        .replace(/atan\(([^)]+)\)/g, 'atan($1) * 180 / pi');
    }

    const result = toNumber(evaluate(processedExpr));
    return formatNumber(result);
  } catch (error) {
    console.error('Calculation error:', error);
    return 'Error';
  }
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  const currentValue = toNumber(state.display);

  switch (action.type) {
    case 'NUMBER':
      if (state.display === '0' && action.payload !== '.') {
        return {
          ...state,
          display: action.payload,
          isNewNumber: false
        };
      }
      if (action.payload === '.' && state.display.includes('.')) {
        return state;
      }
      return {
        ...state,
        display: state.isNewNumber ? action.payload : state.display + action.payload,
        isNewNumber: false
      };

    case 'OPERATOR':
      if (action.payload === '=') {
        let finalExpression = state.expression;
        if (!state.isNewNumber) {
          finalExpression += state.display;
        }
        // 닫히지 않은 괄호 자동 완성
        for (let i = 0; i < state.parenthesesCount; i++) {
          finalExpression += ')';
        }
        
        const result = calculateExpression(finalExpression, state.mode);
        return {
          ...state,
          display: result,
          expression: '',
          isNewNumber: true,
          lastOperator: '',
          parenthesesCount: 0
        };
      }

      // 연속 연산 처리
      if (state.expression && !state.isNewNumber) {
        const intermediateResult = calculateExpression(state.expression + state.display, state.mode);
        return {
          ...state,
          display: intermediateResult,
          expression: intermediateResult + ' ' + action.payload + ' ',
          isNewNumber: true,
          lastOperator: action.payload
        };
      }

      if (action.payload === '(') {
        const newExpr = state.isNewNumber ? 
          (state.expression + '(') : 
          (state.expression + state.display + ' × (');
        return {
          ...state,
          expression: newExpr,
          parenthesesCount: state.parenthesesCount + 1,
          isNewNumber: true
        };
      }

      if (action.payload === ')' && state.parenthesesCount > 0) {
        return {
          ...state,
          expression: state.expression + state.display + ')',
          parenthesesCount: state.parenthesesCount - 1,
          isNewNumber: true
        };
      }

      return {
        ...state,
        expression: (state.isNewNumber ? state.expression : state.expression + state.display) + ' ' + action.payload + ' ',
        isNewNumber: true,
        lastOperator: action.payload
      };

    case 'FUNCTION':
      try {
        switch (action.payload) {
          case 'AC':
            return initialState;

          case 'back':
            if (state.display.length <= 1 || state.display === '0') {
              return {
                ...state,
                display: '0',
                isNewNumber: true
              };
            }
            return {
              ...state,
              display: state.display.slice(0, -1)
            };

          case '2nd':
            return {
              ...state,
              shift: !state.shift
            };

          case 'x²':
            const squareResult = formatNumber(toNumber(pow(currentValue, 2)));
            return {
              ...state,
              display: squareResult,
              expression: state.expression,
              isNewNumber: true
            };

          case 'x³':
            const cubeResult = formatNumber(toNumber(pow(currentValue, 3)));
            return {
              ...state,
              display: cubeResult,
              expression: state.expression,
              isNewNumber: true
            };

          case 'xʸ':
            return {
              ...state,
              expression: state.expression + state.display + ' ^ ',
              isNewNumber: true
            };

          case 'eˣ':
            const expResult = formatNumber(toNumber(pow(Math.E, currentValue)));
            return {
              ...state,
              display: expResult,
              expression: state.expression,
              isNewNumber: true
            };

          case '10ˣ':
            const exp10Result = formatNumber(toNumber(pow(10, currentValue)));
            return {
              ...state,
              display: exp10Result,
              expression: state.expression,
              isNewNumber: true
            };

          case '1/x':
            if (currentValue === 0) return { ...state, display: 'Error' };
            const reciprocalResult = formatNumber(1 / currentValue);
            return {
              ...state,
              display: reciprocalResult,
              expression: state.expression,
              isNewNumber: true
            };

          case '²√x':
            return {
              ...state,
              expression: state.expression + 'sqrt(',
              parenthesesCount: state.parenthesesCount + 1,
              isNewNumber: true
            };

          case '³√x':
            return {
              ...state,
              expression: state.expression + 'cbrt(',
              parenthesesCount: state.parenthesesCount + 1,
              isNewNumber: true
            };

          case 'ʸ√x':
            return {
              ...state,
              expression: state.expression + state.display + ' ^ (1 ÷ ',
              isNewNumber: true
            };

          case 'ln':
            return {
              ...state,
              expression: state.expression + 'ln(',
              parenthesesCount: state.parenthesesCount + 1,
              isNewNumber: true
            };

          case 'log':
            return {
              ...state,
              expression: state.expression + 'log(',
              parenthesesCount: state.parenthesesCount + 1,
              isNewNumber: true
            };

          case 'sin':
            return {
              ...state,
              expression: state.expression + 'sin(',
              parenthesesCount: state.parenthesesCount + 1,
              isNewNumber: true
            };

          case 'cos':
            return {
              ...state,
              expression: state.expression + 'cos(',
              parenthesesCount: state.parenthesesCount + 1,
              isNewNumber: true
            };

          case 'tan':
            return {
              ...state,
              expression: state.expression + 'tan(',
              parenthesesCount: state.parenthesesCount + 1,
              isNewNumber: true
            };

          case 'asin':
            return {
              ...state,
              expression: state.expression + 'asin(',
              parenthesesCount: state.parenthesesCount + 1,
              isNewNumber: true
            };

          case 'acos':
            return {
              ...state,
              expression: state.expression + 'acos(',
              parenthesesCount: state.parenthesesCount + 1,
              isNewNumber: true
            };

          case 'atan':
            return {
              ...state,
              expression: state.expression + 'atan(',
              parenthesesCount: state.parenthesesCount + 1,
              isNewNumber: true
            };

          case '!':
            if (currentValue < 0 || currentValue > 170 || !Number.isInteger(currentValue)) {
              return { ...state, display: 'Error' };
            }
            const factorialResult = formatNumber(toNumber(factorial(currentValue)));
            return {
              ...state,
              display: factorialResult,
              expression: state.expression,
              isNewNumber: true
            };

          case 'e':
            return {
              ...state,
              display: formatNumber(Math.E),
              isNewNumber: true
            };

          case 'π':
            return {
              ...state,
              display: formatNumber(Math.PI),
              isNewNumber: true
            };

          case '%':
            const percentResult = formatNumber(currentValue / 100);
            return {
              ...state,
              display: percentResult,
              expression: state.expression,
              isNewNumber: true
            };

          case 'deg':
            return {
              ...state,
              mode: state.mode === 'RAD' ? 'DEG' : 'RAD'
            };

          default:
            return state;
        }
      } catch (error) {
        console.error('Function error:', error);
        return { ...state, display: 'Error', isNewNumber: true };
      }

    case 'MEMORY':
      try {
        switch (action.payload) {
          case 'mc':
            return { ...state, memory: 0 };
          case 'mr':
            return { 
              ...state, 
              display: formatNumber(state.memory),
              isNewNumber: true 
            };
          case 'm+':
            return { 
              ...state, 
              memory: state.memory + currentValue
            };
          case 'm-':
            return { 
              ...state, 
              memory: state.memory - currentValue
            };
          case 'ms':
            return { 
              ...state, 
              memory: currentValue
            };
          default:
            return state;
        }
      } catch (error) {
        console.error('Memory operation error:', error);
        return state;
      }

    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const handleButtonClick = (value: string) => {
    if ('0123456789.'.includes(value)) {
      dispatch({ type: 'NUMBER', payload: value });
    } else if ('+-×÷=()%'.includes(value)) {
      dispatch({ type: 'OPERATOR', payload: value });
    } else if (['mc', 'mr', 'm+', 'm-', 'ms'].includes(value)) {
      dispatch({ type: 'MEMORY', payload: value });
    } else {
      dispatch({ type: 'FUNCTION', payload: value });
    }
  };

  return { state, handleButtonClick };
} 