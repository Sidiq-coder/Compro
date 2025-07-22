import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/userValidate.js';
import { login, logout, me, refreshToken } from '../controllers/auth.js';
import { loginSchema } from '../schema/auth.js'; // Import yang benar
import { loginLimiter } from '../middlewares/rateLimitter.js';


const router = express.Router();

router.post('/login', validate(loginSchema), loginLimiter, login); // Sekarang menggunakan schema yang tepat
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.post('/refresh-token', refreshToken);

export default router;