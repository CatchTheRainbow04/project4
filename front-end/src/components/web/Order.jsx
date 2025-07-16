import "../../styles/user/css/Order.css";
import { Link, useNavigate } from "react-router-dom";
import useRequireAuth from "../../hooks/useRequireAuth";
import orderApi from "../../services/orderApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatPriceVND } from "../../utils/Utils";

function Order() {
  const isAuthenticated = useRequireAuth(
    "/signin",
    "Vui lòng đăng nhập để xem đơn hàng"
  );
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    from_date: "",
    to_date: "",
    per_page: 10,
    sort_field: "created_at",
    sort_direction: "desc",
  });

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "processing", label: "Đang xử lý" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const perPageOptions = [5, 10, 15, 20];

  const sortOptions = [
    { value: "created_at", label: "Ngày tạo" },
    { value: "total_price", label: "Tổng tiền" },
    { value: "order_status", label: "Trạng thái" },
  ];

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null) {
          delete params[key];
        }
      });

      const res = await orderApi.getByUser(params);
      setOrders(res.data.data);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        per_page: res.data.per_page,
        total: res.data.total,
      });
    } catch (error) {
      toast.error("Lỗi khi tải đơn hàng!");
      navigate("/not-found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    fetchOrders(1);
  };

  const handleResetFilters = () => {
    setFilters({
      status: "",
      from_date: "",
      to_date: "",
      per_page: 10,
      sort_field: "created_at",
      sort_direction: "desc",
    });
    // Reset and fetch
    setTimeout(() => {
      fetchOrders(1);
    }, 100);
  };

  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  const handleSortChange = (field) => {
    const direction =
      filters.sort_field === field && filters.sort_direction === "asc"
        ? "desc"
        : "asc";
    setFilters((prev) => ({
      ...prev,
      sort_field: field,
      sort_direction: direction,
    }));
    // Auto apply sort
    setTimeout(() => {
      fetchOrders(1);
    }, 100);
  };

  const formatStatus = (status) => {
    const statusMap = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const renderPagination = () => {
    const { current_page, last_page } = pagination;
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(last_page, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(current_page - 1)}
          disabled={current_page === 1}
          className="pagination-btn"
        >
          « Trước
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-btn ${
              page === current_page ? "active" : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="pagination-btn"
        >
          Sau »
        </button>
      </div>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <div className="account-order-container">
      <div className="orders">
        <h2>ĐƠN HÀNG</h2>

        {/* Filter Section */}
        <div className="order-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Trạng thái:</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Từ ngày:</label>
              <input
                type="date"
                value={filters.from_date}
                onChange={(e) =>
                  handleFilterChange("from_date", e.target.value)
                }
              />
            </div>

            <div className="filter-group">
              <label>Đến ngày:</label>
              <input
                type="date"
                value={filters.to_date}
                onChange={(e) => handleFilterChange("to_date", e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Hiển thị:</label>
              <select
                value={filters.per_page}
                onChange={(e) =>
                  handleFilterChange("per_page", parseInt(e.target.value))
                }
              >
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} đơn/trang
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={handleApplyFilters} className="btn-apply">
              Áp dụng
            </button>
            <button onClick={handleResetFilters} className="btn-reset">
              Đặt lại
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-table-container">
          <table>
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Thông tin đơn hàng</th>
                <th
                  className="sortable"
                  onClick={() => handleSortChange("order_status")}
                >
                  Trạng thái
                  {filters.sort_field === "order_status" && (
                    <span className="sort-indicator">
                      {filters.sort_direction === "asc" ? " ↑" : " ↓"}
                    </span>
                  )}
                </th>
                <th>Sản phẩm</th>
                <th
                  className="sortable"
                  onClick={() => handleSortChange("total_price")}
                >
                  Thành tiền
                  {filters.sort_field === "total_price" && (
                    <span className="sort-indicator">
                      {filters.sort_direction === "asc" ? " ↑" : " ↓"}
                    </span>
                  )}
                </th>
                <th
                  className="sortable"
                  onClick={() => handleSortChange("created_at")}
                >
                  Ngày tạo
                  {filters.sort_field === "created_at" && (
                    <span className="sort-indicator">
                      {filters.sort_direction === "asc" ? " ↑" : " ↓"}
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-order">
                    Đang tải đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-order">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders
                  .filter((order) => order.items.every((item) => item.product))
                  .map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      <td>
                        <strong>#{order.id}</strong>
                      </td>
                      <td>
                        <div className="order-info">
                          <strong>{order.customer_name}</strong>
                          <small>{order.customer_phone}</small>
                          <small>{order.shipping_address}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`status status-${order.order_status}`}>
                          {formatStatus(order.order_status)}
                        </span>
                      </td>
                      <td>
                        <div className="order-info">
                          {order.items.map((item) => (
                            <div key={item.id}>
                              <small>
                                {item.product?.name || "Sản phẩm bị xóa"} -{" "}
                                {formatPriceVND(item.price)} x {item.quantity}
                              </small>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong>{formatPriceVND(order.total_price)}</strong>
                      </td>
                      <td>
                        <small>
                          {new Date(order.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </small>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Hiển thị {orders.length} trong tổng số {pagination.total} đơn hàng
            </div>
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
}

export default Order;
