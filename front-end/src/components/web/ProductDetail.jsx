import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../styles/user/css/ProductDetail.css";
import productApi from "../../services/productApi";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { toast } from "react-toastify";
import { formatPriceVND } from "../../utils/Utils";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState("");
  const { isAuthenticated, isAuthLoaded } = useAuth();
    const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    productApi.getById(id).then((res) => {
      setProduct(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (product && product.feature_image_path) {
      setCurrentImage(product.feature_image_path);
    }
  }, [product]);

  if (!product) return <div>Đang tải...</div>;

  const handleAddToCart = (product) => {
      if (isAuthLoaded && isAuthenticated) {
        addItem(product.id, quantity);
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
      } else {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng !");
        navigate("/signin");
      }
    };
  
    const handleBuyNow = (product) => {
      navigate("/buy-now", { state: { product } })
    };

  const handleQuantity = (type) => {
    if (type === "inc") setQuantity(quantity + 1);
    else if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <>
        <div className="product-detail">
        <Link to="/" className="back-to-home">Về trang chủ</Link>
        <div className="content">
         <div className="product-detail-left">
            <div className="main-image-product">
              <img
                src={
                  currentImage?.startsWith("http")
                    ? currentImage
                    : `http://127.0.0.1:8000/storage/${currentImage || ""}`
                }
                alt={product.name}
                className="main-image"
              />
            </div>

            <div className="detail-image">
              {Array.isArray(product.images) &&
                product.images.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => setCurrentImage(i.image_path)}
                  >
                    <img
                      src={
                        i.image_path?.startsWith("http")
                          ? i.image_path
                          : `http://127.0.0.1:8000/storage/${
                              i.image_path || ""
                            }`
                      }
                      alt={i.image_name}
                    />
                  </button>
                ))}
            </div>
          </div>

          <div className="product-detail-right">
            <div>
              <h1>{product.name}</h1>
              <p className="status">Còn hàng</p>
            </div>

            <hr />
            <div className="price">Giá : {formatPriceVND(product.price)}</div>

            <div className="color-select">
              <p>MÀU SẮC</p>
              <div className="colors">
                <div
                  className="color-option"
                  style={{ backgroundColor: "#ffffff", width:"20px",height:"20px",border: "1px solid black" }}
                  title="Trắng"
                ></div>
                <div
                  className="color-option"
                  style={{ backgroundColor: "#D3D3D3" , width:"20px",height:"20px",border: "1px solid black" }}
                  title="Ghi nhạt"
                ></div>
                <div
                  className="color-option"
                  style={{ backgroundColor: "#696969", width:"20px",height:"20px",border: "1px solid black" }}
                  title="Ghi đậm"
                ></div>
                <div
                  className="color-option"
                  style={{ backgroundColor: "#000000", width:"20px",height:"20px",border: "1px solid black" }}
                  title="Đen"
                ></div>
              </div>
            </div>

            <div className="size-select">
              <p>
                KÍCH THƯỚC <a href="#">Hướng Dẫn Chọn Size</a>
              </p>
              <div className="sizes">
                {["3XL", "2XL", "XL", "L", "M"].map((size) => (
                  <button key={size}>{size}</button>
                ))}
              </div>
            </div>

            <div className="quantity-select">
              <button onClick={() => handleQuantity("dec")}>-</button>
              <input type="text" value={quantity} readOnly />
              <button onClick={() => handleQuantity("inc")}>+</button>
            </div>

            <div className="action-buttons">
              <button onClick={()=> handleAddToCart(product)} className="add-to-cart">THÊM VÀO GIỎ HÀNG</button>
              <button onClick={()=> handleBuyNow(product)} className="buy-now">MUA NGAY</button>
            </div>

            <div className="store-check">
              <hr />
              <div className="info-section">
                <div>THÔNG TIN SẢN PHẨM</div>
                <p>- {product.content}</p>
                <p>{product.tags.map((tag)=>(<span>#{tag.name}</span>))}</p>
                
                <hr />
                <div>CHÍNH SÁCH ĐỔI TRẢ</div>
                <ul>
                  <li>- Mức phí: 30,000đ nội thành và 40,000đ ngoại thành</li>
                  <li>- Được kiểm tra hàng trước khi nhận hàng</li>
                  <li>- Đổi hàng trong vòng 30 ngày kể từ khi nhận hàng</li>
                  <li>- Không áp dụng đổi/trả sản phẩm trong CTKM</li>
                  <li>- Miễn phí đổi trả nếu lỗi sai sót từ phía chúng tôi</li>
                </ul>
                <hr />
              </div>
              <div className="benefits">
                <li>
                  <img
                    src="https://web.nvnstatic.net/tp/T0298/img/tmp/img_policy_1.png?v=9"
                    alt="free ship"
                  />{" "}
                  <p>GIAO HÀNG NỘI THÀNH TRONG 24 GIỜ</p>
                </li>
                <li>
                  <img
                    src="https://web.nvnstatic.net/tp/T0298/img/tmp/img_policy_3.png?v=9"
                    alt="Return"
                  />{" "}
                  <p>ĐỔI HÀNG TRONG 30 NGÀY</p>
                </li>
                <li>
                  <img
                    src="https://web.nvnstatic.net/tp/T0298/img/tmp/img_policy_4.png?v=9"
                    alt="Hotline"
                  />{" "}
                  <p>TỔNG ĐÀI BÁN HÀNG 096728.4444</p>
                </li>
              </div>
            </div>
          </div>
        </div>
 
        </div>
    </>
  );
};

export default ProductDetail;
