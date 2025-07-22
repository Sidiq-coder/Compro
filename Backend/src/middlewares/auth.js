import { verifyToken } from '../utils/auth.js';
import { prisma } from '../prisma/client.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Token tidak valid'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User tidak ditemukan'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Token tidak valid atau kadaluarsa'
    });
  }
};