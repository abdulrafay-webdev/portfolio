'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * NeonButton component with professional gradient styling.
 */
export function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}: NeonButtonProps) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 relative overflow-hidden';

  const variantStyles = {
    primary: 'bg-gradient-to-br from-neon-blue to-neon-purple text-white',
    secondary: 'bg-white text-neon-purple border-2 border-neon-purple',
    outline: 'bg-transparent text-neon-purple border-2 border-neon-purple',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.4), 0 0 30px rgba(123, 0, 255, 0.2)',
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
}
