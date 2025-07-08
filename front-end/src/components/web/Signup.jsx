import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/user/css/Signup.css";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const Signup = () => {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  const navigate = useNavigate();
  const { isAuthLoaded, isAuthenticated, register } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthLoaded && isAuthenticated) {
      toast.info("Đăng xuất trước khi đăng kí");
      navigate("/profile");
    }
  }, [isAuthenticated, isAuthLoaded, navigate]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await register(form);
      navigate("/");
    } catch (err) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages) => {
          messages.forEach((msg) => toast.error(msg));
        });
      } else {
        toast.error(err.message || "Đăng ký thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthLoaded) return null;
  return (
    <div className="form-container">
      <div className="tabs">
        <Link to="/signin" className="home-link">
          <div className={`tab ${!isSignup ? "active" : ""}`}>ĐĂNG NHẬP</div>
        </Link>
        <Link to="/signup" className="home-link">
          <div className={`tab ${isSignup ? "active" : ""}`}>ĐĂNG KÝ</div>
        </Link>
      </div>

      <form className="form-body" onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Tên"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password_confirmation"
          placeholder="Xác nhận mật khẩu"
          onChange={handleChange}
        />

        <button type="submit" className="register-btn">
          {loading ? "Vui lòng chờ 1 chút ..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
