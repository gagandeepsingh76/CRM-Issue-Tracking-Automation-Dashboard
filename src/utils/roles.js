export const AUTH_ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
};

export const ALL_ROLES = [
  AUTH_ROLES.ADMIN,
  AUTH_ROLES.MANAGER,
  AUTH_ROLES.EMPLOYEE,
];

export const canAccessRoute = (userRole, allowedRoles = ALL_ROLES) => {
  return Boolean(userRole && allowedRoles.includes(userRole));
};
