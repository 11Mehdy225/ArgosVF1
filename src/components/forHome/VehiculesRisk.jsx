// src/components/forHome/VehicleRisk.jsx
import React, { useEffect, useState } from "react";
import { getVehicles } from "../../api";
import "../../ui/Home.css"

const VehicleRisk = () => {
    const [vehiclesARisque, setVehiclesARisque] = useState([]);
  
    useEffect(() => {
      fetchVehicles();
    }, []);
  
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        filterVehiclesARisque(data);
      } catch (err) {
        console.error("Erreur chargement véhicules :", err);
      }
    };
  
    const filterVehiclesARisque = (data) => {
      const today = new Date();
      const thresholdDate = new Date();
      thresholdDate.setDate(today.getDate() + 30); // dans 30 jours
  
      const atRisk = data.filter((v) => {
        if (!v.revision) return false;
        const revDate = new Date(v.revision);
        return revDate <= thresholdDate;
      });
  
      setVehiclesARisque(atRisk);
    };
  
    return (
      <div className="vehicle-risk">
        <div className="vehicle-risk-header">
          <h2 className="vehicle-risk-title">🚨 Véhicules à risque</h2>
          {vehiclesARisque.length > 0 && (
            <span className="risk-badge">{vehiclesARisque.length}</span>
          )}
        </div>
  
        {vehiclesARisque.length > 0 ? (
          <table className="vehicle-risk-table">
            <thead>
              <tr>
                <th>Plaque</th>
                <th>Marque / Modèle</th>
                <th>Date limite</th>
              </tr>
            </thead>
            <tbody>
              {vehiclesARisque.map((v) => (
                <tr key={v._id}>
                  <td>{v.plaque}</td>
                  <td>{v.marque} {v.modele}</td>
                  <td>{new Date(v.revision).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun véhicule en risque ce mois-ci ✅</p>
        )}
      </div>
    );
  };
  
  export default VehicleRisk;