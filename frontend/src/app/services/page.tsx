'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Service } from '@/types';
import { publicApi } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { ServicesCarousel } from '@/components/carousel/ServicesCarousel';

const WHATSAPP_NUMBER = '923239518506';

export default function ServicesPage() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const [featured, all] = await Promise.all([
          publicApi.getFeaturedServices(),
          publicApi.getServices(),
        ]);
        setFeaturedServices(featured);
        setAllServices(all);
      } catch (error) {
        console.error('Failed to load services:', error);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
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
            My <span className="gradient-text">Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional development services tailored to your needs
          </p>
        </motion.div>
      </section>

      {/* Featured Services Carousel */}
      {featuredServices.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="container-custom">
            <motion.h2
              className="text-3xl font-bold text-center mb-8 text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Featured Services
            </motion.h2>
            <ServicesCarousel
              services={featuredServices}
              autoPlay={true}
              autoPlayInterval={5000}
              showDots={true}
              showArrows={true}
            />
          </div>
        </section>
      )}

      {/* All Services Grid */}
      <section className="py-16 px-4">
        <div className="container-custom">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            All Services
          </motion.h2>
          
          {allServices.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💼</div>
              <p className="text-gray-500 text-lg mb-2">Services coming soon</p>
              <p className="text-gray-400">Contact me to discuss your project!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-neon-blue to-neon-purple">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Have a Project in Mind?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Let&apos;s discuss how I can help bring your ideas to life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Abdulrafay!%20I'm%20interested%20in%20discussing%20a%20project.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  className="px-12 py-5 text-lg font-semibold bg-white text-neon-purple rounded-xl hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Chat on WhatsApp
                </motion.button>
              </a>
              <Link href="/contact">
                <motion.button
                  className="px-12 py-5 text-lg font-semibold bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-neon-purple transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Email
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const whatsappMessage = `Hi Abdulrafay! I'm interested in ${service.name}. Can you provide more details?`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/services/${service.slug}`} className="block h-full">
        <GlassCard className="h-full p-0 flex flex-col overflow-hidden" hover={false}>
          {/* Service Image */}
          {service.image_url ? (
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
              <span className="text-6xl">⚡</span>
            </div>
          )}

          {/* Service Info */}
          <div className="p-8 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
              {service.featured && (
                <span className="px-2 py-1 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs rounded-full font-semibold">
                  Featured
                </span>
              )}
            </div>
            <div
              className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed overflow-hidden"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: '4',
                WebkitBoxOrient: 'vertical',
              }}
              dangerouslySetInnerHTML={{ __html: service.description.replace(/<p>/g, '').replace(/<\/p>/g, ' ').replace(/<br\s*\/?>/g, ' ') }}
            />

            {service.pricing && (
              <div className="mb-6 py-3 px-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded-xl">
                <p className="text-neon-purple font-semibold">{service.pricing}</p>
              </div>
            )}

            <div className="mt-auto">
              <NeonButton fullWidth>
                View Details
              </NeonButton>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
