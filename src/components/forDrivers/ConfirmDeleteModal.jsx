import React from "react";
import Modal from "react-modal";
import "../../ui/drivers.css"

const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel, driver }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Confirmation de suppression"
      className="modalContent"
      overlayClassName="modalOverlay"
    >
      <h2>Confirmer la suppression</h2>
      <p>Supprimer le chauffeur {driver?.nom} {driver?.prenom} ?</p>
      <div className="modalButtons">
        <button onClick={onConfirm} style={{ backgroundColor: "#d9534f", color: "white" }}>
          Oui, supprimer
        </button>
        <button onClick={onCancel}>
          Annuler
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
