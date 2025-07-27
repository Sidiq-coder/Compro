import { verifyToken, isTokenBlacklisted } from '../utils/auth.js';
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
    
    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Token sudah tidak valid (logout)'
      });
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        lastLoginAt: true,
        refreshToken: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User tidak ditemukan'
      });
    }

    // Check if user is still logged in (has valid refresh token)
    if (!user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User sudah logout'
      });
    }

    // Store token in request for potential logout
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Token tidak valid atau kadaluarsa'
    });
  }
};

