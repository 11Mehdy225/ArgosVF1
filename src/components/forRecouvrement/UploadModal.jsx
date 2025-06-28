// src/components/UploadModal.jsx
import React, { useState } from "react";
import Modal from "react-modal";
import * as XLSX from "xlsx";

Modal.setAppElement("#root");

const UploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [fichier, setFichier] = useState(null);

  const handleSubmit = () => {
    if (!mois || !annee || !fichier) {
      alert("Veuillez remplir tous les champs");
      return;
     
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

      // Appel du parent avec les données converties
      onSubmit({ mois, annee, jsonData });

      onClose();

      // reset
      setMois("");
      setAnnee(new Date().getFullYear());
      setFichier(null);
    };

    reader.readAsArrayBuffer(fichier);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Charger un fichier"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>Charger un fichier de contraventions</h2>
      <div>
        <label>Mois :</label>
        <select value={mois} onChange={(e) => setMois(e.target.value)}>
          <option value="">-- Sélectionner --</option>
          {[
            "janvier", "février", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"
          ].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Année :</label>
        <input
          type="number"
          value={annee}
          onChange={(e) => setAnnee(e.target.value)}
        />
      </div>

      <div>
        <label>Fichier Excel :</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFichier(e.target.files[0])}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit}>Valider</button>
        <button onClick={onClose} style={{ marginLeft: "10px" }}>
          Annuler
        </button>
      </div>
    </Modal>
  );
};

export default UploadModal;
