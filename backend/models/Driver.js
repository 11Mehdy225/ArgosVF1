import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  permis: { type: String, required: true },
  matricule: { type: String, required: true, unique: true },
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
