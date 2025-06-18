// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../provider/AuthProvider";

// export const ProtectedRoute = () => {
//     const { token } = useAuth();
  
//     // Check if the user is authenticated
//     if (!token) {
//       // If not authenticated, redirect to the login page
//       return <Navigate to="/profile" />;
//     }
  
//     // If authenticated, render the child routes
//     return <Outlet />;
//   };

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

export const ProtectedRoute = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};