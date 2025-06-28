import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import AddEventModal from "../components/AddEventModal";
import EventDetailModal from "../components/EventDetailModal";
import EditEventModal from "../components/EditEventModal";
import { getEvents, deleteEvent } from "../api";
import "../ui/planning.css";
import "../components/HourdModalRh";
import HourdModalRh from "../components/HourdModalRh";

moment.locale("fr");
const localizer = momentLocalizer(moment);
Modal.setAppElement("#root");

const Planning = () => {
  //etat calendrier
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");

  //les modals
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventDetailModalOpen, setEventDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);

  //chargement des donnees
  const fetchEvents = useCallback(async () => {
    try {
      const data = await getEvents();
      setEvents(
        data.map((evt) => ({
          ...evt,
          start: new Date(evt.start),
          end: new Date(evt.end),
        }))
      );
    } catch (err) {
      console.error("Erreur chargement événements :", err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  //selection d'une case libre
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setModalIsOpen(true);
  };

  //selection d'un evenement
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventDetailModalOpen(true);
  };

  //ajout d'un evenement
  const handleEventAdded = async () => {
    await fetchEvents(); // Recharge tous les événements depuis le backend
    setModalIsOpen(false); // Ferme le modal d'ajout
  };

  //modification d'un evenement
  const handleEventUpdated = async () => {
    await fetchEvents(); // Recharge tous les événements depuis le backend
    setEditModalOpen(false); // Ferme le modal de modification
  };

  //suppression d'un evenement
  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId); // Supprime en base
      await fetchEvents(); // Recharge tous les événements
      setEventDetailModalOpen(false); // Ferme le modal de détail
    } catch (err) {
      console.error("Erreur suppression événement :", err);
    }
  };

  //style des evenements
  const colors = [
    "#6C5CE7",
    "#00B894",
    "#E17055",
    "#0984E3",
    "#D63031",
    "#f3c11e",
    "#FF00FF",
    "#000080",
    "#FF00FF",
    "#00FFFF",
  ];
  const eventStyleGetter = (event) => {
    const index = events.findIndex((e) => e._id === event._id);
    const backgroundColor = colors[index % colors.length];
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <div style={{ height: "100vh", padding: "20px" }}>
      <h2>Planning des chauffeurs</h2>
      <button
        onClick={() => setIsHoursModalOpen(true)}
        style={{ marginBottom: "15px" }}
        className="view-hours-btn"
      >
        Voir heures de travail
      </button>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          views={["month", "week", "day", "agenda"]}
          defaultView="month"
          popup
          date={currentDate}
          view={currentView}
          onNavigate={setCurrentDate}
          onView={setCurrentView}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          titleAccessor={(event) =>
            `${event.nom ?? "?"} ${event.prenom ?? "?"} - (${moment(
              event.start
            ).format("HH:mm")}-${moment(event.end).format("HH:mm")})`
          }
          style={{
            height: "700px",
            width: "1200px",
            margin: "0 auto",
            borderRadius: "10px",
            padding: "10px",
            color: "black",
          }}
        />
      </div>

      {/* Modals */}
      <AddEventModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        selectedDate={selectedDate}
        onEventAdded={handleEventAdded}
      />
      {eventDetailModalOpen && selectedEvent && (
        <EventDetailModal
          isOpen={eventDetailModalOpen}
          onRequestClose={() => setEventDetailModalOpen(false)}
          event={selectedEvent}
          onEdit={() => {
            setEventDetailModalOpen(false);
            setEditModalOpen(true);
          }}
          onDelete={handleDeleteEvent}
        />
      )}
      <EditEventModal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        event={selectedEvent}
        onEventUpdated={handleEventUpdated}
      />
      <HourdModalRh
        isOpen={isHoursModalOpen}
        onRequestClose={() => setIsHoursModalOpen(false)}
        events={events}
      />
    </div>
  );
};

export default Planning;
