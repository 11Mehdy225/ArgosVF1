import Modal from "react-modal";
import "../ui/ModalStyles.css";
import moment from "moment";

moment.locale("fr");

const EventDetailModal = ({
  isOpen,
  onRequestClose,
  event,
  onEdit,
  onDelete,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modalContent"
      overlayClassName="modalOverlay"
    >
      <h2>Détails de l'événement</h2>
      <div className="modalForm"> 
        <p><strong>Chauffeur :</strong> {event.nom} {event.prenom}</p>
        <p><strong>Véhicule :</strong> {event.plaque}</p>
        <p><strong>Début :</strong> {moment(event.start).format("LLLL")}</p>
        <p><strong>Fin :</strong> {moment(event.end).format("LLLL")}</p>
      </div> 
      <div className="modalButtons">
        <button className="btnConfirm" onClick={onEdit} style={{ backgroundColor: "blue", color: "white" }}>Modifier</button>
        <button className="btnCancel" onClick={() => onDelete(event._id)} style={{ backgroundColor: "red", color: "white" }}>Supprimer</button>
        <button className="btnCancel" onClick={onRequestClose}>Fermer</button>
      </div>
    </Modal>
  );
};

export default EventDetailModal;