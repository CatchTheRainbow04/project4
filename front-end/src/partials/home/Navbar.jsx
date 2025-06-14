
import React, { Children, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css"; 
import categoryApi from '../../services/categoryApi';

function Navbar() {
  const [categories,setCategories] = useState([]);

  useEffect(()=>{
    categoryApi.tree().then((res)=>{
      setCategories(res.data);
    }).catch(console.error)
  }, []);
  return (
    <nav className="navbar">
      {/* Box trái - logo */}
      <div className="navbar-left">
        <Link to="/">
          <img src="/src/images/LOGO.png" alt="Logo" className="logo" />
        </Link>
      </div>

      {/* Box giữa - menu */}
      <div className="navbar-center">
        <ul className="navbar-menu">
          <li><Link to="/">TRANG CHỦ</Link></li>
          {categories.map(cat => (
  <li key={cat.id} className="has-dropdown">
    <Link to={`/${cat.slug}`}>{cat.name}</Link>
    {cat.children && (
      <div className="dropdown-menu-shirt">
        <div className="dropdown-left">
          <ul>
            {cat.children.map(i => (
              <li key={i.id}>
                <Link to={`/${i.slug}`}>{i.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="dropdown-right">Chưa có</div>
      </div>
    )}
  </li>
))}
          <li><Link to="/map">TÌM CỬA HÀNG</Link></li>
          <li><Link to="/lienhe">THÔNG TIN</Link></li>
        </ul>
      </div>

      {/* Box phải - tài khoản */}
      <div className="navbar-right">
        <div>
          <Link to="/dangnhap" className="account-link">Tài Khoản</Link>
          <Link to="/giohang" className="account-link">Giỏ Hàng</Link>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm..." />
          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
      </div>
    </nav>
  );
}

export default Navbar;