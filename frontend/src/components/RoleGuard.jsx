import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RoleGuard = ({ roles, children }) => {
  const user = useAuthStore((state) => state.user);
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default RoleGuard;
