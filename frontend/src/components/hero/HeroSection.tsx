'use client';

import { motion } from 'framer-motion';

/**
 * Premium SaaS-Style Hero Section
 * 
 * Features:
 * - Clean, text-driven design
 * - No personal image
 * - Modern SaaS landing page aesthetic
 * - Subtle background accents
 * - Professional typography
 * - Optional stats section
 */
export function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-white via-[#f9fbff] to-white pt-[80px] pb-[80px] md:pt-[120px] md:pb-[120px] overflow-hidden">
      {/* Subtle Background Divider Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />

      {/* Subtle Floating Accent (Top Right) */}
      <div
        className="absolute top-20 right-20 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08), transparent 70%)',
          filter: 'blur(120px)',
          opacity: 0.1,
        }}
      />

      <div className="max-w-[1000px] mx-auto px-6 md:px-24 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Top Tag */}
          <motion.p
            className="text-xs md:text-sm font-semibold text-[#00E5FF] uppercase tracking-[0.2em] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Full Stack Web Developer
          </motion.p>

          {/* Main Headline */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-[#111111] leading-tight mb-6 max-w-[900px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Building{' '}
            <span className="bg-gradient-to-r from-[#00E5FF] to-[#7B00FF] bg-clip-text text-transparent">
              Scalable & High-Performance
            </span>
            <br />
            Web Applications
          </motion.h1>

          {/* Subheading Paragraph */}
          <motion.p
            className="text-base md:text-lg text-gray-600 leading-relaxed mb-10 max-w-[700px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            I design and develop modern web applications using React, Next.js, and FastAPI — focused on scalable architecture, clean code, optimized performance, and production-ready systems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-5 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Primary Button */}
            <a href="#projects">
              <motion.button
                className="px-8 py-4 bg-[#00E5FF] text-black font-semibold rounded-lg hover:shadow-lg transition-shadow duration-300 min-w-[180px]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                View My Projects
              </motion.button>
            </a>

            {/* Secondary Button */}
            <a href="#contact">
              <motion.button
                className="px-8 py-4 border border-[#00E5FF] text-[#00E5FF] font-semibold rounded-lg bg-transparent hover:bg-[#00E5FF]/10 transition-colors duration-300 min-w-[180px]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Get In Touch
              </motion.button>
            </a>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-3 gap-8 md:gap-16 w-full max-w-[700px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-[#111111] mb-2">
                20+
              </span>
              <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
                Projects Built
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-[#111111] mb-2">
                100%
              </span>
              <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
                Modern Stack
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-[#111111] mb-2">
                100%
              </span>
              <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
                Production Ready
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
