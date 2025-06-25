import express from 'express';

import { authenticate } from '../middleware/auth.js';
import { audit } from '../middleware/logger.js';
import { permit } from '../middleware/rbac.js';
import Asset from '../models/Asset.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Transfer
router.post('/', authenticate, permit('ADMIN','LOGISTICS'), async (req, res) => {
  const { fromBase, toBase, equipmentTypeId, quantity } = req.body;
  // Create OUT
  const txOut = await Transaction.create({ type: 'TRANSFER_OUT', baseFrom: fromBase, equipmentType: equipmentTypeId, quantity, performedBy: req.user.id });
  // Create IN
  const txIn = await Transaction.create({ type: 'TRANSFER_IN', baseTo: toBase, equipmentType: equipmentTypeId, quantity, performedBy: req.user.id });
  // update assets
  await Asset.findOneAndUpdate({ base: fromBase, equipmentType: equipmentTypeId }, { $inc: { quantity: -quantity } });
  await Asset.findOneAndUpdate({ base: toBase, equipmentType: equipmentTypeId }, { $inc: { quantity } }, { upsert: true });
  await audit('Transaction', txOut._id, null, txOut, req.user.id);
  await audit('Transaction', txIn._id, null, txIn, req.user.id);
  res.json({ txOut, txIn });
});

// Get Transfers
router.get('/', authenticate, permit('ADMIN','COMMANDER','LOGISTICS'), async (req, res) => {
  const { baseId, direction, from, to } = req.query;
  const filter = { type: direction === 'IN' ? 'TRANSFER_IN' : 'TRANSFER_OUT' };
  if (req.user.role === 'COMMANDER') {
    filter[direction === 'IN' ? 'baseTo' : 'baseFrom'] = req.user.base;
  }
  if (baseId) filter[direction === 'IN' ? 'baseTo' : 'baseFrom'] = baseId;
  if (from || to) filter.createdAt = {};
  if (from) filter.createdAt.$gte = new Date(from);
  if (to) filter.createdAt.$lte = new Date(to);
  const transfers = await Transaction.find(filter);
  res.json(transfers);
});

export default router;