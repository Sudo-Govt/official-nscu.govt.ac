// Role-Based Access Control Configuration
// Permissions are role-based and immutable by default
// Admins assign roles, not individual permissions
// Only Super Admin can override role definitions

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'operations' | 'admissions' | 'external' | 'readonly';
  permissions: {
    users?: ('create' | 'read' | 'update' | 'delete')[];
    roles?: ('create' | 'read' | 'update' | 'delete')[];
    admissions?: ('create' | 'read' | 'update' | 'delete' | 'override')[];
    finance?: ('read' | 'update' | 'payout' | 'override')[];
    compliance?: ('read' | 'update' | 'lock')[];
    content?: ('create' | 'read' | 'update' | 'delete')[];
    system?: ('logs' | 'api' | 'security' | 'config')[];
    agents?: ('create' | 'read' | 'update' | 'suspend')[];
    students?: ('create' | 'read' | 'update' | 'delete')[];
  };
}

export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  superadmin: {
    id: 'superadmin',
    name: 'Super Admin',
    description: 'Absolute system control - Full read/write/delete access across system',
    category: 'system',
    permissions: {
      users: ['create', 'read', 'update', 'delete'],
      roles: ['create', 'read', 'update', 'delete'],
      admissions: ['create', 'read', 'update', 'delete', 'override'],
      finance: ['read', 'update', 'payout', 'override'],
      compliance: ['read', 'update', 'lock'],
      content: ['create', 'read', 'update', 'delete'],
      system: ['logs', 'api', 'security', 'config'],
      agents: ['create', 'read', 'update', 'suspend'],
      students: ['create', 'read', 'update', 'delete'],
    },
  },
  platform_admin: {
    id: 'platform_admin',
    name: 'Platform Admin',
    description: 'Day-to-day system control - Manage users, admissions, and agents',
    category: 'system',
    permissions: {
      users: ['create', 'read', 'update'],
      roles: ['create', 'read', 'update'],
      admissions: ['create', 'read', 'update', 'delete'],
      finance: ['read'],
      compliance: ['read', 'update'],
      content: ['create', 'read', 'update', 'delete'],
      agents: ['create', 'read', 'update', 'suspend'],
      students: ['create', 'read', 'update'],
    },
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    description: 'General administrative access',
    category: 'system',
    permissions: {
      users: ['create', 'read', 'update'],
      roles: ['read'],
      admissions: ['create', 'read', 'update'],
      finance: ['read'],
      content: ['create', 'read', 'update'],
      agents: ['create', 'read', 'update'],
      students: ['create', 'read', 'update'],
    },
  },
  hr_admin: {
    id: 'hr_admin',
    name: 'HR Admin',
    description: 'Human resources & internal staff management',
    category: 'operations',
    permissions: {
      users: ['create', 'read', 'update'],
      roles: ['read'],
      content: ['read'],
    },
  },
  finance: {
    id: 'finance',
    name: 'Finance Admin',
    description: 'Money, payouts, accounting - View revenue and execute payouts',
    category: 'operations',
    permissions: {
      finance: ['read', 'update', 'payout'],
      admissions: ['read'],
      agents: ['read'],
      students: ['read'],
    },
  },
  compliance_admin: {
    id: 'compliance_admin',
    name: 'Compliance & Legal Admin',
    description: 'Risk, KYC, governance - Review and enforce compliance',
    category: 'operations',
    permissions: {
      compliance: ['read', 'update', 'lock'],
      agents: ['read', 'update'],
      system: ['logs'],
    },
  },
  admission_admin: {
    id: 'admission_admin',
    name: 'Admission Admin',
    description: 'Admission governance - Approve/reject admissions with override authority',
    category: 'admissions',
    permissions: {
      admissions: ['create', 'read', 'update', 'override'],
      agents: ['read', 'update'],
      students: ['create', 'read', 'update'],
    },
  },
  admission_staff: {
    id: 'admission_staff',
    name: 'Admission Staff',
    description: 'Operational admissions - Process applications without override authority',
    category: 'admissions',
    permissions: {
      admissions: ['create', 'read', 'update'],
      students: ['read', 'update'],
      content: ['read'],
    },
  },
  admission_agent: {
    id: 'admission_agent',
    name: 'Admission Agent',
    description: 'Student recruitment - Create leads, submit applications, track commissions',
    category: 'external',
    permissions: {
      admissions: ['create', 'read'],
      students: ['create', 'read'],
      content: ['read'],
      finance: ['read'],
    },
  },
  master_agent: {
    id: 'master_agent',
    name: 'Master Agent',
    description: 'Agent network leader - All Agent permissions plus sub-agent management',
    category: 'external',
    permissions: {
      admissions: ['create', 'read'],
      students: ['create', 'read'],
      agents: ['create', 'read'],
      content: ['read'],
      finance: ['read'],
    },
  },
  student: {
    id: 'student',
    name: 'Student',
    description: 'Applicant / enrolled learner - View status, upload documents, pay fees',
    category: 'external',
    permissions: {
      admissions: ['read'],
      students: ['read'],
      content: ['read'],
      finance: ['read'],
    },
  },
  alumni: {
    id: 'alumni',
    name: 'Alumni',
    description: 'Graduate access - Verify credentials, download transcripts',
    category: 'external',
    permissions: {
      students: ['read'],
      content: ['read'],
    },
  },
  faculty: {
    id: 'faculty',
    name: 'Faculty',
    description: 'Teaching staff - Academic access and student interaction',
    category: 'operations',
    permissions: {
      students: ['read'],
      content: ['read', 'create'],
      admissions: ['read'],
    },
  },
  support: {
    id: 'support',
    name: 'Support / Help Desk',
    description: 'User assistance - View tickets, respond to users, escalate issues',
    category: 'operations',
    permissions: {
      users: ['read'],
      students: ['read'],
      admissions: ['read'],
      content: ['read'],
    },
  },
  marketing_admin: {
    id: 'marketing_admin',
    name: 'Content / Marketing Admin',
    description: 'Outreach & branding - Manage announcements, campaigns, marketing materials',
    category: 'operations',
    permissions: {
      content: ['create', 'read', 'update', 'delete'],
      agents: ['read'],
    },
  },
  auditor: {
    id: 'auditor',
    name: 'Auditor',
    description: 'Read-only access - View logs, reports, and documents for audit purposes',
    category: 'readonly',
    permissions: {
      users: ['read'],
      admissions: ['read'],
      finance: ['read'],
      compliance: ['read'],
      system: ['logs'],
      agents: ['read'],
      students: ['read'],
    },
  },
  staff: {
    id: 'staff',
    name: 'Staff',
    description: 'General staff member with basic access',
    category: 'operations',
    permissions: {
      content: ['read'],
      students: ['read'],
    },
  },
  accounts: {
    id: 'accounts',
    name: 'Accounts',
    description: 'Accounts department - Financial record keeping',
    category: 'operations',
    permissions: {
      finance: ['read', 'update'],
      students: ['read'],
    },
  },
  registrar: {
    id: 'registrar',
    name: 'Registrar',
    description: 'Academic records management',
    category: 'operations',
    permissions: {
      students: ['read', 'update'],
      admissions: ['read', 'update'],
    },
  },
  delegator: {
    id: 'delegator',
    name: 'Delegator',
    description: 'Can delegate tasks to other users',
    category: 'operations',
    permissions: {
      users: ['read'],
      content: ['read'],
    },
  },
};

