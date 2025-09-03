// FILE: /backend/seed/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const Firm = require('../models/Firm');

// System permissions
const SYSTEM_PERMISSIONS = [
  // User management
  { name: 'users:read', category: 'users', description: 'View users' },
  { name: 'users:create', category: 'users', description: 'Create users' },
  { name: 'users:update', category: 'users', description: 'Update users' },
  { name: 'users:delete', category: 'users', description: 'Delete users' },
  { name: 'users:invite', category: 'users', description: 'Invite users' },
  
  // Role management
  { name: 'roles:read', category: 'roles', description: 'View roles' },
  { name: 'roles:create', category: 'roles', description: 'Create roles' },
  { name: 'roles:update', category: 'roles', description: 'Update roles' },
  { name: 'roles:delete', category: 'roles', description: 'Delete roles' },
  
  // Document management
  { name: 'documents:read', category: 'documents', description: 'View documents' },
  { name: 'documents:create', category: 'documents', description: 'Create documents' },
  { name: 'documents:update', category: 'documents', description: 'Update documents' },
  { name: 'documents:delete', category: 'documents', description: 'Delete documents' },
  { name: 'documents:upload', category: 'documents', description: 'Upload documents' },
  { name: 'documents:share', category: 'documents', description: 'Share documents' },
  
  // Client management
  { name: 'clients:read', category: 'clients', description: 'View clients' },
  { name: 'clients:create', category: 'clients', description: 'Create clients' },
  { name: 'clients:update', category: 'clients', description: 'Update clients' },
  { name: 'clients:delete', category: 'clients', description: 'Delete clients' },
  
  // Project management
  { name: 'projects:read', category: 'projects', description: 'View projects' },
  { name: 'projects:create', category: 'projects', description: 'Create projects' },
  { name: 'projects:update', category: 'projects', description: 'Update projects' },
  { name: 'projects:delete', category: 'projects', description: 'Delete projects' },
  { name: 'projects:assign', category: 'projects', description: 'Assign projects' },
  
  // Compliance management
  { name: 'compliance:read', category: 'compliance', description: 'View compliance' },
  { name: 'compliance:create', category: 'compliance', description: 'Create compliance' },
  { name: 'compliance:update', category: 'compliance', description: 'Update compliance' },
  { name: 'compliance:delete', category: 'compliance', description: 'Delete compliance' },
  { name: 'compliance:approve', category: 'compliance', description: 'Approve compliance' },
  
  // Audit and reporting
  { name: 'audit:read', category: 'audit', description: 'View audit logs' },
  { name: 'audit:export', category: 'audit', description: 'Export audit logs' },
  { name: 'reports:read', category: 'reports', description: 'View reports' },
  { name: 'reports:create', category: 'reports', description: 'Create reports' },
  { name: 'reports:export', category: 'reports', description: 'Export reports' },
  
  // Firm settings
  { name: 'firm:read', category: 'firm', description: 'View firm settings' },
  { name: 'firm:update', category: 'firm', description: 'Update firm settings' },
  { name: 'firm:delete', category: 'firm', description: 'Delete firm' },
  
  // Integrations
  { name: 'integrations:read', category: 'integrations', description: 'View integrations' },
  { name: 'integrations:update', category: 'integrations', description: 'Update integrations' },
  { name: 'integrations:delete', category: 'integrations', description: 'Delete integrations' }
];

