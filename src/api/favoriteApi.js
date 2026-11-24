import api from './axiosInstance';

export const favoriteApi = {
  getAll: async () => {
    const { data } = await api.get('/favorites');
    return data.data; // Array de objetos de paquetes
  },
  add: async (packageId) => {
    const { data } = await api.post(`/favorites/${packageId}`);
    return data;
  },
  remove: async (packageId) => {
    const { data } = await api.delete(`/favorites/${packageId}`);
    return data;
  }
};
