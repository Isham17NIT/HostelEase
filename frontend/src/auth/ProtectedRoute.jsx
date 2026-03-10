import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, loading, role, children }) => {

  if(loading)
    return null;
  
  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) return <Navigate to="/login" />;

  return children; // means show content as access is now allowed
};

export default ProtectedRoute;
