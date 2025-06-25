import AuditLog from '../models/AuditLog.js';

export const audit = async (entity, entityId, before, after, userId) => {
  await AuditLog.create({ entity, entityId, operation: `${entity}.${entityId}`, dataBefore: before, dataAfter: after, performedBy: userId });
};