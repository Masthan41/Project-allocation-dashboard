import { api } from './api';

class BatchService {
  async getBatches() {
    const response = await api.get('/batches');
    return response.data;
  }

  async getBatch(id: string) {
    const response = await api.get(`/batches/${id}`);
    return response.data;
  }

  async getMyBatch() {
    const response = await api.get('/batches/my');
    return response.data;
  }

  async updateBatchProgress(id: string, progress: number, status: string) {
    const response = await api.put(`/batches/${id}/progress`, { progress, status });
    return response.data;
  }
}

export const batchService = new BatchService();