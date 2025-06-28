import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("tokenExpiration");

    if (!token || !expiration) {
      setIsAuthenticated(false);
      return;
    }

    const now = Date.now();

    if (now > parseInt(expiration, 10)) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }

    // Vérifie toutes les 10 secondes si le token est expiré
    const interval = setInterval(() => {
      const expiration = localStorage.getItem("tokenExpiration");
      if (expiration && Date.now() > parseInt(expiration, 10)) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        setIsAuthenticated(false);
        window.location.href = "/"; // rediriger
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return { isAuthenticated };
}
