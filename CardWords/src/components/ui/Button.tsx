import React from 'react';
import { Button as FlowbiteButton } from 'flowbite-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const color = variant === 'primary' ? 'blue' : 'gray';
  return <FlowbiteButton color={color} {...props}>{children}</FlowbiteButton>;
};

export default Button;