import React from 'react'
import AuthProvider from "./provider/AuthProvider";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast"
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Registre';

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Toaster />
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;