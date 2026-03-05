'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

/**
 * AnimatedSection wrapper component for scroll-triggered animations.
 */
export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  ...props
}: AnimatedSectionProps) {
  const directionOffset = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 },
    none: {},
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, ...directionOffset[direction] }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
