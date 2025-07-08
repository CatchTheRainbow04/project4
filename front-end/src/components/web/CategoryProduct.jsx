import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import categoryApi from "../../services/categoryApi";
import productApi from "../../services/productApi";
import ProductCard from "./ProductCard";
import { useCart } from "../../contexts/CartContext";
import "../../styles/user/css/CategoryProduct.css";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import useProductFilter from "../../hooks/useProductFilter";

function CategoryProduct() {
  const { isAuthenticated, isAuthLoaded } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    priceFilter,
    setPriceFilter,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    currentProducts,
    totalPages,
  } = useProductFilter(allProducts);

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

  useEffect(() => {
    setLoading(true);
    categoryApi
      .findBySlug(slug)
      .then((res) => {
        setCategory(res.data);
        return productApi.getProductsByCategory(res.data.id);
      })
      .then((res) => {
        setAllProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi tải dữ liệu:", error);
        setError("Không thể tải sản phẩm hoặc danh mục.");
        setLoading(false);
      });
  }, [slug]);

  if (loading)
    return <div className="text-center mt-7 mb-7 p-4">Loading...</div>;
  if (error)
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container">
      <div className="home-bar">
        <Link to="/" className="home-link">
          <i className="fas fa-home"> </i> Trang chủ
        </Link>
        <span className="divider">|</span>
        <li className="category-name">{category?.name}</li>
      </div>

      <div className="page">
        <h2 className="category-title">{category?.name}</h2>

        <div className="filter-sort-container">
          <div className="filters">
            <span className="filter-label">BỘ LỌC</span>
            <div className="dropdown-box">
              <label>
                <input
                  type="checkbox"
                  checked={priceFilter.includes("under-200k")}
                  onChange={() =>
                    setPriceFilter((prev) =>
                      prev.includes("under-200k")
                        ? prev.filter((p) => p !== "under-200k")
                        : [...prev, "under-200k"]
                    )
                  }
                />
                Dưới 200,000
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={priceFilter.includes("200k-500k")}
                  onChange={() =>
                    setPriceFilter((prev) =>
                      prev.includes("200k-500k")
                        ? prev.filter((p) => p !== "200k-500k")
                        : [...prev, "200k-500k"]
                    )
                  }
                />
                Từ 200,000 - 500,000
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={priceFilter.includes("500k-1m")}
                  onChange={() =>
                    setPriceFilter((prev) =>
                      prev.includes("500k-1m")
                        ? prev.filter((p) => p !== "500k-1m")
                        : [...prev, "500k-1m"]
                    )
                  }
                />
                Từ 500,000 - 1,000,000
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={priceFilter.includes("over-1m")}
                  onChange={() =>
                    setPriceFilter((prev) =>
                      prev.includes("over-1m")
                        ? prev.filter((p) => p !== "over-1m")
                        : [...prev, "over-1m"]
                    )
                  }
                />
                Trên 1,000,000
              </label>
            </div>
          </div>

          <div className="sort">
            <span>
              <strong>Sắp xếp theo:</strong>
            </span>
            <select
              className="custom-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="price-asc">Giá tăng dần</option>
            </select>
          </div>
        </div>

        <div className="results-info">Danh sách sản phẩm</div>
      </div>

      <div className="product-list">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetail={() => handleViewDetail(product)}
              onBuyNow={() => handleBuyNow(product)}
            />
          ))
        ) : (
          <div className="no-products">Không có sản phẩm nào.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryProduct;
