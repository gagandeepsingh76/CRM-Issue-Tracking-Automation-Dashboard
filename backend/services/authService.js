import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signToken } from '../utils/token.js';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  phone: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
};

const issueSession = (user) => ({
  user,
  token: signToken({
    sub: user.id,
    role: user.role,
    email: user.email,
  }),
});

export const authService = {
  async register(payload) {
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ApiError(409, 'A user with this email already exists.');
    }

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        password: await hashPassword(payload.password),
        role: 'EMPLOYEE',
      },
      select: publicUserSelect,
    });

    return issueSession(user);
  },

  async login(payload) {
    const user = await prisma.user.findFirst({
      where: {
        email: payload.email,
        deletedAt: null,
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const passwordMatches = await verifyPassword(payload.password, user.password);

    if (!passwordMatches) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const { password, deletedAt, ...publicUser } = user;
    void password;
    void deletedAt;

    return issueSession(publicUser);
  },

  async getMe(userId) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: publicUserSelect,
    });

    if (!user) {
      throw new ApiError(404, 'User profile was not found.');
    }

    return user;
  },
};
