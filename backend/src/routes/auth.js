import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid creds' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ message: 'Invalid creds' });
  const token = jwt.sign({ id: user._id, role: user.role, base: user.base }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

export default router;