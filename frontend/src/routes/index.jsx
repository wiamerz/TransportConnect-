import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import RedirectIfAuth from "./RedirectIfAuth";

import Home from "../components/home";
import RegistreForm from "../components/Registre";
import Profile from "../components/Profile";

import LoginForm from "../components/Login";

const Routes = () => {
  const { token } = useAuth();

  const router = createBrowserRouter([
    // Root redirect based on auth
    {
      path: "/",
      element: token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />,
    },

    // Protected Routes (only accessible if authenticated)
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },

    // Public Routes (only accessible if NOT authenticated)
    {
      element: <RedirectIfAuth />,
      children: [
        {
          path: "/login",
          element: <LoginForm />,
        },
        {
          path: "/registre",
          element: <RegistreForm />,
        },
      ],
    },

    // (404)
    {
      path: "*",
      element: (
        <div className="text-center p-10 text-red-600 text-lg font-semibold">
          404 - Page non trouvée
        </div>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
