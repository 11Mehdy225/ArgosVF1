import mongoose from "mongoose";

const resultatSchema = new mongoose.Schema({
  mois: String,
  annee: Number,
  donnees: [Object], // tableau de correspondances enrichies
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ResultatRecouvrement = mongoose.model("ResultatRecouvrement", resultatSchema);
export default ResultatRecouvrement;
