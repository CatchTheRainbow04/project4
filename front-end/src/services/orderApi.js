import axiosClient from "./axiosClient";

const orderApi = {
  // Lấy danh sách đơn hàng (admin)
  getAll: (params) => axiosClient.get("/orders", { params }),

  // Lấy danh sách đơn hàng của người dùng hiện tại với full params
  getByUser: (params) => axiosClient.get("/myOrders", { params }),

  // Lấy chi tiết 1 đơn hàng theo ID
  getById: (id) => axiosClient.get(`/orders/${id}`),

  // Cập nhật trạng thái đơn hàng
  updateStatus: (id, data) =>
    axiosClient.put(`/orders/${id}/status`, data),

  // Lấy thống kê đơn hàng
  getStatistics: (params) => axiosClient.get("/orders-statistics", { params }),

  // Mua ngay
  buyNow: (data) => axiosClient.post('/buy-now', data),

  // Hủy đơn hàng (nếu cần)
  cancel: (id, reason) => 
    axiosClient.put(`/orders/${id}/cancel`, { reason }),

  // Tìm kiếm đơn hàng
  search: (params) => axiosClient.get("/orders/search", { params }),
};

export default orderApi;