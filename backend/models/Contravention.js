import mongoose from "mongoose";

const contraventionSchema = new mongoose.Schema({
  plaque: String,
  code: String,                     
  infractions: String,
  numero_contravention: String,     
  date: String,
  heure: String,
  code_paiement: String,            
  montant: Number,
  mois: String,
  annee: String,
});

const Contravention = mongoose.model("Contravention", contraventionSchema);
export default Contravention;
