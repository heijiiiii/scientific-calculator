export type ButtonType = 'number' | 'operator' | 'memory' | 'function' | 'clear' | 'equals' | 'percent';

export interface ButtonProps {
  label: string;
  onClick: () => void;
  type?: ButtonType;
} 