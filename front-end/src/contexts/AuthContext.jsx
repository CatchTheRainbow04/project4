import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  // Load user từ token nếu có
  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        try {
          const res = await axiosClient.get("/me");
          setUser(res.data.user);
        } catch (err) {
          setAccessToken(null);
          setUser(null);
          localStorage.removeItem("access_token");
          delete axiosClient.defaults.headers.common["Authorization"];
        }
      }
      setIsAuthLoaded(true);
    };

    fetchUser();
  }, [accessToken]);

  const login = async (data) => {
  try {
    const res = await axiosClient.post("/login", data);
    const token = res.data.access_token;

    localStorage.setItem("access_token", token);
    setAccessToken(token);
    setUser(res.data.user);
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi đăng nhập" };
  }
};

  const register = async (data) => {
  try {
    const res = await axiosClient.post("/register", data);
    const token = res.data.access_token;

    localStorage.setItem("access_token", token);
    setAccessToken(token);
    setUser(res.data.user);
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi đăng ký" };
  }
};
  const logout = async () => {
    try {
      await axiosClient.post("/logout");
    } catch (_) {}
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    delete axiosClient.defaults.headers.common["Authorization"];
  };

  const updateUser = async (data) => {
  try {
    const res = await axiosClient.put("/me/update-info", data);
    setUser(res.data.user);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi không xác định" };
  }
};

const updatePassword = async (data) => {
  try {
    const res = await axiosClient.put("/me/update-password", data);
    setUser(res.data.user);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi không xác định" };
  }
};


  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isAuthLoaded,
        login,
        logout,
        register,
        updateUser,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
