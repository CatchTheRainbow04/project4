import React, { useState , useEffect } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Welcome from "./Welcome";

import GradientText from "../../../Reactbits/GradientText/GradientText";
import ClickSpark from "../../../ReactbitsAnimations/ClickSpark/ClickSpark";

import CategoriesTable from "../../features/categories/CategoriesTable";
import CategoryForm from "../../features/categories/CategoryForm";
import ProductsTable from "../../features/products/ProductsTable";
import ProductForm from "../../features/products/ProductForm";
import PermissionsTable from "../../features/permissions/PermissionsTable";
import PermissionForm from "../../features/permissions/PermissionForm";
import SlidersTable from "../../features/sliders/SlidersTable";
import SliderForm from "../../features/sliders/SliderForm";
import RolesTable from "../../features/roles/RolesTable";
import RoleForm from "../../features/roles/RoleForm";
import UsersTable from "../../features/users/UsersTable";
import UserForm from "../../features/users/UserForm";
import TagForm from "../../features/tags/TagForm";
import TagsTable from "../../features/tags/TagsTable";
import { useAuth } from "../../contexts/AuthContext";

import "../../css/style.css";

import useRequireAuth from "../../hooks/useRequireAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const isAuthenticated = useRequireAuth("/" , "Vui lòng đăng nhập");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  if (user && !user.roles.some((role) => role.name === "admin")) {
    toast.error("Bạn không có quyền truy cập trang này");
    navigate("/");
  }
}, [user, navigate]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mainContent, setMainContent] = useState("welcome");

  // State riêng cho mỗi loại nội dung chỉnh sửa
  const [editCategory, setEditCategory] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editPermission, setEditPermission] = useState(null);
  const [editSlider, setEditSlider] = useState(null);
  const [editRole, setEditRole] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editTag, setEditTag] = useState(null);

  // Dashboard
  const handleShowDashboard = () => {
    setMainContent("welcome");
    clearEditStates();
  };

  // Categories
  const handleShowCategories = (type = "categories") => {
    setMainContent(type);
    clearEditStates();
  };
  const handleEditCategory = (cat) => {
    setEditCategory(cat);
    setMainContent("categoryForm");
  };

  // Products
  const handleShowProducts = (type = "products") => {
    setMainContent(type);
    clearEditStates();
  };
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setMainContent("productForm");
  };

  // Permissions
  const handleShowPermissions = (type = "permissions") => {
    setMainContent(type);
    clearEditStates();
  };
  const handleEditPermission = (permission) => {
    setEditPermission(permission);
    setMainContent("permissionForm");
  };

  // Sliders
  const handleShowSliders = (type = "sliders") => {
    setMainContent(type);
    clearEditStates();
  };
  const handleEditSlider = (slider) => {
    setEditSlider(slider);
    setMainContent("sliderForm");
  };

  // Roles
  const handleShowRoles = (type = "roles") => {
    setMainContent(type);
    clearEditStates();
  };
  const handleEditRole = (role) => {
    setEditRole(role);
    setMainContent("roleForm");
  };
  // Users
  const handleShowUsers = (type = "users") => {
    setMainContent(type);
    clearEditStates();
  };
  const handleEditUser = (user) => {
    setEditUser(user);
    setMainContent("userForm");
  };
  // Tags
  const handleShowTags = (type = "tags") => {
    setMainContent(type);
    clearEditStates();
  };
  const handleEditTag = (tag) => {
    setEditTag(tag);
    setMainContent("tagForm");
  };
  // Xóa tất cả trạng thái chỉnh sửa
  const clearEditStates = () => {
    setEditCategory(null);
    setEditProduct(null);
    setEditPermission(null);
    setEditSlider(null);
    setEditRole(null);
    setEditUser(null);
    setEditTag(null);
  };

  const renderTitle = () => {
    switch (mainContent) {
      case "categories":
        return "Danh mục sản phẩm";
      case "categoryForm":
        return editCategory ? "Sửa danh mục" : "Thêm danh mục";
      case "products":
        return "Sản phẩm";
      case "productForm":
        return editProduct ? "Sửa sản phẩm" : "Thêm sản phẩm";
      case "permissions":
        return "Phân quyền";
      case "permissionForm":
        return editPermission ? "Sửa phân quyền" : "Thêm phân quyền";
      case "sliders":
        return "Slider";
      case "sliderForm":
        return editSlider ? "Sửa Slider" : "Thêm Slider";
      case "roles":
        return "Vai trò";
      case "roleForm":
        return editRole ? "Sửa vai trò" : "Thêm vai trò";
      case "users":
        return "Người dùng";
      case "userForm":
        return editUser ? "Sửa người dùng" : "Thêm người dùng";
      case "tags":
        return "Tags";
      case "tagForm":
        return editTag ? "Sửa tag" : "Thêm tag";
      default:
        return "Welcome";
    }
  };
  if(!isAuthenticated || !user) return null;
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
          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onShowDashboard={handleShowDashboard}
            onShowCategories={handleShowCategories}
            onShowProducts={handleShowProducts}
            onShowPermissions={handleShowPermissions}
            onShowSliders={handleShowSliders}
            onShowRoles={handleShowRoles}
            onShowUsers={handleShowUsers}
            onShowTags={handleShowTags}
          />

          {/* Content area */}
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className="grow">
              <div className="px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto">
                {/* Title */}
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
                      <h1>{renderTitle()}</h1>
                    </GradientText>
                  </div>
                </div>

                {/* Main content */}
                <div className="gap-6">
                  {mainContent === "welcome" && <Welcome />}

                  {mainContent === "categories" && (
                    <CategoriesTable onEditCategory={handleEditCategory} />
                  )}
                  {mainContent === "categoryForm" && (
                    <CategoryForm
                      initialData={editCategory || {}}
                      onCancel={() => setMainContent("categories")}
                    />
                  )}

                  {mainContent === "products" && (
                    <ProductsTable onEditProduct={handleEditProduct} />
                  )}
                  {mainContent === "productForm" && (
                    <ProductForm
                      initialData={editProduct || {}}
                      onCancel={() => setMainContent("products")}
                    />
                  )}

                  {mainContent === "permissions" && (
                    <PermissionsTable onEditPermission={handleEditPermission} />
                  )}
                  {mainContent === "permissionForm" && (
                    <PermissionForm
                      initialData={editPermission || {}}
                      onCancel={() => setMainContent("permissions")}
                    />
                  )}

                  {mainContent === "sliders" && (
                    <SlidersTable onEditSlider={handleEditSlider} />
                  )}
                  {mainContent === "sliderForm" && (
                    <SliderForm
                      initialData={editSlider || {}}
                      onCancel={() => setMainContent("sliders")}
                    />
                  )}

                  {mainContent === "roles" && (
                    <RolesTable onEditRole={handleEditRole} />
                  )}
                  {mainContent === "roleForm" && (
                    <RoleForm
                      initialData={editRole || {}}
                      onCancel={() => setMainContent("roles")}
                    />
                  )}
                  {mainContent === "users" && (
                    <UsersTable onEditUser={handleEditUser} />
                  )}
                  {mainContent === "userForm" && (
                    <UserForm
                      initialData={editUser || {}}
                      onCancel={() => setMainContent("users")}
                    />
                  )}
                  {mainContent === "tags" && (
                    <TagsTable onEditTag={handleEditTag} />
                  )}
                  {mainContent === "tagForm" && (
                    <TagForm
                      initialData={editTag || {}}
                      onCancel={() => setMainContent("tags")}
                    />
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </ClickSpark>
    </>
  );
}

export default Dashboard;
