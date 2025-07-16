import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import axios from "axios";
import axiosClient from "../../services/axiosClient";

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthday: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address_detail: "",
  });
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
const [loadingLocation, setLoadingLocation] = useState(false);

  // Load vai trò
  useEffect(() => {
    axiosClient.get("/roles").then((res) => {
      const options = res.data.map((r) => ({
        value: r.id,
        label: r.name,
      }));
      setRoles(options);
    });
  }, []);

  // Load user nếu có id
  useEffect(() => {
    if (id) {
      setLoadingUser(true);
      axiosClient.get(`/users/${id}`).then((res) => {
        setInitialData(res.data);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          birthday: res.data.birthday || "",
          phone: res.data.phone || "",
          province: res.data.province || "",
          district: res.data.district || "",
          ward: res.data.ward || "",
          address_detail: res.data.address_detail || "",
        });
        setSelectedRoles(
          res.data.roles.map((r) => ({ value: r.id, label: r.name }))
        );
      }).catch((err) => {
        toast.error("Không thể tải thông tin người dùng.");
        navigate("/dashboard/users");
      }).finally(() => {
        setLoadingUser(false);
      });
    }
  }, [id]);

  // Load tỉnh ban đầu
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data));
  }, []);

  // Khi có danh sách tỉnh và user -> set lại formData theo code
  useEffect(() => {
    if (initialData && provinces.length > 0) {
      const province = provinces.find((p) => p.name === initialData.province);
      const provinceCode = province?.code || "";

      if (provinceCode) {
        setFormData((prev) => ({ ...prev, province: provinceCode }));
        axios
          .get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
          .then((res) => {
            setDistricts(res.data.districts);
            const district = res.data.districts.find(
              (d) => d.name === initialData.district
            );
            const districtCode = district?.code || "";

            if (districtCode) {
              setFormData((prev) => ({ ...prev, district: districtCode }));
              axios
                .get(
                  `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
                )
                .then((res) => {
                  setWards(res.data.wards);
                  const ward = res.data.wards.find(
                    (w) => w.name === initialData.ward
                  );
                  const wardCode = ward?.code || "";
                  if (wardCode) {
                    setFormData((prev) => ({ ...prev, ward: wardCode }));
                  }
                  setLoadingLocation(false);
                });
            } else {
              setLoadingLocation(false);
            }
          });
      } else {
        setLoadingLocation(false);
      }
    } else {
      setLoadingLocation(false);
    }
  }, [initialData, provinces]);

  // Khi chọn tỉnh -> load quận
  useEffect(() => {
    if (formData.province) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${formData.province}?depth=2`)
        .then((res) => {
          setDistricts(res.data.districts);
        });
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [formData.province]);

  // Khi chọn quận -> load xã
  useEffect(() => {
    if (formData.district) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${formData.district}?depth=2`)
        .then((res) => {
          setWards(res.data.wards);
        });
    } else {
      setWards([]);
    }
  }, [formData.district]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const provinceName =
      provinces.find((p) => p.code === +formData.province)?.name || "";
    const districtName =
      districts.find((d) => d.code === +formData.district)?.name || "";
    const wardName = wards.find((w) => w.code === +formData.ward)?.name || "";

    const payload = {
      ...formData,
      province: provinceName,
      district: districtName,
      ward: wardName,
      roles: selectedRoles.map((r) => r.value),
    };
    if (password) payload.password = password;

    try {
      if (initialData) {
        await axiosClient.put(`/users/${initialData.id}`, payload);
        toast.success("Cập nhật người dùng thành công!");
      } else {
        await axiosClient.post("/users", payload);
        toast.success("Tạo người dùng thành công!");
      }
      navigate("/dashboard/users");
    } catch (err) {
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((messages) =>
          messages.forEach((msg) => toast.error(msg))
        );
      } else {
        toast.error("Có lỗi xảy ra khi lưu thông tin!");
      }
    }
  };

  if (loadingLocation || loadingUser) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="loader" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-6"
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        {initialData ? "Cập nhật người dùng" : "Tạo người dùng mới"}
      </h2>

      {/* Họ tên */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Họ tên
        </label>
        <input
          type="text"
          name="name"
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      {/* Mật khẩu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mật khẩu
        </label>
        <input
          type="password"
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Ngày sinh, Điện thoại */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ngày sinh
          </label>
          <input
            type="date"
            name="birthday"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Tỉnh / Huyện / Xã */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tỉnh / Thành phố
          </label>
          <select
            name="province"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={formData.province}
            onChange={handleChange}
          >
            <option value="">--Chọn tỉnh--</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quận / Huyện
          </label>
          <select
            name="district"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={formData.district}
            onChange={handleChange}
          >
            <option value="">--Chọn huyện--</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phường / Xã
          </label>
          <select
            name="ward"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={formData.ward}
            onChange={handleChange}
          >
            <option value="">--Chọn xã--</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Địa chỉ chi tiết */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Địa chỉ chi tiết
        </label>
        <input
          type="text"
          name="address_detail"
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={formData.address_detail}
          onChange={handleChange}
        />
      </div>

      {/* Vai trò */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Vai trò
        </label>
        <Select
          isMulti
          options={roles}
          value={selectedRoles}
          onChange={setSelectedRoles}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      {/* Nút */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
        >
          {initialData ? "Cập nhật" : "Tạo mới"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard/users")}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}

export default UserForm;
