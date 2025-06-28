import { useState } from "react";
import { addDriver } from "../../api"; // <-- Bien importer ici

const CreateDrivers = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    permis: "",
    matricule: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data à envoyer:", formData);
      const result = await addDriver(formData);

      if (result?.id) {
        alert("Chauffeur ajouté !");
        onClose();
      } else {
        alert("Erreur lors de l'ajout.");
      }
    } catch (err) {
      console.error("Erreur fetch:", err);
      alert("Erreur serveur ou réseau.");
    }
  };

  return (
    <div className="modalContent">
      <h2>Créer un chauffeur</h2>
      <form onSubmit={handleSubmit} className="modalForm">
        <input name="nom" placeholder="Nom" onChange={handleChange} required />
        <input name="prenom" placeholder="Prénom" onChange={handleChange} required />
        <input name="permis" placeholder="Permis" onChange={handleChange} required />
        <input name="matricule" placeholder="Matricule" onChange={handleChange} required />
        <div className="modalButtons">
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDrivers;
