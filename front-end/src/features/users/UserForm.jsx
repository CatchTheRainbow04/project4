import React, { useState, useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import Select from "react-select";

function UserForm({ initialData = {}, onCancel }) {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState(
    initialData.roles
      ? initialData.roles.map((r) => ({ value: r.id, label: r.name }))
      : []
  );

  useEffect(() => {
    axiosClient
      .get("/roles")
      .then((res) => {
        const roleOptions = res.data.map((role) => ({
          value: role.id,
          label: role.name,
        }));
        setRoles(roleOptions);
      })
      .catch(() => alert("Không thể tải danh sách vai trò"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name,
      email,
      roles: selectedRoles.map((r) => r.value),
    };    
    if (password) data.password = password;

    try {
      const res = initialData.id
        ? await axiosClient.put(`/users/${initialData.id}`, data)
        : await axiosClient.post("/users", data);

      if (onCancel) onCancel();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError(error.response.data.errors);
      }
    }
  };

const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa quyền này?")) {
      try {
        await axiosClient.delete(`/users/${id}`);
        if (onCancel) onCancel();
      } catch {
        alert("Xóa thất bại!");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded shadow"
    >
      <h3 className="text-lg font-bold">
        {initialData.id ? "Cập nhật" : "Tạo mới"} người dùng
      </h3>

      <div>
        <label className="block text-sm font-medium">Tên</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <span className="text-red-500 text-sm">
        {error?.name ? error.name[0] : ""}
      </span>
      {error?.message && (
        <div className="text-red-500 text-sm">{error.message}</div>
      )}

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <span className="text-red-500 text-sm">
        {error?.email ? error.email[0] : ""}
      </span>
      {error?.message && (
        <div className="text-red-500 text-sm">{error.message}</div>
      )}

      <div>
        <label className="block text-sm font-medium">
          Mật khẩu{" "}
          {initialData.id && (
            <span className="text-gray-500">(bỏ trống để giữ nguyên)</span>
          )}
        </label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <span className="text-red-500 text-sm">
        {error?.password ? error.password[0] : ""}
      </span>
      {error?.message && (
        <div className="text-red-500 text-sm">{error.message}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Vai trò</label>
        <Select
          isMulti
          options={roles}
          value={selectedRoles}
          onChange={setSelectedRoles}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Lưu
        </button>
        {initialData.id && (<button type="button" onClick={() => handleDelete(initialData.id)} className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-700">Xóa</button>)}
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}

export default UserForm;
