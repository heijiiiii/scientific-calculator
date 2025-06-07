import React from 'react';
import { Display } from '../Display';
import { Button } from '../Button';
import { useCalculator } from './hooks';
import './styles.css';

export const Calculator: React.FC = () => {
  const { state, handleButtonClick } = useCalculator();

  return (
    <div className="calculator">
      <Display 
        value={state.display} 
        mode={state.mode} 
        expression={state.expression}
      />
      <div className="keypad">
        {/* Memory Operations */}
        <div className="memory-row">
          <Button onClick={() => handleButtonClick('mc')} variant="memory">mc</Button>
          <Button onClick={() => handleButtonClick('m+')} variant="memory">m+</Button>
          <Button onClick={() => handleButtonClick('m-')} variant="memory">m-</Button>
          <Button onClick={() => handleButtonClick('mr')} variant="memory">mr</Button>
          <Button onClick={() => handleButtonClick('ms')} variant="memory">ms</Button>
          <Button onClick={() => handleButtonClick('back')} variant="function">←</Button>
        </div>

        {/* Scientific Functions */}
        <div className="scientific-row">
          <Button onClick={() => handleButtonClick('2nd')} variant="function">
            {state.shift ? '1st' : '2nd'}
          </Button>
          <Button onClick={() => handleButtonClick('x²')} variant="function">x²</Button>
          <Button onClick={() => handleButtonClick('x³')} variant="function">x³</Button>
          <Button onClick={() => handleButtonClick('xʸ')} variant="function">xʸ</Button>
          <Button onClick={() => handleButtonClick('eˣ')} variant="function">eˣ</Button>
          <Button onClick={() => handleButtonClick('10ˣ')} variant="function">10ˣ</Button>
        </div>

        <div className="scientific-row">
          <Button onClick={() => handleButtonClick('1/x')} variant="function">1/x</Button>
          <Button onClick={() => handleButtonClick('²√x')} variant="function">²√x</Button>
          <Button onClick={() => handleButtonClick('³√x')} variant="function">³√x</Button>
          <Button onClick={() => handleButtonClick('ʸ√x')} variant="function">ʸ√x</Button>
          <Button onClick={() => handleButtonClick('ln')} variant="function">ln</Button>
          <Button onClick={() => handleButtonClick('log')} variant="function">log</Button>
        </div>

        <div className="scientific-row">
          <Button onClick={() => handleButtonClick(state.shift ? 'asin' : 'sin')} variant="function">
            {state.shift ? 'sin⁻¹' : 'sin'}
          </Button>
          <Button onClick={() => handleButtonClick(state.shift ? 'acos' : 'cos')} variant="function">
            {state.shift ? 'cos⁻¹' : 'cos'}
          </Button>
          <Button onClick={() => handleButtonClick(state.shift ? 'atan' : 'tan')} variant="function">
            {state.shift ? 'tan⁻¹' : 'tan'}
          </Button>
          <Button onClick={() => handleButtonClick('!')} variant="function">x!</Button>
          <Button onClick={() => handleButtonClick(state.shift ? 'π' : 'e')} variant="function">
            {state.shift ? 'π' : 'e'}
          </Button>
          <Button onClick={() => handleButtonClick('deg')} variant="function">
            {state.mode}
          </Button>
        </div>

        {/* Number Pad */}
        <div className="number-pad">
          <Button onClick={() => handleButtonClick('7')}>7</Button>
          <Button onClick={() => handleButtonClick('8')}>8</Button>
          <Button onClick={() => handleButtonClick('9')}>9</Button>
          <Button onClick={() => handleButtonClick('(')} variant="operator">(</Button>
          <Button onClick={() => handleButtonClick(')')} variant="operator">)</Button>
        </div>

        <div className="number-pad">
          <Button onClick={() => handleButtonClick('4')}>4</Button>
          <Button onClick={() => handleButtonClick('5')}>5</Button>
          <Button onClick={() => handleButtonClick('6')}>6</Button>
          <Button onClick={() => handleButtonClick('×')} variant="operator">×</Button>
          <Button onClick={() => handleButtonClick('÷')} variant="operator">÷</Button>
        </div>

        <div className="number-pad">
          <Button onClick={() => handleButtonClick('1')}>1</Button>
          <Button onClick={() => handleButtonClick('2')}>2</Button>
          <Button onClick={() => handleButtonClick('3')}>3</Button>
          <Button onClick={() => handleButtonClick('+')} variant="operator">+</Button>
          <Button onClick={() => handleButtonClick('-')} variant="operator">−</Button>
        </div>

        <div className="number-pad">
          <Button onClick={() => handleButtonClick('0')}>0</Button>
          <Button onClick={() => handleButtonClick('.')}>.</Button>
          <Button onClick={() => handleButtonClick('=')} variant="operator">=</Button>
          <Button onClick={() => handleButtonClick('%')} variant="operator">%</Button>
          <Button onClick={() => handleButtonClick('AC')} variant="function">AC</Button>
        </div>
      </div>
    </div>
  );
};