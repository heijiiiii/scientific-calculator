import React from 'react';
import './styles.css';

interface DisplayProps {
  value: string;
  mode: string;
  expression: string;
}

export const Display: React.FC<DisplayProps> = ({ value, mode, expression }) => {
  return (
    <div className="display">
      <div className="mode">{mode}</div>
      <div className="expression">{expression || '0'}</div>
      <div className="value">{value}</div>
    </div>
  );
}; 