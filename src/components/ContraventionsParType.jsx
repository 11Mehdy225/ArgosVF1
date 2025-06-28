import React, { useState } from "react";
import { getContraventionsParType } from "../api";
import "../ui/contraventionsParType.css"; 
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
  } from "recharts";
  import jsPDF from "jspdf";
  import autoTable from "jspdf-autotable";

const ContraventionsParType = () => {
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState("2025");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!mois || !annee) return;
    setLoading(true);
    try {
      const result = await getContraventionsParType(mois, annee);
      const sorted = [...result].sort((a, b) => b.count - a.count);
      setData(sorted);
    } catch (err) {
      console.error("Erreur API :", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Contraventions par type - ${mois} ${annee}`, 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Type d'infraction", "Nombre", "Montant Total (F)"]],
      body: data.map((item) => [
        item._id, item.count, item.montantTotal
      ]),
    });
    doc.save(`contraventions_${mois}_${annee}.pdf`);
  };

  return (
    <div className="contraventions-type-container">
      <h3>Statistiques par type de contravention</h3>

      <div className="controls">
        <select value={mois} onChange={(e) => setMois(e.target.value)}>
          <option value="">-- Mois --</option>
          {["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"].map(m =>
            <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
          )}
        </select>

        <input
          type="number"
          value={annee}
          onChange={(e) => setAnnee(e.target.value)}
          placeholder="Année"
          min="2020"
          max="2030"
        />

        <button onClick={handleFetch}>Afficher</button>
        {data.length > 0 && (
          <button onClick={generatePDF} className="export-pdf-btn">
            Exporter PDF
          </button>
        )}
      </div>

      {loading && <p>Chargement...</p>}

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 30,  bottom: 20 }}
            dataKey="count" fill="#007BFF" barSize={10}
            
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="_id" type="category"
            width={200}  // largeur fixe suffisante pour les intitulés longs
            tick={{ fontSize: 13, fill: "#333", fontWeight: "bold" }} />
            <Tooltip />
            <Bar dataKey="count" fill="#007BFF" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {data.length === 0 && mois && !loading && (
        <p style={{ marginTop: "10px" }}>Aucune donnée trouvée pour {mois} {annee}.</p>
      )}
    </div>
  );
};

export default ContraventionsParType;
