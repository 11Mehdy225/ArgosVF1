import mongoose from 'mongoose';

const vehiclePositionSchema = new mongoose.Schema({
  plaque: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const VehiclePosition = mongoose.model('VehiclePosition', vehiclePositionSchema);

export default VehiclePosition;
