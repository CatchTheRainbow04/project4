import {formatPriceVND} from '../../utils/Utils';
import "../../styles/user/css/Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { toast } from "react-toastify";
import useRequireAuth from "../../hooks/useRequireAuth";

function Cart() {
  const isAuthenticated = useRequireAuth("/signin" , "Vui lòng đăng nhập để sử dụng giỏ hàng !")
  const { items, total, updateItem, removeItem, clearCart } = useCart();
  if (!isAuthenticated) return null;

  return (
    <div className="cart-page">
      <h2>
        GIỎ HÀNG CỦA BẠN
        <span>
          {" "}
          ( Có <strong>{items.length}</strong> sản phẩm trong giỏ hàng )
        </span>
      </h2>

      <div className="cart-content">
        <div className="cart-left">
          <div className="remove-all">
            <button onClick={clearCart}>Xóa toàn bộ giỏ </button>
          </div>

          {items.length === 0 ? (
            <p className="flex h-full items-center justify-center">Giỏ hàng trống</p>
          ) : (
            items.map((i) => (
              <div className="cart-item" key={i.id}>
                  <i onClick={() => removeItem(i.id)} className="fa-solid fa-x"></i>
                <img
                  src={
                    i.product.feature_image_path?.startsWith("http")
                      ? i.product.feature_image_path
                      : `http://127.0.0.1:8000/storage/${
                          i.product.feature_image_path || ""
                        }`
                  }
                  alt={i.product.name}
                />
                <div className="item-details">
                  <p>{i.product.name}</p>
                </div>
                <div className="quantity-control">
                  <button
                    onClick={() => updateItem(i.id, i.quantity - 1)}
                    disabled={i.quantity <= 1}
                  >
                    -
                  </button>
                  <p>{i.quantity}</p>
                  <button onClick={() => updateItem(i.id, i.quantity + 1)}>
                    +
                  </button>
                </div>
                <div className="item-price">
                  {formatPriceVND(i.quantity * i.product.price)}
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <div className="cart-summary">
            <h3 className="dark:text-black">TÓM TẮT ĐƠN HÀNG</h3>
            <p className="note">Chưa bao gồm phí vận chuyển:</p>
            <div className="total">
              <span className="dark:text-black">Tổng tiền:</span>
              <strong className="dark:text-black">{formatPriceVND(total)}</strong>
            </div>
            <p className="note">
              <i>Bạn có thể nhập mã giảm giá trong trang thanh toán</i>
            </p>
            <Link
              to={items.length > 0 ? "/checkout" : "#"}
              className="checkout-btn"
              onClick={(e) => {
                if (items.length === 0) {
                  e.preventDefault();
                  toast.error("Không thể đặt hàng vì giỏ hàng trống.");
                }
              }}
            >
              TIẾN HÀNH ĐẶT HÀNG
            </Link>
            <Link to="/" className="buy-more-btn">
              MUA THÊM SẢN PHẨM
            </Link>
          </div>

          <div className="benefits">
            <li>
              <img
                src="https://web.nvnstatic.net/tp/T0298/img/tmp/img_policy_1.png?v=9"
                alt="free ship"
                className="dark:invert"
              />
              <p>GIAO HÀNG NỘI THÀNH TRONG 24 GIỜ</p>
            </li>
            <li>
              <img
                src="https://web.nvnstatic.net/tp/T0298/img/tmp/img_policy_3.png?v=9"
                alt="Return"
                                className="dark:invert"
              />
              <p>ĐỔI HÀNG TRONG 30 NGÀY</p>
            </li>
            <li>
              <img
                src="https://web.nvnstatic.net/tp/T0298/img/tmp/img_policy_4.png?v=9"
                alt="Hotline"
                                className="dark:invert"
              />
              <p>TỔNG ĐÀI BÁN HÀNG 096728.4444</p>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
