// FILE: /lib/mockData.ts
// Mock data for hardcoded deployment without database

export interface MockUser {
  _id: string;
  email: string;
  password: string; // hashed password
  firstName: string;
  lastName: string;
  firmId: string;
  roleId: string;
  permissions: string[];
  mfaEnabled: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: Date;
  refreshToken?: string;
}

export interface MockRole {
  _id: string;
  name: string;
  permissions: string[];
}

export interface MockFirm {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

// Mock roles
export const mockRoles: MockRole[] = [
  {
    _id: 'role_admin',
    name: 'Administrator',
    permissions: [
      // Dashboard and core permissions
      'dashboard:read',
      'analytics:read', 'analytics:export',
      'ledger:read', 'ledger:write', 'tally:import',
      
      // User management
      'users:read', 'users:write', 'users:delete',
      
      // Client management
      'clients:read', 'clients:write', 'clients:delete', 'clients:create',
      
      // Project management
      'projects:read', 'projects:write', 'projects:delete',
      
      // Document management
      'documents:read', 'documents:write', 'documents:delete', 'documents:upload', 'documents:share',
      
      // Compliance
      'compliance:read', 'compliance:write', 'compliance:delete',
      
      // Reports
      'reports:read', 'reports:write',
      
      // Settings and firm management
      'settings:read', 'settings:write', 'firm:read', 'firm:update',
      
      // Security and audit
      'audit:read', 'integrations:read'
    ]
  },
  {
    _id: 'role_manager',
    name: 'Manager',
    permissions: [
      // Dashboard and core permissions
      'dashboard:read',
      'analytics:read',
      'ledger:read',
      
      // User management (limited)
      'users:read',
      
      // Client management
      'clients:read', 'clients:write', 'clients:create',
      
      // Project management
      'projects:read', 'projects:write',
      
      // Document management
      'documents:read', 'documents:write', 'documents:upload', 'documents:share',
      
      // Compliance
      'compliance:read', 'compliance:write',
      
      // Reports
      'reports:read', 'reports:write'
    ]
  },
  {
    _id: 'role_accountant',
    name: 'Accountant',
    permissions: [
      // Dashboard and core permissions
      'dashboard:read',
      'analytics:read',
      'ledger:read', 'ledger:write',
      
      // Client management (read-only)
      'clients:read',
      
      // Project management (limited)
      'projects:read', 'projects:write',
      
      // Document management
      'documents:read', 'documents:write',
      
      // Compliance
      'compliance:read',
      
      // Reports
      'reports:read'
    ]
  }
];

// Mock firms
export const mockFirms: MockFirm[] = [
  {
    _id: 'firm_1',
    name: 'Demo CA Firm',
    address: '123 Business Street, Mumbai, Maharashtra 400001',
    phone: '+91 98765 43210',
    email: 'info@democafirm.com'
  }
];

// Mock users (password for all is 'password123')
export const mockUsers: MockUser[] = [
  {
    _id: 'user_admin',
    email: 'admin@ledgerfy.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    firstName: 'Admin',
    lastName: 'User',
    firmId: 'firm_1',
    roleId: 'role_admin',
    permissions: mockRoles[0].permissions,
    mfaEnabled: false,
    isActive: true,
    isEmailVerified: true,
    lastLogin: new Date()
  },
  {
    _id: 'user_manager',
    email: 'manager@ledgerfy.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    firstName: 'Manager',
    lastName: 'User',
    firmId: 'firm_1',
    roleId: 'role_manager',
    permissions: mockRoles[1].permissions,
    mfaEnabled: false,
    isActive: true,
    isEmailVerified: true,
    lastLogin: new Date()
  },
  {
    _id: 'user_accountant',
    email: 'accountant@ledgerfy.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    firstName: 'Accountant',
    lastName: 'User',
    firmId: 'firm_1',
    roleId: 'role_accountant',
    permissions: mockRoles[2].permissions,
    mfaEnabled: false,
    isActive: true,
    isEmailVerified: true,
    lastLogin: new Date()
  }
];

// Mock clients
export const mockClients = [
  {
    _id: 'client_1',
    name: 'ABC Industries Ltd.',
    email: 'contact@abcindustries.com',
    phone: '+91 98765 43211',
    address: '456 Industrial Area, Delhi, 110001',
    gstNumber: '07AABCU9603R1ZX',
    panNumber: 'AABCU9603R',
    status: 'active',
    firmId: 'firm_1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'client_2',
    name: 'XYZ Trading Co.',
    email: 'info@xyztrading.com',
    phone: '+91 98765 43212',
    address: '789 Commercial Street, Bangalore, 560001',
    gstNumber: '29XYZTR1234R1ZX',
    panNumber: 'XYZTR1234R',
    status: 'active',
    firmId: 'firm_1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock projects
export const mockProjects = [
  {
    _id: 'project_1',
    name: 'Annual Audit - ABC Industries',
    description: 'Annual statutory audit for ABC Industries Ltd.',
    clientId: 'client_1',
    status: 'in_progress',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    assignedTo: ['user_accountant'],
    firmId: 'firm_1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'project_2',
    name: 'Tax Filing - XYZ Trading',
    description: 'Income tax return filing for XYZ Trading Co.',
    clientId: 'client_2',
    status: 'pending',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-07-31'),
    assignedTo: ['user_manager'],
    firmId: 'firm_1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper functions
export function findUserByEmail(email: string): MockUser | null {
  return mockUsers.find(user => user.email === email) || null;
}

export function findUserById(id: string): MockUser | null {
  return mockUsers.find(user => user._id === id) || null;
}

export function findRoleById(id: string): MockRole | null {
  return mockRoles.find(role => role._id === id) || null;
}

export function findFirmById(id: string): MockFirm | null {
  return mockFirms.find(firm => firm._id === id) || null;
}

export function getClientsByFirm(firmId: string) {
  return mockClients.filter(client => client.firmId === firmId);
}

export function getProjectsByFirm(firmId: string) {
  return mockProjects.filter(project => project.firmId === firmId);
}

export function getProjectsByUser(userId: string) {
  return mockProjects.filter(project => project.assignedTo.includes(userId));
}
