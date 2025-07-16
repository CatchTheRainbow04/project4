import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";
import categoryApi from "../../services/categoryApi";
import { toast } from "react-toastify";

function CategoriesTable() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const { value } = e.target;
    debouncedSearch(value);
  };

  const fetchCategories = () => {
    setLoading(true);
    categoryApi
      .getAll()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
          setFilteredCategories(res.data);
        } else if (Array.isArray(res.data.data)) {
          setCategories(res.data.data);
          setFilteredCategories(res.data.data);
        } else {
          setCategories([]);
          setFilteredCategories([]);
        }
      })
      .catch(() => toast.error("Lỗi tải danh mục !"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search
  useEffect(() => {
    if (search) {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [search, categories]);

  // Hàm tạo class động cho hàng
  const getRowClassName = (category) => {
    const isEvenId = category.id % 2 === 0;
    return `cursor-pointer transition ${
      isEvenId ? "bg-gray-50 dark:bg-gray-700/30" : "bg-white dark:bg-gray-800"
    } hover:bg-blue-50 dark:hover:bg-blue-900/20`;
  };

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

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Danh sách danh mục
        </h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <svg
            className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto overflow-y-auto h-[300px] hide-scrollbar">
          <AnimatePresence>
            <motion.table
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="table-auto w-full dark:text-gray-300"
            >
              <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
                <tr>
                  <th className="p-2 sticky top-0 bg-gray-50 dark:bg-gray-700">
                    <div className="font-semibold text-left z-100">
                      Tên danh mục
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-blue-400">
                      Đang tải...
                    </td>
                  </tr>
                ) : Array.isArray(filteredCategories) &&
                  filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <motion.tr
                      key={cat.id}
                      variants={itemVariants}
                      onClick={() =>
                        navigate(`/dashboard/categories/edit/${cat.id}`)
                      }
                      className={getRowClassName(cat)}
                    >
                      <td
                        className={`p-2 ${
                          cat.parent_id === null ? "font-bold" : ""
                        }`}
                      >
                        {cat.name}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={3} className="text-center py-8 text-blue-400">
                      Không tìm thấy danh mục
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </motion.table>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default CategoriesTable;
