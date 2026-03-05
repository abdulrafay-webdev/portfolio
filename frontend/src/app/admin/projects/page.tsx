'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { Project } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), { ssr: false });

// Default values for new projects
const DEFAULT_PROJECT_META = {
  project_type: 'Full Stack Web Application',
  performance: 'Optimized for speed & SEO',
  responsive: 'Mobile, Tablet & Desktop',
  security: 'Production-ready security',
};

const DEFAULT_CHALLENGES = {
  challenge_title: 'Scalable Architecture',
  challenge_description: 'Implementing a scalable architecture that supports rapid development while maintaining code quality and performance.',
  solution_title: 'Modern Tech Stack',
  solution_description: 'Utilized Next.js for frontend with server-side rendering, FastAPI for backend with async support, and implemented CI/CD pipelines for automated deployments.',
};

const DEFAULT_KEY_FEATURES = [
  'Responsive design across all devices',
  'Fast loading with optimized assets',
  'Secure authentication & authorization',
  'Real-time data updates',
  'SEO optimized structure',
  'Accessible UI components',
];

export default function AdminProjects() {
  const router = useRouter();
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProjects();
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
      console.error('Project error:', err);
      let errorMessage = 'Failed to save project';
      
      if (err.response?.status === 422 && err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          const messages = detail.map((d: any) => `${d.loc?.join(' ') || 'Field'}: ${d.msg || 'Invalid'}`);
          errorMessage = messages.join('; ');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      } else if (err.message && err.message !== '[object Object]') {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
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
    setEditingId(null);
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
      
      const response = await fetch('http://localhost:8000/api/v1/admin/images/upload', {
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

  function updateMetaField(field: string, value: string) {
    setFormData({
      ...formData,
      project_meta: { ...formData.project_meta, [field]: value },
    });
  }

  function updateChallengesField(field: string, value: string) {
    setFormData({
      ...formData,
      challenges: { ...formData.challenges, [field]: value },
    });
  }

  function toggleSection(section: 'project_meta' | 'challenges' | 'key_features') {
    setFormData({
      ...formData,
      [section]: formData[section] ? null : (
        section === 'project_meta' ? { ...DEFAULT_PROJECT_META } :
        section === 'challenges' ? { ...DEFAULT_CHALLENGES } :
        [...DEFAULT_KEY_FEATURES]
      ),
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Manage Projects</h2>
        <NeonButton onClick={() => { setShowForm(true); resetForm(); }}>
          {showForm ? 'Cancel' : 'Add Project'}
        </NeonButton>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
          {success}
        </div>
      )}

      {showForm && (
        <div className="space-y-6">
          <GlassCard hover={false}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Basic Information</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title, Slug, Description, Image, Tech Stack fields... */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-neon-purple focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="my-project"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-neon-purple focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  placeholder="Describe your project... (max 10000 characters)"
                  height="300px"
                />
                <p className={`text-sm mt-2 ${formData.description.replace(/<[^>]*>/g, '').length > 9000 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.description.replace(/<[^>]*>/g, '').length}/10000 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  />
                  {uploading && (
                    <div className="text-center text-sm text-gray-600">
                      <div className="w-4 h-4 border-2 border-neon-purple border-t-transparent rounded-full animate-spin inline mr-2"></div>
                      Uploading image...
                    </div>
                  )}
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="Add technology"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl"
                  />
                  <NeonButton type="button" size="sm" onClick={addTech}>Add</NeonButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tech_stack && formData.tech_stack.split(',').filter(t => t.trim()).map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-neon-blue/10 text-neon-purple rounded-full text-sm flex items-center gap-2">
                      {tech}
                      <button type="button" onClick={() => removeTech(tech)} className="text-neon-pink hover:text-neon-purple">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                <input
                  type="url"
                  value={formData.live_url}
                  onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">Featured (show on homepage carousel)</label>
              </div>
            </form>
          </GlassCard>

          {/* Project Meta Section */}
          <GlassCard hover={false}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Project Meta Information</h3>
              <button
                onClick={() => toggleSection('project_meta')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  formData.project_meta ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
              >
                {formData.project_meta ? 'Remove Section' : 'Add Section'}
              </button>
            </div>

            {formData.project_meta && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                  <input
                    type="text"
                    value={formData.project_meta.project_type}
                    onChange={(e) => updateMetaField('project_type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Performance</label>
                  <input
                    type="text"
                    value={formData.project_meta.performance}
                    onChange={(e) => updateMetaField('performance', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsive</label>
                  <input
                    type="text"
                    value={formData.project_meta.responsive}
                    onChange={(e) => updateMetaField('responsive', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Security</label>
                  <input
                    type="text"
                    value={formData.project_meta.security}
                    onChange={(e) => updateMetaField('security', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            )}
          </GlassCard>

          {/* Challenges & Solutions Section */}
          <GlassCard hover={false}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Challenges & Solutions</h3>
              <button
                onClick={() => toggleSection('challenges')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  formData.challenges ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
              >
                {formData.challenges ? 'Remove Section' : 'Add Section'}
              </button>
            </div>

            {formData.challenges && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Title</label>
                  <input
                    type="text"
                    value={formData.challenges.challenge_title}
                    onChange={(e) => updateChallengesField('challenge_title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Description</label>
                  <textarea
                    value={formData.challenges.challenge_description}
                    onChange={(e) => updateChallengesField('challenge_description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Solution Title</label>
                  <input
                    type="text"
                    value={formData.challenges.solution_title}
                    onChange={(e) => updateChallengesField('solution_title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Solution Description</label>
                  <textarea
                    value={formData.challenges.solution_description}
                    onChange={(e) => updateChallengesField('solution_description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            )}
          </GlassCard>

          {/* Key Features Section */}
          <GlassCard hover={false}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Key Features</h3>
              <button
                onClick={() => toggleSection('key_features')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  formData.key_features && formData.key_features.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
              >
                {formData.key_features && formData.key_features.length > 0 ? 'Remove Section' : 'Add Section'}
              </button>
            </div>

            {formData.key_features && formData.key_features.length > 0 && (
              <div className="space-y-2">
                {formData.key_features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                    <svg className="w-5 h-5 text-neon-purple flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="flex-1 text-gray-700">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="Add a key feature"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                  />
                  <NeonButton type="button" onClick={addFeature}>Add Feature</NeonButton>
                </div>
              </div>
            )}
          </GlassCard>

          <div className="flex gap-4">
            <NeonButton onClick={handleSubmit} className="flex-1" size="lg">
              Create Project
            </NeonButton>
            <NeonButton variant="secondary" onClick={() => { setShowForm(false); resetForm(); }} className="flex-1" size="lg">
              Cancel
            </NeonButton>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.map((project) => (
          <GlassCard key={project.id} hover={false}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                  {project.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Featured</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.tech_stack && project.tech_stack.split(',').filter(t => t.trim()).slice(0, 5).map((tech, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-neon-blue/10 text-neon-purple rounded-full">{tech}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editProject(project)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => {/* Toggle featured */}}
                  className={`px-3 py-1 text-sm rounded-xl ${
                    project.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {project.featured ? 'Unfeature' : 'Feature'}
                </button>
                <button
                  onClick={() => {/* Delete functionality */}}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-xl hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </GlassCard>
        ))}

        {projects.length === 0 && (
          <GlassCard className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No projects yet</p>
            <NeonButton onClick={() => { setShowForm(true); resetForm(); }}>Add Your First Project</NeonButton>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
