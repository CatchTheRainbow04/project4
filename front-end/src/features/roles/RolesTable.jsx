import React, { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function RolesTable() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = () => {
    setLoading(true);
    axiosClient
      .get("/roles")
      .then((res) => {
        setRoles(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setRoles([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Animation variants
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

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <h2 className="text-2xl font-bold mb-4">Danh sách vai trò</h2>
      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="table-wrapper mx-4">
          <div className="table-responsive">
            <AnimatePresence>
              <motion.table
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="table-auto w-full dark:text-gray-300"
              >
                <thead>
                  <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Tên vai trò</th>
                    <th className="border px-4 py-2">Mô tả</th>
                    <th className="border px-4 py-2">Thông tin</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <motion.tr
                        key={role.id}
                        variants={itemVariants}
                        onClick={() => navigate(`/dashboard/roles/edit/${role.id}`)}
                        className="cursor-pointer hover:bg-gray-600 hover:text-white"
                      >
                        <td className="border px-4 py-2">{role.id}</td>
                        <td className="border px-4 py-2">{role.name}</td>
                        <td className="border px-4 py-2">
                          {role.display_name}
                        </td>
                        <td className="border px-4 py-2">
                          {role.users.length} người dùng,{" "}
                          {role.permissions.length} quyền
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
        </div>
      )}
    </div>
  );
}

export default RolesTable;
