import axiosClient from "./axiosClient";

const categoryApi = {
    getAll: (params) => {
    return axiosClient.get('/categories', { params });
  },

  getById: (id) => {
    return axiosClient.get(`/categories/${id}`);
  },

  create: (data) => {
    return axiosClient.post('/categories', data);
  },

  update: (id, data) => {
    return axiosClient.put(`/categories/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/categories/${id}`);
  },
  
  tree : (params) => {
    return axiosClient.get('/categories-tree', { params });
  },
  dropdown : () =>{
    return axiosClient.get("/categories-dropdown");
  },
  findBySlug: (slug) => {
  return axiosClient.get(`/categories/slug/${slug}`);
}
}

export default categoryApi;