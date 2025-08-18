import api from "@/lib/api";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const Protected = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) {
      navigate("/login", { replace: true });
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setIsVerified(true);
        } else {
          throw new Error("Token not valid");
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate, token, user]);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="bg-black text-white"><Loader2 className="animate-spin"/>Loading</div>; 
  }

  if (!isVerified) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default Protected;
