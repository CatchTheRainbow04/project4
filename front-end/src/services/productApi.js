import axiosClient from "./axiosClient";

const productApi = {
  getAll: (params) => {
    return axiosClient.get(`/products/?q=${params}`);
  },

  getById: (id) => {
    return axiosClient.get(`/products/${id}`);
  },

  create: (data) => {
    return axiosClient.post('/products', data);
  },

  update: (id, data) => {
    return axiosClient.post(`/products/${id}?_method=PUT`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/products/${id}`);
  },

  getProductsByCategory: (id, page = 1) => {
  return axiosClient.get(`/products-by-category/${id}`, {
    params: { page }
  });
}
}

export default productApi;