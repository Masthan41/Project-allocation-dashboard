import { api } from './api';

class AuthService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(name: string, email: string, password: string, role: string) {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  }

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(profile: any) {
    const response = await api.put('/auth/profile', { profile });
    return response.data;
  }
}

export const authService = new AuthService();