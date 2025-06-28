import { useEffect, useState } from "react";
import Modal from "react-modal";
import { getDrivers, getVehicles, updateEvent } from "../api";
import "../ui/ModalStyles.css";

const EditEventModal = ({ isOpen, onRequestClose, event, onEventUpdated }) => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    driver: "",
    plaque: "",
    start: "",
    end: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const [driversList, vehiclesList] = await Promise.all([
          getDrivers(),
          getVehicles(),
        ]);
        setDrivers(driversList);
        setVehicles(vehiclesList);
      } catch (err) {
        console.error("Erreur chargement données :", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (event) {
      setFormData({
        driver: event.driver,
        plaque: event.vehicle,
        start: new Date(event.start).toISOString().slice(0, 16),
        end: new Date(event.end).toISOString().slice(0, 16),
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = await updateEvent(event._id, formData);
      onEventUpdated(updatedEvent); // Met à jour le calendrier
      onRequestClose(); // Ferme le modal
    } catch (err) {
      console.error("Erreur mise à jour événement :", err);
    }
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modalContent"
      overlayClassName="modalOverlay"
    >
      <h2>Modifier l'événement</h2>
      <form onSubmit={handleSubmit} className="modalForm">
        <label>Chauffeur</label>
        <select name="driver" value={formData.driver} onChange={handleChange} required>
          <option value="">-- Choisir --</option>
          {drivers.map((d) => (
            <option key={d._id} value={`${d.nom} ${d.prenom}`}>
            {d.nom} {d.prenom}
          </option>
          ))}
        </select>

        <label>Véhicule</label>
        <select name="vehicle" value={formData.vehicle} onChange={handleChange} required>
          <option value="">-- Choisir --</option>
          {vehicles.map((v) => (
            <option key={v._id} value={v.plaque}>
            {v.plaque}
          </option>          
          ))}
        </select>

        <label>Début</label>
        <input type="datetime-local" name="start" value={formData.start} onChange={handleChange} required />

        <label>Fin</label>
        <input type="datetime-local" name="end" value={formData.end} onChange={handleChange} required />

        <div className="modalButtons">
          <button type="submit" className="btnConfirm">Enregistrer</button>
          <button type="button" className="btnCancel" onClick={onRequestClose}>Annuler</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditEventModal;
