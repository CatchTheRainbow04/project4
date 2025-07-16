import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          toast.error("Bạn không có quyền xem người dùng này.");
        } else {
          toast.error("Lỗi khi tải thông tin người dùng.");
        }
        setError("Không thể tải dữ liệu người dùng.");
        setLoading(false);
        navigate("/dashboard/users");
      });
  }, [id, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-8">
        {error}
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow rounded">
    <Link to="/dashboard/users" className="text-blue-600 hover:underline mb-4 inline-block hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
      Quay lại danh sách người dùng
    </Link>
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Thông tin người dùng</h2>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-700 dark:text-gray-300">
        <div><strong>Họ tên:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}</div>
        <div><strong>Ngày sinh:</strong> {user.birthday || "Chưa cập nhật"}</div>
        <div><strong>Địa chỉ:</strong> {`${user.address_detail || ""}, ${user.ward || ""}, ${user.district || ""}, ${user.province || ""}`}</div>
        <div><strong>Thời gian tạo:</strong> {new Date(user.created_at).toLocaleString()}</div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold dark:text-white">Vai trò</h3>
        {user.roles.length > 0 ? (
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
            {user.roles.map((role) => (
              <li key={role.id}>
                <strong>{role.display_name}</strong> ({role.name})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Không có vai trò nào.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 dark:text-white">Đơn hàng gần đây</h3>
        {user.orders.length > 0 ? (
          <table className="min-w-full table-auto border dark:border-gray-600 text-sm text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-left">Mã</th>
                <th className="px-3 py-2 text-left">Trạng thái</th>
                <th className="px-3 py-2 text-left">Thanh toán</th>
                <th className="px-3 py-2 text-left">Tổng tiền</th>
                <th className="px-3 py-2 text-left">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {user.orders.map((order) => (
                <tr onClick={()=> navigate(`/dashboard/orders/${order.id}`)} key={order.id} className="border-t dark:border-gray-600">
                  <td className="px-3 py-2">{order.id}</td>
                  <td className="px-3 py-2">{order.order_status}</td>
                  <td className="px-3 py-2">{order.payment_status}</td>
                  <td className="px-3 py-2">{Number(order.total_price).toLocaleString()}₫</td>
                  <td className="px-3 py-2">{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-500">Chưa có đơn hàng nào.</p>
        )}
      </div>
      <button
        onClick={() => navigate(`/dashboard/users/edit/${user.id}`)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
        Chỉnh sửa người dùng
      </button>
    </div>
  );
}

export default UserDetail;
