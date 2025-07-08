import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/user/css/Signin.css";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignin = location.pathname === "/signin";

  const { isAuthenticated, isAuthLoaded, login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthLoaded && isAuthenticated && !justLoggedIn) {
      toast.info("Bạn đã đăng nhập rồi");
      navigate("/profile");
    }
  }, [isAuthenticated, isAuthLoaded, navigate, justLoggedIn]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast.success("Đăng nhập thành công!");
      setJustLoggedIn(true);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        Object.values(err.response.data.errors).forEach((messages) => {
          messages.forEach((msg) => toast.error(msg));
        });
      } else {
        toast.error("Đăng nhập thất bại !");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthLoaded) return null;

  return (
    <div className="login-container">
      <div className="tabs">
        <Link to="/signin" className="home-link">
          <div className={`tab ${isSignin ? "active" : ""}`}>ĐĂNG NHẬP</div>
        </Link>
        <Link to="/signup" className="home-link">
          <div className={`tab ${!isSignin ? "active" : ""}`}>ĐĂNG KÝ</div>
        </Link>
      </div>

      <form className="form-group" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Nhập email hoặc Tên đăng nhập"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Mật khẩu"
          onChange={handleChange}
        />

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
        </button>
      </form>
    </div>
  );
};

export default Signin;
