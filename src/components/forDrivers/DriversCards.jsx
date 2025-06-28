import React, { useState } from "react";
import Modal from "react-modal";
import "../../ui/drivers.css";
import { deleteDriver, updateDriver } from "../../api";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

Modal.setAppElement("#root");

const DriversCards = ({ driver, isOpen, onClose, onDeleted }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nom: driver.nom,
    prenom: driver.prenom,
    permis: driver.permis,
    matricule: driver.matricule,
  });

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const result = await updateDriver(driver._id, editForm);
    if (result) {
      // alert("Chauffeur mis à jour !");
      setIsEditing(false);
      onClose();
      onDeleted();
    } else {
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async () => {
    const result = await deleteDriver(driver._id);
    if (result) {
      // alert("Chauffeur supprimé.");
      onDeleted();
    } else {
      alert("Échec de la suppression.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Détails du chauffeur"
      className="modal-driver-content"
      overlayClassName="modal-overlay"
    >
      <div className="driver-card">
        {isEditing ? (
          <div className="edit-form">
            <input name="nom" value={editForm.nom} onChange={handleChange} />
            <input name="prenom" value={editForm.prenom} onChange={handleChange} />
            <input name="matricule" value={editForm.matricule} onChange={handleChange} />
            <input name="permis" value={editForm.permis} onChange={handleChange} />
          </div>
        ) : (
          <>
          {/* le drivers details card  */}
            <h2>{driver.nom} {driver.prenom}</h2>
            <p><strong>Matricule :</strong> {driver.matricule}</p>
            <p><strong>Permis :</strong> {driver.permis}</p>

            <h3>Infractions</h3>
            {driver.infractions && driver.infractions.length > 0 ? (
              <ul className="infraction-list">
                {driver.infractions.map((infraction, index) => (
                  <li key={index}>
                    <strong>Code :</strong> {infraction.code}<br />
                    <strong>Plaque :</strong> {infraction.plaque}<br />
                    <strong>Date :</strong> {infraction.date}<br />
                    <strong>N° contravention :</strong> {infraction.numeroContravention}<br />
                    <strong>Code paiement :</strong> {infraction.codePaiement}<br />
                    <strong>Description :</strong> {infraction.infractions}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune infraction.</p>
            )}
          </>
        )}

        <div className="modalButtons">
          {isEditing ? (
            <>
              <button onClick={handleUpdate} style={{ backgroundColor: "#5cb85c", color: "white" }}>
                Enregistrer
              </button>
              <button onClick={() => setIsEditing(false)}>Annuler</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} style={{ backgroundColor: "blue", color: "white" }}>Modifier</button>
              <button onClick={() => setConfirmOpen(true)} style={{ backgroundColor: "#d9534f", color: "white" }}>
                Supprimer
              </button>
              <button onClick={onClose}>Fermer</button>
            </>
          )}
        </div>

        <ConfirmDeleteModal
          isOpen={confirmOpen}
          onConfirm={async () => {
            await handleDelete();
            setConfirmOpen(false);
            onClose();
          }}
          onCancel={() => setConfirmOpen(false)}
          driver={driver}
        />
      </div>
    </Modal>
  );
};

export default DriversCards;
