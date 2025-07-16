import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import categoryApi from "../../services/categoryApi";
import { toast } from "react-toastify";
import "../../styles/admin/categoryTable.css";

function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({});
  const [name, setName] = useState();
  const [parentId, setParentId] = useState();
  const [dropdown, setDropdown] = useState([]);
  const [loadingDropdown, setLoadingDropdown] = useState(true);
  const [loadingForm, setLoadingForm] = useState(!!id);

  useEffect(() => {
    if (id) {
      setLoadingForm(true);
      categoryApi
        .getById(id)
        .then((res) => {
          setInitialData(res.data);
          setName(res.data.name || "");
          setParentId(res.data.parent_id || "");
        })
        .catch(() => {
          toast.error("Lỗi tải danh mục !");
          navigate("/dashboard/categories");
        })
        .finally(() => {
          setLoadingForm(false);
        });
    }
  }, [id, navigate]);

  useEffect(() => {
    setLoadingDropdown(true);
    categoryApi
      .dropdown()
      .then((res) => {
        setDropdown(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setDropdown([]))
      .finally(() => setLoadingDropdown(false));
  }, []);
  // Handle submit action
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData.id) {
        await categoryApi.update(initialData.id, {
          ...initialData,
          name,
          parent_id: parentId || null,
        });
        toast.success("Cập nhật danh mục thành công");
        navigate("/dashboard/categories");
      } else {
        await categoryApi.create({
          name,
          parent_id: parentId || null,
        });
        toast.success("Thêm mới danh mục thành công");
        navigate("/dashboard/categories");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        Object.values(err.response.data.errors).forEach((messages) => {
          messages.forEach((msg) => toast.error(msg));
        });
      } else {
        toast.error("Lưu danh mục thất bại !");
      }
    }
  };
  // Handle delete action
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await categoryApi.delete(id);
      toast.success("Xóa danh mục thành công");
      navigate("/dashboard/categories");
    } catch {
      toast.error("Xóa danh mục thất bại");
    }
  };

  if (loadingForm) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="mb-4 p-8 border w-full max-w-4xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded shadow"
      >
        <div className="mb-4">
          <label className="block mb-1 text-gray-900 dark:text-gray-100">
            Tên danh mục
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Nhập tên danh mục"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-900 dark:text-gray-100">
            Danh mục cha
          </label>
          <select
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={parentId || ""}
            onChange={(e) => setParentId(e.target.value)}
            disabled={loadingDropdown}
          >
            <option value="">-- Không chọn --</option>
            {dropdown
              .filter((cat) => cat.id !== initialData.id)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-blue-400"
          >
            {initialData.id ? "Cập nhật" : "Tạo mới"}
          </button>
          {initialData.id && (
            <button
              type="button"
              onClick={() => handleDelete(initialData.id)}
              className="bg-red-600 dark:bg-red-600 text-gray-100 dark:text-gray-100 px-4 py-2 rounded hover:bg-red-700 dark:hover:bg-red-700 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-gray-400"
            >
              Xóa
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/dashboard/categories")}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-gray-400"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;
