
import { createContext, useContext, useState, ReactNode } from "react";

// Tipos de datos
export type Permission = {
  id: string;
  name: string;
  description: string;
  category: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // IDs de permisos
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roleId: string;
  branchId?: string;
  shift?: string;
  notes?: string;
  status: "active" | "suspended" | "inactive";
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Branch = {
  id: string;
  name: string;
};

// Datos iniciales
const initialPermissions: Permission[] = [
  { id: "perm_inventory_view", name: "Ver inventario", description: "Permite ver el inventario", category: "Inventario" },
  { id: "perm_inventory_edit", name: "Editar inventario", description: "Permite editar el inventario", category: "Inventario" },
  { id: "perm_orders_view", name: "Ver órdenes", description: "Permite ver las órdenes", category: "Órdenes" },
  { id: "perm_orders_edit", name: "Editar órdenes", description: "Permite crear y editar órdenes", category: "Órdenes" },
  { id: "perm_tables_view", name: "Ver mesas", description: "Permite ver las mesas", category: "Mesas" },
  { id: "perm_tables_edit", name: "Editar mesas", description: "Permite editar la distribución de mesas", category: "Mesas" },
  { id: "perm_staff_view", name: "Ver personal", description: "Permite ver la lista de personal", category: "Personal" },
  { id: "perm_staff_edit", name: "Editar personal", description: "Permite editar información del personal", category: "Personal" },
  { id: "perm_roles_edit", name: "Gestionar roles", description: "Permite crear y editar roles de usuario", category: "Seguridad" },
  { id: "perm_reports_view", name: "Ver reportes", description: "Permite ver reportes", category: "Reportes" },
  { id: "perm_settings_edit", name: "Editar configuración", description: "Permite editar configuración del sistema", category: "Sistema" },
];

const initialRoles: Role[] = [
  {
    id: "role_admin",
    name: "Administrador",
    description: "Acceso completo al sistema",
    permissions: initialPermissions.map(p => p.id),
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "role_manager",
    name: "Gerente",
    description: "Gestión de personal y operaciones",
    permissions: ["perm_inventory_view", "perm_inventory_edit", "perm_orders_view", "perm_orders_edit", 
                  "perm_tables_view", "perm_tables_edit", "perm_staff_view", "perm_staff_edit", 
                  "perm_reports_view"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "role_cashier",
    name: "Cajero",
    description: "Atención de caja y pagos",
    permissions: ["perm_orders_view", "perm_orders_edit", "perm_tables_view"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "role_waiter",
    name: "Mesero",
    description: "Atención de mesas y pedidos",
    permissions: ["perm_orders_view", "perm_orders_edit", "perm_tables_view"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "role_chef",
    name: "Chef",
    description: "Preparación de alimentos",
    permissions: ["perm_orders_view", "perm_inventory_view"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const initialBranches: Branch[] = [
  { id: "branch_main", name: "Sucursal Principal" },
  { id: "branch_north", name: "Sucursal Norte" },
  { id: "branch_south", name: "Sucursal Sur" }
];

const initialStaff: StaffMember[] = [
  {
    id: "staff_001",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "+1234567890",
    roleId: "role_admin",
    branchId: "branch_main",
    shift: "Matutino",
    status: "active",
    lastLogin: new Date(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: "staff_002",
    name: "María García",
    email: "maria.garcia@example.com",
    roleId: "role_manager",
    branchId: "branch_north",
    shift: "Vespertino",
    status: "active",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: "staff_003",
    name: "Carlos López",
    email: "carlos.lopez@example.com",
    phone: "+1987654321",
    roleId: "role_waiter",
    branchId: "branch_main",
    shift: "Mixto",
    status: "active",
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: "staff_004",
    name: "Laura Martínez",
    email: "laura.martinez@example.com",
    roleId: "role_cashier",
    branchId: "branch_south",
    shift: "Matutino",
    status: "active",
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: "staff_005",
    name: "Roberto Fernández",
    email: "roberto.fernandez@example.com",
    roleId: "role_chef",
    branchId: "branch_main",
    status: "suspended",
    notes: "Suspendido temporalmente por vacaciones",
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
];

// Tipo del contexto
type StaffContextType = {
  staff: StaffMember[];
  roles: Role[];
  permissions: Permission[];
  branches: Branch[];
  addStaffMember: (member: Omit<StaffMember, "id" | "createdAt" | "updatedAt">) => void;
  updateStaffMember: (id: string, data: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;
  addRole: (role: Omit<Role, "id" | "createdAt" | "updatedAt">) => void;
  updateRole: (id: string, data: Partial<Role>) => void;
  deleteRole: (id: string) => boolean;
  getRoleById: (id: string) => Role | undefined;
  getPermissionsByRole: (roleId: string) => Permission[];
  getBranchById: (id: string) => Branch | undefined;
};

// Creación del contexto
const StaffContext = createContext<StaffContextType | undefined>(undefined);

// Hook para usar el contexto
export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
};

// Proveedor del contexto
export const StaffProvider = ({ children }: { children: ReactNode }) => {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [permissions] = useState<Permission[]>(initialPermissions);
  const [branches] = useState<Branch[]>(initialBranches);

  // Funciones para manejar el personal
  const addStaffMember = (member: Omit<StaffMember, "id" | "createdAt" | "updatedAt">) => {
    const newMember: StaffMember = {
      ...member,
      id: `staff_${Date.now().toString(36)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setStaff([...staff, newMember]);
  };

  const updateStaffMember = (id: string, data: Partial<StaffMember>) => {
    setStaff(staff.map(member => 
      member.id === id 
        ? { ...member, ...data, updatedAt: new Date() }
        : member
    ));
  };

  const deleteStaffMember = (id: string) => {
    setStaff(staff.filter(member => member.id !== id));
  };

  // Funciones para manejar roles
  const addRole = (role: Omit<Role, "id" | "createdAt" | "updatedAt">) => {
    const newRole: Role = {
      ...role,
      id: `role_${Date.now().toString(36)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setRoles([...roles, newRole]);
  };

  const updateRole = (id: string, data: Partial<Role>) => {
    setRoles(roles.map(role => 
      role.id === id 
        ? { ...role, ...data, updatedAt: new Date() }
        : role
    ));
  };

  const deleteRole = (id: string): boolean => {
    // Verificar si hay usuarios con este rol
    const hasUsers = staff.some(member => member.roleId === id);
    if (hasUsers) {
      return false; // No se puede eliminar porque hay usuarios con este rol
    }
    
    // Verificar si es el único rol de administrador
    const isAdmin = roles.find(r => r.id === id)?.permissions.includes("perm_roles_edit");
    if (isAdmin) {
      const otherAdminRoles = roles.filter(r => 
        r.id !== id && r.permissions.includes("perm_roles_edit")
      );
      if (otherAdminRoles.length === 0) {
        return false; // No se puede eliminar porque es el único rol con permisos de administración
      }
    }
    
    setRoles(roles.filter(role => role.id !== id));
    return true;
  };

  // Funciones auxiliares
  const getRoleById = (id: string) => {
    return roles.find(role => role.id === id);
  };

  const getPermissionsByRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return [];
    return permissions.filter(p => role.permissions.includes(p.id));
  };

  const getBranchById = (id: string) => {
    return branches.find(branch => branch.id === id);
  };

  const value = {
    staff,
    roles,
    permissions,
    branches,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    addRole,
    updateRole,
    deleteRole,
    getRoleById,
    getPermissionsByRole,
    getBranchById
  };

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  );
};
