import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";

//Public page
import Home from "./components/web/Home";
import Profile from "./components/web/Profile";
import Signin from "./components/web/Signin";
import Signup from "./components/web/Signup";
import CategoryProduct from "./components/web/CategoryProduct";
import Checkout from "./components/web/Checkout";
import Cart from "./components/web/Cart";
import Order from "./components/web/Order";
import UserOrderDetail from "./components/web/UserOrderDetail";
import SearchResult from "./components/web/SearchResult";
import ProductDetail from "./components/web/ProductDetail";
import BuyNow from "./components/web/BuyNow";
import ProfileEdit from "./components/web/ProfileEdit";
import PasswordEdit from "./components/web/PasswordEdit";
import NotFound from "./components/web/NotFound";

//Dashboard page
import Welcome from "./components/dashboard/Welcome";
import ProductsTable from "./features/products/ProductsTable";
import ProductForm from "./features/products/ProductForm";
import CategoriesTable from "./features/categories/CategoriesTable";
import CategoryForm from "./features/categories/CategoryForm";
import PermissionsTable from "./features/permissions/PermissionsTable";
import PermissionForm from "./features/permissions/PermissionForm";
import SlidersTable from "./features/sliders/SlidersTable";
import SliderForm from "./features/sliders/SliderForm";
import RolesTable from "./features/roles/RolesTable";
import RoleForm from "./features/roles/RoleForm";
import UsersTable from "./features/users/UsersTable";
import UserForm from "./features/users/UserForm";
import UserStatistics from "./features/users/UserStatistics";
import TagsTable from "./features/tags/TagsTable";
import TagForm from "./features/tags/TagForm";
import UserDetail from "./features/users/UserDetail";
import OrderDetail from "./features/orders/OrderDetail";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} />
      <Routes>
        {/* Public site layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/:slug" element={<CategoryProduct />} />
          <Route path="/detail/:id" element={<ProductDetail />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/password-edit" element={<PasswordEdit />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order/:id" element={<UserOrderDetail />} />
          <Route path="/buy-now" element={<BuyNow />} />
          <Route path="/not-found" element={<NotFound />} />
        </Route>

        {/* Dashboard layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Welcome />} />
          
          {/* Products */}
          <Route path="products" element={<ProductsTable />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          
          {/* Categories */}
          <Route path="categories" element={<CategoriesTable />} />
          <Route path="categories/create" element={<CategoryForm />} />
          <Route path="categories/edit/:id" element={<CategoryForm />} />
          
          {/* Permissions */}
          <Route path="permissions" element={<PermissionsTable />} />
          <Route path="permissions/create" element={<PermissionForm />} />
          <Route path="permissions/edit/:id" element={<PermissionForm />} />
          
          {/* Sliders */}
          <Route path="sliders" element={<SlidersTable />} />
          <Route path="sliders/create" element={<SliderForm />} />
          <Route path="sliders/edit/:id" element={<SliderForm />} />
          
          {/* Roles */}
          <Route path="roles" element={<RolesTable />} />
          <Route path="roles/create" element={<RoleForm />} />
          <Route path="roles/edit/:id" element={<RoleForm />} />
          
          {/* Users */}
          <Route path="users" element={<UsersTable />} />
          <Route path="users/create" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />
          <Route path="users/detail/:id" element={<UserDetail />} />
          <Route path="users/statistics" element={<UserStatistics />} />
          
          {/* Tags */}
          <Route path="tags" element={<TagsTable />} />
          <Route path="tags/create" element={<TagForm />} />
          <Route path="tags/edit/:id" element={<TagForm />} />
          { /* Order Detail */ 
          <Route path="/dashboard/orders/:id" element={<OrderDetail />} />}
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </>
  );
}

export default App;