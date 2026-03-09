'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/types';

interface Carousel5CardProps {
  projects: Project[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export function Carousel5Card({
  projects,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
}: Carousel5CardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalProjects = projects.length;

  // Get visible projects for 5-card layout
  const getVisibleProjects = useCallback(() => {
    if (totalProjects === 0) return [];
    
    const result: Array<{ project: Project; relativeIndex: number }> = [];
    
    for (let i = -2; i <= 2; i++) {
      let index = (currentIndex + i) % totalProjects;
      if (index < 0) index = totalProjects + index;
      result.push({ project: projects[index], relativeIndex: i });
    }
    
    return result;
  }, [currentIndex, projects, totalProjects]);

  // Determine navigation direction
  const navigateRight = previousIndex < currentIndex || (previousIndex === totalProjects - 1 && currentIndex === 0);
  const navigateLeft = previousIndex > currentIndex || (previousIndex === 0 && currentIndex === totalProjects - 1);

  // Auto-play functionality (desktop only)
  useEffect(() => {
    if (!autoPlay || isPaused || isDragging || totalProjects <= 1 || isMobile) return;

    const timer = setInterval(() => {
      setPreviousIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % totalProjects);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isPaused, isDragging, totalProjects, isMobile, currentIndex]);

  // Navigation handlers
  const navigateNext = useCallback(() => {
    setPreviousIndex(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % totalProjects);
  }, [currentIndex, totalProjects]);

  const navigatePrev = useCallback(() => {
    setPreviousIndex(currentIndex);
    setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  }, [currentIndex, totalProjects]);

  const goToIndex = useCallback((index: number) => {
    setPreviousIndex(currentIndex);
    setCurrentIndex(index);
  }, [currentIndex]);

  if (totalProjects === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No projects to display</p>
      </div>
    );
  }

  const visibleProjects = getVisibleProjects();

  return (
    <div
      ref={containerRef}
      className="relative w-full py-20 px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(autoPlay)}
    >
      <div
        className="relative w-full h-[400px] md:h-[450px] flex items-center justify-center"
        style={{
          perspective: isMobile ? '1400px' : '2000px',
          perspectiveOrigin: 'center center',
        }}
      >
        {/* Depth Shadow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-gradient-to-t from-black/10 to-transparent rounded-full blur-xl"
          style={{ zIndex: 1 }}
        />

        <AnimatePresence>
          {visibleProjects.map(({ project, relativeIndex }) => {
            const isCenter = relativeIndex === 0;
            const config = getCardConfig(relativeIndex, isMobile);

            return (
              <DesktopCard
                key={`${project.id}-${currentIndex}-${relativeIndex}`}
                project={project}
                relativeIndex={relativeIndex}
                config={config}
                isCenter={isCenter}
                currentIndex={currentIndex}
                totalProjects={totalProjects}
                setCurrentIndex={setCurrentIndex}
                setIsDragging={setIsDragging}
                navigateNext={navigateNext}
                navigatePrev={navigatePrev}
                isMobile={isMobile}
                navigateRight={navigateRight}
                navigateLeft={navigateLeft}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalProjects > 1 && (
        <>
          <DesktopArrow onClick={navigatePrev} direction="left" />
          <DesktopArrow onClick={navigateNext} direction="right" />
        </>
      )}

      {/* Desktop Dots */}
      {showDots && totalProjects > 1 && (
        <DesktopDots
          projects={projects}
          currentIndex={currentIndex}
          goToIndex={goToIndex}
        />
      )}
    </div>
  );
}

// Desktop card configuration
function getCardConfig(position: number, isMobile: boolean) {
  if (isMobile) {
    // Mobile configuration - tighter spacing
    const configs: Record<number, any> = {
      0: { scale: 1, opacity: 1, rotateY: 0, x: 0, zIndex: 30, blur: 'none' },
      1: { scale: 0.82, opacity: 0.75, rotateY: 8, x: isMobile ? 140 : 280, zIndex: 20, blur: 'none' },
      2: { scale: 0.68, opacity: 0.5, rotateY: 12, x: isMobile ? 220 : 420, zIndex: 10, blur: 'none' },
      '-1': { scale: 0.82, opacity: 0.75, rotateY: -8, x: isMobile ? -140 : -280, zIndex: 20, blur: 'none' },
      '-2': { scale: 0.68, opacity: 0.5, rotateY: -12, x: isMobile ? -220 : -420, zIndex: 10, blur: 'none' },
    };
    return configs[position] || configs[0];
  }
  
  // Desktop configuration
  const configs: Record<number, any> = {
    0: { scale: 1, opacity: 1, rotateY: 0, x: 0, zIndex: 30, blur: 'none' },
    1: { scale: 0.85, opacity: 0.8, rotateY: 15, x: 280, zIndex: 20, blur: 'blur(2px)' },
    2: { scale: 0.7, opacity: 0.6, rotateY: 25, x: 420, zIndex: 10, blur: 'blur(4px)' },
    '-1': { scale: 0.85, opacity: 0.8, rotateY: -15, x: -280, zIndex: 20, blur: 'blur(2px)' },
    '-2': { scale: 0.7, opacity: 0.6, rotateY: -25, x: -420, zIndex: 10, blur: 'blur(4px)' },
  };
  return configs[position] || configs[0];
}

// Desktop Card Component
function DesktopCard({ project, relativeIndex, config, isCenter, currentIndex, totalProjects, setCurrentIndex, setIsDragging, navigateNext, navigatePrev, isMobile, navigateRight, navigateLeft }: any) {
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);
    const threshold = isMobile ? 30 : 50;
    if (info.offset.x > threshold) {
      navigatePrev();
    } else if (info.offset.x < -threshold) {
      navigateNext();
    }
  };

