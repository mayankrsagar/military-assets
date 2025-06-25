import express from 'express';

import { authenticate } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { baseId, equipmentTypeId, date } = req.query;
  const start = new Date(date);
  start.setHours(0,0,0,0);
  const end = new Date(date);
  end.setHours(23,59,59,999);
  const match = { createdAt: { $gte: start, $lte: end } };
  if (baseId) match.$or = [{ baseFrom: baseId }, { baseTo: baseId }];
  if (equipmentTypeId) match.equipmentType = equipmentTypeId;

  const txs = await Transaction.find(match);
  const opening = await calculateOpeningBalance(baseId, equipmentTypeId, start);
  const purchased = txs.filter(t=>t.type==='PURCHASE').reduce((s,t)=>s+t.quantity,0);
  const inCnt = txs.filter(t=>t.type==='TRANSFER_IN').reduce((s,t)=>s+t.quantity,0);
  const outCnt = txs.filter(t=>t.type==='TRANSFER_OUT').reduce((s,t)=>s+t.quantity,0);
  const assigned = txs.filter(t=>t.type==='ASSIGN').reduce((s,t)=>s+t.quantity,0);
  const expended = txs.filter(t=>t.type==='EXPEND').reduce((s,t)=>s+t.quantity,0);
  const net = purchased + inCnt - outCnt;
  const closing = opening + net - assigned - expended;

  res.json({ opening, purchased, transferIn: inCnt, transferOut: outCnt, net, assigned, expended, closing });
});

export default router;