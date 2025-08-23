import { api } from './api';

class ApplicationService {
  async createApplication(applicationData: any) {
    const response = await api.post('/applications', applicationData);
    return response.data;
  }

  async getMyApplications() {
    const response = await api.get('/applications/my');
    return response.data;
  }

  async getAllApplications(status?: string, project?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (project) params.append('project', project);
    
    const response = await api.get(`/applications/all?${params.toString()}`);
    return response.data;
  }

  async reviewApplication(id: string, reviewData: any) {
    const response = await api.put(`/applications/${id}/review`, reviewData);
    return response.data;
  }
}

export const applicationService = new ApplicationService();