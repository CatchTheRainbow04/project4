import React, { useState, useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";

function RoleForm({ initialData = {}, onCancel }) {
  const [name, setName] = useState(initialData.name || "");
  const [displayName, setDisplayName] = useState(
    initialData.display_name || ""
  );
  const [selectedPermissions, setSelectedPermissions] = useState(
    initialData.permissions?.map((p) => p.id) || []
  );
  const [selectedUsers, setSelectedUsers] = useState(
    initialData.users?.map((u) => u.id) || []
  );
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchUser, setSearchUser] = useState("");
  const [searchPermission, setSearchPermission] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const [permissionsRes, usersRes] = await Promise.all([
          axiosClient.get("/permissions"),
          axiosClient.get("/users"),
        ]);
        // Handle Laravel API response structure
        const permissionsData =
          permissionsRes.data.data || permissionsRes.data || [];
        const usersData = usersRes.data.data || usersRes.data || [];

        setPermissions(Array.isArray(permissionsData) ? permissionsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Không thể tải dữ liệu. Vui lòng thử lại sau."
        );
        setPermissions([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setName(initialData.name || "");
    setDisplayName(initialData.display_name || "");
    setSelectedPermissions(initialData.permissions?.map((p) => p.id) || []);
    setSelectedUsers(initialData.users?.map((u) => u.id) || []);
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name,
        display_name: displayName,
      };

      let roleId;
      if (initialData.id) {
        await axiosClient.put(`/roles/${initialData.id}`, data);
        roleId = initialData.id;
        toast.success("Cập nhật vai trò thành công!");
        if (onCancel) onCancel();
      } else {
        const response = await axiosClient.post("/roles", data);
        roleId = response.data.id;
        toast.success("Tạo vai trò mới thành công!");
        if (onCancel) onCancel();
      }

      // Sync permissions
      await axiosClient.post(`/roles/${roleId}/permissions`, {
        permissions: selectedPermissions,
      });
      toast.success("Cập nhật quyền hạn cho vai trò thành công!");

      // Sync users
      await axiosClient.post(`/roles/${roleId}/users`, {
        users: selectedUsers,
      });
      toast.success("Cập nhật vai trò cho người dùng thành công!");
      if (onCancel) onCancel();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        Object.values(err.response.data.errors).forEach((messages) => {
          messages.forEach((msg) => toast.error(msg));
        });
      } else {
        toast.error("Lưu vai trò thất bại!");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa vai trò này?")) {
      try {
        await axiosClient.delete(`/roles/${id}`);
        fetchRoles();
      } catch {
        alert("Xóa thất bại!");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(searchPermission.toLowerCase()) ||
      permission.display_name
        .toLowerCase()
        .includes(searchPermission.toLowerCase())
  );

  const handleSelectAllPermissions = (checked) => {
    setSelectedPermissions(checked ? permissions.map((p) => p.id) : []);
  };

  const handleSelectAllUsers = (checked) => {
    setSelectedUsers(checked ? users.map((u) => u.id) : []);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="p-10 rounded border w-full shadow-2xl text-white max-h-[950px] dark:bg-gray-800"
      >
        <h1 className="text-lg font-semibold text-black dark:text-white mb-5">
          Thông tin vai trò
        </h1>

        <div className="grid grid-cols-10 grid-rows-8 gap-4">
          <div className="col-span-5 flex flex-col items-start">
            <label className="block mb-1 text-black dark:text-white">
              Tên vai trò
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md bg-white text-black placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="col-span-5 col-start-1 row-start-5 flex items-end">
            <div className="col-span-5 col-start-1 row-start-5 flex flex-col w-full">
              <label className="text-black dark:text-white">Mô tả</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2 border rounded-md bg-white text-black placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="col-span-5 col-start-6 row-start-1">
            <div className="flex justify-between w-full">
              <span className="block mb-1 text-black dark:text-white">
                Quyền hạn
              </span>
              <label className="text-black dark:text-white">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedPermissions.length === permissions.length}
                  onChange={(e) => handleSelectAllPermissions(e.target.checked)}
                />
                Chọn tất cả
              </label>
            </div>

            <input
              type="text"
              placeholder="Tìm quyền..."
              value={searchPermission}
              onChange={(e) => setSearchPermission(e.target.value)}
              className="w-full p-2 border rounded-md mb-2 bg-white text-black placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-5 row-span-3 col-start-6 row-start-2">
            {" "}
            <div className=" rounded-md h-48 overflow-y-auto bg-white dark:bg-gray-900 p-2">
              {filteredPermissions.length === 0 ? (
                <div className="text-center py-4text-gray-500">
                  {permissions.length === 0
                    ? "Không có quyền hạn nào"
                    : "Không tìm thấy quyền hạn phù hợp"}
                </div>
              ) : (
                filteredPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center p-1">
                    <input
                      type="checkbox"
                      id={`perm_${permission.id}`}
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => {
                        setSelectedPermissions((prev) => {
                          if (prev.includes(permission.id)) {
                            return prev.filter((id) => id !== permission.id);
                          } else {
                            return [...prev, permission.id];
                          }
                        });
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`perm_${permission.id}`}
                      className="cursor-pointer text-sm text-black dark:text-white"
                    >
                      <div>{permission.display_name}</div>
                      <div className="text-gray-500 text-xs">
                        {permission.name}
                      </div>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="col-span-2 col-start-4 row-start-6 flex items-end">
            <button
              type="button"
              onClick={onCancel}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md transition-all duration-200 hover:bg-gray-700 active:scale-95 focus:ring-2 focus:ring-gray-400"
            >
              Hủy
            </button>
          </div>
          <div className="col-span-2 col-start-4 row-start-7 flex items-center">
            <button
              type="button"
              onClick={() => handleDelete(initialData.id)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md transition-all duration-200 hover:bg-red-700 active:scale-95 focus:ring-2 focus:ring-gray-400"
            >
              Xóa
            </button>
          </div>
          <div className="col-span-2 col-start-4 row-start-8">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md transition-all duration-200 hover:bg-blue-700 active:scale-95 focus:ring-2 focus:ring-blue-400"
            >
              {initialData.id ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
          <div className="col-span-5 col-start-6 row-start-5 flex flex-col justify-end">
            <div className="flex flex-col w-full">
              <div className="flex w-full justify-between">
                <label className="block mb-1 text-black dark:text-white">
                  Người dùng ({users.length})
                </label>
                <label className="text-black dark:text-white">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedUsers.length === users.length}
                    onChange={(e) => handleSelectAllUsers(e.target.checked)}
                  />
                  Chọn tất cả
                </label>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Tìm người dùng..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white text-black placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="col-span-5 row-span-3 col-start-6 row-start-6">
            <div className="border rounded-md overflow-y-auto bg-white dark:bg-gray-900 p-2">
              {users.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Không có người dùng nào
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Không tìm thấy người dùng phù hợp
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center bg-white p-2 border rounded hover:bg-gray-300  overflow-hidden
                                  ${
                                    selectedUsers.includes(user.id)
                                      ? "bg-blue-50 border-blue-200"
                                      : ""
                                  }`}
                    >
                      <input
                        type="checkbox"
                        id={`user_${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => {
                          setSelectedUsers((prev) => {
                            if (prev.includes(user.id)) {
                              return prev.filter((id) => id !== user.id);
                            } else {
                              return [...prev, user.id];
                            }
                          });
                        }}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`user_${user.id}`}
                        className="cursor-pointer flex-1"
                      >
                        <div className="text-sm font-medium text-black">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-800">
                          {user.email}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RoleForm;
