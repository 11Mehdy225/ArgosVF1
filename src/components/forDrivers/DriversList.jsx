import React, { useState } from "react";
import CreateDrivers from "./CreateDrivers";
import "../../ui/drivers.css";
import Modal from "react-modal";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

Modal.setAppElement("#root"); // important pour accessibilité

const DriversList = ({ drivers, onDriverClick }) => {
  const [createDri, setCreateDri] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterPermis, setFilterPermis] = useState("");
  const driversPerPage = 5;

  const filteredDrivers = drivers.filter((driver) => {
    const searchLower = search.toLowerCase();

    const nom = driver.nom?.toString().toLowerCase() || "";
    const prenom = driver.prenom?.toString().toLowerCase() || "";
    const matricule = driver.matricule?.toString().toLowerCase() || "";

    return (
      nom.includes(searchLower) ||
      prenom.includes(searchLower) ||
      matricule.includes(searchLower)
    );
  });

  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirstDriver, indexOfLastDriver);
  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (num) => {
    setCurrentPage(num);
  };

  const uniquePermis = [...new Set(drivers.map((d) => d.permis))];

  return (
    <div>
      <h1>Gestion des chauffeurs</h1>
      {/* Barre de recherche */}
      <div className="searchNinput">
      <input
        className="driversBarSearch"
        type="text"
        placeholder="Rechercher un chauffeur.../matricule/nom/prenom/permis"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={searchInputStyle}
      />
      {/* Filtres & bouton */}
      <div style={filterBarStyle}>
        <select
          value={filterPermis}
          onChange={(e) => {
            setFilterPermis(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">filter</option>
          {uniquePermis.map((permis, i) => (
            <option key={i} value={permis}>
              {permis}
            </option>
          ))}
        </select>

        <button className="ajouterButton" onClick={() => setCreateDri(true)}>
          AJOUTER
        </button>
      </div>
      </div>

      <Modal
        isOpen={createDri}
        onRequestClose={() => setCreateDri(false)}
        contentLabel="Créer Chauffeur"
        overlayClassName="modalOverlay"
        className="modalContent"
      >
        <CreateDrivers onClose={() => setCreateDri(false)} />
      </Modal>

      <table style={tableStyle}>
        <thead>
          <tr className="trDriversListHead">
            <th style={colNarrow}>Matricule</th>
            <th style={colNarrow}>Nom</th>
            <th style={colWide}>Prénom</th>
            <th style={colNarrow}>Montant</th>
            <th style={colWide}>Permis</th>
            <th style={colAction}></th>
          </tr>
        </thead>
        <tbody>
          {currentDrivers.map((driver, index) => (
            <tr key={driver.matricule} style={rowStyle}>
              <td style={getCellStyle(index)}>{driver.matricule}</td>
              <td style={getCellStyle(index)}>{driver.nom}</td>
              <td style={getCellStyle(index)}>{driver.prenom}</td>
              <td style={getCellStyle(index)}>{driver.montant ?? "N/A"}</td>
              <td style={getCellStyle(index)}>{driver.permis}</td>
              <td style={getCellStyle(index)}>
                <button className="voirPlusButton" onClick={() => onDriverClick(driver)}>
                  Voir plus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div style={paginationStyle}>
        <button className="pagination-bouton" onClick={handlePrev} disabled={currentPage === 1}>
          <GrFormPrevious />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            className="pagination-bouton"
            key={i}
            onClick={() => handlePageClick(i + 1)}
            style={{
              fontWeight: currentPage === i + 1 ? "bold" : "normal",
            }}
          >
            {i + 1}
          </button>
        ))}
        <button className="pagination-bouton" onClick={handleNext} disabled={currentPage === totalPages}>
          <GrFormNext />
        </button>
      </div>
    </div>
  );
};

export default DriversList;

const tableStyle = {
  width: "1600px",
  borderCollapse: "collapse",
  marginTop: "20px",
  marginLeft: "50px",
};

const rowStyle = {
  cursor: "pointer",
};

const colNarrow = {
  padding: "12px",
  textAlign: "left",
  width: "12%",
  borderBottom: "1px solid #ccc",
};

const colWide = {
  padding: "12px",
  textAlign: "left",
  width: "25%",
  borderBottom: "1px solid #ccc",
};

const colAction = {
  padding: "12px",
  width: "10%",
  textAlign: "center",
  borderBottom: "1px solid #ccc",
  cursor: "pointer",
};

const getCellStyle = (index) => ({
  padding: "12px",
  borderBottom: index === 0 ? "1px solid #ccc" : "none",
  borderRight: "none",
});

const paginationStyle = {
  marginTop: "30px",
  display: "flex",
  gap: "10px",
  justifyContent: "right",
};

const filterBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
 
  marginBottom: "10px",
  padding: "10px",
};

const searchInputStyle = {
  width: "100%",

  padding: "8px",
  fontSize: "16px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};
