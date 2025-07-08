// src/hooks/useProductFilter.js
import { useMemo, useState } from "react";

const useProductFilter = (allProducts) => {
  const [priceFilter, setPriceFilter] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  // Lọc theo giá
  const filterProductsByPrice = (products) => {
    if (priceFilter.length === 0) return products;

    return products.filter((product) => {
      const price = product.price;
      return priceFilter.some((range) => {
        switch (range) {
          case "under-200k":
            return price < 200000;
          case "200k-500k":
            return price >= 200000 && price <= 500000;
          case "500k-1m":
            return price >= 500000 && price <= 1000000;
          case "over-1m":
            return price > 1000000;
          default:
            return false;
        }
      });
    });
  };

  // Sắp xếp
  const sortProducts = (products) => {
    const sorted = [...products];
    switch (sortOption) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
        );
    }
  };

  // Kết quả sau lọc và sắp xếp
  const processedProducts = useMemo(() => {
    return sortProducts(filterProductsByPrice(allProducts));
  }, [allProducts, priceFilter, sortOption]);

  // Phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = processedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(processedProducts.length / productsPerPage);

  return {
    priceFilter,
    setPriceFilter,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    currentProducts,
    processedProducts,
    totalPages,
    indexOfFirstProduct,
    indexOfLastProduct,
  };
};

export default useProductFilter;
