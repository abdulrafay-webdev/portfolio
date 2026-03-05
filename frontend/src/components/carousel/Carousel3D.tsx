'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

interface Carousel3DProps {
  projects: Project[];
}

/**
 * 3D Carousel component for displaying featured projects.
 * Fully responsive with touch support for mobile.
 */
export function Carousel3D({ projects }: Carousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 30 : -30,
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      rotateY: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 2,
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 30 : -30,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex >= projects.length) newIndex = 0;
      if (newIndex < 0) newIndex = projects.length - 1;
      return newIndex;
    });
  };

  const handleSwipe = (offset: { x: number; y: number }) => {
    if (Math.abs(offset.x) > 50) {
      paginate(offset.x > 0 ? -1 : 1);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No featured projects yet</p>
        <p className="text-gray-400 text-sm mt-2">Admin can add projects via /admin dashboard</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div className={`relative ${isMobile ? 'h-[600px]' : 'h-[500px]'}`}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              rotateY: { type: "spring", stiffness: 300, damping: 30 },
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset }) => handleSwipe(offset)}
            className="absolute w-full max-w-6xl mx-auto left-0 right-0 px-4"
          >
            <GlassCard className="p-6 md:p-8 bg-gradient-to-br from-white/90 to-purple-50/90" hover={false}>
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Project Image */}
                <div className="relative h-48 sm:h-64 md:h-full rounded-glass overflow-hidden shadow-lg">
                  {projects[currentIndex].image_url ? (
                    <img
                      src={projects[currentIndex].image_url}
                      alt={projects[currentIndex].title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 flex items-center justify-center">
                      <span className="text-6xl">🚀</span>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 md:mb-3 text-gray-900">
                      {projects[currentIndex].title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
                      {projects[currentIndex].description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {projects[currentIndex].tech_stack && projects[currentIndex].tech_stack.split(',').filter((t: string) => t.trim()).map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gradient-to-r from-neon-pink/10 to-neon-purple/10 border border-neon-purple/30 rounded-full text-neon-purple font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {projects[currentIndex].github_url && (
                      <a href={projects[currentIndex].github_url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px]">
                        <NeonButton variant="secondary" size="sm" className="w-full">
                          <span className="hidden sm:inline">GitHub</span>
                          <span className="sm:hidden">Code</span>
                        </NeonButton>
                      </a>
                    )}
                    {projects[currentIndex].live_url && (
                      <a href={projects[currentIndex].live_url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px]">
                        <NeonButton size="sm" className="w-full">
                          <span className="hidden sm:inline">Live Demo</span>
                          <span className="sm:hidden">Demo</span>
                        </NeonButton>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Desktop Only */}
      {projects.length > 1 && !isMobile && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-neon-pink hover:text-white transition-all duration-300 flex items-center justify-center"
            aria-label="Previous project"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => paginate(1)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-neon-purple hover:text-white transition-all duration-300 flex items-center justify-center"
            aria-label="Next project"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator - Mobile & Desktop */}
      {projects.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-neon-pink w-6 sm:w-8'
                  : 'bg-gray-300 hover:bg-neon-purple/50'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Mobile Swipe Hint */}
      {isMobile && projects.length > 1 && (
        <div className="text-center mt-4 text-gray-400 text-sm">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Swipe to navigate
          </span>
        </div>
      )}
    </div>
  );
}
