import "../../styles/user/css/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

function Profile() {
  const navigate = useNavigate();
  const { user, logout, isAuthLoaded, isAuthenticated } = useAuth();
  const hasCheckedAuth = useRef(false);
  useEffect(() => {
    if (!isAuthLoaded) return;

    if (!user && !hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      toast.error("Vui lòng đăng nhập !");
      navigate("/signin");
    }
  }, [user, isAuthLoaded, navigate]);

  const handleLogout = async () => {
    hasCheckedAuth.current = true;
    await logout();
    toast.success("Đăng xuất thành công !");
    navigate("/");
  };
  if (!isAuthenticated) return <div>Đang kiểm tra xác thực...</div>;

  return (
    <>
      {user ? (
        <div className="account-container">
          <h2 className="account-title">Tài khoản</h2>
          <div className="account-content">
            <div className="account-section">
              <h3>Thông tin tài khoản</h3>
              <hr />
              <p>- Tên người dùng : {user.name}</p>
              <p>- Địa chỉ email : {user.email}</p>
              <p>- Số điện thoại : {user.phone}</p>
              <p>
                - Địa chỉ :{" "}
                {`${user.address_detail} , ${user.ward} , ${user.district} , ${user.province}`}
              </p>
              <p>
                Điểm Tích lũy của bạn:{" "}
                <strong>{user.orders?.length || 0}</strong>
              </p>
              <p>
                Cấp độ khách hàng:
                <span className="customer-level">
                  {" "}
                  {user.orders?.length <= 1
                    ? "Khách hàng mới"
                    : user.orders?.length <= 3
                    ? "Khách hàng tiềm năng"
                    : "Khách hàng thân thiết"}
                </span>
              </p>
              <p
                className="signout"
                onClick={handleLogout}
                style={{ cursor: "pointer", transition: "0.5s ease" }}
              >
                <i className="fas fa-sign-out-alt"></i> Đăng xuất
              </p>
            </div>

            <div className="account-section">
              <h3>Tùy chọn</h3>
              <hr />
              <Link to="/cart">
                <p>Giỏ Hàng</p>
              </Link>
              <Link to="/order">
                <p>Đơn Hàng</p>
              </Link>
              <Link to="/profile-edit">
                <p>Thay đổi thông tin tài khoản</p>
              </Link>
              <Link to="/password-edit">
                <p>Thay đổi mật khẩu</p>
              </Link>
              {user.roles?.some((role) => role.name === "admin") && (
                <Link to="/dashboard">
                  <p>Trang quản lý</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Profile;
