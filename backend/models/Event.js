import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  plaque: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  title: { type: String },
  description: { type: String }
}, { timestamps: true });


const Event = mongoose.model('Event', eventSchema);
export default Event;
