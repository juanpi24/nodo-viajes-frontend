import api from './axiosInstance';

export const orderApi = {
  // Crea la orden en el backend y devuelve el link de MP
  create: async (items) => {
    const { data } = await api.post('/orders', { items });
    return data; // { orderId, init_point }
  },
  // Verifica el estado del pago cuando MP redirige de vuelta
  verify: async (orderId, paymentId) => {
    const { data } = await api.get(`/orders/${orderId}/verify?payment_id=${paymentId}`);
    return data.data;
  }
};