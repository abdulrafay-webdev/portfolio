'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project, Service } from '@/types';
import { publicApi } from '@/lib/api';
import { Carousel5Card } from '@/components/carousel/Carousel5Card';
import { ServicesCarousel } from '@/components/carousel/ServicesCarousel';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { HeroSection } from '@/components/hero/HeroSection';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const [projects, services] = await Promise.all([
          publicApi.getFeaturedProjects(),
          publicApi.getFeaturedServices(),
        ]);
        setFeaturedProjects(projects);
        setFeaturedServices(services);
      } catch (error) {
        console.error('Failed to load featured items:', error);
        setFeaturedProjects([]);
        setFeaturedServices([]);
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Premium Hero Section */}
      <HeroSection />

      {/* Who I Am Section */}
      <section id="about" className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="gradient-text">Who</span> I Am
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  I&apos;m a <strong className="text-gray-900">Full Stack Developer</strong> specializing in building
                  exceptional digital experiences with modern technologies.
                </p>
                <p>
                  My expertise spans <strong className="text-neon-purple">React.js</strong>, <strong className="text-neon-purple">Next.js</strong>,
                  and <strong className="text-neon-purple">TypeScript</strong> for frontend, combined with{' '}
                  <strong className="text-neon-purple">FastAPI</strong> and <strong className="text-neon-purple">SQLModel</strong> for
                  robust backend systems.
                </p>
                <p>
                  I leverage <strong className="gradient-text">CLI-driven automation</strong> and{' '}
                  <strong className="gradient-text">AI-accelerated development</strong> workflows to deliver 
                  production-ready solutions at unprecedented speed.
                </p>
                <p>
                  My focus is on creating <strong className="text-neon-purple">scalable architectures</strong> and{' '}
                  <strong className="text-neon-purple">rapid MVP builds</strong> that help businesses validate ideas 
                  quickly and scale efficiently.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-8" hover={false}>
                <h3 className="text-2xl font-bold mb-6 gradient-text">Tech Stack</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Frontend</h4>
                    <div className="flex flex-wrap gap-2">
                      {['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'].map(tech => (
                        <span key={tech} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Backend</h4>
                    <div className="flex flex-wrap gap-2">
                      {['FastAPI', 'SQLModel', 'Python', 'REST APIs', 'GraphQL'].map(tech => (
                        <span key={tech} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Database</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Neon PostgreSQL', 'SQLModel ORM', 'Alembic', 'Redis'].map(tech => (
                        <span key={tech} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">DevOps & Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {['CLI Automation', 'Git', 'Docker', 'Vercel', 'Railway'].map(tech => (
                        <span key={tech} className="tech-badge bg-gray-100 text-gray-700 border-gray-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-[10px] md:py-[20px] bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              A curated selection of my best work
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : featuredProjects.length > 0 ? (
            <Carousel5Card
              projects={featuredProjects}
              autoPlay={true}
              autoPlayInterval={5000}
              showDots={true}
              showArrows={true}
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No featured projects yet</p>
              <p className="text-gray-400 text-sm">Admin can add projects via /admin dashboard</p>
            </div>
          )}

          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a href="/projects">
              <NeonButton size="lg" className="px-12 py-5 text-lg">
                View All Projects
              </NeonButton>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section id="why-me" className="section bg-white">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Why <span className="gradient-text">Choose Me</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              What sets me apart from other developers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Fast Delivery',
                description: 'CLI automation and AI-assisted development enable rapid MVP builds without compromising quality.',
              },
              {
                icon: '🏗️',
                title: 'Scalable Code',
                description: 'Clean, structured, and well-documented code that grows with your business needs.',
              },
              {
                icon: '✅',
                title: 'Production-Ready',
                description: 'Every project is built with production in mind: error handling, security, and performance.',
              },
              {
                icon: '🎯',
                title: 'End-to-End Ownership',
                description: 'From initial concept to deployment and maintenance - I handle the entire development lifecycle.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="h-full p-8 text-center" hover={false}>
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Carousel */}
      <section id="featured-services" className="py-[10px] md:py-[20px] bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Professional services tailored to your needs
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          ) : featuredServices.length > 0 ? (
            <ServicesCarousel
              services={featuredServices}
              autoPlay={true}
              autoPlayInterval={5000}
              showDots={true}
              showArrows={true}
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No featured services yet</p>
              <p className="text-gray-400 text-sm">Admin can add services via /admin dashboard</p>
            </div>
          )}

          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a href="/services">
              <NeonButton size="lg" className="px-12 py-5 text-lg">
                View All Services
              </NeonButton>
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="section bg-gradient-to-r from-neon-blue to-neon-purple py-20">
        <div className="container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Let&apos;s discuss your project and bring your ideas to life with cutting-edge technology and rapid development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/923239518506" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="px-12 py-5 text-lg font-semibold bg-white text-neon-purple rounded-xl hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Chat on WhatsApp
                </motion.button>
              </a>
              <a href="/contact">
                <motion.button
                  className="px-12 py-5 text-lg font-semibold bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-neon-purple transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Email
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
