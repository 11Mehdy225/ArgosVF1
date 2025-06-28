import { MongoClient, ServerApiVersion } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/../.env` });

const uri = process.env.MONGODB_URI;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let isConnected = false;

// Connexion unique
export async function connectDB() {
  if (!isConnected) {
    try {
      await client.connect();
      await client.db("argosTest1").command({ ping: 1 });
      console.log("✅ MongoDB connecté via connectDB()");
      isConnected = true;
    } catch (e) {
      console.error("❌ Erreur de connexion MongoDB :", e);
      throw e;
    }
  }
  return client;
}

// Pour récupérer une collection facilement de facon universel
export async function getCollection(name) {
  const client = await connectDB();
  return client.db("argosTest1").collection(name);
}







// version mongoose et mongoClient ///////////////////////////////////////////////////
// // 📦 Imports
// import mongoose from 'mongoose';
// import { MongoClient, ServerApiVersion } from 'mongodb';

// // 🧩 URI et nom de base
// const uri = "";
// const dbName = "argosTest1";

// // ✅ Connexion Mongoose (ODM moderne pour les modèles)
// mongoose.connect(uri, {
//   dbName, // indique explicitement la base
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("✅ Connecté à MongoDB via Mongoose"))
// .catch(err => console.error("❌ Erreur connexion Mongoose :", err));

// // 🧱 Connexion MongoClient (pour fonctions directes comme getCollection)
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// let isConnected = false;

// // 🔌 Connexion unique MongoClient
// export async function connectDB() {
//   if (!isConnected) {
//     try {
//       await client.connect();
//       await client.db(dbName).command({ ping: 1 });
//       console.log("✅ MongoClient connecté via connectDB()");
//       isConnected = true;
//     } catch (e) {
//       console.error("❌ Erreur de connexion MongoClient :", e);
//       throw e;
//     }
//   }
//   return client;
// }

// // 📂 Utilitaire pour accéder à une collection Mongo "brute"
// export async function getCollection(name) {
//   const client = await connectDB();
//   return client.db(dbName).collection(name);
// }