// Preset roles with permissions
const PRESET_ROLES = [
  {
    name: 'admin',
    description: 'Full access to all features and settings',
    permissions: [
      'users:read', 'users:create', 'users:update', 'users:delete', 'users:invite',
      'roles:read', 'roles:create', 'roles:update', 'roles:delete',
      'documents:read', 'documents:create', 'documents:update', 'documents:delete', 'documents:upload', 'documents:share',
      'clients:read', 'clients:create', 'clients:update', 'clients:delete',
      'projects:read', 'projects:create', 'projects:update', 'projects:delete', 'projects:assign',
      'compliance:read', 'compliance:create', 'compliance:update', 'compliance:delete', 'compliance:approve',
      'audit:read', 'audit:export',
      'reports:read', 'reports:create', 'reports:export',
      'firm:read', 'firm:update', 'firm:delete',
      'integrations:read', 'integrations:update', 'integrations:delete'
    ]
  },
  {
    name: 'partner',
    description: 'Senior partner with broad access to business operations',
    permissions: [
      'users:read', 'users:create', 'users:update', 'users:invite',
      'roles:read',
      'documents:read', 'documents:create', 'documents:update', 'documents:upload', 'documents:share',
      'clients:read', 'clients:create', 'clients:update', 'clients:delete',
      'projects:read', 'projects:create', 'projects:update', 'projects:assign',
      'compliance:read', 'compliance:create', 'compliance:update', 'compliance:approve',
      'audit:read',
      'reports:read', 'reports:create', 'reports:export',
      'firm:read', 'firm:update',
      'integrations:read', 'integrations:update'
    ]
  },
  {
    name: 'manager',
    description: 'Team manager with project and client oversight',
    permissions: [
      'users:read', 'users:create', 'users:update',
      'documents:read', 'documents:create', 'documents:update', 'documents:upload', 'documents:share',
      'clients:read', 'clients:create', 'clients:update',
      'projects:read', 'projects:create', 'projects:update', 'projects:assign',
      'compliance:read', 'compliance:create', 'compliance:update',
      'reports:read', 'reports:create',
      'firm:read'
    ]
  },
  {
    name: 'senior',
    description: 'Senior staff member with project execution capabilities',
    permissions: [
      'users:read',
      'documents:read', 'documents:create', 'documents:update', 'documents:upload',
      'clients:read', 'clients:create',
      'projects:read', 'projects:update',
      'compliance:read', 'compliance:create', 'compliance:update',
      'reports:read'
    ]
  },
  {
    name: 'associate',
    description: 'Junior staff member with basic access',
    permissions: [
      'documents:read', 'documents:create', 'documents:upload',
      'clients:read',
      'projects:read',
      'compliance:read'
    ]
  },
  {
    name: 'client',
    description: 'Client with limited access to their own data',
    permissions: [
      'documents:read',
      'compliance:read'
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data (optional - comment out if you want to preserve data)
    // await User.deleteMany({});
    // await Role.deleteMany({});
    // await Permission.deleteMany({});
    // await Firm.deleteMany({});
    // console.log('🗑️  Cleared existing data');
    
    // Create system permissions
    console.log('📝 Creating system permissions...');
    for (const permissionData of SYSTEM_PERMISSIONS) {
      const existingPermission = await Permission.findOne({ name: permissionData.name });
      if (!existingPermission) {
        const permission = new Permission({
          ...permissionData,
          isSystem: true
        });
        await permission.save();
        console.log(`  ✅ Created permission: ${permissionData.name}`);
      } else {
        console.log(`  ⏭️  Permission already exists: ${permissionData.name}`);
      }
    }
    
    // Create default firm if it doesn't exist
    console.log('🏢 Creating default firm...');
    let defaultFirm = await Firm.findOne({ name: 'Default Firm' });
    if (!defaultFirm) {
      defaultFirm = new Firm({
        name: 'Default Firm',
        type: 'CA',
        address: {
          street: '123 Business Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        },
        contact: {
          email: 'admin@defaultfirm.com',
          phone: '+91-9876543210'
        },
        gstin: '22AAAAA0000A1Z5',
        pan: 'AAAAA0000A',
        tan: 'MUMB00000A',
        isActive: true
      });
      await defaultFirm.save();
      console.log('  ✅ Created default firm');
    } else {
      console.log('  ⏭️  Default firm already exists');
    }
    
    // Create preset roles
    console.log('👥 Creating preset roles...');
    const createdRoles = {};
    
    for (const roleData of PRESET_ROLES) {
      const existingRole = await Role.findOne({ 
        name: roleData.name, 
        firmId: defaultFirm._id 
      });
      
      if (!existingRole) {
        // Get permission IDs
        const permissions = await Permission.find({ 
          name: { $in: roleData.permissions } 
        });
        
        const role = new Role({
          name: roleData.name,
          description: roleData.description,
          permissions: permissions.map(p => p._id),
          firmId: defaultFirm._id,
          isPreset: true
        });
        
        await role.save();
        createdRoles[roleData.name] = role;
        console.log(`  ✅ Created role: ${roleData.name}`);
      } else {
        createdRoles[roleData.name] = existingRole;
        console.log(`  ⏭️  Role already exists: ${roleData.name}`);
      }
    }
    
    // Create default admin user
    console.log('👤 Creating default admin user...');
    const existingAdmin = await User.findOne({ email: 'admin@defaultfirm.com' });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const adminUser = new User({
        email: 'admin@defaultfirm.com',
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
        firmId: defaultFirm._id,
        roleId: createdRoles['admin']._id,
        isActive: true,
        isEmailVerified: true,
        preferences: {
          theme: 'system',
          language: 'en',
          timezone: 'Asia/Kolkata'
        }
      });
      
      await adminUser.save();
      console.log('  ✅ Created default admin user (admin@defaultfirm.com / admin123)');
    } else {
      console.log('  ⏭️  Default admin user already exists');
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Default credentials:');
    console.log('  Email: admin@defaultfirm.com');
    console.log('  Password: admin123');
    console.log('\n⚠️  Remember to change the default password in production!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
