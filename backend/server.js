import express from "express";
import cors from "cors";
import {
  getDrivers,
  addDriver,
  getBilanMonth,
  getEventsData,
  getEventsCollection,
  addEvent,
  getVehicles,
  getDriversCollection,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesCollection,
} from "./actions.js";
import bodyParser from "body-parser";
import { ObjectId } from "mongodb";
import Driver from "./models/Driver.js";
import Event from "./models/Event.js";
import ResultatRecouvrement from "./models/resultatRecouvrement.js";
import BilanMonth from "./models/BilanMonth.js";
import Contravention from "./models/contravention.js";
import RecouvrementHistory from "./models/RecouvrementHistory.js";
import VehiclePosition from './models/VehiclePosition.js';
import path from "path";
import mongoose from "mongoose";
import XLSX from "xlsx";
import fs from "fs";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { getCollection } from "./connect.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import twilio from 'twilio';

dotenv.config();


// URI de connexion MongoDB
const uri ="";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connexion Mongoose
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Mongoose connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur de connexion Mongoose :", err));

const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());
app.use(express.json());

let events = [];


function excelDateToJSDate(excelDate) {
  return new Date((excelDate - 25569) * 86400 * 1000);
}

// ROUTES API


//connexion securisee 
const usersCollection = await getCollection("users");
const allUsers = await usersCollection.find().toArray();



app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await usersCollection.findOne({ username });
  if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });
  
  if (!user.validated) {
    return res.status(403).json({ message: "Compte non validé. Veuillez attendre la validation par un administrateur." });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

  console.log("Clé secrète JWT utilisée :", process.env.JWT_SECRET);
  const token = jwt.sign({ 
    id: user._id, 
    username: user.username ,
    role: user.role
  }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});


app.post("/api/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const existing = await usersCollection.findOne({ username });
  if (existing) {
    return res.status(400).json({ message: "Utilisateur déjà existant." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await usersCollection.insertOne({
    username,
    email,
    password: hashedPassword,
    role,
    isValidated: false, // Validation manuelle par un admin
    createdAt: new Date(),
  });

  res.json({ message: "Utilisateur créé. En attente de validation." });
});

//admin pour valider un utilisateur de l'application

app.get("/api/pending-users", async (req, res) => {
  const usersCollection = await getCollection("users");
  const users = await usersCollection.find({ validated: { $ne: true } }).toArray();
  res.json(users);
});

app.post("/api/validate-user", async (req, res) => {
  const { userId } = req.body;

  try {
    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { validated: true } });

    // Envoi de l'email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Argos" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Validation de votre compte",
      text: `Bonjour ${user.username},\n\nVotre compte a été validé. Vous pouvez désormais vous connecter.\n\nL'équipe Argos/leDeveloppeur.`,
    });

    res.json({ message: "Utilisateur validé et email envoyé." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la validation" });
  }
});

app.get("/api/users", async (req, res) => {
  const usersCollection = await getCollection("users");
  const users = await usersCollection.find({}).toArray();
  res.json(users);
});



//API DRIVERS///////////////////////////////////////////////////////////////////////////
app.get("/api/drivers", async (req, res) => {
  try {
    const drivers = await getDrivers();
    res.json(drivers);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des chauffeurs." });
  }
});

//creer et envoyer des donnees dans la base
app.post("/api/drivers", async (req, res) => {
  try {
    const newDriver = req.body;
    if (
      !newDriver.nom ||
      !newDriver.prenom ||
      !newDriver.permis ||
      !newDriver.matricule
    ) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }
    const result = await addDriver(newDriver);
    res
      .status(201)
      .json({ message: "Chauffeur ajouté", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout du chauffeur." });
  }
});

//supprime un drivers
app.delete("/api/drivers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await getDriversCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Chauffeur non trouvé" });
    }
    res.json({ message: "Chauffeur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//met a jour un
app.put("/api/drivers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const collection = await getDriversCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Aucune mise à jour effectuée" });
    }
    res.json({ message: "Chauffeur mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur update:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//API STATISTIQUE///////////////////////////////////////////////////////////////////
app.get("/api/bilanMois", async (req, res) => {
  try {
    const bilan = await getBilanMonth();
    res.json(bilan);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du chargement du bilan." });
  }
});

//API CALENDRIER///////////////////////////////////////////////////////////////////

//GET(recuperer evenements)
app.get("/api/events", async (req, res) => {
  try {
    const events = await getEventsData();
    res.json(events);
  } catch (err) {
    console.error("Erreur chargement événements:", err);
    res.status(500).json({ error: "Erreur chargement événements." });
  }
});

//POST(Creer evenement)
app.post("/api/events", async (req, res) => {
  try {
    const result = await addEvent(req.body);
    res.status(201).json({ ...req.body, _id: result.insertedId });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'événement." });
  }
});

// PUT (mise à jour)
app.put("/api/events/:id", async (req, res) => {
  try {
    const collection = await getEventsCollection();
    const id = req.params.id;
    // console.log("ID reçu :", id);
    // console.log("Payload reçu :", req.body);
    const updatedData = {
      ...req.body,
      start: new Date(req.body.start),
      end: new Date(req.body.end),
    };
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    const updatedEvent = await collection.findOne({ _id: new ObjectId(id) });
    res.json(updatedEvent);
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: "Erreur mise à jour événement." });
  }
});

