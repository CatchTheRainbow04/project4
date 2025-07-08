import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/user/css/Navbar.css"; 
import categoryApi from '../../services/categoryApi';
import ProductPreviewDropdown from './ProductPreviewDropdown';
import logo from '../../images/LOGO-removebg-preview.png';
import ThemeToggle from '../ThemeToggle';

function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryApi.tree().then((res) => {
      setCategories(res.data);
    }).catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="navbar dark:bg-black bg-white">
      {/* Box trái - logo */}
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo dark:invert " />
        </Link>
      </div>

      {/* Box giữa - menu */}
      <div className="navbar-center">
        <ul className="navbar-menu">
          <li className="has-dropdown"><Link to="/">TRANG CHỦ</Link></li>
          {categories.map(cat => (
            <li key={cat.id} className="has-dropdown">
              <Link to={`/${cat.slug}`}>{cat.name}</Link>
              {cat.children && (
                <div className="dropdown-menu">
                  <div className="dropdown-left">
                    <ul>
                      {cat.children.map(i => (
                        <li className="root-category" key={i.id}>
                          <Link to={`/${i.slug}`}>{i.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ProductPreviewDropdown categoryId={cat.id} />
                </div>
              )}
            </li>
          ))}
          {/* <li><Link to="/map">TÌM CỬA HÀNG</Link></li>
          <li><Link to="/lienhe">THÔNG TIN</Link></li> */}
        </ul>
      </div>

      {/* Box phải - tài khoản */}
      <div className="navbar-right">
                  <ThemeToggle />
        <div className="search-bar">
        <form onSubmit={handleSubmit} >
                    <input type="text" placeholder="Tìm kiếm..." value={query}
        onChange={(e) => setQuery(e.target.value)}/>
          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;