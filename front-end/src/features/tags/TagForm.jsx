import React, { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";

function TagForm({ initialData = {}, onCancel }) {
  const [name, setName] = useState(initialData.name || "");

  useEffect(() => {
    setName(initialData.name || "");
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData.id) {
        await axiosClient.put(`/tags/${initialData.id}`, { name });
        toast.success("Cập nhật tag thành công");
      } else {
        await axiosClient.post("/tags", { name });
        toast.success("Thêm tag thành công");
      }
      if (onCancel) onCancel();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        Object.values(err.response.data.errors).forEach((messages) => {
          messages.forEach((msg) => toast.error(msg));
        });
      } else {
        toast.error("Lưu tag thất bại!");
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa tag này?")) return;
    try {
      await axiosClient.delete(`/tags/${initialData.id}`);
      toast.success("Xoá tag thành công");
      if (onCancel) onCancel();
    } catch {
      toast.error("Xoá tag thất bại");
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="mb-4 p-8 border w-full max-w-4xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded shadow"
      >
        <div className="mb-4">
          <label className="block mb-1 text-gray-900 dark:text-gray-100">
            Tên Tag
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Nhập tên tag"
            required
          />
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
              onClick={handleDelete}
              className="bg-red-600 dark:bg-red-600 text-gray-100 dark:text-gray-100 px-4 py-2 rounded hover:bg-red-700 dark:hover:bg-red-700 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-gray-400"
            >
              Xóa
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-gray-400"
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
}

export default TagForm;
