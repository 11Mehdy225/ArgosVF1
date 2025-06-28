import React, { useState, useEffect } from "react";
import "../ui/dashboardScreen.css";
import { getEvents } from "../api";

const DashboardScreen = () => {
  const [events, setEvents] = useState([]);
  const [now, setNow] = useState(new Date());
  const [accessGranted, setAccessGranted] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const correctPassword = "local2024"; // à sécuriser plus tard
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Met à jour l'heure chaque seconde
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Charge les événements + rafraîchit toutes les 30 secondes si accès accordé
  useEffect(() => {
    if (accessGranted) {
      fetchEvents();
      enterFullScreen();
      const refresh = setInterval(fetchEvents, 1000); // ← rafraîchissement toutes les 30 sec
      return () => clearInterval(refresh);
    }
  }, [accessGranted]);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      const today = new Date().toISOString().split("T")[0];
      const todayEvents = data.filter((event) =>
        event.start.startsWith(today)
      );
      setEvents(todayEvents);
    } catch (err) {
      console.error("Erreur lors du chargement des événements :", err);
    }
  };

  const enterFullScreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  if (!accessGranted) {
    return (
      <div className="login-screen">
        <h2>Accès sécurisé</h2>
        <input
          type="password"
          placeholder="Entrez le mot de passe"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button
          onClick={() => {
            if (passwordInput === correctPassword) {
              setAccessGranted(true);
            } else {
              alert("Mot de passe incorrect");
            }
          }}
        >
          Accéder
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-screen">
      <div className="clock">
      <span className="clock">{today}_</span>
        {now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
      <h1>Planning du jour</h1>

      <div className="dashboard-content">
        <table className="events-table">
          <thead>
            <tr>
              <th>État</th>
              <th>Chauffeur</th>
              <th>Plaque</th>
              <th>Marque</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
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
                    <td>{isFinished ? "Terminé" : "En cours"}</td>
                    <td>{event.nom || "-"}{event.prenom || "-"}</td>
                    <td>{event.plaque || "-"}</td>
                    <td>{event.marque || "-"}</td>
                    <td>{startTime}</td>
                    <td>{endTime}</td>
                    <td>{isFinished ? "(Terminé)" : ""}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardScreen;
