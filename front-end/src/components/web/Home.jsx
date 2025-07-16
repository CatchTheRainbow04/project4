import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/user/css/Home.css";
import categoryApi from "../../services/categoryApi";
import { useCart } from "../../contexts/CartContext";
import useRandomProductsByCategory from "../../hooks/useRandomProductsByCategory";
import ProductCard from "../web/ProductCard";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import Slider from "../web/Slider";

function Home() {
  const { isAuthenticated, isAuthLoaded } = useAuth();
  const navigate = useNavigate();
  const [selectedAoCategoryId, setSelectedAoCategoryId] = useState(1);
  const [selectedQuanCategoryId, setSelectedQuanCategoryId] = useState(12);
  const [selectedPhukienCategoryId, setSelectedPhukienCategoryId] =
    useState(18);

  const ao = useRandomProductsByCategory(selectedAoCategoryId, 5);
  const quan = useRandomProductsByCategory(selectedQuanCategoryId, 5);
  const phukien = useRandomProductsByCategory(selectedPhukienCategoryId, 5);

  const [loading, setLoading] = useState({
    ao: true,
    quan: true,
    phukien: true,
  });

  useEffect(() => {
    setLoading((prev) => ({ ...prev, ao: true }));
  }, [selectedAoCategoryId]);
  useEffect(() => {
    setLoading((prev) => ({ ...prev, quan: true }));
  }, [selectedQuanCategoryId]);
  useEffect(() => {
    setLoading((prev) => ({ ...prev, phukien: true }));
  }, [selectedPhukienCategoryId]);

useEffect(() => {
  const checkLoading = (data, key) => {
    if (Array.isArray(data)) {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };
  checkLoading(ao, "ao");
  checkLoading(quan, "quan");
  checkLoading(phukien, "phukien");
}, [ao, quan, phukien]);

  const [categories, setCategories] = useState([]);
  const { addItem } = useCart();

  const handleAddToCart = (product) => {
    if (isAuthLoaded && isAuthenticated) {
      addItem(product.id, 1);
      toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
    } else {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng !");
      navigate("/signin");
    }
  };

  const handleViewDetail = (product) => {
    navigate(`/detail/${product.id}`);
  };

  const handleBuyNow = (product) => {
    navigate("/buy-now", { state: { product } })
  };

  const handleCategoryClick = (childCategoryId, mainCategoryName) => {
    switch (mainCategoryName.normalize("NFC").toLowerCase()) {
      case "áo xuân hè":
        setSelectedAoCategoryId(childCategoryId);
        break;
      case "quần":
        setSelectedQuanCategoryId(childCategoryId);
        break;
      case "phụ kiện":
        setSelectedPhukienCategoryId(childCategoryId);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    categoryApi
      .tree()
      .then((res) => setCategories(res.data))
      .catch((error) =>
        console.error(
          "API Error: GET /categories-tree",
          error.response?.data || error.message
        )
      );
  }, []);

  const renderCategoryBlock = (mainCategoryName) => {
    return categories.map((category) => {
      if (
        category.name.normalize("NFC").toLowerCase() ===
        mainCategoryName.normalize("NFC").toLowerCase()
      ) {
        let currentSelectedId;
        switch (mainCategoryName.normalize("NFC").toLowerCase()) {
          case "áo xuân hè":
            currentSelectedId = selectedAoCategoryId;
            break;
          case "quần":
            currentSelectedId = selectedQuanCategoryId;
            break;
          case "phụ kiện":
            currentSelectedId = selectedPhukienCategoryId;
            break;
          default:
            currentSelectedId = null;
        }

        return (
          <React.Fragment key={category.id}>
            <Link to={`/${category.slug}`} className="category-item large-font">
              {category.name}
            </Link>
            <div
              className={`category-item ${
                currentSelectedId === category.id ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category.id, mainCategoryName)}
            >
              Tất cả {category.name}
            </div>
            {Array.isArray(category.children) &&
              category.children.map((child) => (
                <div
                  key={child.id}
                  className={`category-item ${
                    currentSelectedId === child.id ? "active" : ""
                  }`}
                  onClick={() =>
                    handleCategoryClick(child.id, mainCategoryName)
                  }
                >
                  {child.name}
                </div>
              ))}
          </React.Fragment>
        );
      }
      return null;
    });
  };

  const renderProductList = (products, sectionKey) => (
    <div className="product-list">
      {loading[sectionKey] ? (
        <div className="loader"></div>
      ) : products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onViewDetail={handleViewDetail}
            onBuyNow={handleBuyNow}
          />
        ))
      ) : (
        <div
          className="no-products"
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#666",
            width: "100%",
          }}
        >
          Không có sản phẩm nào.
        </div>
      )}
    </div>
  );

  return (
    <>
<Slider />
    <div className="homepage-container dark:bg-dark">
      <div className="category-bar">{renderCategoryBlock("Áo Xuân Hè")}</div>
      {renderProductList(ao, "ao")}

      <div className="category-bar">{renderCategoryBlock("Quần")}</div>
      {renderProductList(quan, "quan")}

      <div className="category-bar">{renderCategoryBlock("Phụ kiện")}</div>
      {renderProductList(phukien, "phukien")}
    </div>
    </>
  );
}

export default Home;
