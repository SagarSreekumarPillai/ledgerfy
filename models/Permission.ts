// FILE: /models/Permission.ts
import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  description: String,
  isSystem: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for efficient lookups
PermissionSchema.index({ category: 1, name: 1 });

export default mongoose.model('Permission', PermissionSchema);
