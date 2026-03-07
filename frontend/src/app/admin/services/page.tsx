'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Service } from '@/types';
import Link from 'next/link';

export default function AdminServicesPage() {
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
    features: [] as string[],
    delivery_time: '3-5 business days',
  });
  const [featureInput, setFeatureInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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
    setSaving(true);

    try {
      const serviceData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        pricing: formData.pricing || undefined,
        image_url: formData.image_url || undefined,
        featured: formData.featured,
        features: formData.features.length > 0 ? formData.features : undefined,
        delivery_time: formData.delivery_time || undefined,
      };

      if (editingId) {
        await adminApi.updateService(editingId, serviceData);
        setSuccess('Service updated successfully!');
      } else {
        await adminApi.createService(serviceData);
        setSuccess('Service created successfully!');
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadServices();
    } catch (err: any) {
      setError(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
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

  function resetForm() {
    setFormData({
      name: '',
      slug: '',
      description: '',
      pricing: '',
      image_url: '',
      featured: false,
      features: [],
      delivery_time: '3-5 business days',
    });
    setImageFile(null);
    setImagePreview('');
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

  function addFeature() {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  }

  function removeFeature(index: number) {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    setDeleting(id);
    try {
      await adminApi.deleteService(id);
      setServices(services.filter(s => s.id !== id));
      setSuccess('Service deleted successfully!');
      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
        resetForm();
      }
    } catch (err: any) {
      setError('Failed to delete service: ' + (err.message || 'Unknown error'));
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Services</h2>
          <p className="text-gray-600 mt-1">Manage your offered services</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); resetForm(); }}
          className="px-6 py-3 bg-gradient-to-r from-[#00E5FF] to-[#7B00FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
        >
          {showForm ? 'Cancel' : '+ Add Service'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Web Development"
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
                  placeholder="web-development"
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
                  placeholder="Service description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
                <input
                  type="text"
                  value={formData.pricing}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Starting at $500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                <input
                  type="text"
                  value={formData.delivery_time}
                  onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="e.g., 3-5 business days"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Service Image</h3>
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

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none transition-all"
                  placeholder="Add a feature"
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
                {formData.features.map((feature, i) => (
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

          {/* Featured */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 text-[#00E5FF] rounded focus:ring-[#00E5FF]"
              />
              <span className="text-sm font-medium text-gray-700">Featured Service</span>
            </label>
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
                editingId ? 'Update Service' : 'Create Service'
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

      {/* Services List */}
      {!showForm && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {service.image_url ? (
                  <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl">⚡</span>
                  </div>
                )}
                {service.featured && (
                  <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-[#00E5FF] to-[#7B00FF] text-white text-xs font-semibold rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>

                {service.pricing && (
                  <div className="mb-4 px-3 py-2 bg-[#7B00FF]/10 rounded-lg">
                    <p className="text-sm font-semibold text-[#7B00FF]">{service.pricing}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => editService(service)}
                    className="flex-1 px-4 py-2.5 bg-[#00E5FF]/10 text-[#00E5FF] font-medium rounded-lg hover:bg-[#00E5FF]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    disabled={deleting === service.id}
                    className="px-4 py-2.5 bg-red-50 text-red-500 font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!showForm && services.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">🛠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Services Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first service!</p>
          <button
            onClick={() => { setShowForm(true); resetForm(); }}
            className="px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-[#7B00FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
          >
            + Add Your First Service
          </button>
        </div>
      )}
    </div>
  );
}
