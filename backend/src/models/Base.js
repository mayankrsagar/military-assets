import mongoose from 'mongoose';

const BaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
}, { timestamps: true });

const Base =mongoose.models.Base || mongoose.model('Base', BaseSchema);
export default Base;
