import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import assignmentRoutes from './routes/assignments.js';
import authRoutes from './routes/auth.js';
import baseRoutes from './routes/bases.js';
import dashboardRoutes from './routes/dashboard.js';
import equipmentTypeRoutes from './routes/equipmentTypes.js';
import purchaseRoutes from './routes/purchases.js';
import transferRoutes from './routes/transfers.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',    // your Next.js dev server
  credentials: true                   // if you need to send cookies/auth headers
}))

app.use(express.json());
app.use(morgan('dev'));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/bases', baseRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/equipment-types', equipmentTypeRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));