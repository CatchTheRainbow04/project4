import React, { useState, useEffect } from "react";
import axiosClient from "../../services/axiosClient";

function PermissionForm({ initialData = {}, onCancel }) {
  const [name, setName] = useState(initialData.name || "");
  const [displayName, setDisplayName] = useState(
    initialData.display_name || ""
  );
  const [keyCode, setKeyCode] = useState(initialData.key_code || "");
  const [parentId, setParentId] = useState(initialData.parent_id || "");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/parent-permissions")
      .then((res) => {
        setPermissions(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setPermissions([]));
  }, []);

  useEffect(() => {
    setName(initialData.name || "");
    setDisplayName(initialData.display_name || "");
    setKeyCode(initialData.key_code || "");
    setParentId(initialData.parent_id || "");
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name,
        display_name: displayName,
        key_code: keyCode,
        parent_id: parentId || null,
      };

      if (initialData.id) {
        await axiosClient.put(`/permissions/${initialData.id}`, data);
      } else {
        await axiosClient.post("/permissions", data);
      }

      if(onCancel) onCancel();
    } catch (err) {
      if (err.response?.data?.errors) {
        alert(Object.values(err.response.data.errors).join("\n"));
      } else {
        alert("Lưu quyền hạn thất bại!");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa quyền này?")) {
      try {
        await axiosClient.delete(`/permissions/${id}`);
        if (onCancel) onCancel();
      } catch {
        alert("Xóa thất bại!");
      }
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
            Tên quyền
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: view_post"
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            required
          />
          <small className="text-gray-500 dark:text-gray-400">
            Tên định danh duy nhất của quyền
          </small>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-900 dark:text-gray-100">
            Tên hiển thị
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ví dụ: Xem bài viết"
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-900 dark:text-gray-100">
            Key Code
          </label>
          <input
            type="text"
            value={keyCode}
            onChange={(e) => setKeyCode(e.target.value)}
            placeholder="Ví dụ: POST_VIEW"
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            required
          />
          <small className="text-gray-500 dark:text-gray-400">
            Mã định danh duy nhất cho quyền này
          </small>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-900 dark:text-gray-100">
            Quyền cha
          </label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">-- Không có quyền cha --</option>
            {permissions
              .filter((p) => p.id !== initialData.id)
              .map((permission) => (
                <option key={permission.id} value={permission.id}>
                  {permission.display_name || permission.name}
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
            onClick={onCancel}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-gray-400"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default PermissionForm;
