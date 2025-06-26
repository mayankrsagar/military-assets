import express from 'express';

import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  
  try {
    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;