// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import "./Bag.css";

function Bag() {
  return (
    <div className="bag-container">
        <div className="home-bar">
        <Link to="/" className="home-link">
          <i className="fas fa-home"> </i> Trang chủ
        </Link>
        <span className="divider">|</span>
        <li className="category-name">PHỤ KIỆN</li>
      </div>
      <div className="bag-page">
      <h2 className="category-title">PHỤ KIỆN</h2>

      <div className="filter-sort-container">
        <div className="filters">
          <span className="filter-label"><i></i> BỘ LỌC</span>          
              <div className="filter-dropdown-group">
                <div className="dropdown-items">
                  <span className="dropdown"><strong>Màu sắc</strong><i className="fas fa-chevron-down"></i></span>
                  <span className="dropdown"><strong>Kích cỡ</strong> <i className="fas fa-chevron-down"></i></span>
                  <span className="dropdown"><strong>Khoảng giá</strong> <i className="fas fa-chevron-down"></i></span>
                </div>

                <div className="dropdown-box">
                  <div className="dropdown-section">
                    {/* <strong>Màu sắc</strong> */}
                    <div className="color-grid">
                      <div className="color-option" style={{ backgroundColor: '#ffffff' }} title="Trắng"></div>
                      <div className="color-option" style={{ backgroundColor: '#808080' }} title="Ghi"></div>
                      <div className="color-option" style={{ backgroundColor: '#F5F5DC' }} title="Be"></div>
                      <div className="color-option" style={{ backgroundColor: '#556B2F' }} title="Rêu"></div>
                      <div className="color-option" style={{ backgroundColor: '#FFC0CB' }} title="Hồng"></div>
                      <div className="color-option" style={{ backgroundColor: '#8B4513' }} title="Nâu"></div>
                      <div className="color-option" style={{ backgroundColor: '#800000' }} title="Đỏ mận"></div>
                      <div className="color-option" style={{ backgroundColor: '#D3D3D3' }} title="Ghi nhạt"></div>
                      <div className="color-option" style={{ backgroundColor: '#696969' }} title="Ghi đậm"></div>
                      <div className="color-option" style={{ backgroundColor: '#87CEEB' }} title="Xanh da trời"></div>
                      <div className="color-option" style={{ backgroundColor: '#36454F' }} title="Than"></div>
                      <div className="color-option" style={{ backgroundColor: '#000000' }} title="Đen"></div>
                      <div className="color-option" style={{ backgroundColor: '#FF0000' }} title="Đỏ"></div>
                      <div className="color-option" style={{ backgroundColor: '#A52A2A' }} title="Nâu Nhạt"></div>
                      <div className="color-option" style={{ backgroundColor: '#36454F' }} title="Than"></div>
                      <div className="color-option" style={{ backgroundColor: '#5C4033' }} title="Nâu Đậm"></div>
                    </div>
                  </div>

                  <div className="dropdown-section">
                    {/* <strong>Kích cỡ</strong><br /> */}
                    <label><input type="checkbox" /> 44</label><br />
                    <label><input type="checkbox" /> 43</label><br />
                    <label><input type="checkbox" /> 42</label><br />
                    <label><input type="checkbox" /> 41</label><br />
                    <label><input type="checkbox" /> 40</label><br />
                    <label><input type="checkbox" /> 39</label><br />
                    <label><input type="checkbox" /> 3XL</label><br />
                    <label><input type="checkbox" /> 2XL</label><br />
                    <label><input type="checkbox" /> XL</label><br />
                    <label><input type="checkbox" /> L</label><br />
                    <label><input type="checkbox" /> M</label><br />
                    <label><input type="checkbox" /> S</label>
                  </div>

                  <div className="dropdown-section">
                    {/* <strong>Khoảng giá</strong><br /> */}
                    <label><input type="checkbox" /> Dưới 200,000</label><br />
                    <label><input type="checkbox" /> Từ 200,000 - 500,000</label><br />
                    <label><input type="checkbox" /> Từ 500,000 - 1,000,000</label><br />
                    <label><input type="checkbox" /> Trên 1,000,000</label>
                  </div>
                </div>
              </div>
          </div>

          
        <div className="sort">
          <span><strong>Sắp xếp theo:</strong></span>
          <span className="dropdown">Mới nhất <i className="fas fa-chevron-down"></i></span>
        </div>
      </div>
    </div>
    <div className="product-list">
        <div className="product-card">
            <div className="product-items">
              <img src="src/images/dep1.jpg" alt="Sản phẩm 1" />
              <h3>Dép Da 1.9804</h3>
              <p>189,000₫</p>
            </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div>
        <div className="product-card">
            <div className="product-items">
              <img src="src/images/dep2.jpg" alt="Sản phẩm 2" />
              <h3>Dép Da 2.9805</h3>
              <p>189,000₫</p>
            </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div>
        <div className="product-card">
            <div className="product-items">
              <img src="src/images/dep3.jpg" alt="Sản phẩm 3" />
              <h3>Dép Da 2.9806</h3>
              <p>189,000₫</p>
            </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div>
        <div className="product-card">
            <div className="product-items">
              <img src="src/images/mu1.jpg" alt="Sản phẩm 4" />
              <h3>M204 Mũ Colorado Since 1977</h3>
              <p>129,000₫</p>
            </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div>
        <div className="product-card">
            <div className="product-items">
              <img src="src/images/mu2.jpg" alt="Sản phẩm 5" />
              <h3>M203 Mũ Colorado</h3>
              <p>129,000₫</p>
            </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div>
        <div className="product-card">
            <div className="product-items">
              <img src="src/images/mu3.jpg" alt="Sản phẩm 6" />
              <h3>M202 Mũ P</h3>
              <p>129,000₫</p>
            </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div>
        <div className="product-card">
            <div className="product-items">
              <img src="src/images/mu4.jpg" alt="Sản phẩm 7" />
              <h3>M201 Mũ Moormoor</h3>
              <p>129,000₫</p>
            </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div>
        <div className="product-card">
            <div className="product-items">
              <img src="src/images/giay1.jpg" alt="Sản phẩm 8" />
              <h3>Giày Thể Thao 1.9816</h3>
              <p>399,000₫</p>
              </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div>
      </div>
    </div>
  );
  }
 export default Bag;

