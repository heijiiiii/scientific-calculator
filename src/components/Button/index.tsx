import React from 'react';
import './styles.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'memory' | 'function' | 'operator' | 'default';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'default' 
}) => {
  return (
    <button 
      className={`calculator-button ${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}; 