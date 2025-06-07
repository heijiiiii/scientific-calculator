interface DisplayProps {
  mode: string;
  result: string;
  expression: string;
}

const Display = ({ mode, result, expression }: DisplayProps) => {
  return (
    <div className="calculator-display">
      <div className="display-mode">{mode}</div>
      <div className="display-result">{result}</div>
      <div className="display-expression">{expression}</div>
    </div>
  );
};

export default Display; 