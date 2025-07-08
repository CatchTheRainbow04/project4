import axiosClient from "./axiosClient";

const orderApi = {
  // Lấy danh sách đơn hàng
  getAll: () => axiosClient.get("/orders"),

  // Lấy chi tiết 1 đơn hàng theo ID
  getById: (id) => axiosClient.get(`/orders/${id}`),

  // Cập nhật trạng thái đơn hàng
  updateStatus: (id, status) =>
    axiosClient.put(`/orders/${id}/status`, { status }),

  // Lấy thống kê đơn hàng
  getStatistics: () => axiosClient.get("/orders-statistics"),
  // Mua ngay
  buyNow: (data) => axiosClient.post('/buy-now', data),
};

export default orderApi;