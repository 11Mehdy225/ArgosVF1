import { useEffect, useState } from "react";
import Modal from "react-modal";
import { addEvent, getDrivers, getVehicles } from "../api";
import "../ui/ModalStyles.css";

const AddEventModal = ({
  isOpen,
  onRequestClose,
  selectedDate,
  onEventAdded,
}) => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    plaque: "",
    start: "",
    end: ""
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
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().substring(0, 10);
      setFormData((prev) => ({
        ...prev,
        start: `${dateStr}T08:00`,
        end: `${dateStr}T17:00`,
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (formData.nom && formData.prenom && formData.plaque) {
      setFormData((prev) => ({
        ...prev,
        title: `${prev.nom} ${prev.prenom} (${prev.plaque})`,
      }));
    }
  }, [formData.nom, formData.prenom, formData.plaque]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await addEvent(formData); // Pas besoin de récupérer newEvent ici
  //     onEventAdded(); // Juste déclencher la mise à jour côté Planning
  //     onRequestClose(); // Ferme le modal
  //   } catch (err) {
  //     console.error("Erreur création événement :", err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullData = {
        ...formData,
        title: `${formData.nom} ${formData.prenom} (${formData.plaque})`,
      };
      console.log("📤 Données envoyées :", fullData);

      await addEvent(fullData);
      onEventAdded();
      onRequestClose();
    } catch (err) {
      console.error("Erreur création événement :", err);
    }
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modalContent"
      overlayClassName="modalOverlay"
    >
      <h2>Ajouter un événement</h2>
      <form onSubmit={handleSubmit} className="modalForm">
        <label>Chauffeur</label>
        <select
          name="nom"
          onChange={(e) => {
            const [nom, prenom] = e.target.value.split("|");
            setFormData((prev) => ({ ...prev, nom, prenom }));
          }}
          required
        >
          <option value="">-- Choisir --</option>
          {drivers.map((d) => (
            <option key={d.matricule} value={`${d.nom}|${d.prenom}`}>
              {d.nom} {d.prenom}
            </option>
          ))}
        </select>

        {/* <select name="driver" onChange={handleChange} value={formData.driver} required>
          <option value="">-- Choisir --</option>
          {drivers.map((d) => (
         <option key={d.matricule} value={`${d.nom} ${d.prenom}`}>{d.nom} {d.prenom}</option>
          ))}
        </select> */}

        <label>plaque vehicle</label>
        <select
          name="plaque"
          onChange={handleChange}
          value={formData.plaque}
          required
        >
          <option value="">-- Choisir --</option>
          {vehicles.map((v) => (
            <option key={v._id} value={v.plaque}>
              {v.plaque}
            </option>
          ))}
        </select>

        <label>Début</label>
        <input
          type="datetime-local"
          name="start"
          value={formData.start}
          onChange={handleChange}
          required
        />

        <label>Fin</label>
        <input
          type="datetime-local"
          name="end"
          value={formData.end}
          onChange={handleChange}
          required
        />

        <div className="modalButtons">
          <button type="submit" className="btnConfirm">
            Ajouter
          </button>
          <button type="button" onClick={onRequestClose} className="btnCancel">
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEventModal;
