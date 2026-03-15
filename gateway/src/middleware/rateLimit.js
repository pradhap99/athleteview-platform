/**
 * Rate Limiting Middleware
 * Redis-backed sliding window rate limiter
 */
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute (default)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
  keyGenerator: (req) => {
    return req.headers['x-api-key'] || req.ip;
  },
});

module.exports = { rateLimiter };
