// FILE: /models/Role.ts
import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  firmId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Firm', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  description: String,
  permissions: [String],
  isPreset: { 
    type: Boolean, 
    default: false 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Ensure unique role names per firm
RoleSchema.index({ firmId: 1, name: 1 }, { unique: true });

// Update timestamp on save
RoleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Role', RoleSchema);