// Get roles by category for UI grouping
export const getRolesByCategory = () => {
  const categories: Record<string, RoleDefinition[]> = {
    system: [],
    operations: [],
    admissions: [],
    external: [],
    readonly: [],
  };

  Object.values(ROLE_DEFINITIONS).forEach((role) => {
    categories[role.category].push(role);
  });

  return categories;
};

// Get role display name
export const getRoleDisplayName = (roleId: string): string => {
  return ROLE_DEFINITIONS[roleId]?.name || roleId;
};

// Get role description
export const getRoleDescription = (roleId: string): string => {
  return ROLE_DEFINITIONS[roleId]?.description || '';
};

// Check if a role has a specific permission
export const roleHasPermission = (
  roleId: string,
  category: keyof RoleDefinition['permissions'],
  action: string
): boolean => {
  const role = ROLE_DEFINITIONS[roleId];
  if (!role) return false;
  const categoryPermissions = role.permissions[category];
  if (!categoryPermissions) return false;
  return categoryPermissions.includes(action as never);
};

// Get all available roles for selection (excludes superadmin for non-superadmins)
export const getSelectableRoles = (currentUserRole: string): RoleDefinition[] => {
  const allRoles = Object.values(ROLE_DEFINITIONS);
  
  // Superadmins can assign any role
  if (currentUserRole === 'superadmin') {
    return allRoles;
  }
  
  // Platform admins can assign most roles except superadmin
  if (currentUserRole === 'platform_admin' || currentUserRole === 'admin') {
    return allRoles.filter(r => r.id !== 'superadmin');
  }
  
  // HR admins can only assign staff roles
  if (currentUserRole === 'hr_admin') {
    return allRoles.filter(r => ['staff', 'support', 'admission_staff'].includes(r.id));
  }
  
  // Admission admins can assign admission-related roles
  if (currentUserRole === 'admission_admin') {
    return allRoles.filter(r => ['admission_staff', 'admission_agent'].includes(r.id));
  }
  
  // Master agents can create sub-agents
  if (currentUserRole === 'master_agent') {
    return allRoles.filter(r => r.id === 'admission_agent');
  }
  
  return [];
};

// Category labels for UI
export const CATEGORY_LABELS: Record<string, string> = {
  system: 'System Administration',
  operations: 'Operations & Staff',
  admissions: 'Admissions',
  external: 'External Users',
  readonly: 'Read-Only Access',
};
