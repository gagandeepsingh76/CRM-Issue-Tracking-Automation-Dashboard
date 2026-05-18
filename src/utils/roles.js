export const AUTH_ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
};

export const ALL_ROLES = [
  AUTH_ROLES.ADMIN,
  AUTH_ROLES.MANAGER,
  AUTH_ROLES.EMPLOYEE,
];

export const ROLE_LABELS = {
  [AUTH_ROLES.ADMIN]: "Admin",
  [AUTH_ROLES.MANAGER]: "Manager",
  [AUTH_ROLES.EMPLOYEE]: "Employee",
};

export const formatRole = (role) => ROLE_LABELS[role] ?? role ?? "Unknown";

export const canAccessRoute = (userRole, allowedRoles = ALL_ROLES) => {
  return Boolean(userRole && allowedRoles.includes(userRole));
};
