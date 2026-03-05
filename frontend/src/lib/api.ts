/**
 * API client for communicating with the backend.
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  Project,
  Service,
  Contact,
  ContactCreate,
  AdminLogin,
  AdminLoginResponse,
  ProjectCreate,
  ProjectUpdate,
  ServiceCreate,
  ServiceUpdate,
  ApiError,
} from '@/types';

// Backend API URL - automatically appends /api/v1
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE}/api/v1`;

/**
 * Custom error class for API errors.
 */
export class ApiErrorClass extends Error {
  constructor(
    public status: number,
    public errorCode: string,
    public detail: string,
    public fields?: Array<{ field: string; message: string; code: string }>
  ) {
    super(detail);
    this.name = 'ApiError';
  }
}

/**
 * Create axios instance with default configuration.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Handle API errors.
 */
function handleApiError(error: AxiosError<ApiError>): never {
  const data = error.response?.data;
  
  throw new ApiErrorClass(
    error.response?.status || 500,
    data?.error_code || 'UNKNOWN_ERROR',
    data?.detail || 'An unexpected error occurred',
    data?.fields
  );
}

/**
 * Public API endpoints.
 */
export const publicApi = {
  // Projects
  getProjects: async (featured?: boolean, limit?: number, offset?: number): Promise<Project[]> => {
    try {
      const params = new URLSearchParams();
      if (featured !== undefined) params.append('featured', featured.toString());
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      
      const response = await apiClient.get<Project[]>(`/projects?${params}`);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  getFeaturedProjects: async (): Promise<Project[]> => {
    try {
      const response = await apiClient.get<Project[]>('/projects/featured');
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  getProjectBySlug: async (slug: string): Promise<Project> => {
    try {
      const response = await apiClient.get<Project>(`/projects/${slug}`);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    try {
      const response = await apiClient.get<Service[]>('/services');
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  getFeaturedServices: async (): Promise<Service[]> => {
    try {
      const response = await apiClient.get<Service[]>('/services/featured');
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  getServiceBySlug: async (slug: string): Promise<Service> => {
    try {
      const response = await apiClient.get<Service>(`/services/${slug}`);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  // Contact
  submitContact: async (contact: ContactCreate): Promise<Contact> => {
    try {
      const response = await apiClient.post<Contact>('/contact', contact);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },
};

/**
 * Admin API endpoints with authentication.
 */
export const adminApi = {
  /**
   * Login to admin panel.
   */
  login: async (credentials: AdminLogin): Promise<AdminLoginResponse> => {
    try {
      const response = await apiClient.post<AdminLoginResponse>('/admin/login', credentials);
      if (response.data.access_token) {
        localStorage.setItem('admin_token', response.data.access_token);
      }
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  /**
   * Logout from admin panel.
   */
  logout: () => {
    localStorage.removeItem('admin_token');
  },

  /**
   * Get stored token.
   */
  getToken: (): string | null => {
    return localStorage.getItem('admin_token');
  },

  /**
   * Check if user is authenticated.
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('admin_token');
    return !!token;
  },

  // Projects (Admin)
  getProjects: async (): Promise<Project[]> => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.get<Project[]>('/admin/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  createProject: async (project: ProjectCreate): Promise<Project> => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.post<Project>('/admin/projects', project, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  updateProject: async (id: string, project: ProjectUpdate): Promise<Project> => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.put<Project>(`/admin/projects/${id}`, project, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('admin_token');
      await apiClient.delete(`/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  // Services (Admin)
  getServices: async (): Promise<Service[]> => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.get<Service[]>('/admin/services', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  createService: async (service: ServiceCreate): Promise<Service> => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.post<Service>('/admin/services', service, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  updateService: async (id: string, service: ServiceUpdate): Promise<Service> => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await apiClient.put<Service>(`/admin/services/${id}`, service, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },

  deleteService: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('admin_token');
      await apiClient.delete(`/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  },
};

/**
 * Health check endpoint.
 */
export const healthCheck = async (): Promise<{ status: string }> => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError<ApiError>);
  }
};
