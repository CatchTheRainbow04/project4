import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import GradientText from "../../Reactbits/GradientText/GradientText";
import ClickSpark from "../../ReactbitsAnimations/ClickSpark/ClickSpark";

import { useAuth } from "../contexts/AuthContext";
import useRequireAuth from "../hooks/useRequireAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "../css/style.css";

export default function DashboardLayout() {
  const isAuthenticated = useRequireAuth("/", "Vui lòng đăng nhập");
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && !user.roles.some((role) => role.name === "admin")) {
      toast.error("Bạn không có quyền truy cập trang này");
      navigate("/");
    }
  }, [user, navigate]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/dashboard") return "Dashboard";
    if (path === "/dashboard/categories") return "Danh mục sản phẩm";
    if (path === "/dashboard/categories/create") return "Thêm danh mục";
    if (path.includes("/dashboard/categories/edit/")) return "Sửa danh mục";
    if (path === "/dashboard/products") return "Sản phẩm";
    if (path === "/dashboard/products/create") return "Thêm sản phẩm";
    if (path.includes("/dashboard/products/edit/")) return "Sửa sản phẩm";
    if (path === "/dashboard/permissions") return "Phân quyền";
    if (path === "/dashboard/permissions/create") return "Thêm phân quyền";
    if (path.includes("/dashboard/permissions/edit/")) return "Sửa phân quyền";
    if (path === "/dashboard/sliders") return "Slider";
    if (path === "/dashboard/sliders/create") return "Thêm Slider";
    if (path.includes("/dashboard/sliders/edit/")) return "Sửa Slider";
    if (path === "/dashboard/roles") return "Vai trò";
    if (path === "/dashboard/roles/create") return "Thêm vai trò";
    if (path.includes("/dashboard/roles/edit/")) return "Sửa vai trò";
    if (path === "/dashboard/users") return "Người dùng";
    if (path === "/dashboard/users/create") return "Thêm người dùng";
    if (path.includes("/dashboard/users/edit/")) return "Sửa người dùng";
    if (path === "/dashboard/tags") return "Tags";
    if (path === "/dashboard/tags/create") return "Thêm tag";
    if (path.includes("/dashboard/tags/edit/")) return "Sửa tag";

    return "Dashboard";
  };

  if (!isAuthenticated || !user) return null;

  return (
    <>
      <ClickSpark
        sparkColor="#8470FF"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="grow">
              <div className="px-4 sm:px-6 lg:px-8 max-w-9xl mx-auto">
                <div className="sm:flex sm:justify-between sm:items-center mb-2">
                  <div className="mb-4 sm:mb-0">
                    <GradientText
                      colors={[
                        "#40ffaa",
                        "#4079ff",
                        "#40ffaa",
                        "#4079ff",
                        "#40ffaa",
                      ]}
                      animationSpeed={3}
                      showBorder={false}
                      className="custom-class text-4xl md:text-5xl font-bold"
                    >
                      <h1>{getPageTitle()}</h1>
                    </GradientText>
                  </div>
                </div>

                {/* Main content - Rendered by React Router */}
                <div className="gap-6">
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        </div>
      </ClickSpark>
    </>
  );
}
