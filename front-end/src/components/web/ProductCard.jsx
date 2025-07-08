import React from 'react';
import PropTypes from 'prop-types';
import { formatPriceVND } from '../../utils/Utils';

function ProductCard({ product, onAddToCart, onViewDetail,onBuyNow }) {
  if (!product) return null;

  const imageUrl =
    product.feature_image_path?.startsWith('http')
      ? product.feature_image_path
      : `http://127.0.0.1:8000/storage/${product.feature_image_path || ''}`;

  return (
    <div className="product-card">
      <div className="product-items" onClick={() => onViewDetail?.(product)}>
        <img src={imageUrl} alt={product.name} />
        <h5 className="dark:text-black">{product.name}</h5>
        <p>{formatPriceVND(product.price)}</p>
      </div>
      <div className="product-buttons">
        <button className="btn-cart" onClick={() => onAddToCart?.(product)}>
          Thêm vào giỏ
        </button>
        <button className="btn-buy" onClick={() => onBuyNow?.(product)}>
          Mua ngay
        </button>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func,
  onViewDetail: PropTypes.func,
};

export default ProductCard;