// DELETE(supprimer evenement)
app.delete("/api/events/:id", async (req, res) => {
  try {
    const collection = await getEventsCollection();
    const id = req.params.id;

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    console.log(result);
    if (result.deletedCount === 1) {
      res.json({ message: "Événement supprimé avec succès" });
    } else {
      res.status(404).json({ error: "Événement non trouvé" });
    }
  } catch (err) {
    console.error("Erreur suppression événement:", err);
    res.status(500).json({ error: "Erreur suppression événement" });
  }
});

//API VEHICLES///////////////////////////////////////////////////////////////////
app.get("/api/vehicles", async (req, res) => {
  try {
    const vehicles = await getVehicles();
    res.json(vehicles);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des véhicules." });
  }
});

// Route POST - Ajouter un véhicule
app.post("/api/vehicles", async (req, res) => {
  try {
    const newVehicle = req.body;
    const result = await addVehicle(newVehicle);
    res.status(201).json({ ...newVehicle, _id: result.insertedId });
  } catch (err) {
    console.error("Erreur ajout véhicule:", err);
    res.status(500).json({ error: "Erreur ajout véhicule" });
  }
});

// Route PUT - Modifier un véhicule
app.put("/api/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVehicle = req.body;
    const result = await updateVehicle(id, updatedVehicle);
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Aucune mise à jour effectuée" });
    }
    res.json({ message: "Véhicule mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur update véhicule:", err);
    res.status(500).json({ error: "Erreur mise à jour véhicule" });
  }
});

// Route DELETE - Supprimer un véhicule
app.delete("/api/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteVehicle(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Véhicule non trouvé" });
    }
    res.json({ message: "Véhicule supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression véhicule:", err);
    res.status(500).json({ error: "Erreur suppression véhicule" });
  }
});

