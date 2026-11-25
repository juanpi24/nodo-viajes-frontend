import api from './axiosInstance';

export const packageApi = {
  getAll: async (params) => {
    const { data } = await api.get('/packages', { params });
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/packages/${id}`);
    return data.data;
  },
  getWeather: async (id) => {
    const { data } = await api.get(`/packages/${id}/weather`);
    return data;
  },
  create: async (pkg) => {
    const { data } = await api.post('/packages', pkg);
    return data.data;
  },
  update: async (id, pkg) => {
    const { data } = await api.put(`/packages/${id}`, pkg);
    return data.data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/packages/${id}`);
    return data;
  },
  importFromApi: async () => {
    const { data } = await api.post('/packages/import');
    return data;
  },
};
