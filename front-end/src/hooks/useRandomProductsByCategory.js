import { useEffect, useState } from 'react';
import productApi from '../services/productApi';

function useRandomProductsByCategory(categoryId, limit) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) return;

    productApi.getProductsByCategory(categoryId)
      .then((res) => {
        const all = res.data || [];

        const random = all
          .sort(() => 0.5 - Math.random())
          .slice(0, limit);

        setProducts(random);
      })
      .catch((error) => {
        console.error(`Error fetching products for category ${categoryId}:`, error.response?.data || error.message);
      });
  }, [categoryId, limit]);

  return products;
}

export default useRandomProductsByCategory;
