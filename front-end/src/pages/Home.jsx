// src/pages/HomePage.jsx
import React , { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/user/css/Home.css';
import Navbar from "../partials/home/Navbar";
import Footer from "../partials/home/Footer";
import productApi from "../services/productApi"
import categoryApi from "../services/categoryApi";


function Home() {
const [products, setProducts] = useState([]);
const [categories,setCategories] = useState([]);

  useEffect(()=>{
    categoryApi.tree().then((res)=>{
      setCategories(res.data);
    }).catch(console.error)
  }, []);

  useEffect(() => {
    productApi.getAll().then((res) => {
      setProducts(res.data);

    }).catch(console.error);
  }, []);
      console.log(products);
  return (
    <>
    <Navbar/>
    <div className="homepage-container">
      <div className="category-bar">
{
  Array.isArray(categories) ? (
    categories.map(category => {
      if (category.name.normalize("NFC").toLowerCase() === "áo xuân hè".normalize("NFC").toLowerCase()) {
        return (
          <React.Fragment key={category.id}>
            <Link to="/" className="category-item large-font" >{category.name}</Link>
            {Array.isArray(category.children) ? (
              category.children.map(i => (
                <div key={i.id} className="category-item">{i.name}</div>
              ))
            ) : null}
          </React.Fragment>
        );
      }
      return null;
    })
  ) : null
}
      </div>
      <div className="product-list">
      
      {
  products.map(product => {
    if (product.category && product.category.parent_id === 1) { // Kiểm tra product.category
      return (
        <React.Fragment key={product.id}>
          <div className="product-card">
            <div className="product-items">
              <img
                src={
                  product.feature_image_url.startsWith('http')
                    ? product.feature_image_url
                    : `http://127.0.0.1:8000${product.feature_image_url}`
                }
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </div>
            <div className="product-buttons">
              <button className="btn-cart">Thêm vào giỏ</button>
              <button className="btn-buy">Chi Tiết</button>
            </div>
          </div>
        </React.Fragment>
      );
    }
    return null;
  })
}
      {/* {products.map(product=>(
        <div key={product.id} className="product-card">
            <div className="product-items">
          <img src={product.feature_image_path.startsWith('http')
                              ? product.feature_image_path
                              : `http://127.0.0.1:8000${product.feature_image_url}`}
                            alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div>
      ))} */}

      </div>
      <div className="category-bar">
          <div className="category-item large-font" >QUẦN</div>
            <div className="category-item">QUẦN DÀI</div>
            <div className="category-item">QUẦN SHORT</div>
      </div>
      <div className="product-list">
        <div className="product-card">
            <div className="product-items">
          <img src="src/images/quan1.jpg" alt="Sản phẩm 1" />
          <h3>Quần Short Fitted L.4.1626</h3>
          <p>99,000₫</p>
          </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div>
        <div className="product-card">
            <div className="product-items">
          <img src="src/images/quan2.jpg" alt="Sản phẩm 2" />
          <h3>Quần Short Fitted L.5.1627</h3>
          <p>99,000₫</p>
          </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div><div className="product-card">
            <div className="product-items">
          <img src="src/images/quan3.jpg" alt="Sản phẩm 3" />
          <h3>Quần Short Regular L.1.1647</h3>
          <p>149,000₫</p>
          </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div><div className="product-card">
            <div className="product-items">
          <img src="src/images/quan4.jpg" alt="Sản phẩm 4" />
          <h3>Quần Short Regular L.1.1640</h3>
          <p>149,000₫</p>
          </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div><div className="product-card">
            <div className="product-items">
          <img src="src/images/quan5.jpg" alt="Sản phẩm 5" />
          <h3>Quần Short Fitted 30.2.1667</h3>
          <p>169,000₫</p>
          </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div><div className="product-card">
            <div className="product-items">
          <img src="src/images/quan6.jpg" alt="Sản phẩm 6" />
          <h3>Quần Short Regular L.3.1648</h3>
          <p>119,000₫</p>
          </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div><div className="product-card">
            <div className="product-items">
          <img src="src/images/quan7.jpg" alt="Sản phẩm 7" />
          <h3>Quần Short Regular L.4.1654</h3>
          <p>189,000₫</p>
          </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div><div className="product-card">
            <div className="product-items">
          <img src="src/images/quan8.jpg" alt="Sản phẩm 8" />
          <h3>Quần Short Regular L.3.1659</h3>
          <p>169,000₫</p>
          </div>
            <div className="product-buttons">
                <button className="btn-cart">Thêm vào giỏ</button>
                <button className="btn-buy">Chi Tiết</button>
            </div>
        </div>
        

        {/* <div> adumavtec</div> */}


      </div>
      <div className="category-bar">
          <div className="category-item large-font" >PHỤ KIỆN</div>
            <div className="category-item">TÚI/BALO</div>
            <div className="category-item">GIÀY DÉP</div>
            <div className="category-item">DÂY LƯNG</div>
            <div className="category-item">MŨ</div>
            <div className="category-item">QUẦN LÓT</div>
            <div className="category-item">TẤT</div>
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
      <div className="img-Store">
        <img src='src/images/imgStore.jpeg' width="100%" height="50%"/>
      </div>

      
    </div>
    <Footer/>
    </>
  );
}

export default Home;