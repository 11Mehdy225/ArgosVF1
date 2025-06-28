// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { getEvents } from "../api";
import "../ui/dashboard.css";

export default function Dashboard() {
    const [events, setEvents] = useState([]);
  
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const data = await getEvents();
          const today = new Date().toISOString().split("T")[0];
  
          const todayEvents = data.filter(event => {
            const eventDate = new Date(event.start).toISOString().split("T")[0];
            return eventDate === today;
          });
  
          setEvents(todayEvents);
        } catch (err) {
          console.error("Erreur lors du chargement des événements :", err);
        }
      };
  
      fetchEvents();
      const interval = setInterval(fetchEvents, 60 * 60 * 1000); // refresh toutes les heures
      return () => clearInterval(interval);
    }, []);
  
    const now = new Date();
  
    return (
      <div className="dashboard-container">
        <h2>Événements du jour</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Conducteur</th>
              <th>Plaque</th>
              <th>marque/model</th>
              <th>Heure Départ</th>
              <th>Heure Retour</th>
              <th>statut</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Aucun événement aujourd’hui
                </td>
              </tr>
            ) : (
              events.map((event, index) => {
                const end = new Date(event.end);
                const isFinished = now > end;
  
                const startTime = new Date(event.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const endTime = new Date(event.end).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
  
                return (
                  <tr key={index} className={isFinished ? "event-finished" : ""}>
                    <td>{event.nom || "-"}{event.prenom || "-"}</td>
                    <td>{event.plaque || "-"}</td>
                    <td>{event.marque || "-"}</td>
                    <td>{startTime}</td>
                    <td>{endTime}</td>
                    <td>{isFinished ? "(Terminé) " : ""}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  }