  const cardWidth = isMobile ? '280px' : '520px';
  const cardHeight = isMobile ? '280px' : '320px';

  // Direction-based animation offsets
  const enterOffset = navigateRight ? 150 : -150;
  const exitOffset = navigateRight ? -150 : 150;

  return (
    <motion.div
      className="absolute"
      style={{
        width: isCenter ? cardWidth : `calc(${cardWidth} * ${config.scale})`,
        height: isCenter ? cardHeight : `calc(${cardHeight} * ${config.scale})`,
      }}
      initial={{
        x: config.x + (relativeIndex > 0 ? enterOffset : -enterOffset),
        opacity: 0,
        scale: config.scale * 0.9,
        rotateY: config.rotateY * 0.5,
      }}
      animate={{
        x: config.x,
        opacity: config.opacity,
        scale: config.scale,
        rotateY: config.rotateY,
        zIndex: config.zIndex,
        filter: config.blur,
      }}
      exit={{
        x: config.x + exitOffset,
        opacity: 0,
        scale: config.scale * 0.9,
      }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      drag={isCenter ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={isMobile ? 0.5 : 0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileHover={isCenter ? { scale: config.scale * 1.02, y: -8 } : {}}
      onClick={() => {
        if (relativeIndex !== 0) {
          setCurrentIndex((currentIndex + relativeIndex + totalProjects) % totalProjects);
        }
      }}
    >
      <Link href={`/projects/${project.slug}`} className="block w-full h-full">
        <CardInner project={project} isCenter={isCenter} isMobile={isMobile} />
      </Link>
    </motion.div>
  );
}

// Card Inner Content (shared)
function CardInner({ project, isCenter, isMobile }: { project: Project; isCenter: boolean; isMobile: boolean }) {
  return (
    <motion.div
      className={`relative w-full h-full rounded-2xl overflow-hidden ${
        isCenter ? 'bg-white shadow-2xl' : 'bg-white/90 backdrop-blur-sm'
      }`}
      style={{
        boxShadow: isCenter
          ? '0 20px 60px rgba(0, 0, 0, 0.12)'
          : '0 8px 32px rgba(0, 0, 0, 0.08)',
        border: isCenter ? 'none' : '1px solid #EAEAEA',
      }}
      animate={isCenter ? { y: [0, -10, 0] } : {}}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative w-full h-full">
        {project.image_url ? (
          <motion.img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
            <span className="text-5xl md:text-6xl">🚀</span>
          </div>
        )}

        {isCenter && (
          <>
            {/* Gradient Overlay - Dark gradient for text readability */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.1) 100%)',
              }}
            />
            
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-7">
              <div className="space-y-3">
                {/* Featured Badge */}
                {project.featured && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#00E5FF] to-[#7B00FF] text-white text-xs font-semibold rounded-full shadow-lg">
                      Featured
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] line-clamp-1">
                  {project.title}
                </h3>

                {/* Description */}
                <div 
                  className="text-white text-sm leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] line-clamp-2 max-w-[90%] [&>p]:text-white [&>p]:text-sm [&>p]:leading-relaxed [&>strong]:text-white [&>u]:text-white [&>em]:text-white [&>span]:text-white"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />

                {/* View Details Button */}
                <motion.button
                  className="px-6 py-2.5 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-semibold rounded-lg shadow-lg self-start"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </div>
            </div>
          </>
        )}

        {!isCenter && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
            <h3 className="text-white text-sm font-semibold line-clamp-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">{project.title}</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Desktop Arrow Component
function DesktopArrow({ onClick, direction }: { onClick: () => void; direction: string }) {
  return (
    <motion.button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-neon-blue hover:shadow-lg transition-all duration-300 ${
        direction === 'left' ? 'left-2 md:left-8' : 'right-2 md:right-8'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`${direction} project`}
    >
      <svg className={`w-4 h-4 md:w-5 h-5 ${direction === 'left' ? 'text-gray-600 hover:text-neon-blue' : 'text-gray-600 hover:text-neon-purple'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {direction === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        )}
      </svg>
    </motion.button>
  );
}

// Desktop Dots Component
function DesktopDots({ projects, currentIndex, goToIndex }: any) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {projects.map((_: any, index: number) => (
        <motion.button
          key={index}
          onClick={() => goToIndex(index)}
          className={`rounded-full transition-all duration-300 ${
            index === currentIndex
              ? 'w-8 h-2 bg-gradient-to-r from-neon-blue to-neon-purple'
              : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
          }`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to project ${index + 1}`}
        />
      ))}
    </div>
  );
}
