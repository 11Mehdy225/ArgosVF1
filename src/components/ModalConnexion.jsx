import React, { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import RegisterUser from "./RegistrerUser";

Modal.setAppElement("#root");

const ModalConnexion = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Affichage personnalisé pour certaines erreurs
        if (response.status === 403) {
          toast.error("⚠️ Compte non validé. Veuillez attendre la validation d’un administrateur.");
        } else if (response.status === 401) {
          toast.error("❌ Nom d'utilisateur ou mot de passe incorrect.");
        } else {
          toast.error(`Erreur : ${data.message || "Erreur inconnue"}`);
        }
        return; // on arrête ici
      }

      const expirationTime = Date.now() + 30 * 60 * 1000; // 30 minutes
      localStorage.setItem("token", data.token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());

    //   localStorage.setItem("token", data.token);
    login(data.token);
    toast.success("Connexion réussie ✅");
    onClose();
    onSuccess && onSuccess();
  } catch (err) {
    toast.error(`Erreur de connexion : ${err.message}`);
  }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <button onClick={handleLogin}>Se connecter</button>
        <button onClick={onClose}>Annuler</button>
      </div>
      <p style={{ marginTop: "10px", textAlign: "center" }}>
        Pas encore de compte ?{" "}
        <span
          onClick={() => setIsRegisterModalOpen(true)}
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Créer un compte
        </span>
      </p>

      {/* Le modal de création de compte */}
      <RegisterUser
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </Modal>
  );
};

export default ModalConnexion;
