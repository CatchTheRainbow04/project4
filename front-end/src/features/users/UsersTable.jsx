import React, { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function UsersTable() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    axiosClient
      .get("/users")
      .then((res) => setUsers(res.data.data || res.data))
      .catch(() => alert("Lỗi khi tải danh sách người dùng"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>
        {loading ? (
          <div className="h-full w-full flex justify-center items-center">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto h-[300px] hide-scrollbar">
            <AnimatePresence>
              <motion.table
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="table-auto w-full dark:text-gray-300"
              >
                <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
                  <tr className="text-black dark:text-white">
                    <th className="border px-4 py-2 sticky top-0 bg-gray-50 dark:bg-gray-700">
                      ID
                    </th>
                    <th className="border px-4 py-2 sticky top-0 bg-gray-50 dark:bg-gray-700">
                      Tên
                    </th>
                    <th className="border px-4 py-2 sticky top-0 bg-gray-50 dark:bg-gray-700">
                      Email
                    </th>
                    <th className="border px-4 py-2 sticky top-0 bg-gray-50 dark:bg-gray-700">
                      Quyền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <motion.tr
                        key={user.id}
                        variants={itemVariants}
                        onClick={() =>
                          navigate(`/dashboard/users/detail/${user.id}`)
                        }
                        className="hover:bg-blue-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <td className="border text-gray-500 dark:text-white px-4 py-2">
                          {user.id}
                        </td>
                        <td className="border text-gray-500 dark:text-white px-4 py-2">
                          {user.name}
                        </td>
                        <td className="border text-gray-500 dark:text-white px-4 py-2">
                          {user.email}
                        </td>
                        <td className="border text-gray-500 dark:text-white px-4 py-2">
                          {user.roles?.map((r) => r.name).join(", ") || "—"}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </motion.table>
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}

export default UsersTable;
