import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../../services/axiosClient";
import '../../styles/admin/permissionTable.css';

function PermissionsTable({ onEditPermission }) {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = () => {
    setLoading(true);
    axiosClient
      .get("/permissions")
      .then((res) => {
        setPermissions(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setPermissions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPermissions();
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
    <div>
      <h2 className="text-2xl font-bold mb-4">Danh sách quyền hạn</h2>
      {loading ? (
        <p>Đang tải...</p>
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
                    Tên quyền
                  </th>
                  <th className="border px-4 py-2 sticky top-0 bg-gray-50 dark:bg-gray-700">
                    Tên hiển thị
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissions.length > 0 ? (
                  permissions.map((permission) => (
                    <motion.tr
                      key={permission.id}
                      variants={itemVariants}
                      onClick={() => onEditPermission(permission)}
                      className={`${
                        permission.parent_id === null ? "font-bold" : " "
                      } hover:bg-blue-100 dark:hover:bg-gray-800 cursor-pointer`}
                    >
                      <td className="border text-gray-500 dark:text-white px-4 py-2">
                        {permission.id}
                      </td>
                      <td className="border text-gray-500 dark:text-white px-4 py-2">
                        {permission.name}
                      </td>
                      <td className="border text-gray-500 dark:text-white px-4 py-2">
                        {permission.display_name}
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
  );
}

export default PermissionsTable;