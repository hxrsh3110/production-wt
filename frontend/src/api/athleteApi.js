import API from './client';

export const athleteApi = {
  getAll: (params) => API.get('/athletes', { params }),
  getById: (id) => API.get(`/athletes/${id}`),
  create: (data) => API.post('/athletes', data),
  update: (id, data) => API.put(`/athletes/${id}`, data),
  delete: (id) => API.delete(`/athletes/${id}`),
  getStats: () => API.get('/athletes/stats/overview')
};

export default athleteApi;
