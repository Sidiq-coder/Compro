// src/middlewares/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // maksimal 100 request per IP per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'Terlalu banyak permintaan. Coba lagi nanti.'
  }
});

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 menit
  max: 5,
  message: {
    status: 429,
    message: 'Terlalu banyak upaya login. Silakan coba lagi dalam 10 menit.'
  }
});
