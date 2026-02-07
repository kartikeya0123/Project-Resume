const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Profile endpoints
  async getProfile(userId: string) {
    return this.request(`/profile/profile?userId=${userId}`);
  }

  async updateProfile(userId: string, profileData: any) {
    return this.request('/profile/profile', {
      method: 'PUT',
      body: JSON.stringify({ userId, profileData }),
    });
  }

  // Resume endpoints
  async getResumes(userId: string) {
    return this.request(`/resume/?userId=${userId}`);
  }

  async createResume(userId: string, title: string, content: any) {
    return this.request('/resume/', {
      method: 'POST',
      body: JSON.stringify({ userId, title, content }),
    });
  }

  async updateResume(id: string, data: any) {
    return this.request(`/resume/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResume(id: string) {
    return this.request(`/resume/${id}`, {
      method: 'DELETE',
    });
  }

  // Career endpoints
  async getCareerRecommendations(userId: string) {
    return this.request(`/career/recommendations?userId=${userId}`);
  }

  async generateCareerRecommendations(userId: string, profileData: any) {
    return this.request('/career/recommendations', {
      method: 'POST',
      body: JSON.stringify({ userId, profileData }),
    });
  }

  async getSkillGaps(userId: string) {
    return this.request(`/career/skill-gaps?userId=${userId}`);
  }

  // Roadmap endpoints
  async getRoadmaps(userId: string) {
    return this.request(`/roadmap/?userId=${userId}`);
  }

  async createRoadmap(userId: string, title: string, targetRole?: string, description?: string) {
    return this.request('/roadmap/', {
      method: 'POST',
      body: JSON.stringify({ userId, title, targetRole, description }),
    });
  }

  async getRoadmapItems(id: string) {
    return this.request(`/roadmap/${id}/items`);
  }

  async addRoadmapItems(id: string, items: any[]) {
    return this.request(`/roadmap/${id}/items`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }

  async updateRoadmapItem(itemId: string, isCompleted: boolean) {
    return this.request(`/roadmap/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ is_completed: isCompleted }),
    });
  }

  // Auth endpoints
  async verifyToken(token: string) {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }
}

export const apiService = new ApiService();
