import { Navigate, Outlet, useLocation } from "react-router-dom";

const LoginRedirect = () => {
  const location = useLocation();
  var isAuthenticated = localStorage.getItem('isLoggedIn');

  // logic to protect routes if user is not logged in
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default LoginRedirect;