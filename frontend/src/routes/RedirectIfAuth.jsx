import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';

const RedirectIfAuth = () => {
  const { token } = useAuth();

  return token ? <Navigate to="/conducteurDashbord" /> : <Outlet />;
};

export default RedirectIfAuth;

