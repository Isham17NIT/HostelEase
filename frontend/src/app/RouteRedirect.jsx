import { Navigate } from "react-router-dom";

const RootRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user && user.role === "student") {
    return <Navigate to="/student" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default RootRedirect
