// ProductPreviewDropdown.js
import React from 'react';
import useRandomProductsByCategory from '../../hooks/useRandomProductsByCategory';
import { useNavigate } from 'react-router-dom';

function ProductPreviewDropdown({ categoryId }) {
  const products = useRandomProductsByCategory(categoryId, 3);
  const navigate = useNavigate();

  const handleViewDetail = (product) => {
    navigate(`/detail/${product.id}`);
  };

  return (
    <div className="dropdown-right">
      {Array.isArray(products) && products.map((i) => (
        <div className="product-preview" key={i.id} onClick={()=>handleViewDetail(i)}>
          <img
            src={i.feature_image_path?.startsWith('http')
              ? i.feature_image_path
              : `http://127.0.0.1:8000/storage/${i.feature_image_path || ''}`}
            alt={i.name}
          />
          <p>{i.name}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductPreviewDropdown;
