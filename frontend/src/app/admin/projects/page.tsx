'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Project } from '@/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const DEFAULT_PROJECT_META = {
  project_type: 'Full Stack Web Application',
  performance: 'Optimized for speed & SEO',
  responsive: 'Mobile, Tablet & Desktop',
  security: 'Production-ready security',
};

const DEFAULT_CHALLENGES = {
  challenge_title: 'Scalable Architecture',
  challenge_description: 'Implementing a scalable architecture that supports rapid development.',
  solution_title: 'Modern Tech Stack',
  solution_description: 'Utilized Next.js for frontend with FastAPI for backend.',
};

const DEFAULT_KEY_FEATURES = [
  'Responsive design across all devices',
  'Fast loading with optimized assets',
  'Secure authentication & authorization',
];

export default function AdminProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    tech_stack: '',
    featured: false,
    image_url: '',
    github_url: '',
    live_url: '',
    project_meta: { ...DEFAULT_PROJECT_META },
    challenges: { ...DEFAULT_CHALLENGES },
    key_features: [...DEFAULT_KEY_FEATURES],
  });
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProjects();
    const editId = searchParams.get('edit');
    if (editId) {
      const projectToEdit = projects.find(p => p.id === editId);
      if (projectToEdit) {
        editProject(projectToEdit);
      }
    }
  }, []);

  async function loadProjects() {
    try {
      const data = await adminApi.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const projectData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        tech_stack: formData.tech_stack,
        featured: formData.featured,
        image_url: formData.image_url || undefined,
        github_url: formData.github_url || undefined,
        live_url: formData.live_url || undefined,
        project_meta: formData.project_meta || undefined,
        challenges: formData.challenges || undefined,
        key_features: formData.key_features || undefined,
      };

      if (editingId) {
        await adminApi.updateProject(editingId, projectData);
        setSuccess('Project updated successfully!');
      } else {
        await adminApi.createProject(projectData);
        setSuccess('Project created successfully!');
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadProjects();
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  }

  function editProject(project: Project) {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description || '',
      tech_stack: project.tech_stack || '',
      featured: project.featured,
      image_url: project.image_url || '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      project_meta: {
        project_type: project.project_meta?.project_type || DEFAULT_PROJECT_META.project_type,
        performance: project.project_meta?.performance || DEFAULT_PROJECT_META.performance,
        responsive: project.project_meta?.responsive || DEFAULT_PROJECT_META.responsive,
        security: project.project_meta?.security || DEFAULT_PROJECT_META.security,
      },
      challenges: {
        challenge_title: project.challenges?.challenge_title || DEFAULT_CHALLENGES.challenge_title,
        challenge_description: project.challenges?.challenge_description || DEFAULT_CHALLENGES.challenge_description,
        solution_title: project.challenges?.solution_title || DEFAULT_CHALLENGES.solution_title,
        solution_description: project.challenges?.solution_description || DEFAULT_CHALLENGES.solution_description,
      },
      key_features: project.key_features || [...DEFAULT_KEY_FEATURES],
    });
    if (project.image_url) {
      setImagePreview(project.image_url);
    }
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      title: '',
      slug: '',
      description: '',
      tech_stack: '',
      featured: false,
      image_url: '',
      github_url: '',
      live_url: '',
      project_meta: { ...DEFAULT_PROJECT_META },
      challenges: { ...DEFAULT_CHALLENGES },
      key_features: [...DEFAULT_KEY_FEATURES],
    });
    setImageFile(null);
    setImagePreview('');
    setTechInput('');
    setFeatureInput('');
    setError('');
    setSuccess('');
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'portfolio');

      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/v1/admin/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, image_url: data.url }));
      setSuccess('Image uploaded successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  function addTech() {
    if (techInput.trim()) {
      const currentStack = formData.tech_stack ? formData.tech_stack.split(',').filter(t => t.trim()) : [];
      if (!currentStack.includes(techInput.trim())) {
        currentStack.push(techInput.trim());
        setFormData({ ...formData, tech_stack: currentStack.join(',') });
      }
      setTechInput('');
    }
  }

  function removeTech(tech: string) {
    const currentStack = formData.tech_stack.split(',').filter(t => t.trim() !== tech);
    setFormData({ ...formData, tech_stack: currentStack.join(',') });
  }

  function addFeature() {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        key_features: [...(formData.key_features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  }

  function removeFeature(index: number) {
    setFormData({
      ...formData,
      key_features: formData.key_features?.filter((_, i) => i !== index) || [],
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeleting(id);
    try {
      await adminApi.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      setSuccess('Project deleted successfully!');
      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
        resetForm();
      }
    } catch (err: any) {
      setError('Failed to delete project: ' + (err.message || 'Unknown error'));
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600 mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); resetForm(); }}
          className="px-6 py-3 bg-gradient-to-r from-[#00E5FF] to-[#7B00FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
        >
          {showForm ? 'Cancel' : '+ Add Project'}
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="Project title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="project-slug"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Project description"
                  required
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Project Image</h3>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
              />
              {uploading && (
                <div className="flex items-center gap-2 text-[#00E5FF]">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading image...</span>
                </div>
              )}
              {imagePreview && (
                <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tech Stack</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="Add technology (e.g., React, Next.js)"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-6 py-3 bg-[#00E5FF] text-black font-semibold rounded-lg hover:bg-[#00E5FF]/90 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tech_stack && formData.tech_stack.split(',').filter(t => t.trim()).map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg text-sm font-medium flex items-center gap-2">
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Project Links</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                <input
                  type="url"
                  value={formData.live_url}
                  onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 text-[#00E5FF] rounded focus:ring-[#00E5FF]"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Project</span>
                </label>
              </div>
            </div>
          </div>

          {/* Project Meta */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Project Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                <input
                  type="text"
                  value={formData.project_meta?.project_type || ''}
                  onChange={(e) => setFormData({ ...formData, project_meta: { ...formData.project_meta, project_type: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Full Stack Web Application"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Performance</label>
                <input
                  type="text"
                  value={formData.project_meta?.performance || ''}
                  onChange={(e) => setFormData({ ...formData, project_meta: { ...formData.project_meta, performance: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Optimized for speed & SEO"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsive</label>
                <input
                  type="text"
                  value={formData.project_meta?.responsive || ''}
                  onChange={(e) => setFormData({ ...formData, project_meta: { ...formData.project_meta, responsive: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Mobile, Tablet & Desktop"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Security</label>
                <input
                  type="text"
                  value={formData.project_meta?.security || ''}
                  onChange={(e) => setFormData({ ...formData, project_meta: { ...formData.project_meta, security: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Production-ready security"
                />
              </div>
            </div>
          </div>

          {/* Challenges & Solutions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Challenges & Solutions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Title</label>
                <input
                  type="text"
                  value={formData.challenges?.challenge_title || ''}
                  onChange={(e) => setFormData({ ...formData, challenges: { ...formData.challenges, challenge_title: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Scalable Architecture"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Description</label>
                <textarea
                  value={formData.challenges?.challenge_description || ''}
                  onChange={(e) => setFormData({ ...formData, challenges: { ...formData.challenges, challenge_description: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Describe the main challenge"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Solution Title</label>
                <input
                  type="text"
                  value={formData.challenges?.solution_title || ''}
                  onChange={(e) => setFormData({ ...formData, challenges: { ...formData.challenges, solution_title: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Modern Tech Stack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Solution Description</label>
                <textarea
                  value={formData.challenges?.solution_description || ''}
                  onChange={(e) => setFormData({ ...formData, challenges: { ...formData.challenges, solution_description: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Describe the solution"
                />
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="Add a key feature"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-6 py-3 bg-[#00E5FF] text-black font-semibold rounded-lg hover:bg-[#00E5FF]/90 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.key_features?.map((feature, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#7B00FF]/10 text-[#7B00FF] rounded-lg text-sm font-medium flex items-center gap-2">
                    {feature}
                    <button type="button" onClick={() => removeFeature(i)} className="hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-[#00E5FF] to-[#7B00FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  {editingId ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                editingId ? 'Update Project' : 'Create Project'
              )}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}
              className="px-6 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      {!showForm && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl">🚀</span>
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-[#00E5FF] to-[#7B00FF] text-white text-xs font-semibold rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech_stack.split(',').filter(t => t.trim()).slice(0, 4).map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-[#00E5FF]/10 text-[#00E5FF] text-xs rounded-md font-medium">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => editProject(project)}
                    className="flex-1 px-4 py-2.5 bg-[#00E5FF]/10 text-[#00E5FF] font-medium rounded-lg hover:bg-[#00E5FF]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deleting === project.id}
                    className="px-4 py-2.5 bg-red-50 text-red-500 font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!showForm && projects.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first project!</p>
          <button
            onClick={() => { setShowForm(true); resetForm(); }}
            className="px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-[#7B00FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
          >
            + Add Your First Project
          </button>
        </div>
      )}
    </div>
  );
}
