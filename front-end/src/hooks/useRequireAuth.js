import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function useRequireAuth(redirectTo = "/signin", message = "") {
  const { isAuthenticated, isAuthLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoaded) return;

    if (!isAuthenticated) {
      if (message == "") {
        navigate(redirectTo);
      } else {
        toast.warning(message);
        navigate(redirectTo);
      }
    }
  }, [isAuthenticated, isAuthLoaded, navigate, message, redirectTo]);

  return isAuthLoaded && isAuthenticated;
}
