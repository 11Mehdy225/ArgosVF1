import React from "react";
import { useDrivers } from "../../context/DriversContext";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import "../../ui/rank.css";

const Rank = () => {
  const { drivers, isLoading, error, refresh } = useDrivers();

  if (isLoading) return <p>Chargement du classement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  if (!drivers || drivers.length === 0) return <p>Aucun chauffeur trouvé.</p>;

  const sortedDrivers = [...drivers].sort((a, b) => (b.montant || 0) - (a.montant || 0));
  const totalMontant = sortedDrivers.reduce((acc, d) => acc + (d.montant || 0), 0);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Classement des chauffeurs", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Rang", "Nom", "Prénom", "Montant (F)", "%"]],
      body: sortedDrivers.map((driver, index) => [
        index + 1,
        driver.nom,
        driver.prenom,
        driver.montant != null ? `${driver.montant.toFixed(0)} F` : "N/A",
        totalMontant > 0 ? `${((driver.montant / totalMontant) * 100).toFixed(2)} %` : "0 %",
      ]),
    });

    const date = new Date().toLocaleDateString("fr-FR");
    doc.text(`Généré le : ${date}`, 14, doc.internal.pageSize.height - 10);

    doc.save("Classement_chauffeurs.pdf");
  };

  return (
    <div className="rank-container">
      <h1>Classement des chauffeurs</h1>
      <div className="rank-buttons">
        <button onClick={refresh} className="refresh-btn">Rafraîchir</button>
        <button onClick={generatePDF} className="export-btn">Exporter en PDF</button>
      </div>
      <table className="rank-table">
        <thead>
          <tr>
            <th>Rang</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Montant (F)</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {sortedDrivers.map((driver, index) => (
            <tr key={driver._id || index}>
              <td>{index + 1}</td>
              <td>{driver.nom}</td>
              <td>{driver.prenom}</td>
              <td>{driver.montant != null ? `${driver.montant.toFixed(0)} F` : "N/A"}</td>
              <td>{totalMontant > 0 ? `${((driver.montant / totalMontant) * 100).toFixed(2)} %` : "0 %"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rank;