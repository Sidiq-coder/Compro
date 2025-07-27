import { generateTokens, comparePassword, invalidateTokens, verifyToken } from '../utils/auth.js';
import { prisma } from '../prisma/client.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        refreshToken,
        lastLoginAt: new Date() 
      }
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      message: 'Login berhasil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login'
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Pass the current access token to be blacklisted
    await invalidateTokens(req.user.id, req.token);
    
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat logout'
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: {
          select: {
            id: true,
            name: true
          }
        },
        division: {
          select: {
            id: true,
            name: true
          }
        },
        lastLoginAt: true
      }
    });

    res.json({
      success: true,
      data: user,
      message: 'Data user berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data user'
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // Check from cookies first, then from request body (with safe access)
    let refreshToken = req.cookies?.refreshToken || (req.body && req.body.refreshToken);
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token tidak tersedia'
      });
    }

    let decoded;
    try {
      decoded = verifyToken(refreshToken);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Refresh token tidak valid atau kadaluarsa'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id, refreshToken }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token tidak valid atau user sudah logout'
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      data: { 
        accessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      message: 'Token berhasil diperbarui'
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui token'
    });
  }
};