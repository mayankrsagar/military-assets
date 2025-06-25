import express from 'express';

import { authenticate } from '../middleware/auth.js';
import { audit } from '../middleware/logger.js';
import { permit } from '../middleware/rbac.js';
import Asset from '../models/Asset.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Record Purchase
router.post('/', authenticate, permit('ADMIN','LOGISTICS'), async (req, res) => {
  const { baseId, equipmentTypeId, quantity } = req.body;
  const tx = await Transaction.create({ type: 'PURCHASE', baseTo: baseId, equipmentType: equipmentTypeId, quantity, performedBy: req.user.id,
base: req.user.base  // Add base reference 
});
  // update Asset
  const asset = await Asset.findOneAndUpdate(
    { base: baseId, equipmentType: equipmentTypeId },
    { $inc: { quantity } },
    { upsert: true, new: true }
  );
  await audit('Transaction', tx._id, null, tx, req.user.id);
  res.json({ tx, asset });
});

// Get Purchases
router.get('/', authenticate, permit('ADMIN','COMMANDER','LOGISTICS'), async (req, res) => {
  const { baseId, equipmentTypeId, from, to } = req.query;
  const filter = { type: 'PURCHASE' };
  if (req.user.role === 'COMMANDER') filter.baseTo = req.user.base;
  if (baseId) filter.baseTo = baseId;
  if (equipmentTypeId) filter.equipmentType = equipmentTypeId;
  if (from || to) filter.createdAt = {};
  if (from) filter.createdAt.$gte = new Date(from);
  if (to) filter.createdAt.$lte = new Date(to);
  const purchases = await Transaction.find(filter);
  res.json(purchases);
});

export default router;