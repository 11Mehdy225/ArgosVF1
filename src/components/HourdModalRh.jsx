// components/HoursModal.jsx
import React from "react";
import Modal from "react-modal";
import moment from "moment";

const HourdModalRh = ({ isOpen, onRequestClose, events }) => {
    const now = moment();
    const startOfWeek = now.clone().startOf("isoWeek");
    const startOfMonth = now.clone().startOf("month");
  
    const chauffeurs = {};
  
    events.forEach(event => {
      const { nom, prenom, start, end } = event;
      const key = `${nom?.trim().toLowerCase()}_${prenom?.trim().toLowerCase()}`;
  
      const duration = moment(end).diff(moment(start), "hours", true);
  
      if (!chauffeurs[key]) {
        chauffeurs[key] = {
          nom,
          prenom,
          heuresSemaine: 0,
          heuresMois: 0,
        };
      }
  
      if (moment(start).isSameOrAfter(startOfWeek)) {
        chauffeurs[key].heuresSemaine += duration;
      }
      if (moment(start).isSameOrAfter(startOfMonth)) {
        chauffeurs[key].heuresMois += duration;
      }
    });
  
    const chauffeursList = Object.values(chauffeurs);
  
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Heures des chauffeurs"
        className="custom-hours-modal"
        overlayClassName="custom-overlay"
      >
        <h2>Heures de travail des chauffeurs</h2>
        <table className="hours-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Heures semaine (en Cours)</th>
              <th>Heures mois (en Cours)</th>
            </tr>
          </thead>
          <tbody>
            {chauffeursList.map((chf, index) => (
              <tr key={index}>
                <td>{chf.nom}</td>
                <td>{chf.prenom}</td>
                <td>{chf.heuresSemaine.toFixed(1)} h</td>
                <td>{chf.heuresMois.toFixed(1)} h</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onRequestClose} className="close-btn">Fermer</button>
      </Modal>
    );
  };
  

export default HourdModalRh ;
