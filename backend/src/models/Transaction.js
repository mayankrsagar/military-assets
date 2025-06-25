import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['PURCHASE', 'TRANSFER_IN', 'TRANSFER_OUT', 'ASSIGN', 'EXPEND'], 
    required: true 
  },
  baseFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
  baseTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
  equipmentType: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentType', required: true },
  quantity: { type: Number, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
