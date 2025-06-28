// // fixEventsPlaque.js
// import { getEventsCollection } from './actions.js';
// import { connectDB } from './connect.js';

// async function corrigerVehicleEvents() {
//   await connectDB(); // ✅ Connexion MongoDB
//   const collection = await getEventsCollection();

//   const events = await collection.find({}).toArray();
//   let corrections = 0;

//   for (const e of events) {
//     if (!e.title && e.nom && e.prenom && e.plaque) {
//       const title = `${e.nom} ${e.prenom} (${e.plaque})`;

//       await collection.updateOne(
//         { _id: e._id },
//         { $set: { title } }
//       );

//       console.log(`✅ Title ajouté à ${e.nom} ${e.prenom} (${e.plaque})`);
//       corrections++;
//     }
//   }

//   console.log(`🎯 ${corrections} événements corrigés avec ajout du champ 'title'.`);
// }

// corrigerVehicleEvents()
//   .then(() => {
//     console.log("🎉 Correction terminée.");
//     process.exit();
//   })
//   .catch(err => {
//     console.error("❌ Erreur pendant la correction :", err);
//     process.exit(1);
//   });

  // const runFix = async () => {

  //   try {
  //     await connectDB(); 
  //     console.log("🟢 Connecté à MongoDB");
  
  //     const events = await Event.find({});
  
  //     for (const e of events) {
  //       if (!e.title && e.nom && e.prenom && e.plaque) {
  //         e.title = `${e.nom} ${e.prenom} (${e.plaque})`;
  //         await e.save();
  //         console.log(`✅ Title ajouté à ${e.nom} ${e.prenom}`);
  //       }
  //     }
  
  //     console.log("🎉 Correction terminée !");
  //     process.exit();
  //   } catch (error) {
  //     console.error("❌ Erreur lors de la correction :", error);
  //     process.exit(1);
  //   }
  // };
  
  // runFix();


  import { connectDB } from './connect.js';
// import { getEventsCollection } from './actions.js';

// const runFixNomPrenom = async () => {
//   await connectDB();
//   const collection = await getEventsCollection();
//   const events = await collection.find({}).toArray();

//   let fixes = 0;

//   for (const e of events) {
//     if ((!e.nom || !e.prenom) && e.driver) {
//       const [nom, ...reste] = e.driver.trim().split(' ');
//       const prenom = reste.join(' ').trim();

//       await collection.updateOne(
//         { _id: e._id },
//         {
//           $set: {
//             nom,
//             prenom,
//             title: `${nom} ${prenom} (${e.plaque || ''})`,
//           },
//           $unset: {
//             driver: ""
//           }
//         }
//       );
//       console.log(`✅ Corrigé : ${e.driver} → nom: ${nom}, prenom: ${prenom}`);
//       fixes++;
//     }
//   }

//   console.log(`🎉 Correction terminée. Total corrigés : ${fixes}`);
//   process.exit();
// };

// runFixNomPrenom().catch((err) => {
//   console.error("❌ Erreur lors de la correction :", err);
//   process.exit(1);
// });

// initAdminUser.js
// import { getCollection } from "./connect.js";
// import bcrypt from "bcryptjs";

// async function createAdminUser() {
//   const usersCollection = await getCollection("users");

//   // Vérifie s'il existe déjà
//   const existing = await usersCollection.findOne({ username: "admin" });
//   if (existing) {
//     console.log("✅ L'utilisateur 'admin' existe déjà");
//     return;
//   }

//   const hashedPassword = await bcrypt.hash("bonjourRecovery", 10);

//   await usersCollection.insertOne({
//     username: "admin",
//     email: "admin@example.com",
//     password: hashedPassword,
//     role: "admin"
//   });

//   console.log("🎉 Utilisateur admin créé avec succès !");
// }

// createAdminUser().catch(console.error);