//pour la page recouvrement
app.post("/api/recouvrement", async (req, res) => {
  const { mois, annee, contraventions } = req.body;

  try {
    // 1. Enrichir et enregistrer les contraventions
    const enrichedContraventions = contraventions.map((c) => ({
      ...c,
      mois,
      annee,
    }));

    try {
      await Contravention.insertMany(enrichedContraventions);
    } catch (err) {
      return res.status(500).json({
        message: "Erreur d'enregistrement des contraventions",
        error: err,
      });
    }

    const events = await Event.find({});
    const drivers = await Driver.find({});
    const matched = [];

    for (const c of enrichedContraventions) {
      const rawDate =
        typeof c.date === "number"
          ? excelDateToJSDate(c.date)
          : new Date(`${c.date}T${c.heure.replace("h", ":")}`);

      const heure = c.heure.includes("h") ? c.heure.replace("h", ":") : c.heure;
      const dateStr = new Date(
        `${rawDate.toISOString().split("T")[0]}T${heure}`
      );

      const event = events.find((e) => {
        const eventStart = new Date(e.start);
        const eventEnd = new Date(e.end);
        const plaqueMatch =
          e.plaque?.trim().toUpperCase() === c.plaque.trim().toUpperCase();
        const timeMatch = dateStr >= eventStart && dateStr <= eventEnd;
        return plaqueMatch && timeMatch;
      });

      if (!event || !event.nom || !event.prenom) continue;

      const driver = drivers.find((d) => {
        const eventNom = (event.nom || "").trim().toLowerCase();
        const eventPrenom = (event.prenom || "").trim().toLowerCase();
        const driverNom = (d.nom || "").trim().toLowerCase();
        const driverPrenom = (d.prenom || "").trim().toLowerCase();
        return driverNom === eventNom && driverPrenom === eventPrenom;
      });

      if (!driver) continue;

      if (!driver.infractions) driver.infractions = [];

      driver.infractions.push({
        date: c.date,
        heure: c.heure,
        plaque: c.plaque,
        infraction: c.infractions,
        montant: c.montant,
      });

      driver.montant = (driver.montant || 0) + Number(c.montant);
      await driver.save();

      matched.push({
        plaque: c.plaque,
        date: excelDateToJSDate(c.date).toLocaleDateString("fr-FR"),
        heure: c.heure,
        infractions: c.infractions,
        montant: c.montant,
        nom: driver.nom,
        prenom: driver.prenom,
      });
    }

    const totalMois = matched.reduce(
      (acc, val) => acc + Number(val.montant),
      0
    );

    const existingBilan = await BilanMonth.findOne({ month: mois });

    if (existingBilan) {
      existingBilan.revenue += totalMois;
      await existingBilan.save();
    } else {
      await BilanMonth.create({ month: mois, revenue: totalMois });
    }

    const fileName = `recouvrement_${mois}_${annee}_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, "recouvrements", fileName);
    const recouvrementsDir = path.join(__dirname, "recouvrements");

    if (!fs.existsSync(recouvrementsDir)) {
      fs.mkdirSync(recouvrementsDir);
    }

    const ws = XLSX.utils.json_to_sheet(matched);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recouvrement");
    XLSX.writeFile(wb, filePath);

    await RecouvrementHistory.create({
      mois,
      annee,
      fileName,
      filePath,
      dateTraitement: new Date(),
    });

    await ResultatRecouvrement.create({ mois, annee, donnees: matched });

    res.status(200).json(matched);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors du traitement du recouvrement." });
  }
});

app.post("/api/notify-driver", async (req, res) => {
  const { nom, prenom, telephone, email, nombreInfractions, montantTotal } = req.body;

  const message = `Bonjour ${prenom} ${nom}, après recoupement, vous avez ${nombreInfractions} infractions pour un montant total de ${montantTotal} F. Veuillez vous rendre au service recouvrement.`;

  const transporter2 = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    // ✅ Envoi du SMS
    if (telephone) {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: telephone.startsWith('+') ? telephone : `+225${telephone}` // adapt. Côte d'Ivoire
      });
    }

    // ✅ Envoi de l’email
    if (email) {
      await transporter2.sendMail({
        to: email,
        subject: "Notification Recouvrement",
        text: message,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur envoi notification :", err);
    res.status(500).json({ message: "Échec de notification." });
  }
});

app.get("/api/recouvrement/historique", async (req, res) => {
  try {
    const historiques = await RecouvrementHistory.find().sort({
      dateTraitement: -1,
    });
    res.json(historiques);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération historique" });
  }
});

app.get("/api/recouvrement/telecharger/:fileName", (req, res) => {
  const filePath = path.join(__dirname, "recouvrements", req.params.fileName);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send("Fichier non trouvé");
  }
});

app.get("/api/recouvrement/resultats", async (req, res) => {
  try {
    const resultats = await ResultatRecouvrement.find({});
    res.json(resultats);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération résultats." });
  }
});

app.get("/api/recouvrement/dernier", async (req, res) => {
  try {
    const dernier = await mongoose.connection
      .collection("recouvrements")
      .find({})
      .sort({ dateTraitement: -1 })
      .limit(1)
      .toArray();

    if (dernier.length === 0) {
      return res.status(404).json({ message: "Aucun fichier trouvé." });
    }

    const fichier = dernier[0];
    return res.json(fichier.data); // le champ `data` contient le tableau final
  } catch (err) {
    console.error("Erreur récupération dernier fichier :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/api/contraventions/types", async (req, res) => {
  const { mois, annee } = req.query;

  try {
    const result = await Contravention.aggregate([
      {
        $match: {
          mois: mois, // ex: "juin"
          annee: annee, // ex: "2025"
        },
      },
      {
        $group: {
          _id: "$infractions", // regroupe par type d'infraction
          count: { $sum: 1 },   // nombre d'infractions
          montantTotal: { $sum: "$montant" }, // total en F
        },
      },
      {
        $sort: { count: -1 }, // optionnel : trie par nombre d'infractions
      },
    ]);

    res.json(result);
  } catch (err) {
    console.error("Erreur récupération par type :", err);
    res.status(500).json({ error: "Erreur récupération contraventions par type." });
  }
});

//position gps

// GET toutes les positions
app.get("/api/vehicle-positions", async (req, res) => {
  try {
    const collection = await getCollection("VehiclePosition");
    const allPositions = await collection.find().toArray();
    res.json(allPositions);
  } catch (err) {
    console.error("Erreur récupération positions :", err);
    res.status(500).json({ error: "Erreur récupération positions" });
  }
});



// POST une nouvelle position
app.post("/api/vehicle-positions", async (req, res) => {
  try {
    const collection = await getCollection("VehiclePosition");
    const { plaque, latitude, longitude } = req.body;
    if (!plaque || !latitude || !longitude) {
      return res.status(400).json({ error: "Champs manquants" });
    }
    // On fait un "upsert" pour mettre à jour la position si la plaque existe déjà
    const result = await collection.updateOne(
      { plaque },
      {
        $set: {
          latitude,
          longitude,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    res.status(201).json({ message: "Position mise à jour", result });
  } catch (err) {
    console.error("Erreur ajout position :", err);
    res.status(500).json({ error: "Erreur ajout position" });
  }
});





// Démarrage du serveur///////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});








// version mongoose ///////////////////////////////////////////////////

// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";

// import {
//   getDrivers,
//   addDriver,
//   updateDriver,
//   deleteDriver,
//   getVehicles,
//   addVehicle,
//   updateVehicle,
//   deleteVehicle,
//   getEventsData,
//   addEvent,
//   updateEvent,
//   deleteEvent,
//   getBilanMonth,
// } from "./actions.js";

// const app = express();
// const port = 3000;

// app.use(cors({ origin: 'http://localhost:5173' }));
// app.use(bodyParser.json());
// app.use(express.json());

// // 🚌 API CHAUFFEURS
// app.get("/api/drivers", async (req, res) => {
//   try {
//     const drivers = await getDrivers();
//     res.json(drivers);
//   } catch (err) {
//     res.status(500).json({ error: "Erreur lors de la récupération des chauffeurs." });
//   }
// });

// app.post("/api/drivers", async (req, res) => {
//   try {
//     const { nom, prenom, permis, matricule } = req.body;
//     if (!nom || !prenom || !permis || !matricule) {
//       return res.status(400).json({ error: "Tous les champs sont requis." });
//     }
//     const newDriver = await addDriver(req.body);
//     res.status(201).json(newDriver);
//   } catch (err) {
//     res.status(500).json({ error: "Erreur lors de l'ajout du chauffeur." });
//   }
// });

// app.put("/api/drivers/:id", async (req, res) => {
//   try {
//     const updated = await updateDriver(req.params.id, req.body);
//     if (!updated) return res.status(404).json({ message: "Chauffeur non trouvé" });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Erreur serveur lors de la mise à jour du chauffeur" });
//   }
// });

// app.delete("/api/drivers/:id", async (req, res) => {
//   try {
//     const deleted = await deleteDriver(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Chauffeur non trouvé" });
//     res.json({ message: "Chauffeur supprimé avec succès" });
//   } catch (err) {
//     res.status(500).json({ message: "Erreur serveur lors de la suppression du chauffeur" });
//   }
// });

// // 🚗 API VEHICULES
// app.get("/api/vehicles", async (req, res) => {
//   try {
//     const vehicles = await getVehicles();
//     res.json(vehicles);
//   } catch (err) {
//     res.status(500).json({ error: "Erreur lors de la récupération des véhicules." });
//   }
// });

// app.post("/api/vehicles", async (req, res) => {
//   try {
//     const vehicle = await addVehicle(req.body);
//     res.status(201).json(vehicle);
//   } catch (err) {
//     res.status(500).json({ error: "Erreur lors de l'ajout du véhicule." });
//   }
// });

// app.put("/api/vehicles/:id", async (req, res) => {
//   try {
//     const updated = await updateVehicle(req.params.id, req.body);
//     if (!updated) return res.status(404).json({ message: "Véhicule non trouvé" });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Erreur mise à jour véhicule" });
//   }
// });

// app.delete("/api/vehicles/:id", async (req, res) => {
//   try {
//     const deleted = await deleteVehicle(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Véhicule non trouvé" });
//     res.json({ message: "Véhicule supprimé avec succès" });
//   } catch (err) {
//     res.status(500).json({ error: "Erreur suppression véhicule" });
//   }
// });

// // 📅 API EVENEMENTS
// app.get("/api/events", async (req, res) => {
//   try {
//     const events = await getEventsData();
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ error: "Erreur chargement événements." });
//   }
// });

// app.post("/api/events", async (req, res) => {
//   try {
//     const event = await addEvent(req.body);
//     res.status(201).json(event);
//   } catch (err) {
//     res.status(500).json({ error: "Erreur création événement." });
//   }
// });

// app.put("/api/events/:id", async (req, res) => {
//   try {
//     const updated = await updateEvent(req.params.id, req.body);
//     if (!updated) return res.status(404).json({ error: "Événement non trouvé" });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Erreur mise à jour événement." });
//   }
// });

// app.delete("/api/events/:id", async (req, res) => {
//   try {
//     const deleted = await deleteEvent(req.params.id);
//     if (!deleted) return res.status(404).json({ error: "Événement non trouvé" });
//     res.json({ message: "Événement supprimé avec succès" });
//   } catch (err) {
//     res.status(500).json({ error: "Erreur suppression événement." });
//   }
// });

// // 📊 API BILAN (inchangé)
// app.get("/api/bilanMois", async (req, res) => {
//   try {
//     const bilan = await getBilanMonth();
//     res.json(bilan);
//   } catch (err) {
//     res.status(500).json({ error: "Erreur lors du chargement du bilan." });
//   }
// });

// // 🚀 Lancer le serveur
// app.listen(port, () => {
//   console.log(`✅ Serveur démarré sur http://localhost:${port}`);
// });
