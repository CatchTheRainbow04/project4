import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import orderApi from "../../services/orderApi";
import { toast } from "react-toastify";
import "../../styles/user/css/Checkout.css";
import {formatPriceVND} from '../../utils/Utils'

const BuyNow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
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
  const { user, isAuthLoaded, isAuthenticated } = useAuth();
  const hasCheckedAuth = useRef(false);
  useEffect(() => {
    if (!isAuthLoaded) return;

    if (!user && !hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      toast.error("Vui lòng đăng nhập !");
      navigate("/signin");
    }
  }, [user, isAuthLoaded, navigate]);

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
    if (!product) return;

    const provinceName =
      provinces.find((p) => p.code === +formData.province)?.name || "";
    const districtName =
      districts.find((d) => d.code === +formData.district)?.name || "";
    const wardName = wards.find((w) => w.code === +formData.ward)?.name || "";

    const fullAddress = `${formData.address}, ${wardName}, ${districtName}, ${provinceName}`;

    try {
      const payload = {
        product_id: product.id,
        quantity,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        shipping_address: fullAddress,
        payment_method: formData.payment,
        note: formData.note || "",
      };
      await orderApi.buyNow(payload);
      toast.success("Đặt hàng thành công!");
      navigate("/profile");
    } catch (err) {
      toast.error("Đặt hàng thất bại");
      console.error("BuyNow failed:", err);
    }
  };

  if (!isAuthenticated || !product) return null;

  return (
    <div className="checkout-container">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <Link to="/" className="back-to-home">
          Trở về trang chủ
        </Link>
        <h3>Thông tin giao hàng</h3>
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <div className="row-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <div className="row-2">
          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
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
            required
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <select
          name="ward"
          value={formData.ward}
          onChange={handleChange}
          required
        >
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
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={formData.payment === "cod"}
                onChange={handleChange}
              />
            </div>
            <span className="radio-label-primary">
              Thanh toán khi nhận hàng (COD)
            </span>
          </label>
        </div>

        <button type="submit" className="submit-button">
          Mua ngay
        </button>
      </form>

      <div className="checkout-summary">
        <div className="items-flex">
          <div className="item">
            <img
              src={
                product.feature_image_path?.startsWith("http")
                  ? product.feature_image_path
                  : `http://127.0.0.1:8000/storage/${
                      product.feature_image_path || ""
                    }`
              }
              alt={product.name}
            />
            <div className="item-details-1">
              <div>
                <p>{product.name}</p>
                <small>{formatPriceVND(product.price)}</small>
              </div>
              <div>
                <button
                  className="quantity-button"
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity<=1}
                >
                  -
                </button>

                <input
                  type="number"
                  value={quantity}
                  readOnly
                  style={{ width: 50, textAlign: "center" }}
                />
                <button
                  className="quantity-button"
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="item-details-2">
              <p>
                <strong>{formatPriceVND(product.price * quantity)}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="absolute-area">
          <div className="total-section">
            <p>
              <strong>Tổng cộng:</strong> {formatPriceVND(product.price * quantity)}
            </p>
            <div className="note-1">
              <p>
                Chúng tôi sẽ XÁC NHẬN đơn hàng bằng TIN NHẮN SMS hoặc GỌI ĐIỆN.
                Bạn vui lòng kiểm tra tin nhắn hoặc nghe máy sau khi đặt hàng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
