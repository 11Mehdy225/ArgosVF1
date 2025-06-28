import React, { useEffect, useState } from "react";
import Diagrame from "./Diagrame";
import { getBilanMonth } from "../../api";

const Stats = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBilan() {
      try {
        const result = await getBilanMonth();
        setData(result);
      } catch (e) {
        setError(e);
        console.error("Erreur de chargement du bilan :", e);
      }
    }
    fetchBilan();
  }, []);

  const style = {
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "20px",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width:"1000px",
  };

  const titleStyle = {
    fontSize: "2em",
    fontWeight: "bold",
    textDecoration: "underline",
  };

  return (
    <div style={style}>
      <h1 style={titleStyle}>Statistiques</h1>
      {error ? (
        <p>Erreur lors du chargement des données.</p>
      ) : (
        <Diagrame data={data} />
      )}
    </div>
  );
};

export default Stats;
