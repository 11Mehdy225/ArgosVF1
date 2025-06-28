import React, { useContext ,useState } from "react";
import "../App.css";
import brand from "../assets/argos.webp";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon, FaSignInAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ModalConnexion from "./modalConnexion";
import { FaUserCircle } from "react-icons/fa";




const Header = () => {

  const { user } = useAuth();

  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className={`header-container ${darkMode ? "dark" : ""}`}>
      <div className="header-left">
        <img src={brand} alt="Logo" className="brand-logo" />
        <h1 className="app-title">Argos - Gestion de flotte</h1>
      </div>

      <div className="header-right">
        <span className="current-date">{today}</span>

        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaUserCircle size={24} />
              <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Bonjour, <strong>{user?.username}</strong></span>
              <img src={user?.photo} alt="user" style={{ width: 30, height: 30, borderRadius: "50%" }} />
        <button className="login-button" onClick={logout}>
          <FaSignInAlt style={{ marginRight: "5px" }} />
         Se deconnecter
        </button> 
        </div>
        ):(
            <button className="login-button" onClick={() => setIsModalOpen(true)}>Connexion</button>
          )}
         <ModalConnexion isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </header>
  );
};

export default Header;
