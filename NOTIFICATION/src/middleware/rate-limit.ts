import { Request } from 'express';
import rateLimit from 'express-rate-limit';

// General API rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    statusCode: 429
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

// Strict rate limiting for sensitive endpoints
export const strictRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 requests per 5 minutes
  message: {
    error: 'Rate limit exceeded for this endpoint. Please wait before trying again.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict rate limiting for notification sending
export const notificationRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Only 5 notification sends per 10 minutes
  message: {
    error: 'Notification sending rate limit exceeded. Please wait before sending again.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator to rate limit per auth token instead of IP
  keyGenerator: (req: Request): string => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      return `token:${token}`;
    }
    return req.ip ?? 'unknown-ip';
  },
});

// Rate limiting for token registration
export const tokenRegisterRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 token registrations per 15 minutes
  message: {
    error: 'Too many token registration attempts. Please try again later.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
});