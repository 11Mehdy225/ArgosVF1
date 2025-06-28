import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // ✅ syntaxe correcte


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    const interval = setInterval(() => {
      const savedToken = localStorage.getItem("token");
      setIsAuthenticated(!!savedToken);
    }, 1000 * 60); // vérifie toutes les minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      let timer;
  
      const resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          logout();
          toast.info("Session expirée. Veuillez vous reconnecter.");
        }, 30 * 60 * 1000); // 30 minutes
      };
  
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("click", resetTimer);
      window.addEventListener("keypress", resetTimer);
  
      resetTimer(); // initialisation
  
      return () => {
        clearTimeout(timer);
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("click", resetTimer);
        window.removeEventListener("keypress", resetTimer);
      };
    }
  }, [isAuthenticated]);
  

  

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    setIsAuthenticated(true);
    const decoded = jwtDecode(token);
  setUser({ username: decoded.username});
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
