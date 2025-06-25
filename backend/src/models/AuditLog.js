import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  entity: String,
  entityId: mongoose.Schema.Types.ObjectId,
  operation: String,
  dataBefore: mongoose.Schema.Types.Mixed,
  dataAfter: mongoose.Schema.Types.Mixed,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
