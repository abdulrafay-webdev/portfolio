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
      className="group"
    >
      <Link href={`/services/${service.slug}`} className="block h-full">
        {/* Card Container with Gradient Border Glow */}
        <div className="relative h-full rounded-2xl overflow-hidden bg-white border-2 border-transparent shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-500/50">
          {/* Featured Badge */}
          {service.featured && (
            <div className="absolute top-4 right-4 z-40">
              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium shadow-lg">
                Featured
              </span>
            </div>
          )}

          {/* Service Image */}
          <div className="relative h-48 overflow-hidden bg-gray-50">
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-purple-100">
                <span className="text-6xl">⚡</span>
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className="p-6 flex flex-col gap-4 flex-1">
            {/* Title - Always Single Line */}
            <h3 className="text-xl font-semibold text-gray-900 truncate whitespace-nowrap overflow-hidden text-ellipsis">
              {service.name}
            </h3>

            {/* Description - Max 2 Lines */}
            <div
              className="text-sm text-gray-600 leading-relaxed overflow-hidden min-h-[48px]"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
              }}
              dangerouslySetInnerHTML={{ __html: service.description.replace(/<p>/g, '').replace(/<\/p>/g, ' ').replace(/<br\s*\/?>/g, ' ') }}
            />

            {/* Price Section */}
            {service.pricing && (
              <div className="rounded-xl bg-gradient-to-r from-cyan-100 to-purple-100 py-3 text-center">
                <p className="text-sm font-semibold text-purple-700">{service.pricing}</p>
              </div>
            )}

            {/* CTA Button */}
            <div className="mt-auto">
              <button className="w-full rounded-xl py-3 font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-opacity">
                View Details
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
