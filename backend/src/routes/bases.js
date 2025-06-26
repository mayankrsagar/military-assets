import express from 'express';

import Base from '../models/Base.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const bases = await Base.find();
    res.json(bases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;