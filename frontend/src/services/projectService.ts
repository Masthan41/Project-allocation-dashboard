import { api } from './api';

class ProjectService {
  async getProjects(status = 'active') {
    const response = await api.get(`/projects?status=${status}`);
    return response.data;
  }

  async getProject(id: string) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(projectData: any) {
    const response = await api.post('/projects', projectData);
    return response.data;
  }

  async updateProject(id: string, projectData: any) {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  }

  async deleteProject(id: string) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
}

export const projectService = new ProjectService();