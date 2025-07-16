import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";
import { formatPriceVND } from "../../utils/Utils";

function UserOrderDetail() {
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

  if (loading) return <div className="text-center mt-10 text-lg font-medium">Đang tải đơn hàng...</div>;
  if (!order) return null;

return (
  <div className="p-6 max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl">


    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
      {/* LEFT: Thông tin đơn hàng */}
      <div className="text-base text-gray-700 dark:text-gray-300 space-y-4">
          <Link
      to={`/order`}
      className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300 text-base mb-6 inline-block"
    >
      ← Quay lại danh sách đơn hàng
    </Link>

    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
      Chi tiết đơn hàng #{order.id}
    </h2>
        <div><span className="font-semibold">Khách hàng:</span> {order.customer_name}</div>
        <div><span className="font-semibold">Email:</span> {order.customer_email}</div>
        <div><span className="font-semibold">SĐT:</span> {order.customer_phone}</div>
        <div><span className="font-semibold">Địa chỉ:</span> {order.shipping_address}</div>
        <div><span className="font-semibold">Trạng thái đơn:</span> {order.order_status}</div>
        <div><span className="font-semibold">Thanh toán:</span> {order.payment_status}</div>
        <div><span className="font-semibold">Phương thức:</span> {order.payment_method}</div>
        <div><span className="font-semibold">Ghi chú:</span> {order.note || "Không có"}</div>
        <div><span className="font-semibold">Ngày đặt:</span> {new Date(order.created_at).toLocaleString()}</div>
        <div><span className="font-semibold">Tổng tiền:</span> {formatPriceVND(order.total_price)}</div>
      </div>

      {/* RIGHT: Danh sách sản phẩm */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Sản phẩm
        </h3>
        {order.items?.length > 0 ? (
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] border rounded-md dark:border-gray-600">
            <table className="min-w-full text-base table-auto">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left">Tên sản phẩm</th>
                  <th className="px-4 py-3 text-left">Số lượng</th>
                  <th className="px-4 py-3 text-left">Giá</th>
                  <th className="px-4 py-3 text-left">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">{item.product?.name}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">{formatPriceVND(item.product?.price)}</td>
                    <td className="px-4 py-3">{formatPriceVND(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-base text-gray-500 dark:text-gray-400">
            Không có sản phẩm nào trong đơn hàng này.
          </div>
        )}
      </div>
    </div>
  </div>
);

}

export default UserOrderDetail;
