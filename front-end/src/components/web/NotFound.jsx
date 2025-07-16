import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // 3 giây

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">404 - Không tìm thấy trang</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Có vẻ như bạn đã nhập sai URL hoặc trang không tồn tại.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Đang chuyển hướng về trang chủ trong giây lát...
      </p>
    </div>
  );
}

export default NotFound;
