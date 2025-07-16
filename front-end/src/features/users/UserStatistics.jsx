import { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";

function UserStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/users-statistics")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thống kê người dùng", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-lg">Đang tải thống kê...</div>;
  if (!stats) return <div className="p-4 text-red-500">Không thể tải dữ liệu</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Thống kê người dùng</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base text-gray-700 dark:text-gray-300">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <strong>Tổng số người dùng:</strong> {stats.total_users}
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <strong>Người dùng mới hôm nay:</strong> {stats.new_users_today}
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <strong>Người dùng mới tháng này:</strong> {stats.new_users_this_month}
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4 dark:text-white">Người dùng theo vai trò</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.users_by_role.map(role => (
          <div key={role.id} className="p-4 bg-blue-50 dark:bg-gray-700 rounded shadow text-gray-800 dark:text-gray-200">
            <strong>{role.name}</strong>: {role.users_count}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserStatistics;
