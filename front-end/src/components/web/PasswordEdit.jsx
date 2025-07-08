import { useState } from "react";
import "../../styles/user/css/PasswordEdit.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useRequireAuth from "../../hooks/useRequireAuth";
import { toast } from "react-toastify";
function PasswordEdit() {
  const isAuthenticated = useRequireAuth("/signin","Vui lòng đăng nhập");
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updatePassword(formData);
      toast.success(res.message);
      navigate("/profile");
    } catch (err) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages) => {
          messages.forEach((msg) => toast.error(msg));
        });
      } else {
        toast.error(err.message || "Đăng ký thất bại");
      }
    }
  };
  if (!isAuthenticated) return null;
  return (
    <div>
      <div className="change-password">
        <h2>Đổi mật khẩu</h2>
        <p className="breadcrumb">
          <Link to="/"> Trang chủ /</Link> Đổi mật khẩu
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Mật khẩu cũ:</label>
            <input
              type="password"
              name="old_password"
              placeholder="Mật khẩu cũ"
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Mật khẩu mới:</label>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu mới"
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Xác Mật khẩu :</label>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Xác Mật khẩu"
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-confirm">
              Xác nhận
            </button>
            <button type="button" className="btn-back">
              <Link to="/profile">Quay lại</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default PasswordEdit;
