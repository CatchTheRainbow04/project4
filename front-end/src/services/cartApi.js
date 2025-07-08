import axios from './axiosClient';

const cartApi = {
  getCart: () => axios.get('/cart'),
  addToCart: (data) => axios.post('/cart/items', data),
  updateQuantity: (id, data) => axios.patch(`/cart/items/${id}`, data),
  removeItem: (id) => axios.delete(`/cart/items/${id}`),
  clearCart: () => axios.delete('/cart'),
  checkout: (data) => axios.post('/cart/checkout', data),
};

export default cartApi;