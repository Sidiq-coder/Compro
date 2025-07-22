import { prisma } from '../prisma/client.js';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Zod validation
      const parsed = schema.parse(req.body);
      
      // Additional email uniqueness check
      if (schema._def.typeName === 'ZodObject' && parsed.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: parsed.email },
        });
        
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Email sudah terdaftar',
            error: {
              field: 'email',
              message: 'Email sudah digunakan oleh user lain'
            }
          });
        }
      }

      req.validatedBody = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        // Zod validation error
        return res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      // Other errors
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan validasi',
        error: error.message
      });
    }
  };
};