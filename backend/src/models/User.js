import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'COMMANDER', 'LOGISTICS'], required: true },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
