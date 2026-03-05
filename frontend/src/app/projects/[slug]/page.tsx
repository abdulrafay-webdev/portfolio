'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { publicApi } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await publicApi.getProjectBySlug(slug);
        setProject(data);
      } catch (error) {
        console.error('Failed to load project:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600 mb-6">The project you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/projects">
            <NeonButton>View All Projects</NeonButton>
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Image */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                  <span className="text-8xl">🚀</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Title & Tags */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                {project.featured && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm rounded-full font-semibold">
                    Featured Project
                  </span>
                )}
                <span className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                  Web Development
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[200px]">
                  <NeonButton variant="secondary" size="lg" className="w-full">
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      View Code
                    </span>
                  </NeonButton>
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[200px]">
                  <NeonButton size="lg" className="w-full">
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </span>
                  </NeonButton>
                </a>
              )}
            </div>

            {/* Description */}
            <GlassCard className="p-8 mb-8" hover={false}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
              <div 
                className="rich-text-content text-gray-600 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />

              {/* Tech Stack */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack && project.tech_stack.split(',').filter(t => t.trim()).map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 text-neon-purple rounded-full font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Project Meta Info */}
            {project.project_meta && (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {project.project_meta.project_type && (
                  <GlassCard className="p-6" hover={false}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Project Type
                    </h3>
                    <p className="text-gray-600">{project.project_meta.project_type}</p>
                  </GlassCard>
                )}
                {project.project_meta.performance && (
                  <GlassCard className="p-6" hover={false}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Performance
                    </h3>
                    <p className="text-gray-600">{project.project_meta.performance}</p>
                  </GlassCard>
                )}
                {project.project_meta.responsive && (
                  <GlassCard className="p-6" hover={false}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Responsive
                    </h3>
                    <p className="text-gray-600">{project.project_meta.responsive}</p>
                  </GlassCard>
                )}
                {project.project_meta.security && (
                  <GlassCard className="p-6" hover={false}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Security
                    </h3>
                    <p className="text-gray-600">{project.project_meta.security}</p>
                  </GlassCard>
                )}
              </div>
            )}

            {/* Challenges & Solutions */}
            {project.challenges && (project.challenges.challenge_title || project.challenges.solution_title) && (
              <GlassCard className="p-8 mb-8" hover={false}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Challenges & Solutions
                </h2>
                <div className="space-y-6">
                  {project.challenges.challenge_title && project.challenges.challenge_description && (
                    <div>
                      <h3 className="text-lg font-semibold text-neon-purple mb-2">
                        {project.challenges.challenge_title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {project.challenges.challenge_description}
                      </p>
                    </div>
                  )}
                  {project.challenges.solution_title && project.challenges.solution_description && (
                    <div>
                      <h3 className="text-lg font-semibold text-neon-blue mb-2">
                        {project.challenges.solution_title}
                      </h3>
                      <p className="text-gray-600">
                        {project.challenges.solution_description}
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            )}

            {/* Key Features */}
            {project.key_features && project.key_features.length > 0 && (
              <GlassCard className="p-8 mb-8" hover={false}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Key Features
                </h2>
                <ul className="space-y-3">
                  {project.key_features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-neon-purple mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}

            {/* GitHub & Live Links */}
            {(project.github_url || project.live_url) && (
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    View Code
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl hover:shadow-lg transition-shadow font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-neon-blue to-neon-purple">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Interested in This Project?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Let&apos;s discuss how I can build something similar for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/923239518506" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="px-8 py-4 text-lg font-semibold bg-white text-neon-purple rounded-xl hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Chat on WhatsApp
                </motion.button>
              </a>
              <a href="/contact">
                <motion.button
                  className="px-8 py-4 text-lg font-semibold bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-neon-purple transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Me
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 border-t border-gray-200 bg-white">
        <p>&copy; {new Date().getFullYear()} Abdulrafay. All rights reserved.</p>
      </footer>
    </main>
  );
}
