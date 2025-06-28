import React, { useEffect, useState } from "react";
import {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from "../api";
import "../ui/parking.css";

const ITEMS_PER_PAGE = 10;

const Parking = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({
    type: "",
    marque: "",
    modele: "",
    plaque: "",
    matricule: "",
    etat: "",
    disponible: false,
    kilometrage: "",
    revisionDate: "",
    details: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur de chargement :", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      (v.marque || "").toLowerCase().includes(search) ||
      (v.modele || "").toLowerCase().includes(search) ||
      (v.immatriculation || "").toLowerCase().includes(search) ||
      (v.plaque || "").toLowerCase().includes(search)
  );

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const displayedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVehicleForm({
      ...vehicleForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddOrUpdate = async () => {
    const { marque, modele, plaque, matricule } = vehicleForm;
    if (!marque || !modele || !plaque || !matricule) return;

    try {
      if (isEditing && editId) {
        await updateVehicle(editId, vehicleForm);
      } else {
        await addVehicle(vehicleForm);
      }
      resetForm();
      fetchVehicles();
    } catch (err) {
      console.error("Erreur formulaire :", err);
    }
  };

  const handleEdit = (vehicle) => {
    setIsEditing(true);
    setEditId(vehicle._id);
    setShowForm(true);
    setVehicleForm({ ...vehicle });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await deleteVehicle(id);
        fetchVehicles();
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  };

  const resetForm = () => {
    setVehicleForm({
      type: "",
      marque: "",
      modele: "",
      plaque: "",
      matricule: "",
      etat: "",
      disponible: false,
      kilometrage: "",
      revisionDate: "",
      details: "",
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="parking-container">
      <h2>Liste des Véhicules</h2>

      <div className="parking-controls">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={handleSearchChange}
        />
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Fermer le formulaire" : "Ajouter un véhicule"}
        </button>
      </div>

      {showForm && (
        <div className="vehicle-form">
          <h3>{isEditing ? "Modifier un véhicule" : "Ajouter un véhicule"}</h3>
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={vehicleForm.type}
            onChange={handleFormChange}
          />
          <input
            type="text"
            name="marque"
            placeholder="Marque"
            value={vehicleForm.marque}
            onChange={handleFormChange}
          />
          <input
            type="text"
            name="modele"
            placeholder="Modèle"
            value={vehicleForm.modele}
            onChange={handleFormChange}
          />
          <input
            type="text"
            name="plaque"
            placeholder="Plaque"
            value={vehicleForm.plaque}
            onChange={handleFormChange}
          />
          <input
            type="text"
            name="matricule"
            placeholder="Matricule interne"
            value={vehicleForm.matricule}
            onChange={handleFormChange}
          />
          <input
            type="text"
            name="etat"
            placeholder="État"
            value={vehicleForm.etat}
            onChange={handleFormChange}
          />
          <input
            type="number"
            name="kilometrage"
            placeholder="Kilométrage"
            value={vehicleForm.kilometrage}
            onChange={handleFormChange}
          />
          <input
            type="date"
            name="revisionDate"
            placeholder="Date révision"
            value={vehicleForm.revisionDate}
            onChange={handleFormChange}
          />
          <textarea
            name="details"
            placeholder="Détails"
            value={vehicleForm.details}
            onChange={handleFormChange}
          ></textarea>

          <label>
            Disponible:
            <input
              type="checkbox"
              name="disponible"
              checked={vehicleForm.disponible}
              onChange={handleFormChange}
            />
          </label>
          <button onClick={handleAddOrUpdate}>
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </button>
          {isEditing && <button onClick={resetForm}>Annuler</button>}
        </div>
      )}

      <table className="parking-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Marque / Modèle</th>
            <th>Plaque</th>
            <th>État</th>
            <th>Km</th>
            <th>Révision</th>
            <th>Disponible</th>
            <th>Actions</th>
            <th>Détails</th>
          </tr>
        </thead>
        <tbody>
          {displayedVehicles.map((v) => (
            <tr key={v._id}>
              <td>{v.type || "N/A"}</td>
              <td>
                {v.marque} {v.modele}
              </td>
              <td>{v.plaque}</td>
              <td>{v.etat || "N/A"}</td>
              <td>{v.kilometrage || "N/A"} km</td>
              <td>{v.revisionDate ? new Date(v.revisionDate).toLocaleDateString() : "N/A"}</td>
              <td>{v.disponible ? "Oui" : "Non"}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(v)}>
                  Modifier
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(v._id)}
                >
                  Supprimer
                </button>
              </td>
              <td>
                <button onClick={() => setSelectedDetails(v)}>
                  Voir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={currentPage === pageNum ? "active" : ""}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {/* Mini Modal Détails */}
      {selectedDetails && (
        <div className="details-modal">
          <div className="details-content">
            <h3>Détails du véhicule</h3>
            <p><strong>Type :</strong> {selectedDetails.type}</p>
            <p><strong>Marque :</strong> {selectedDetails.marque}</p>
            <p><strong>Modèle :</strong> {selectedDetails.modele}</p>
            <p><strong>Kilométrage :</strong> {selectedDetails.kilometrage} km</p>
            <p><strong>Révision :</strong> {selectedDetails.revisionDate ? new Date(selectedDetails.revisionDate).toLocaleDateString() : "N/A"}</p>
            <p><strong>Détails :</strong> {selectedDetails.details}</p>
            <button onClick={() => setSelectedDetails(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parking;
