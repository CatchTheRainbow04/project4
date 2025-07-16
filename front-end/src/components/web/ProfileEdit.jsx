import "../../styles/user/css/ProfileEdit.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import useRequireAuth from "../../hooks/useRequireAuth";

function ProfileEdit() {
  const isAuthenticated = useRequireAuth("/signin" , "Vui lòng đăng nhập !");
  const { user, updateUser } = useAuth();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    address_detail: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        birthday: user.birthday || "",
        phone: user.phone || "",
        email: user.email || "",
        province: user.province || "",
        district: user.district || "",
        ward: user.ward || "",
        address_detail: user.address_detail || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && provinces.length > 0) {
      const province = provinces.find((p) => p.name === user.province);
      const provinceCode = province?.code || "";

      setFormData((prev) => ({
        ...prev,
        province: provinceCode,
      }));

      if (province) {
        // Load quận/huyện tương ứng tỉnh
        axios
          .get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
          .then((res) => {
            setDistricts(res.data.districts);
            const district = res.data.districts.find(
              (d) => d.name === user.district
            );
            const districtCode = district?.code || "";
            setFormData((prev) => ({
              ...prev,
              district: districtCode,
            }));

            if (district) {
              // Load phường/xã tương ứng quận
              axios
                .get(
                  `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
                )
                .then((res) => {
                  setWards(res.data.wards);
                  const ward = res.data.wards.find((w) => w.name === user.ward);
                  const wardCode = ward?.code || "";
                  setFormData((prev) => ({
                    ...prev,
                    ward: wardCode,
                  }));
                });
            }
          });
      }
    }
  }, [user, provinces]);

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Lỗi tải tỉnh:", err));
  }, []);

  useEffect(() => {
    if (formData.province) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${formData.province}?depth=2`)
        .then((res) => setDistricts(res.data.districts))
        .catch((err) => console.error("Lỗi tải quận:", err));
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.district) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${formData.district}?depth=2`)
        .then((res) => setWards(res.data.wards))
        .catch((err) => console.error("Lỗi tải phường:", err));
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

    try {
      const data = {
        name: formData.name,
        birthday: formData.birthday,
        phone: formData.phone,
        email: formData.email,
        province: provinceName,
        district: districtName,
        ward: wardName,
        address_detail: formData.address_detail,
      };
      const res = await updateUser(data);
      toast.success(res.message);
      navigate("/profile");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="profile-form">
      <h2>Thông tin cá nhân</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Họ tên:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Họ tên"
          />
        </div>

        <div className="form-row">
          <label>Ngày sinh:</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Điện thoại:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
          />
        </div>

        <div className="form-row">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>

        <div className="form-row">
          <label>Tỉnh/Thành phố :</label>
          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Quận/Huyện:</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Phường xã :</label>
          <select name="ward" value={formData.ward} onChange={handleChange}>
            <option value="">Chọn Phường/Xã</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Địa chỉ chi tiết:</label>
          <input
            type="text"
            name="address_detail"
            value={formData.address_detail}
            onChange={handleChange}
            placeholder="Địa chỉ chi tiết"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-update">
            Cập nhật
          </button>
          <button type="button" className="btn-back">
            <Link to="/profile">Quay lại</Link>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileEdit;
