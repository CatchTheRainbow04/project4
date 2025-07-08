import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/user/css/Checkout.css";
import cartApi from "../../services/cartApi";
import useRequireAuth from "../../hooks/useRequireAuth";
import { toast } from "react-toastify";
import { formatPriceVND } from '../../utils/Utils';

const Checkout = () => {
  const isAuthenticated = useRequireAuth(
    "/signin",
    "Vui lòng đăng nhập để đặt hàng"
  );

  const { items, total, clearCart, loading } = useCart();
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
    payment: "cod",
  });

  const { user, isAuthLoaded } = useAuth();

  useEffect(() => {
    if (!isAuthLoaded || !user) return;

    if (!loading && items.length === 0) {
      toast.warning("Giỏ hàng trống. Không thể tiến hành đặt hàng.");
      navigate("/");
    }
  }, [loading, items, navigate]);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const provinceName =
      provinces.find((p) => p.code === +formData.province)?.name || "";
    const districtName =
      districts.find((d) => d.code === +formData.district)?.name || "";
    const wardName = wards.find((w) => w.code === +formData.ward)?.name || "";

    const fullAddress = `${formData.address}, ${wardName}, ${districtName}, ${provinceName}`;

    try {
      const payload = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        shipping_address: fullAddress,
        payment_method: formData.payment,
        note: formData.note || "",
      };
      await cartApi.checkout(payload);
      toast.success("Đặt hàng thành công!");
      clearCart();
      navigate("/profile");
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  if (!isAuthenticated || loading || items.length === 0) return null;

  return (
    <div className="checkout-container">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Thông tin giao hàng</h3>
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
        />
        <div className="row-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={formData.address}
          onChange={handleChange}
        />
        <div className="row-2">
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
        <select name="ward" value={formData.ward} onChange={handleChange}>
          <option value="">Chọn Phường/Xã</option>
          {wards.map((w) => (
            <option key={w.code} value={w.code}>
              {w.name}
            </option>
          ))}
        </select>
        <textarea
          name="note"
          placeholder="Ghi chú"
          value={formData.note}
          onChange={handleChange}
        ></textarea>

        <h4>Phương thức thanh toán</h4>
        <div className="payment-method">
          <label className="radio-label">
            <div className="radio-input">
              <input type="radio" name="payment" value="cod" checked readOnly />
            </div>
            <span className="radio-label-primary">
              Thanh toán khi nhận hàng (COD)
            </span>
          </label>
        </div>

        <Link to="/cart" className="back-cart-link">
          <svg
            className="icon-arrow"
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="11"
            viewBox="0 0 6.7 11.3"
          >
            <path d="M6.7 1.1l-1-1.1-4.6 4.6-1.1 1.1 1.1 1 4.6 4.6 1-1-4.6-4.6z"></path>
          </svg>
          Giỏ hàng
        </Link>
      </form>

      <div className="checkout-summary">
        <div className="items-flex">
          {items.map((i) => (
            <div className="item" key={i.id}>
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
              <div className="item-details-1">
                <div>
                  <p>{i.product.name}</p>
                  <small>{formatPriceVND(i.product.price)}</small>
                </div>
                <span>x{i.quantity}</span>
              </div>
              <div className="item-details-2">
                <p>
                  <strong>{formatPriceVND(i.product.price * i.quantity)}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute-area">
          <div className="flash-sale">
            <input type="text" placeholder="Mã giảm giá" />
            <button className="apply-button">Sử dụng</button>
          </div>
          <div className="total-section">
            <p>
              <strong>Tổng cộng:</strong> {formatPriceVND(total)}
            </p>
            <div className="note-1">
              <p>
                Chúng tôi sẽ XÁC NHẬN đơn hàng bằng TIN NHẮN SMS hoặc GỌI ĐIỆN.
                Bạn vui lòng kiểm tra tin nhắn hoặc nghe máy sau khi đặt hàng.
              </p>
            </div>
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            Hoàn tất đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
