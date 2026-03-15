/**
 * AthleteView API Gateway
 * Entry point for the Express + Socket.io server
 */
require('dotenv').config({ path: '../.env' });
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const streamRoutes = require('./routes/streams');
const athleteRoutes = require('./routes/athletes');
const highlightRoutes = require('./routes/highlights');
const apiKeyRoutes = require('./routes/apikeys');
const { authMiddleware } = require('./middleware/auth');
const { rateLimiter } = require('./middleware/rateLimit');
const { setupWebSocket } = require('./websocket/handler');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  path: '/ws',
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway', timestamp: new Date().toISOString() });
});

// API v1 routes
app.use('/api/v1/streams', authMiddleware, streamRoutes);
app.use('/api/v1/athletes', authMiddleware, athleteRoutes);
app.use('/api/v1/highlights', authMiddleware, highlightRoutes);
app.use('/api/v1/keys', apiKeyRoutes);

// WebSocket for real-time biometric feeds
setupWebSocket(io);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: { message: err.message, code: err.code || 'INTERNAL_ERROR' },
  });
});

const PORT = process.env.GATEWAY_PORT || 3000;
server.listen(PORT, () => {
  console.log(`AthleteView Gateway running on port ${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
});

module.exports = { app, server, io };
