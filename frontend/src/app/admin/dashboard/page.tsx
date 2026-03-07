'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Project, Service } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

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

  async function handleDeleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeleting(id);
    try {
      await adminApi.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      alert('Project deleted successfully!');
    } catch (error: any) {
      alert('Failed to delete project: ' + (error.message || 'Unknown error'));
    } finally {
      setDeleting(null);
    }
  }

  async function handleDeleteService(id: string) {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    setDeleting(id);
    try {
      await adminApi.deleteService(id);
      setServices(services.filter(s => s.id !== id));
      alert('Service deleted successfully!');
    } catch (error: any) {
      alert('Failed to delete service: ' + (error.message || 'Unknown error'));
    } finally {
      setDeleting(null);
    }
  }

  const featuredCount = projects.filter(p => p.featured).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your portfolio content</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/projects">
            <button className="px-6 py-3 bg-[#00E5FF] text-black font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105">
              + New Project
            </button>
          </Link>
          <Link href="/admin/services">
            <button className="px-6 py-3 border border-[#00E5FF] text-[#00E5FF] font-semibold rounded-lg hover:bg-[#00E5FF]/10 transition-all hover:scale-105">
              + New Service
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00E5FF]/20 to-[#7B00FF]/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-900">{projects.length}</span>
          </div>
          <p className="text-sm text-gray-600">Total Projects</p>
        </div>

        {/* Featured Projects */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7B00FF]/20 to-[#00E5FF]/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#7B00FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-900">{featuredCount}</span>
          </div>
          <p className="text-sm text-gray-600">Featured Projects</p>
        </div>

        {/* Total Services */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00E5FF]/20 to-[#7B00FF]/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-900">{services.length}</span>
          </div>
          <p className="text-sm text-gray-600">Total Services</p>
        </div>

        {/* Quick View */}
        <div className="bg-gradient-to-br from-[#00E5FF] to-[#7B00FF] rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-3xl font-bold">✓</span>
          </div>
          <p className="text-sm text-white/90">All Systems Active</p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Projects</h3>
          <Link href="/admin/projects" className="text-sm text-[#00E5FF] hover:underline font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tech Stack</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.slice(0, 5).map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {project.image_url && (
                        <img src={project.image_url} alt={project.title} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{project.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {project.featured ? (
                      <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#00E5FF] to-[#7B00FF] text-white rounded-full">
                        Featured
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.split(',').filter(t => t.trim()).slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-[#00E5FF]/10 text-[#00E5FF] rounded-md font-medium">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/projects?edit=${project.id}`}>
                        <button className="p-2 text-[#00E5FF] hover:bg-[#00E5FF]/10 rounded-lg transition-colors" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={deleting === project.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === project.id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 mb-4">No projects yet</p>
            <Link href="/admin/projects">
              <button className="px-6 py-3 bg-[#00E5FF] text-black font-semibold rounded-lg hover:shadow-lg transition-all">
                Add Your First Project
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Services</h3>
          <Link href="/admin/services" className="text-sm text-[#00E5FF] hover:underline font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pricing</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.slice(0, 5).map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {service.image_url && (
                        <img src={service.image_url} alt={service.name} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{service.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {service.pricing ? (
                      <span className="px-3 py-1 text-sm font-medium bg-[#7B00FF]/10 text-[#7B00FF] rounded-md">
                        {service.pricing}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Not specified</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/services?edit=${service.id}`}>
                        <button className="p-2 text-[#00E5FF] hover:bg-[#00E5FF]/10 rounded-lg transition-colors" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        disabled={deleting === service.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === service.id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {services.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛠️</div>
            <p className="text-gray-600 mb-4">No services yet</p>
            <Link href="/admin/services">
              <button className="px-6 py-3 bg-[#00E5FF] text-black font-semibold rounded-lg hover:shadow-lg transition-all">
                Add Your First Service
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
