import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import "../ui/sideBar.css";
import Modal from "react-modal";
import { IoHome, IoPersonCircleSharp, IoCash } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { RiParkingBoxFill, RiDashboard3Fill } from "react-icons/ri";
import { FcAbout } from "react-icons/fc";
import { RiAdminLine , RiMapPin2Line } from "react-icons/ri";
import ModalConnexion from "./modalConnexion";

// Configuration de React Modal
Modal.setAppElement("#root");

const SideBarNav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const handleRecouvrementClick = (e) => {
  //   e.preventDefault();
  //   setIsModalOpen(true);
  // };

  const handleProtectedAccess = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/recovery");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    navigate("/recovery");
  };

  const handleLogin = () => {
    if (username === "user" && password === "12345") {
      setIsModalOpen(false);
      navigate("/recovery");
    } else {
      alert("Nom d'utilisateur ou mot de passe incorrect");
      setIsModalOpen(false);
      navigate("/");
    }
  };

  return (
    <div>
      <aside className="sidebar sidebar2">
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <IoHome className="icon-margin" />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/planning"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <FaCalendarAlt className="icon-margin" />
                Planning
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/drivers"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <IoPersonCircleSharp className="icon-margin" />
                Drivers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/parking"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <RiParkingBoxFill className="icon-margin" />
                Parc Auto
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/recovery"
                // onClick={handleRecouvrementClick}
                onClick={handleProtectedAccess}
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <IoCash className="icon-margin" />
                Recouvrement
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <RiDashboard3Fill className="icon-margin" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <FcAbout className="icon-margin" />
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/SuiviGeoPage"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <RiMapPin2Line className="icon-margin" />
                localisation
              </NavLink>
            </li>
          </ul>
          <NavLink to="/admin/validation">
            <RiAdminLine className="icon-margin" />
            Validation des comptes
          </NavLink>
        </nav>
      </aside>

      {/* Modal de connexion */}
      {/* <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <h2 style={{ textAlign: "center" }}>Connexion</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
          <button onClick={handleLogin}>Se connecter</button>
          <button onClick={() => setIsModalOpen(false)}>Annuler</button>
        </div>
      </Modal> */}
      <ModalConnexion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default SideBarNav;
