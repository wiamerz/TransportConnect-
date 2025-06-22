import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import RedirectIfAuth from "./RedirectIfAuth";

import Home from "../components/home";
import RegistreForm from "../components/Registre";
import Profile from "../components/Profile";
import LoginForm from "../components/Login";
import ConducteurDashbord from "../components/ConducteurDashbord";
import Annonces from "../components/Annonces";
import Historique from "../components/Historique"

const Routes = () => {
  const { token } = useAuth();

  const router = createBrowserRouter([
    // Root redirect based on auth
    {
      path: "/",
      element: token ? <Navigate to="/profile" replace /> : <Navigate to="/home" replace />,
    },

    // Public route accessible to everyone (even if logged in)
    {
      path: "/home",
      element: <Home />,
    },

    // Protected Routes (only if authenticated)
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/ConducteurDashbord",
          element: <ConducteurDashbord />,
        },
        {
          path: "/Annonces",
          element: <Annonces/>,
        },
        {
          path: "/historique",
          element: <Historique/>,
        },
      ],
    },

    // Routes only accessible if NOT authenticated
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

    // 404 page
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
