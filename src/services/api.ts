/**
 * API Service
 * Handles all HTTP requests to the backend using Axios
 */

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:3000/api'
    : 'https://portfolio-backend.bandirs2003.workers.dev/api');

class APIClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const message = error.response.data?.message || `API Error: ${error.response.status}`;
          throw new Error(message);
        } else if (error.request) {
          throw new Error('No response from server');
        } else {
          throw error;
        }
      }
    );
  }

  private async request<T>(endpoint: string, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance(endpoint, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Auth Endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      data: { email, password },
    });
  }

  async register(email: string, password: string, name?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      data: { email, password, name },
    });
  }

  // Blog Endpoints
  async getBlogPosts(page = 1, limit = 10) {
    return this.request(`/blog/posts?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async getBlogPostBySlug(slug: string) {
    return this.request(`/blog/posts/${slug}`, {
      method: 'GET',
    });
  }

  async getBlogTags() {
    return this.request('/blog/tags', {
      method: 'GET',
    });
  }

  async createBlogPost(
    data: {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      tags: string[];
      published: boolean;
    },
    token: string
  ) {
    return this.request('/blog/posts', {
      method: 'POST',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateBlogPost(
    postId: string,
    data: Partial<{
      title: string;
      excerpt: string;
      content: string;
      tags: string[];
      published: boolean;
    }>,
    token: string
  ) {
    return this.request(`/blog/posts/${postId}`, {
      method: 'PATCH',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteBlogPost(postId: string, token: string) {
    return this.request(`/blog/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Project Endpoints
  async getProjects(page = 1, limit = 10, featured?: boolean) {
    let query = `?page=${page}&limit=${limit}`;
    if (featured !== undefined) {
      query += `&featured=${featured}`;
    }
    return this.request(`/projects${query}`, {
      method: 'GET',
    });
  }

  async getProjectBySlug(slug: string) {
    return this.request(`/projects/${slug}`, {
      method: 'GET',
    });
  }

  async createProject(
    data: {
      title: string;
      slug: string;
      description: string;
      category: string;
      technologies: string[];
      featured: boolean;
      media?: string;
      links?: { [key: string]: string };
    },
    token: string
  ) {
    return this.request('/projects', {
      method: 'POST',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateProject(
    projectId: string,
    data: Partial<{
      title: string;
      slug: string;
      description: string;
      category: string;
      technologies: string[];
      featured: boolean;
      media?: string;
      links?: { [key: string]: string };
    }>,
    token: string
  ) {
    return this.request(`/projects/${projectId}`, {
      method: 'PATCH',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteProject(projectId: string, token: string) {
    return this.request(`/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Contact Endpoints
  async submitContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    return this.request('/contact', {
      method: 'POST',
      data,
    });
  }

  async getContactMessages(token: string) {
    return this.request('/contact/messages', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async markMessageAsRead(messageId: string, read: boolean, token: string) {
    return this.request(`/contact/messages/${messageId}/read`, {
      method: 'PATCH',
      data: { read },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Health Check
  async healthCheck() {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

export const apiClient = new APIClient();
