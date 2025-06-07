import { useState } from 'react';
import Display from '../Display';
import Button from '../Button';
import type { ButtonType } from '../Button/types';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [mode, setMode] = useState('DEG');
  const [shift, setShift] = useState(false);
  const [memory, setMemory] = useState(0);
  const [lastResult, setLastResult] = useState(0);

  // 안전한 계산을 위한 함수
  const safeEval = (expr: string): number => {
    try {
      // 과학 함수들을 JavaScript 함수로 변환
      let processedExpr = expr
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e(?!\d)/g, 'Math.E');

      // 각도 모드에 따른 삼각함수 변환
      if (mode === 'DEG') {
        processedExpr = processedExpr
          .replace(/Math\.sin\(/g, 'Math.sin(Math.PI/180*')
          .replace(/Math\.cos\(/g, 'Math.cos(Math.PI/180*')
          .replace(/Math\.tan\(/g, 'Math.tan(Math.PI/180*');
      }

      const evalResult = Function('"use strict"; return (' + processedExpr + ')')();
      return isNaN(evalResult) || !isFinite(evalResult) ? 0 : evalResult;
    } catch (error) {
      return 0;
    }
  };

  const handleNumber = (num: string) => {
    if (result === '0' && num !== '.') {
      setResult(num);
    } else {
      setResult(result + num);
    }
  };

  const handleOperator = (op: string) => {
    setExpression(result + ' ' + op + ' ');
    setResult('0');
  };

  const handleEquals = () => {
    try {
      const finalExpression = expression + result;
      const evalResult = eval(finalExpression);
      setResult(String(evalResult));
      setExpression('');
    } catch (error) {
      setResult('Error');
    }
  };

  const handleClear = () => {
    setResult('0');
    setExpression('');
  };

  const handleMemory = (operation: string) => {
    const currentValue = parseFloat(result);
    switch (operation) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setResult(String(memory));
        break;
      case 'M+':
        setMemory(memory + currentValue);
        break;
      case 'M-':
        setMemory(memory - currentValue);
        break;
    }
  };

  const handleButtonClick = (value: string, buttonType: ButtonType) => {
    console.log(`Button clicked: ${value}, Type: ${buttonType}`);

    switch (buttonType) {
      case ButtonType.NUMBER:
        handleNumber(value);
        break;

      case ButtonType.OPERATOR:
        handleOperator(value);
        break;

      case ButtonType.FUNCTION:
        switch (value) {
          case '←':
            if (expression.length > 0) {
              const newExpr = expression.slice(0, -1);
              setExpression(newExpr);
              setResult(newExpr || '0');
            }
            break;
          case '2nd':
            setShift(!shift);
            break;
          case 'x²':
            setResult(String(Math.pow(parseFloat(result), 2)));
            break;
          case 'x³':
            setResult(String(Math.pow(parseFloat(result), 3)));
            break;
          case 'xʸ':
            setExpression(expression + '^');
            setResult('0');
            break;
          case 'eˣ':
            if (expression) {
              const newExpr = `Math.E^(${expression})`;
              setExpression(newExpr);
              setResult(safeEval(newExpr).toString());
            }
            break;
          case '10ˣ':
            if (expression) {
              const newExpr = `10^(${expression})`;
              setExpression(newExpr);
              setResult(safeEval(newExpr).toString());
            }
            break;
          case '1/x':
            if (expression) {
              const newExpr = `1/(${expression})`;
              setExpression(newExpr);
              setResult(safeEval(newExpr).toString());
            }
            break;
          case '²√x':
            if (expression) {
              const newExpr = `√(${expression})`;
              setExpression(newExpr);
              setResult(safeEval(newExpr).toString());
            }
            break;
          case '³√x':
            if (expression) {
              const newExpr = `(${expression})^(1/3)`;
              setExpression(newExpr);
              setResult(safeEval(newExpr).toString());
            }
            break;
          case 'sin':
          case 'cos':
          case 'tan':
            setExpression(expression + value + '(');
            setResult('0');
            break;
          case 'ln':
          case 'log':
            setExpression(expression + value + '(');
            setResult('0');
            break;
          case 'x!':
            if (expression) {
              const num = parseInt(expression);
              if (num >= 0 && num <= 170) {
                let factorial = 1;
                for (let i = 2; i <= num; i++) {
                  factorial *= i;
                }
                setResult(factorial.toString());
                setExpression(factorial.toString());
              }
            }
            break;
          case 'e':
            setExpression(expression + 'e');
            setResult('0');
            break;
          case 'Deg':
            setMode(mode === 'RAD' ? 'DEG' : 'RAD');
            break;
          case '%':
            if (expression) {
              const newExpr = `(${expression})/100`;
              setExpression(newExpr);
              setResult(safeEval(newExpr).toString());
            }
            break;
        }
        break;

      case ButtonType.MEMORY:
        handleMemory(value.toUpperCase());
        break;

      case ButtonType.CLEAR:
        handleClear();
        break;

      case ButtonType.EQUALS:
        handleEquals();
        break;
    }
  };

  return (
    <div className="calculator-container">
      <Display mode={mode} result={result} expression={expression} />
      
      <div className="calculator-grid">
        {/* Memory Functions Row */}
        <div className="memory-functions">
          <Button value="MC" type={ButtonType.MEMORY} onClick={() => handleMemory('MC')} className="calculator-button-memory" />
          <Button value="MR" type={ButtonType.MEMORY} onClick={() => handleMemory('MR')} className="calculator-button-memory" />
          <Button value="M+" type={ButtonType.MEMORY} onClick={() => handleMemory('M+')} className="calculator-button-memory" />
          <Button value="M-" type={ButtonType.MEMORY} onClick={() => handleMemory('M-')} className="calculator-button-memory" />
          <Button value="←" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function calculator-button-backspace" />
        </div>

        {/* Scientific Functions Row 1 */}
        <div className="scientific-functions">
          <Button value="2nd" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="x²" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="x³" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="xʸ" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="eˣ" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="10ˣ" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
        </div>

        {/* Scientific Functions Row 2 */}
        <div className="scientific-functions">
          <Button value="1/x" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="²√x" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="³√x" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="ʸ√x" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="ln" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="log" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
        </div>

        {/* Scientific Functions Row 3 */}
        <div className="scientific-functions">
          <Button value="sin" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="cos" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="tan" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="x!" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="e" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
          <Button value="Deg" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-function" />
        </div>

        {/* Main Calculator Buttons */}
        <div className="main-buttons">
          {/* Row 1 */}
          <Button value="7" type={ButtonType.NUMBER} onClick={(value) => handleButtonClick(value, ButtonType.NUMBER)} className="calculator-button-number" />
          <Button value="8" type={ButtonType.NUMBER} onClick={(value) => handleButtonClick(value, ButtonType.NUMBER)} className="calculator-button-number" />
          <Button value="9" type={ButtonType.NUMBER} onClick={(value) => handleButtonClick(value, ButtonType.NUMBER)} className="calculator-button-number" />
          <Button value="(" type={ButtonType.OPERATOR} onClick={(value) => handleButtonClick(value, ButtonType.OPERATOR)} className="calculator-button-operator" />
          <Button value=")" type={ButtonType.OPERATOR} onClick={(value) => handleButtonClick(value, ButtonType.OPERATOR)} className="calculator-button-operator" />
          
          {/* Row 2 */}
          <Button value="4" type={ButtonType.NUMBER} onClick={(value) => handleButtonClick(value, ButtonType.NUMBER)} className="calculator-button-number" />
          <Button value="5" type={ButtonType.NUMBER} onClick={(value) => handleButtonClick(value, ButtonType.NUMBER)} className="calculator-button-number" />
          <Button value="6" type={ButtonType.NUMBER} onClick={(value) => handleButtonClick(value, ButtonType.NUMBER)} className="calculator-button-number" />
          <Button value="×" type={ButtonType.OPERATOR} onClick={(value) => handleButtonClick(value, ButtonType.OPERATOR)} className="calculator-button-operator" />
          <Button value="÷" type={ButtonType.OPERATOR} onClick={(value) => handleButtonClick(value, ButtonType.OPERATOR)} className="calculator-button-operator" />
          
          {/* Row 3 */}
          <Button value="1" type={ButtonType.NUMBER} onClick={(value) => handleButtonClick(value, ButtonType.NUMBER)} className="calculator-button-number" />
          <Button value="2" type={ButtonType.NUMBER} onClick={(value) => handleButtonClick(value, ButtonType.NUMBER)} className="calculator-button-number" />
          <Button value="3" type={ButtonType.NUMBER} onClick={(value) => handleButtonClick(value, ButtonType.NUMBER)} className="calculator-button-number" />
          <Button value="+" type={ButtonType.OPERATOR} onClick={(value) => handleButtonClick(value, ButtonType.OPERATOR)} className="calculator-button-operator" />
          <Button value="-" type={ButtonType.OPERATOR} onClick={(value) => handleButtonClick(value, ButtonType.OPERATOR)} className="calculator-button-operator" />
          
          {/* Row 4 */}
          <Button value="0" type={ButtonType.NUMBER} onClick={(value) => handleButtonClick(value, ButtonType.NUMBER)} className="calculator-button-number" />
          <Button value="." type={ButtonType.NUMBER} onClick={(value) => handleButtonClick(value, ButtonType.NUMBER)} className="calculator-button-number" />
          <Button value="=" type={ButtonType.EQUALS} onClick={handleEquals} className="calculator-button-equals" />
          <Button value="%" type={ButtonType.FUNCTION} onClick={(value) => handleButtonClick(value, ButtonType.FUNCTION)} className="calculator-button-percent" />
          <Button value="AC" type={ButtonType.CLEAR} onClick={handleClear} className="calculator-button-clear" />
        </div>
      </div>
    </div>
  );
};

export default Calculator; 