import express from 'express';
import { body } from 'express-validator';

import {
  login,
  register,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['ADMIN', 'LOGISTICS', 'COMMANDER']),
    body('base').optional().isMongoId()
  ],
  register
);

export default router;
