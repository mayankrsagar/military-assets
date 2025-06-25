// src/routes/equipmentTypes.js
import express from 'express';

import EquipmentType from '../models/EquipmentType.js';

const router = express.Router()

// Get all equipment types
router.get('/', async (req, res) => {
  try {
    const equipmentTypes = await EquipmentType.find()
    res.json(equipmentTypes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router