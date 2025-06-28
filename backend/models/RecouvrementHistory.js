// models/RecouvrementHistory.js
import mongoose from "mongoose";

const recouvrementHistorySchema = new mongoose.Schema({
  mois: String,
  annee: Number,
  fileName: String,
  filePath: String,
  dateTraitement: { type: Date, default: Date.now }
});

export default mongoose.model("RecouvrementHistory", recouvrementHistorySchema);
