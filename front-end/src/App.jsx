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
import SearchResult from "./components/web/SearchResult";
import ProductDetail from "./components/web/ProductDetail";
import BuyNow from "./components/web/BuyNow";
import ProfileEdit from "./components/web/ProfileEdit";
import PasswordEdit from "./components/web/PasswordEdit";
import Dashboard from "./components/dashboard/Dashboard";

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
          <Route path="/buy-now" element={<BuyNow />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
