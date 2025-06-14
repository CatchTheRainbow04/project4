import React, { useState } from "react";
import axiosClient from "../services/axiosClient";
import { useNavigate } from "react-router-dom";
import "../styles/admin/login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post("/login", {
        email,
        password,
      });
      localStorage.setItem("access_token", res.data.access_token); // đổi access_token thành token
      window.location.href = "/dashboard"; // hoặc navigate(...)
    } catch (err) {
      if (err.response?.status === 422) {
        // Xử lý lỗi xác thực
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        alert("Lỗi xác thực: " + errorMessages);
      } else {
        alert(
          "Đăng nhập thất bại",
          err.response?.data?.message ||
            "Vui lòng kiểm tra lại thông tin đăng nhập"
        );
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Đăng nhập</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          required
        />
        <button type="submit">Đăng nhập</button>
        <button
          type="button"
          className="register-btn"
          onClick={handleRegisterRedirect}
        >
          Đăng ký tài khoản mới
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
