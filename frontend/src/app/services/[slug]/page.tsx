'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Service } from '@/types';
import { publicApi } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

const WHATSAPP_NUMBER = '923239518506';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    async function loadService() {
      try {
        const data = await publicApi.getServiceBySlug(slug);
        setService(data);
      } catch (error) {
        console.error('Failed to load service:', error);
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The service you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/services">
            <NeonButton>View All Services</NeonButton>
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = `Hi Abdulrafay! I'm interested in ${service.name}. Can you provide more details?`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

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
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                  <span className="text-8xl">⚡</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Details */}
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
                {service.featured && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm rounded-full font-semibold">
                    Featured Service
                  </span>
                )}
                <span className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                  Professional Service
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                {service.name}
              </h1>
            </div>

            {/* Pricing */}
            {service.pricing && (
              <GlassCard className="p-6 mb-8" hover={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">Starting Price</h3>
                    <p className="text-3xl font-bold text-neon-purple">{service.pricing}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Description */}
            <GlassCard className="p-8 mb-8" hover={false}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Overview</h2>
              <div 
                className="rich-text-content text-gray-600 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </GlassCard>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <GlassCard className="p-8 mb-8" hover={false}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  What&apos;s Included
                </h2>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
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

            {/* Delivery Time */}
            {service.delivery_time && (
              <GlassCard className="p-6 mb-8" hover={false}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Delivery Time</h3>
                    <p className="text-gray-600">{service.delivery_time}</p>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <NeonButton size="lg" fullWidth>
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Discuss on WhatsApp
                  </span>
                </NeonButton>
              </a>
              <Link href="/contact" className="flex-1">
                <NeonButton variant="secondary" size="lg" fullWidth>
                  Contact via Email
                </NeonButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back to Services */}
      <section className="py-12 px-4 bg-white">
        <div className="container-custom text-center">
          <Link href="/services">
            <NeonButton variant="outline" size="lg">
              View All Services
            </NeonButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 border-t border-gray-200 bg-white">
        <p>&copy; {new Date().getFullYear()} Abdulrafay. All rights reserved.</p>
      </footer>
    </main>
  );
}
