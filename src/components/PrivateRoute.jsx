import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const token = document.cookie;
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!token) {
        navigate("/login", { replace: true });
      }
    }, [navigate, token]);
  
    return token ? children : null;
  };
  
  export default PrivateRoute