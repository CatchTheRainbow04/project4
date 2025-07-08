
import TopHeader from "../components/web/TopHeader";
import Navbar from "../components/web/Navbar";
import Footer from "../components/web/Footer";
import { Outlet } from "react-router-dom";

const PublicLayout = () => (
  <>
    <TopHeader />
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

export default PublicLayout;