'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Service } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), { ssr: false });

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    pricing: '',
    image_url: '',
    featured: false,
    features: [
      'Professional quality work',
      'Fast delivery',
      'Unlimited revisions',
      '24/7 support',
    ],
    delivery_time: '3-5 business days',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await adminApi.getServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Prepare service data for API
      const serviceData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        pricing: formData.pricing || undefined,
        image_url: formData.image_url || undefined,
        featured: formData.featured,
        features: formData.features || [],
        delivery_time: formData.delivery_time || undefined,
      };

      if (editingId) {
        // Update existing service
        await adminApi.updateService(editingId, serviceData);
        setSuccess('Service updated successfully!');
      } else {
        // Create new service
        await adminApi.createService(serviceData);
        setSuccess('Service created successfully!');
      }
      
      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadServices();
    } catch (err: any) {
      console.error('Service error:', err);
      
      // Proper error handling
      let errorMessage = 'Failed to create service';
      
      if (err.response?.status === 422 && err.response?.data?.detail) {
        const detail = err.response.data.detail;
        
        // Handle validation errors (array of errors)
        if (Array.isArray(detail)) {
          const messages = detail.map((d: any) => {
            const field = d.loc?.join(' ') || 'Field';
            const msg = d.msg || 'Invalid';
            return `${field}: ${msg}`;
          });
          errorMessage = messages.join('; ');
        } 
        // Handle single error object
        else if (typeof detail === 'object') {
          errorMessage = detail.msg || JSON.stringify(detail);
        }
        // Handle string error
        else if (typeof detail === 'string') {
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
      name: '',
      slug: '',
      description: '',
      pricing: '',
      image_url: '',
      featured: false,
      features: [
        'Professional quality work',
        'Fast delivery',
        'Unlimited revisions',
        '24/7 support',
      ],
      delivery_time: '3-5 business days',
    });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
  }

  function editService(service: Service) {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description || '',
      pricing: service.pricing || '',
      image_url: service.image_url || '',
      featured: service.featured,
      features: service.features || [],
      delivery_time: service.delivery_time || '3-5 business days',
    });
    if (service.image_url) {
      setImagePreview(service.image_url);
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

  function addFeature() {
    if (featureInput.trim()) {
      setFormData({ 
        ...formData, 
        features: [...(formData.features || []), featureInput.trim()] 
      });
      setFeatureInput('');
    }
  }

  function removeFeature(index: number) {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index) || [],
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
        <h2 className="text-3xl font-bold text-gray-900">Manage Services</h2>
        <NeonButton onClick={() => { setShowForm(true); resetForm(); }}>
          {showForm ? 'Cancel' : 'Add Service'}
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
          {/* Basic Information */}
          <GlassCard hover={false}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Service' : 'Add Service'}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setFormData({ ...formData, name, slug });
                  }}
                  placeholder="e.g., Full Stack Development"
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
                  placeholder="full-stack-development"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-neon-purple focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  placeholder="Describe your service... (max 10000 characters)"
                  height="300px"
                />
                <p className={`text-sm mt-2 ${formData.description.replace(/<[^>]*>/g, '').length > 9000 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.description.replace(/<[^>]*>/g, '').length}/10000 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>
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
                  {formData.image_url && !imagePreview && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden">
                      <img src={formData.image_url} alt="Service" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
                <input
                  type="text"
                  value={formData.pricing}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                  placeholder="e.g., Starting at $500"
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
                <label htmlFor="featured" className="text-sm text-gray-700">Featured (show in carousel)</label>
              </div>

              <NeonButton type="submit" className="w-full" size="lg">
                Create Service
              </NeonButton>
            </form>
          </GlassCard>

          {/* Features Section */}
          <GlassCard hover={false}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Service Features</h3>
            </div>

            {formData.features && formData.features.length > 0 && (
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
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
                    placeholder="Add a feature"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                  />
                  <NeonButton type="button" onClick={addFeature}>Add Feature</NeonButton>
                </div>
              </div>
            )}
          </GlassCard>

          <div className="flex gap-4">
            <NeonButton onClick={handleSubmit} className="flex-1" size="lg">
              Create Service
            </NeonButton>
            <NeonButton variant="secondary" onClick={() => { setShowForm(false); resetForm(); }} className="flex-1" size="lg">
              Cancel
            </NeonButton>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <GlassCard key={service.id} hover={false}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {service.image_url && (
                  <div className="w-full h-40 mb-4 rounded-xl overflow-hidden">
                    <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                {service.pricing && (
                  <p className="text-neon-purple font-semibold mb-2">{service.pricing}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editService(service)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!confirm('Are you sure you want to delete this service?')) return;
                    try {
                      await adminApi.deleteService(service.id);
                      loadServices();
                    } catch (err: any) {
                      setError(err.message || 'Failed to delete service');
                    }
                  }}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-xl hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </GlassCard>
        ))}

        {services.length === 0 && (
          <GlassCard className="text-center py-12 md:col-span-2">
            <p className="text-gray-500 text-lg mb-4">No services yet</p>
            <NeonButton onClick={() => { setShowForm(true); resetForm(); }}>
              Add Your First Service
            </NeonButton>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
