
import "../../styles/user/css/Footer.css";

function Footer() {
  return (
    <footer className="site-footer dark:bg-black">

  <div className="footer-container">
    {/* <!-- Cột 1: Hỗ trợ khách hàng --> */}
    
    <div className="footer-column">
      <h3>HỖ TRỢ KHÁCH HÀNG</h3>
      <ul>
        <li>Hướng dẫn mua hàng</li>
        <li>Hướng dẫn chọn size</li>
        <li>Phương thức thanh toán</li>
        <li>Chính sách vận chuyển</li>
        <li>Chính sách bảo mật</li>
        <li>Quy định đổi trả</li>
        <li>Chính sách xử lý khiếu nại</li>
      </ul>
    </div>

    {/* <!-- Cột 2: Về chúng tôi --> */}
    <div className="footer-column">
      <h3>VỀ CHÚNG TÔI</h3>
      <p><strong>Hộ kinh doanh ATINO</strong></p>
      <p><strong>Địa chỉ:</strong> Số 110 Phố Nhổn, Phường Tây Tựu, Quận Bắc Từ Liêm, Tp. Hà Nội</p>
      <p><strong>Mã số doanh nghiệp:</strong> 01D-8004624</p>
      <p><strong>Email:</strong> atino@atino.vn</p>
    </div>

    {/* <!-- Cột 3: Hệ thống cửa hàng --> */}
    <div className="footer-column">
      <h3>HỆ THỐNG CỬA HÀNG</h3>
      <ul>
        <p>Hà Nội:</p>
            <li>▪️110 Phố Nhổn</li>
            <li>▪️1221 Giải Phóng</li>
            <li>▪️154 Quang Trung - Hà Đông</li>
            <li>▪️34 Trần Phú - Hà Đông</li>
            <li>▪️208 Bạch Mai</li>
            <li>▪️49 Chùa Bộc</li>
            <li>▪️116 Cầu Giấy</li>
            <li>▪️290 Nguyễn Trãi - Trung Văn</li>

      </ul>
      
    </div>

    {/* <!-- Cột 4: Facebook --> */}
    <div className="footer-column">
      <div className="facebook-box">
        <div className="facebook-header">
          {/* <img src="https://via.placeholder.com/40" alt="ATINO"> */}
          <div>
            <strong>DBQ <span className="checkmark">✔</span></strong>
            536.282 người theo dõi
          </div>
        </div>
        <button className="fb-follow-button">Theo dõi Trang</button>
      </div>
    </div>
  </div>
</footer>
  );
}

export default Footer;
