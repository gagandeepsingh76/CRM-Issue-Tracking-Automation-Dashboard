import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { verifyToken } from '../utils/token.js';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication token is required.');
    }

    const token = header.split(' ')[1];
    const payload = verifyToken(token);

    const user = await prisma.user.findFirst({
      where: {
        id: payload.sub,
        deletedAt: null,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(401, 'Authenticated user no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Invalid or expired authentication token.'));
      return;
    }

    next(error);
  }
};
