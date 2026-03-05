'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Project, Service } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, servicesData] = await Promise.all([
          adminApi.getProjects(),
          adminApi.getServices(),
        ]);
        setProjects(projectsData);
        setServices(servicesData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const featuredCount = projects.filter(p => p.featured).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-neon-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
        <p className="text-gray-600">Manage your portfolio content from here</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard hover={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Projects</p>
              <p className="text-4xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Featured Projects</p>
              <p className="text-4xl font-bold text-gray-900">{featuredCount}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Services</p>
              <p className="text-4xl font-bold text-gray-900">{services.length}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-neon-pink/20 to-purple-20/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/projects">
            <GlassCard className="text-center hover:cursor-pointer">
              <div className="text-4xl mb-3">📁</div>
              <h4 className="font-semibold text-gray-900 mb-1">Manage Projects</h4>
              <p className="text-sm text-gray-600">Add, edit, or delete projects</p>
            </GlassCard>
          </a>

          <a href="/admin/services">
            <GlassCard className="text-center hover:cursor-pointer">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-semibold text-gray-900 mb-1">Manage Services</h4>
              <p className="text-sm text-gray-600">Update your service offerings</p>
            </GlassCard>
          </a>

          <a href="/" target="_blank" rel="noopener noreferrer">
            <GlassCard className="text-center hover:cursor-pointer">
              <div className="text-4xl mb-3">👁️</div>
              <h4 className="font-semibold text-gray-900 mb-1">View Site</h4>
              <p className="text-sm text-gray-600">Preview your portfolio</p>
            </GlassCard>
          </a>

          <a href="/admin" onClick={(e) => { e.preventDefault(); adminApi.logout(); }}>
            <GlassCard className="text-center hover:cursor-pointer">
              <div className="text-4xl mb-3">🚪</div>
              <h4 className="font-semibold text-gray-900 mb-1">Logout</h4>
              <p className="text-sm text-gray-600">Sign out of admin panel</p>
            </GlassCard>
          </a>
        </div>
      </div>

      {/* Recent Projects */}
      {projects.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Projects</h3>
            <a href="/admin/projects">
              <NeonButton size="sm">View All</NeonButton>
            </a>
          </div>
          <GlassCard hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Featured</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tech Stack</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.slice(0, 5).map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{project.title}</td>
                      <td className="py-3 px-4">
                        {project.featured ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {project.tech_stack.split(',').filter(t => t.trim()).slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-1 text-xs bg-neon-pink/10 text-neon-purple rounded-full">
                              {tech}
                            </span>
                          ))}
                          {project.tech_stack.split(',').filter(t => t.trim()).length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                              +{project.tech_stack.split(',').filter(t => t.trim()).length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <GlassCard className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first project!</p>
          <a href="/admin/projects">
            <NeonButton>Add Your First Project</NeonButton>
          </a>
        </GlassCard>
      )}
    </div>
  );
}
