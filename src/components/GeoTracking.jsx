import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup , useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getGeoT } from "../api";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const CenterButton = ({ center }) => {
    const map = useMap();
    const handleClick = () => {
      map.setView(center, 12);
    };
    return (
      <button
        onClick={handleClick}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          padding: "8px 12px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Centrer sur Abidjan
      </button>
    );
  };

const GeoTracking = () => {
  const [positions, setPositions] = useState([]);


  const fetchPositions = async () => {
    try {
      const data = await getGeoT(); 
      setPositions(data);
    } catch (err) {
      console.error("Erreur chargement positions :", err);
    }
  };
  

  useEffect(() => {
    fetchPositions();
    const interval = setInterval(fetchPositions, 10000); // refresh auto toutes les 10 sec
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    fetchPositions();
  };

  const abidjanCenter = [5.3599517, -4.0082563];


  return (
    <div style={{ 
        height: "80vh",
        width: "100%",
        maxWidth: "1200px",
        margin: "20px auto",
        position: "relative",
        padding: "10px",
        boxSizing: "border-box", }}>
      <h2>Suivi Géographique des Véhicules</h2>
      <button
        onClick={handleManualRefresh}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          padding: "8px 12px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Rafraîchir
      </button>

      <MapContainer center={abidjanCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
        <CenterButton center={abidjanCenter} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.map((pos) => (
          <Marker
            key={pos._id}
            position={[pos.latitude, pos.longitude]}
            icon={customIcon}
          >
            <Popup>
              <strong>{pos.plaque}</strong> <br />
              {/* {pos.vehicleId?.marque} {pos.vehicleId?.modele} <br /> */}
              MAJ : {new Date(pos.updatedAt).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GeoTracking;
