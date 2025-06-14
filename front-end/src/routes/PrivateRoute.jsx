import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token"); // vẫn dùng key access_token để đồng bộ với LoginPage
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;