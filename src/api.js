// Chauffeurs
export async function getDrivers() {
    const res = await fetch("/api/drivers");
    if (!res.ok) throw new Error("Erreur de chargement des chauffeurs");
    return res.json();
  }
  
  export async function addDriver(driver) {
    const response = await fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(driver),
    });
    if (!response.ok) throw new Error("Erreur lors de l'ajout du chauffeur");
    return await response.json();
  }

  export const deleteDriver = async (id) => {
    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur deleteDriver:", error);
      return null;
    }
  };

  export async function updateDriver(id, updatedFields) {
    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      return await response.json();
    } catch (error) {
      console.error("Erreur updateDriver:", error);
      return null;
    }
  }
  
  
  
  // Bilan du mois
  export async function getBilanMonth() {
    const res = await fetch("/api/bilanMois");
    if (!res.ok) throw new Error("Erreur de chargement du bilan");
    return await res.json();
  }
  
  // Événements Planning
  export async function getEvents() {
    const res = await fetch("/api/events");
    if (!res.ok) throw new Error("Erreur de chargement des événements");
    return res.json();
  }
  
  export async function addEvent(event) {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (!res.ok) throw new Error("Erreur lors de l'ajout de l'événement");
    return res.json();
  }
  
  export async function updateEvent(id, updatedEvent) {
    const res = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    });
    if (!res.ok) throw new Error("Erreur modification événement");
    return await res.json();
  }

  export async function deleteEvent(id) {
    const res = await fetch(`/api/events/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erreur suppression événement");
    return res.json();
  }

  // les vehicules
  // Récupérer tous les véhicules
  export async function getVehicles() {
    const response = await fetch("/api/vehicles");
    if (!response.ok) throw new Error("Erreur lors de la récupération des véhicules");
    console.log("vehicules recup",response)
    return await response.json();
  }

  // Ajouter un véhicule
export async function addVehicle(vehicle) {
  const res = await fetch("/api/vehicles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  if (!res.ok) throw new Error("Erreur ajout véhicule");
  return res.json();
}

// Modifier un véhicule
export async function updateVehicle(id, vehicle) {
  const res = await fetch(`/api/vehicles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  if (!res.ok) throw new Error("Erreur modification véhicule");
  return res.json();
}

// Supprimer un véhicule
export async function deleteVehicle(id) {
  const res = await fetch(`/api/vehicles/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erreur suppression véhicule");
  return res.json();
}

//la page recouvrement 
export async function sendFsContraventions(mois, annee, contraventions) {
  const response = await fetch("/api/recouvrement", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mois, annee, contraventions }),
  });

  if (!response.ok) {
    throw new Error("Échec du traitement des données");
  }

  return await response.json(); // { resultatFinal, message }
}

export async function getRecouvrementHistorique() {
  const res = await fetch("/api/recouvrement/historique");
  if (!res.ok) throw new Error("Erreur chargement historique");
  return await res.json();
}

export const getDernierRecouvrement = async () => {
  const response = await fetch("http://localhost:3000/api/recouvrement/dernier");
  if (!response.ok) throw new Error("Erreur récupération dernier recouvrement");
  return await response.json();
};

export const getContraventionsParType = async (mois, annee) => {
  const response = await fetch(
    `http://localhost:3000/api/contraventions/types?mois=${mois}&annee=${annee}`
  );
  if (!response.ok) {
    throw new Error("Erreur chargement des types de contraventions");
  }
  return response.json();
};


export const getGeoT = async () => {
  const response = await fetch(`http://localhost:3000/api/vehicle-positions`);
  if (!response.ok) {
    throw new Error("Erreur chargement des positions");
  }
  return response.json();
};


//les foctions de connexion 
