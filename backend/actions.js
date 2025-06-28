import { getCollection } from './connect.js';


// actions sur la collection Chauffeurs
export async function getDrivers() {
  const collection = await getCollection("drivers");
  return await collection.find({}).toArray();
}

export async function addDriver(driver) {
  const collection = await getCollection("drivers");
  return await collection.insertOne(driver);
}

export async function getDriversCollection() {
    return await getCollection("drivers"); // ✅ pour updateOne, delete, etc.
  }

// actions sur la collection bilan mois pour Statistiques mensuelles
export async function getBilanMonth() {
  const collection = await getCollection("bilanMonth");
  return await collection.find({}).toArray();
}

// actions sur la collection  Planning pour les evenements
export async function getEventsData() {
    const collection = await getCollection("events");
    return await collection.find({}).toArray(); // ✅ pour affichage
  }
  
  export async function getEventsCollection() {
    return await getCollection("events"); // ✅ pour updateOne, insertOne, etc.
  }
  

export async function addEvent(event) {
  const collection = await getCollection("events");
  return await collection.insertOne(event);
}

// actions sur la collection parking pour Véhicules
export async function getVehicles() {
  const collection = await getCollection("vehicles");
  return await collection.find({}).toArray();
}

export async function getVehiclesCollection() {
    return await getCollection("vehicles");
  }
  
  export async function addVehicle(vehicle) {
    const collection = await getCollection("vehicles");
    return await collection.insertOne(vehicle);
  }
  
  export async function updateVehicle(id, updatedVehicle) {
    const collection = await getCollection("vehicles");
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedVehicle }
    );
  }
  
  export async function deleteVehicle(id) {
    const collection = await getCollection("vehicles");
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }



  

// version mongoose ///////////////////////////////////////////////////

// import './connect.js'; // assure la connexion à MongoDB via Mongoose
// import Driver from './models/Driver.js';
// import Vehicle from './models/Vehicle.js';
// import Event from './models/Event.js';

// // Chauffeurs
// export async function getDrivers() {
//   return await Driver.find({});
// }

// export async function addDriver(driverData) {
//   const driver = new Driver(driverData);
//   return await driver.save();
// }

// export async function updateDriver(id, updatedData) {
//   return await Driver.findByIdAndUpdate(id, updatedData, { new: true });
// }

// export async function deleteDriver(id) {
//   return await Driver.findByIdAndDelete(id);
// }

// // Véhicules
// export async function getVehicles() {
//   return await Vehicle.find({});
// }

// export async function addVehicle(vehicleData) {
//   const vehicle = new Vehicle(vehicleData);
//   return await vehicle.save();
// }

// export async function updateVehicle(id, updatedData) {
//   return await Vehicle.findByIdAndUpdate(id, updatedData, { new: true });
// }

// export async function deleteVehicle(id) {
//   return await Vehicle.findByIdAndDelete(id);
// }

// // Événements (Planning)
// export async function getEventsData() {
//   return await Event.find({});
// }

// export async function addEvent(eventData) {
//   const event = new Event(eventData);
//   return await event.save();
// }

// export async function updateEvent(id, updatedData) {
//   return await Event.findByIdAndUpdate(id, updatedData, { new: true });
// }

// export async function deleteEvent(id) {
//   return await Event.findByIdAndDelete(id);
// }

// // Statistiques mensuelles (inchangé)
// import { getCollection } from './connect.js';
// export async function getBilanMonth() {
//   const collection = await getCollection("bilanMonth");
//   return await collection.find({}).toArray();
// }
