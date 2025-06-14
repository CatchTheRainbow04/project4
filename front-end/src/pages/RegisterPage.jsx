import React, { useState } from "react";
import axiosClient from "../services/axiosClient";
import { useNavigate } from "react-router-dom";
import "../styles/admin/register.css";

function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles : [2]
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post("/api/register", form);
      localStorage.setItem("access_token", res.data.access_token); // Lưu token trả về
      window.location.href = "/dashboard"; // Chuyển về trang chủ
    } catch (err) {
      alert("Lỗi đăng ký! " + (err.response?.data?.message || err.message || ""));
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Đăng ký</h2>
        <input type="text" name="name" placeholder="Tên" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
        <input type="password" name="password_confirmation" placeholder="Xác nhận mật khẩu" onChange={handleChange} required />
        <button type="submit">Đăng ký</button>
        <button
          type="button"
          className="back-login-btn"
          onClick={handleBackToLogin}
        >
          Quay lại đăng nhập
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;