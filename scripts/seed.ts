import dbConnect from '../lib/db'
import Firm from '../models/Firm'
import Role from '../models/Role'
import User from '../models/User'
import bcrypt from 'bcryptjs'

async function seed() {
  try {
    await dbConnect()
    console.log('🌱 Starting database seeding...')

    // Clear existing data
    await User.deleteMany({})
    await Role.deleteMany({})
    await Firm.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Create default firm
    const firm = await Firm.create({
      name: 'Test Firm & Associates',
      legalName: 'Test Firm & Associates Private Limited',
      registrationNumber: 'F123456789',
      taxId: 'PAN123456789',
      address: {
        street: '123 Business Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India'
      },
      contact: {
        email: 'admin@testfirm.com',
        phone: '+91-98765-43210',
        website: 'https://testfirm.com'
      },
      industry: 'Professional Services',
      size: 'medium',
      subscription: {
        plan: 'enterprise',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        features: ['*']
      },
      settings: {
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'Indian',
        fiscalYearStart: '01/04',
        workingDays: [1, 2, 3, 4, 5],
        workingHours: {
          start: '09:00',
          end: '18:00'
        }
      },
      integrations: {
        tally: true,
        zoho: true,
        quickbooks: false,
        xero: false,
        custom: []
      },
      isActive: true
    })
    console.log('🏢 Created firm:', firm.name)

    // Create default roles
    const adminRole = await Role.create({
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      firmId: firm._id,
      permissions: ['*'],
      isActive: true,
      isSystem: true
    })

    const partnerRole = await Role.create({
      name: 'Partner',
      description: 'Senior partner with broad access',
      firmId: firm._id,
      permissions: [
        'dashboard:read',
        'documents:*',
        'compliance:*',
        'projects:*',
        'clients:*',
        'ledger:*',
        'analytics:*',
        'users:read',
        'roles:read',
        'firm:read',
        'audit:read'
      ],
      isActive: true,
      isSystem: true
    })

    const seniorRole = await Role.create({
      name: 'Senior',
      description: 'Senior professional with project management access',
      firmId: firm._id,
      permissions: [
        'dashboard:read',
        'documents:read',
        'documents:create',
        'documents:update',
        'compliance:read',
        'compliance:create',
        'compliance:update',
        'projects:*',
        'clients:read',
        'clients:update',
        'ledger:read',
        'ledger:create',
        'ledger:update',
        'analytics:read'
      ],
      isActive: true,
      isSystem: true
    })

    const staffRole = await Role.create({
      name: 'Staff',
      description: 'Regular staff member with basic access',
      firmId: firm._id,
      permissions: [
        'dashboard:read',
        'documents:read',
        'documents:create',
        'compliance:read',
        'projects:read',
        'clients:read',
        'ledger:read',
        'ledger:create'
      ],
      isActive: true,
      isSystem: true
    })

    const clientRole = await Role.create({
      name: 'Client',
      description: 'Client user with limited access',
      firmId: firm._id,
      permissions: [
        'dashboard:read',
        'documents:read',
        'compliance:read',
        'projects:read'
      ],
      isActive: true,
      isSystem: true
    })

    console.log('👥 Created roles:', [adminRole.name, partnerRole.name, seniorRole.name, staffRole.name, clientRole.name])

    // Create default users
    const adminPassword = await bcrypt.hash('admin123', 12)
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@testfirm.com',
      password: adminPassword,
      phone: '+91-98765-43210',
      firmId: firm._id,
      roleId: adminRole._id,
      role: 'admin',
      mfaEnabled: false,
      isActive: true,
      isEmailVerified: true,
      preferences: {
        theme: 'auto',
        notifications: {
          email: true,
          sms: false,
          whatsapp: false
        },
        language: 'en',
        timezone: 'Asia/Kolkata'
      }
    })

    const partnerPassword = await bcrypt.hash('partner123', 12)
    const partnerUser = await User.create({
      firstName: 'John',
      lastName: 'Partner',
      email: 'partner@testfirm.com',
      password: partnerPassword,
      phone: '+91-98765-43211',
      firmId: firm._id,
      roleId: partnerRole._id,
      role: 'partner',
      mfaEnabled: false,
      isActive: true,
      isEmailVerified: true,
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          sms: true,
          whatsapp: false
        },
        language: 'en',
        timezone: 'Asia/Kolkata'
      }
    })

    const seniorPassword = await bcrypt.hash('senior123', 12)
    const seniorUser = await User.create({
      firstName: 'Sarah',
      lastName: 'Senior',
      email: 'senior@testfirm.com',
      password: seniorPassword,
      phone: '+91-98765-43212',
      firmId: firm._id,
      roleId: seniorRole._id,
      role: 'senior',
      mfaEnabled: false,
      isActive: true,
      isEmailVerified: true,
      preferences: {
        theme: 'dark',
        notifications: {
          email: true,
          sms: false,
          whatsapp: false
        },
        language: 'en',
        timezone: 'Asia/Kolkata'
      }
    })

    const staffPassword = await bcrypt.hash('staff123', 12)
    const staffUser = await User.create({
      firstName: 'Mike',
      lastName: 'Staff',
      email: 'staff@testfirm.com',
      password: staffPassword,
      phone: '+91-98765-43213',
      firmId: firm._id,
      roleId: staffRole._id,
      role: 'staff',
      mfaEnabled: false,
      isActive: true,
      isEmailVerified: true,
      preferences: {
        theme: 'auto',
        notifications: {
          email: true,
          sms: false,
          whatsapp: false
        },
        language: 'en',
        timezone: 'Asia/Kolkata'
      }
    })

    console.log('👤 Created users:', [
      adminUser.email,
      partnerUser.email,
      seniorUser.email,
      staffUser.email
    ])

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📋 Test Credentials:')
    console.log('👑 Admin: admin@testfirm.com / admin123')
    console.log('🤝 Partner: partner@testfirm.com / partner123')
    console.log('👩‍💼 Senior: senior@testfirm.com / senior123')
    console.log('👨‍💻 Staff: staff@testfirm.com / staff123')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()

