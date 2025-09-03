import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  firmId: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  role?: 'admin' | 'partner' | 'senior' | 'article' | 'staff' | 'client';
  mfaEnabled: boolean;
  mfaSecret?: string;
  mfaBackupCodes?: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  refreshToken?: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      sms: boolean;
      whatsapp: boolean;
    };
  };
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPermissions(): Promise<string[]>;
  hasPermission(permission: string): Promise<boolean>;
  getFullName(): string;
  displayName: string;
}

const userSchema = new Schema<IUser>({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    trim: true
  },
  
  // RBAC & Firm Information
  firmId: {
    type: Schema.Types.ObjectId,
    ref: 'Firm',
    required: true
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  // Legacy role field for backward compatibility
  role: {
    type: String,
    enum: ['admin', 'partner', 'senior', 'article', 'staff', 'client'],
    default: 'staff'
  },
  
  // MFA & Security
  mfaEnabled: {
    type: Boolean,
    default: false
  },
  mfaSecret: String,
  mfaBackupCodes: [String],
  
  // Status & Preferences
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  refreshToken: {
    type: String
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false }
    }
  },
  
  // Audit Fields
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ firmId: 1, roleId: 1 });
userSchema.index({ firmId: 1, isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user permissions (will be populated from role)
userSchema.methods.getPermissions = async function(): Promise<string[]> {
  await this.populate('roleId');
  return this.roleId ? (this.roleId as any).permissions : [];
};

// Method to check if user has specific permission
userSchema.methods.hasPermission = async function(permission: string): Promise<boolean> {
  const permissions = await this.getPermissions();
  return permissions.includes(permission);
};

// Method to get full name
userSchema.methods.getFullName = function(): string {
  return `${this.firstName} ${this.lastName}`;
};

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return this.getFullName();
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret: any) {
    delete ret.password;
    delete ret.mfaSecret;
    delete ret.mfaBackupCodes;
    return ret;
  }
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
