import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  equipmentType: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentType', required: true },
  quantity: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Asset || mongoose.model('Asset', AssetSchema);
