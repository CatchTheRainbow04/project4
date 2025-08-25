# 🛍️ Fashion E-Commerce Shop

Dự án **E-Commerce Shop Thời Trang** được xây dựng nhằm mô phỏng một hệ thống bán hàng trực tuyến, với đầy đủ các chức năng như hiển thị sản phẩm, phân loại, tìm kiếm, giỏ hàng, đặt hàng và quản trị.

## 📌 Preview
👉 Xem preview dự án tại đây: [Google Drive Link](https://drive.google.com/file/d/1M_FaXZLnxAcARWXaRM_VavxTAZQQTugc/view)  
(Không cần clone code và cài đặt, bạn có thể xem trực tiếp demo UI/UX ở link trên.)

---

## 🚀 Tính năng chính
- 👕 Danh mục sản phẩm (thời trang nam/nữ, giày dép, phụ kiện…)
- 🔎 Tìm kiếm và lọc sản phẩm (theo giá, màu sắc, kích thước…)
- 🛒 Giỏ hàng (thêm, sửa, xóa sản phẩm)
- 📦 Đặt hàng và quản lý đơn hàng
- 👤 Quản lý tài khoản người dùng (đăng ký, đăng nhập, phân quyền)
- 📊 Trang quản trị (quản lý sản phẩm, đơn hàng, người dùng)

---

## 🛠️ Công nghệ sử dụng
### Backend
- [Laravel](https://laravel.com/) (PHP Framework)
- MySQL / MariaDB (Cơ sở dữ liệu)

### Frontend
- [ReactJS](https://reactjs.org/) (SPA)
- [TailwindCSS](https://tailwindcss.com/) (UI styling)
- Axios (API call)
- React Router DOM (quản lý route)

---

## ⚙️ Cài đặt & Chạy dự án
### Backend (Laravel)
```bash
**CSDL
-CHẠY FILE CSDL
**BACKEND
1.Cài các thư viện PHP
chạy terminal lệnh : composer install
Yêu cầu có composer và PHP >= 8.1
2.Tạo file .env và cấu hình
chạy lệnh cp .env.example .env
**Chỉnh sửa file .env để cấu hình:
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
3.Generate app key
Chạy lệnh php artisan key:generate
4.Chạy server Laravel
chạy lệnh php artisan serve
** Laravel sẽ chạy tại http://127.0.0.1:8000
**FRONTEND
1. Vào thư mục frontend
chạy cd ../frontend
2. Cài các thư viện
chạy npm install
3. Chạy React Dev Server
chạy npm run dev
Ứng dụng React sẽ chạy tại http://localhost:5173 (hoặc port khác tùy Vite/Webpack)
**TÀI KHOẢN QUẢN TRỊ
TK : doanhdoe@gmail.com
MK : 123456789
** các tài khoản khác phần lớn đều sử dụng mâtk khẩu là 123456 , 12345678 hoặc 123456789 , tên tài khoản có ở trong csdl
php artisan migrate --seed
php artisan serve
