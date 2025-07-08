import "../../styles/user/css/Order.css";
import { Link } from "react-router-dom";
import useRequireAuth from "../../hooks/useRequireAuth";
import orderApi from "../../services/orderApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Order() {
  const isAuthenticated = useRequireAuth("/signin", "Vui lòng đăng nhập để xem đơn hàng");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const res = await orderApi.getAll();
          setOrders(res.data.data);
        } catch (error) {
          toast.error("Lỗi khi tải đơn hàng!");
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) return null;

  return (
    <div className="account-order-container">
      <div className="orders">
        <h2>ĐƠN HÀNG</h2>
        <table>
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Thông tin đơn hàng</th>
              <th>Trạng thái</th>
              <th>Sản phẩm</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty-order">
                  Đang tải đơn hàng...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-order">
                  Bạn chưa có đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                  <div className="order-info"><strong>{order.customer_name}</strong>
                    <small>{order.customer_phone}</small>
                    <small>{order.shipping_address}</small></div>
                    
                  </td>
                  <td>{order.order_status}</td>
                  <td>
                  <div className="order-info">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        <small>{item.product?.name || "Sản phẩm bị xóa"} x {item.quantity}</small>
                      </div>
                    ))}
                  </div>
                  </td>
                  <td>
                    <strong>{order.total_price}đ</strong>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="account-sidebar">
        <h2>Tài khoản</h2>
        <ul>
          <li>
            <Link to="/profile">Thông tin tài khoản</Link>
          </li>
          <li>
            <Link to="/cart">Giỏ hàng</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Order;
