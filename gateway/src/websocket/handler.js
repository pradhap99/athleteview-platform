/**
 * WebSocket Handler
 * Real-time biometric and stream data feeds
 */

function setupWebSocket(io) {
  const biometricsNamespace = io.of('/biometrics');
  const streamsNamespace = io.of('/streams');

  biometricsNamespace.on('connection', (socket) => {
    console.log(`Biometrics client connected: ${socket.id}`);

    socket.on('subscribe', ({ athleteId, matchId }) => {
      if (athleteId) socket.join(`athlete:${athleteId}`);
      if (matchId) socket.join(`match:${matchId}`);
      console.log(`Client ${socket.id} subscribed to athlete:${athleteId} match:${matchId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Biometrics client disconnected: ${socket.id}`);
    });
  });

  streamsNamespace.on('connection', (socket) => {
    console.log(`Streams client connected: ${socket.id}`);

    socket.on('subscribe', ({ streamId, matchId }) => {
      if (streamId) socket.join(`stream:${streamId}`);
      if (matchId) socket.join(`match:${matchId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Streams client disconnected: ${socket.id}`);
    });
  });

  // Helper to broadcast biometric updates
  function emitBiometricUpdate(athleteId, matchId, data) {
    biometricsNamespace.to(`athlete:${athleteId}`).emit('biometric:update', data);
    if (matchId) biometricsNamespace.to(`match:${matchId}`).emit('biometric:update', data);
  }

  // Helper to broadcast stream events
  function emitStreamEvent(streamId, matchId, event, data) {
    streamsNamespace.to(`stream:${streamId}`).emit(event, data);
    if (matchId) streamsNamespace.to(`match:${matchId}`).emit(event, data);
  }

  return { emitBiometricUpdate, emitStreamEvent };
}

module.exports = { setupWebSocket };
