import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to dashboard
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return null;
};

export default SubscriptionSuccess;
