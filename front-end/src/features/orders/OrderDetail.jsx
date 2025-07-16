import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";
import {formatPriceVND} from "../../utils/Utils";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Không thể tải đơn hàng.");
        navigate("/dashboard/orders");
      });
  }, [id, navigate]);
  console.log(order);

  if (loading) return <div className="text-center mt-8">Đang tải đơn hàng...</div>;

  if (!order) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow rounded">
    <Link to={`/dashboard/users/detail/${order.user_id}`} className="text-blue-600 hover:underline mb-4 inline-block hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
      Quay lại chi tiết người dùng
    </Link>
      <h2 className="text-xl font-bold mb-4 dark:text-white">Chi tiết đơn hàng #{order.id}</h2>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 mb-6">
        <div><strong>Khách hàng:</strong> {order.customer_name}</div>
        <div><strong>Email:</strong> {order.customer_email}</div>
        <div><strong>SĐT:</strong> {order.customer_phone}</div>
        <div><strong>Địa chỉ:</strong> {order.shipping_address}</div>
        <div><strong>Trạng thái đơn:</strong> {order.order_status}</div>
        <div><strong>Thanh toán:</strong> {order.payment_status}</div>
        <div><strong>Phương thức:</strong> {order.payment_method}</div>
        <div><strong>Ghi chú:</strong> {order.note || "Không có"}</div>
        <div><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}</div>
        <div><strong>Tổng tiền:</strong> {formatPriceVND(order.total_price)}</div>
      </div>

      <h3 className="text-lg font-semibold mb-2 dark:text-white">Sản phẩm</h3>
      {order.items?.length > 0 ? (
        <table className="min-w-full table-auto border text-sm dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Tên sản phẩm</th>
                            <th className="px-3 py-2 text-left">Số lượng</th>
              <th className="px-3 py-2 text-left">Giá</th>

              <th className="px-3 py-2 text-left">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-t dark:border-gray-600">
                <td className="px-3 py-2">{item.product.name}</td>
                
                <td className="px-3 py-2">{item.quantity}</td>
                <td className="px-3 py-2">{formatPriceVND(item.product.price)}</td>
                <td className="px-3 py-2">
                  {formatPriceVND(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-sm text-gray-500">Không có sản phẩm nào trong đơn hàng này.</div>
      )}
    </div>
  );
}

export default OrderDetail;
