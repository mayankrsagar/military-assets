import mongoose from 'mongoose';

const EquipmentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, default: 'units' },
}, { timestamps: true });

const EquipmentType= mongoose.models.EquipmentType || mongoose.model('EquipmentType', EquipmentTypeSchema);
export default EquipmentType;