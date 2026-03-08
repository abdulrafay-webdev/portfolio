/**
 * Type definitions for the Portfolio application.
 */

// Project types
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  tech_stack: string;  // Comma-separated string from backend
  featured: boolean;
  image_url?: string;  // Single image URL from backend
  github_url?: string;
  live_url?: string;
  created_at: string;
  updated_at: string;
  project_meta?: {
    project_type?: string;
    performance?: string;
    responsive?: string;
    security?: string;
  };
  challenges?: {
    challenge_title?: string;
    challenge_description?: string;
    solution_title?: string;
    solution_description?: string;
  };
  key_features?: string[];
}

export interface ProjectCreate {
  title: string;
  slug: string;
  description: string;
  tech_stack: string;  // Comma-separated string
  featured?: boolean;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  project_meta?: {
    project_type?: string;
    performance?: string;
    responsive?: string;
    security?: string;
  };
  challenges?: {
    challenge_title?: string;
    challenge_description?: string;
    solution_title?: string;
    solution_description?: string;
  };
  key_features?: string[];
}

export interface ProjectUpdate {
  title?: string;
  slug?: string;
  description?: string;
  tech_stack?: string;  // Comma-separated string
  featured?: boolean;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  project_meta?: {
    project_type?: string;
    performance?: string;
    responsive?: string;
    security?: string;
  };
  challenges?: {
    challenge_title?: string;
    challenge_description?: string;
    solution_title?: string;
    solution_description?: string;
  };
  key_features?: string[];
}

// Service types
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricing?: string;
  image_url?: string;  // Single image URL from backend
  featured: boolean;
  features?: string[];
  delivery_time?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceCreate {
  name: string;
  slug: string;
  description: string;
  pricing?: string;
  image_url?: string;
  featured?: boolean;
  features?: string[];
  delivery_time?: string;
}

export interface ServiceUpdate {
  name?: string;
  slug?: string;
  description?: string;
  pricing?: string;
  image_url?: string;
  featured?: boolean;
  features?: string[];
  delivery_time?: string;
}

// Contact types
export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface ContactCreate {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactStats {
  total: number;
}

// Image types
export interface Image {
  id: string;
  url: string;
  alt_text?: string;
  entity_type: 'project' | 'service';
  entity_id: string;
  created_at: string;
  updated_at: string;
}

export interface ImageCreate {
  url: string;
  alt_text?: string;
  entity_type: 'project' | 'service';
  entity_id: string;
}

// Admin types
export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AdminLogin {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  email: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
}

export interface ApiError {
  detail: string;
  error_code?: string;
  fields?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}
