'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/types';
import { publicApi } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Carousel5Card } from '@/components/carousel/Carousel5Card';

/**
 * Projects page with featured carousel and grid layout.
 */
export default function ProjectsPage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const [featured, all] = await Promise.all([
          publicApi.getFeaturedProjects(),
          publicApi.getProjects(),
        ]);
        setFeaturedProjects(featured);
        setAllProjects(all);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <section className="py-16 px-4 text-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore my portfolio of full-stack development projects
          </p>
        </motion.div>
      </section>

      {/* Featured Projects Carousel */}
      {featuredProjects.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="container-custom">
            <motion.h2
              className="text-3xl font-bold text-center mb-8 text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Featured Projects
            </motion.h2>
            <Carousel5Card
              projects={featuredProjects}
              autoPlay={true}
              autoPlayInterval={5000}
              showDots={true}
              showArrows={true}
            />
          </div>
        </section>
      )}

      {/* All Projects Grid */}
      <section className="py-16 px-4">
        <div className="container-custom">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            All Projects
          </motion.h2>
          
          {allProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No projects yet</p>
              <p className="text-gray-400 text-sm">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Individual project card with proper image handling.
 */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.slug}`} className="block h-full">
        <GlassCard className="h-full flex flex-col" hover>
          {/* Project Image - Fixed aspect ratio */}
          <div className="image-container">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                <span className="text-6xl">🚀</span>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
              {project.featured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                  Featured
                </span>
              )}
            </div>
            
            <div 
              className="text-gray-600 mb-4 line-clamp-3 flex-1 text-sm leading-relaxed [&>p]:text-sm [&>p]:leading-relaxed [&>p]:mb-0 [&>strong]:text-gray-900 [&>u]:text-gray-600 [&>em]:text-gray-600 [&>span]:text-gray-600 [&>b]:text-gray-900 [&>i]:text-gray-600"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech_stack && project.tech_stack.split(',').filter(t => t.trim()).slice(0, 4).map((tech, i) => (
                <span key={i} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <NeonButton size="sm" fullWidth>
                View Details
              </NeonButton>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
