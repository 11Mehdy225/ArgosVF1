import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const RegisterUser = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");

      toast.success("✅ Utilisateur enregistré. En attente de validation.");
      setForm({ username: "", email: "", password: "", role: "user" });
      onClose(); // fermeture après succès
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="custom-modal"
      overlayClassName="custom-overlay"
    >
      <h2 style={{ textAlign: "center" }}>Créer un nouvel utilisateur</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
          <button type="submit">Créer le compte</button>
          <button type="button" onClick={onClose}>Annuler</button>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterUser;
