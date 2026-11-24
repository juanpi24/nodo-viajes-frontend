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
  }
};
