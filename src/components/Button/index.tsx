import { ButtonProps } from './types';

const Button = ({ label, onClick, type = 'number' }: ButtonProps) => {
  const buttonClass = `calculator-button calculator-button-${type}`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button; 