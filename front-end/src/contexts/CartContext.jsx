import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import cartApi from '../services/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const { isAuthenticated } = useAuth();
  const hasFetched = useRef(false);

  const fetchCart = async () => {
    try {
      setLoading(true); // ✅ bắt đầu loading
      const res = await cartApi.getCart();
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Lỗi tải giỏ hàng:', err);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false); // ✅ kết thúc loading
    }
  };

  const addItem = async (product_id, quantity = 1) => {
    await cartApi.addToCart({ product_id, quantity });
    await fetchCart();
  };

  const updateItem = async (id, quantity) => {
    await cartApi.updateQuantity(id, { quantity });
    await fetchCart();
  };

  const removeItem = async (id) => {
    await cartApi.removeItem(id);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartApi.clearCart();
    await fetchCart();
  };

  const checkout = async (info) => {
    const res = await cartApi.checkout(info);
    await fetchCart();
    return res;
  };

  useEffect(() => {
    if (isAuthenticated && !hasFetched.current) {
      fetchCart();
      hasFetched.current = true;
    }

    if (!isAuthenticated) {
      setItems([]);
      setTotal(0);
      hasFetched.current = false;
      setLoading(false); // ✅ tránh bị kẹt ở trạng thái loading
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        loading, // ✅ xuất ra để dùng trong /cart, /checkout
        addItem,
        updateItem,
        removeItem,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
