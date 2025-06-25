import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  personnelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  equipmentType: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'EquipmentType', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1
  },
  status: { 
    type: String, 
    enum: ['ASSIGNED','RETURNED','EXPENDED'], 
    default: 'ASSIGNED' 
  },
}, { timestamps: true })

const Assignment= mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
export default Assignment;