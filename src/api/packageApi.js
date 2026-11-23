import api from './axiosInstance';

export const packageApi = {
  getAll: async (params) => {
    // params puede incluir: page, limit, search, categoria, etc.
    const { data } = await api.get('/packages', { params });
    return data; // Devuelve { data: [...], meta: {...} }
  },
  getById: async (id) => {
    const { data } = await api.get(`/packages/${id}`);
    return data.data;
  }
};
