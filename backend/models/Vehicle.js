import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  type: { type: String },
  marque: { type: String, required: true },
  modele: { type: String, required: true },
  immatriculation: { type: String, required: true, unique: true }, // ou "plaque"
  plaque: { type: String, required: true },
  matricule: { type: String },
  etat: { type: String },
  disponible: { type: Boolean, default: false },
  kilometrage: { type: Number, required: true },
  revision: { type: Date }, // 🚗 nouvelle date pour la visite technique
  entretien: { type: String },
}, { timestamps: true });


const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
