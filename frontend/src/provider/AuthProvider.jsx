// import axios from "axios";
// import { createContext, useContext, useEffect, useMemo, useState } from "react";

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   // State to hold the authentication token
//   const [token, setToken_] = useState(localStorage.getItem("token"));

//   // Function to set the authentication token
//   const setToken = (newToken) => {
//     setToken_(newToken);
//   };

//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = "Bearer " + token;
//       localStorage.setItem('token',token);
//     } else {
//       delete axios.defaults.headers.common["Authorization"];
//       localStorage.removeItem('token')
//     }
//   }, [token]);

//   // Memoized value of the authentication context
//   const contextValue = useMemo(
//     () => ({
//       token,
//       setToken,
//     }),
//     [token]
//   );

//   // Provide the authentication context to the children components
//   return (
//     <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export default AuthProvider;


// src/provider/AuthProvider.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); 

  const login = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ✅ THIS LINE IS MISSING IN YOUR FILE
export default AuthProvider;
