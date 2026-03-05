'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * GlassCard component with professional glassmorphism effect.
 */
export function GlassCard({ children, className = '', hover = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
