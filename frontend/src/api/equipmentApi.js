import API from './client';

export const equipmentApi = {
  getAll: (params) => API.get('/equipment', { params }),
  getById: (id) => API.get(`/equipment/${id}`),
  create: (data) => API.post('/equipment', data),
  update: (id, data) => API.put(`/equipment/${id}`, data),
  delete: (id) => API.delete(`/equipment/${id}`)
};

export default equipmentApi;
