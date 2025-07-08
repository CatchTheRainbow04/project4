import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/user/css/CartBox.css";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import {formatPriceVND} from "../../utils/Utils"

function CartBox({ onClose }) {
  const [closing, setClosing] = useState(false);
  const { items, total, updateItem, removeItem} = useCart();
  const { isAuthenticated } = useAuth();

  const handleClose = () => {
    setClosing(true);
  };

  useEffect(() => {
    if (closing) {
      const timer = setTimeout(() => {
        onClose();
      }, 300); // thời gian khớp với animation CSS
      return () => clearTimeout(timer);
    }
  }, [closing, onClose]);

  return (
    <div className="cart-backdrop" onClick={handleClose}>
      <div
        className={`cart-box ${closing ? "slide-out" : "slide-in"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-btn" onClick={handleClose}>
          ×
        </span>
        <h3 className="dark:text-black">Giỏ hàng</h3>
        {!isAuthenticated ? (
          <Link to="/signin" onClick={handleClose} className="checkout-btn">
            ĐĂNG NHẬP NGAY !
          </Link>
        ) : !items ? (
          <p>Đang tải giỏ hàng...</p>
        ) : items.length === 0 ? (
          <p className="dark:text-black">Giỏ hàng trống</p>
        ) : (
          <>
            <p className="dark:text-neutral-600">
              Bạn đang có <strong>{items?.length}</strong> sản phẩm trong giỏ
              hàng
            </p>

            <div className="max-w-2xl">
              {items.map((i) => (
                <div className="cart-item" key={i.id}>
                  <img
                    className="img"
                    src={
                      i.product.feature_image_path?.startsWith("http")
                        ? i.product.feature_image_path
                        : `http://127.0.0.1:8000/storage/${
                            i.product.feature_image_path || ""
                          }`
                    }
                    alt={i.product.name}
                  />
                  <div className="item-info">
                    <p className="dark:text-black">{i.product.name}</p>
                    <small>
                      <b className="dark:text-black">
                        {formatPriceVND(i.product.price)} x
                        {i.quantity}
                      </b>
                    </small>
                  </div>
                  <div className="quantity-action">
                    
                    <button
                      onClick={() => updateItem(i.id, i.quantity - 1)}
                      disabled={i.quantity <= 1}
                    >
                      -
                    </button><button onClick={() => updateItem(i.id, i.quantity + 1)}>
                      +
                    </button>
                    <button onClick={() => removeItem(i.id)}>x</button>
                  </div>
                </div>
              ))}
            </div>

            <hr />
            <div className="cart-total">
              <p className="dark:text-black">TỔNG TIỀN TẠM TÍNH:</p>
              <p>
                <strong className="dark:text-black">{formatPriceVND(total)}</strong>
              </p>
            </div>

            <p>
              <Link
                onClick={handleClose}
                to="/checkout"
                className="checkout-btn"
              >
                TIẾN HÀNH ĐẶT HÀNG
              </Link>
            </p>
            <Link onClick={handleClose} className="view-cart" to="/cart">
              Xem chi tiết giỏ hàng →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default CartBox;
