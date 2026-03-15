/**
 * Authentication Middleware
 * Supports JWT tokens and API keys
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

function authMiddleware(req, res, next) {
  // Check for API key
  const apiKey = req.headers['x-api-key'];
  if (apiKey) {
    // TODO: Validate API key against database
    if (apiKey.startsWith('av_')) {
      req.auth = { type: 'apikey', key: apiKey };
      return next();
    }
  }

  // Check for JWT Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.auth = { type: 'jwt', user: decoded };
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  // Development mode bypass
  if (process.env.NODE_ENV === 'development') {
    req.auth = { type: 'dev', user: { id: 'dev-user' } };
    return next();
  }

  res.status(401).json({ error: 'Authentication required' });
}

module.exports = { authMiddleware };
