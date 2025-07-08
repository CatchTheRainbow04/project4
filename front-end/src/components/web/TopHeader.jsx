import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CartBox from "../web/CartBox";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/user/css/TopHeader.css";

const TopHeader = () => {
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);
  const { isAuthenticated } = useAuth();
  const isCheckoutPage = location.pathname === "/checkout";

  return (
    <div className="top-header dark:bg-black">
      <div className="top-header-container">
        <div className="phone-number">
          <li aria-label="hotline" className="fas fa-phone">
            <Link to="tel:0387387894">0387387.894</Link>
          </li>
        </div>
        <div className="account-cart">
          {isAuthenticated ? (
            <Link to="/profile">
              <i className="fas fa-user"></i> Thông Tin Cá Nhân
            </Link>
          ) : (
            <Link to="/signin">
              <i className="fas fa-user"></i> Tài khoản
            </Link>
          )}
          {!isCheckoutPage && (
            <a onClick={() => setShowCart(true)} style={{ cursor: "pointer" }}>
              <i className="fas fa-shopping-cart"></i> Giỏ hàng
            </a>
          )}
        </div>
        {showCart && <CartBox onClose={() => setShowCart(false)} />}
      </div>
    </div>
  );
};

export default TopHeader;
