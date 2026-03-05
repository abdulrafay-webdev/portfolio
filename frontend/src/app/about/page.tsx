'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 text-neon-purple text-sm font-semibold rounded-full mb-6">
              About Me
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Building <span className="gradient-text">Scalable</span> &amp;{' '}
              <span className="gradient-text">High-Performance</span> Web Applications
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional full stack developer specializing in modern JavaScript frameworks and high-performance backend systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects">
                <NeonButton size="lg" className="px-12 py-5 text-lg">
                  View My Projects
                </NeonButton>
              </Link>
              <Link href="/contact">
                <NeonButton variant="secondary" size="lg" className="px-12 py-5 text-lg">
                  Contact Me
                </NeonButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Who I Am */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-8">
              Who <span className="gradient-text">I Am</span>
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                I&apos;m a <strong className="text-gray-900">full stack developer</strong> passionate about building scalable, production-ready systems that solve real-world problems. With expertise spanning the entire development stack, I transform complex requirements into elegant, efficient solutions.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                On the <strong className="text-neon-purple">frontend</strong>, I craft responsive, user-friendly interfaces using React.js and Next.js, ensuring seamless experiences across all devices. On the <strong className="text-neon-blue">backend</strong>, I build robust, high-performance APIs with FastAPI and PostgreSQL (Neon), designed for scalability and maintainability.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                What sets me apart is my focus on <strong className="text-gray-900">structured architecture</strong> and <strong className="text-gray-900">clean code</strong>. I don&apos;t just build features—I build systems that grow with your business. From dynamic admin panels to complex database-driven applications, every project I deliver is production-ready, secure, and optimized for performance.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. My Development Philosophy */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
              My <span className="gradient-text">Development Philosophy</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '🏗️',
                  title: 'Clean Architecture',
                  description: 'I prioritize well-structured, maintainable code over quick hacks. Every line serves a purpose, every module has a responsibility.',
                },
                {
                  icon: '⚡',
                  title: 'Performance First',
                  description: 'Speed matters. I optimize every layer—from database queries to frontend rendering—ensuring fast, responsive applications.',
                },
                {
                  icon: '🗄️',
                  title: 'Database-Driven UI',
                  description: 'Dynamic interfaces powered by robust data models. I design databases that scale and UIs that adapt.',
                },
                {
                  icon: '🧩',
                  title: 'Reusable Components',
                  description: 'Build once, use everywhere. My component systems reduce duplication and accelerate development.',
                },
                {
                  icon: '🔧',
                  title: 'Automation & CLI',
                  description: 'I leverage CLI-driven workflows and automated scaffolding to build large projects faster without compromising quality.',
                },
                {
                  icon: '📈',
                  title: 'Maintainability',
                  description: 'Code that&apos;s easy to understand is easy to maintain. I write for humans first, compilers second.',
                },
              ].map((item, index) => (
                <GlassCard key={index} className="p-8" hover={false}>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Technical Expertise */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
              Technical <span className="gradient-text">Expertise</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <GlassCard className="p-8" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Frontend</h3>
                </div>
                <ul className="space-y-3">
                  {['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((tech) => (
                    <li key={tech} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                      <span className="text-gray-700">{tech}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-8" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Backend</h3>
                </div>
                <ul className="space-y-3">
                  {['FastAPI', 'SQLModel', 'REST APIs', 'Authentication Systems'].map((tech) => (
                    <li key={tech} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-neon-purple rounded-full"></span>
                      <span className="text-gray-700">{tech}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-8" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Database</h3>
                </div>
                <ul className="space-y-3">
                  {['PostgreSQL (Neon)', 'SQLModel ORM', 'Database Design', 'Query Optimization'].map((tech) => (
                    <li key={tech} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                      <span className="text-gray-700">{tech}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-8" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Media Handling</h3>
                </div>
                <ul className="space-y-3">
                  {['ImageKit', 'Image Optimization', 'CDN Integration', 'File Upload Systems'].map((tech) => (
                    <li key={tech} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-neon-purple rounded-full"></span>
                      <span className="text-gray-700">{tech}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-8" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Deployment</h3>
                </div>
                <ul className="space-y-3">
                  {['Vercel', 'Railway', 'CI/CD Pipelines', 'Production Optimization'].map((tech) => (
                    <li key={tech} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                      <span className="text-gray-700">{tech}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-8" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Best Practices</h3>
                </div>
                <ul className="space-y-3">
                  {['SEO Optimization', 'Performance Tuning', 'Security', 'Code Quality'].map((tech) => (
                    <li key={tech} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-neon-purple rounded-full"></span>
                      <span className="text-gray-700">{tech}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. How I Build Large Projects Fast */}
      <section className="py-20 px-4 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-semibold rounded-full mb-6">
              Special Strength
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-8">
              How I Build <span className="gradient-text">Large Projects</span> Fast
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                I leverage <strong className="text-gray-900">CLI-driven project scaffolding</strong>, structured folder architecture, reusable modules, and backend-first planning to build large-scale applications in significantly less time without compromising code quality.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {[
                  {
                    title: 'Modular Codebase',
                    description: 'Every feature is a module. Clean separation of concerns makes development parallel and maintenance simple.',
                  },
                  {
                    title: 'API-First Development',
                    description: 'Backend APIs defined first. Frontend integrates seamlessly with clear contracts.',
                  },
                  {
                    title: 'Reusable UI Systems',
                    description: 'Component libraries built once, used everywhere. Consistency and speed combined.',
                  },
                  {
                    title: 'Automated Workflows',
                    description: 'CLI tools automate repetitive tasks. More time for complex problems, less for boilerplate.',
                  },
                  {
                    title: 'Structured Database Models',
                    description: 'Well-designed schemas from day one. Scalable, queryable, maintainable.',
                  },
                  {
                    title: 'Production-Ready from Start',
                    description: 'Security, performance, and deployment considerations built in from the beginning.',
                  },
                ].map((item, index) => (
                  <GlassCard key={index} className="p-6" hover={false}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Work Approach & Architecture */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
              Work <span className="gradient-text">Approach</span> &amp; Architecture
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Requirement Analysis',
                  description: 'Understanding your goals, users, and technical constraints. Every detail matters.',
                },
                {
                  step: '02',
                  title: 'System Planning',
                  description: 'Architecture design, technology selection, and project roadmap. Blueprint before building.',
                },
                {
                  step: '03',
                  title: 'Database Modeling',
                  description: 'Designing scalable schemas that support your business logic and growth.',
                },
                {
                  step: '04',
                  title: 'API Development',
                  description: 'Building robust, documented APIs with proper authentication and validation.',
                },
                {
                  step: '05',
                  title: 'Frontend Integration',
                  description: 'Creating responsive, intuitive interfaces that connect seamlessly with backend services.',
                },
                {
                  step: '06',
                  title: 'Testing & Deployment',
                  description: 'Rigorous testing, performance optimization, and production-ready deployment.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <GlassCard className="p-8 relative" hover={false}>
                    {/* Step Number - Top Right Corner */}
                    <div className="absolute top-4 right-4 text-6xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent opacity-20">
                      {item.step}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. Why Choose Me */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
              Why <span className="gradient-text">Choose Me</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Scalable system design that grows with your business',
                'Fast development cycles without compromising quality',
                'Clean, maintainable code that teams love to work with',
                'Performance-focused optimization at every layer',
                'Production-ready security and best practices',
                'Strong problem-solving and architectural thinking',
                'Clear communication and transparent development process',
                'Long-term maintainability over quick fixes',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-lg">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Career Goals */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-8">
              Career <span className="gradient-text">Goals</span>
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                My goal is to build <strong className="text-gray-900">enterprise-level systems</strong> that make a real impact. I&apos;m driven by the challenge of solving complex problems and creating digital products that users love.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                I&apos;m committed to <strong className="text-gray-900">continuous learning</strong>—staying ahead of industry trends, mastering new technologies, and refining my craft. Every project is an opportunity to grow as a <strong className="text-gray-900">system architect</strong> and deliver even better solutions.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether it&apos;s working with startups to bring their vision to life or collaborating with established companies to modernize their systems, I&apos;m focused on creating <strong className="text-gray-900">scalable, impactful digital products</strong> that stand the test of time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. Call To Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-neon-blue to-neon-purple">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Let&apos;s Build Something Scalable Together
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Have a project in mind? Let&apos;s discuss how I can help bring your vision to life with clean code and scalable architecture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.button
                  className="px-12 py-5 text-lg font-semibold bg-white text-neon-purple rounded-xl hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Me
                </motion.button>
              </Link>
              <Link href="/projects">
                <motion.button
                  className="px-12 py-5 text-lg font-semibold bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-neon-purple transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View My Work
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
