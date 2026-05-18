import { createMockJwt } from "../utils/authToken";
import { AUTH_ROLES } from "../utils/roles";

const MOCK_USERS_STORAGE_KEY = "crm-mock-users";

const demoUsers = [
  {
    id: "demo-admin",
    name: "Admin User",
    email: "admin@crm.test",
    password: "password123",
    role: AUTH_ROLES.ADMIN,
  },
  {
    id: "demo-manager",
    name: "Manager User",
    email: "manager@crm.test",
    password: "password123",
    role: AUTH_ROLES.MANAGER,
  },
  {
    id: "demo-employee",
    name: "Employee User",
    email: "employee@crm.test",
    password: "password123",
    role: AUTH_ROLES.EMPLOYEE,
  },
];

const wait = (ms = 600) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const readRegisteredUsers = () => {
  try {
    return JSON.parse(window.localStorage.getItem(MOCK_USERS_STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

const writeRegisteredUsers = (users) => {
  window.localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
};

const sanitizeUser = (user) => {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
};

const createSession = (user) => {
  const safeUser = sanitizeUser(user);

  return {
    user: safeUser,
    token: createMockJwt(safeUser),
  };
};

export const authService = {
  login: async ({ email, password, role }) => {
    await wait();

    const normalizedEmail = email.trim().toLowerCase();
    const users = [...demoUsers, ...readRegisteredUsers()];
    const user = users.find((candidate) => candidate.email === normalizedEmail);

    if (!user || user.password !== password) {
      throw new Error("Invalid email or password.");
    }

    return createSession({
      ...user,
      role: role || user.role,
    });
  },

  register: async ({ name, email, password, role }) => {
    await wait();

    const normalizedEmail = email.trim().toLowerCase();
    const registeredUsers = readRegisteredUsers();
    const users = [...demoUsers, ...registeredUsers];
    const existingUser = users.find(
      (candidate) => candidate.email === normalizedEmail,
    );

    if (existingUser) {
      throw new Error("An account already exists for this email.");
    }

    const user = {
      id: `mock-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    };

    writeRegisteredUsers([...registeredUsers, user]);

    return createSession(user);
  },
};
