export const AUTH_STORAGE_KEY = "crm-auth-session";

export const createMockJwt = (user) => {
  const header = window.btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = window.btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      iss: "crm-suite-mock-auth",
    }),
  );

  return `${header}.${payload}.mock-signature`;
};
