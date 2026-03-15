/**
 * Stream Management Routes
 * CRUD for live streams + stream control
 */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory store (replace with DB in production)
const streams = new Map();

/**
 * POST /api/v1/streams
 * Create a new stream session
 */
router.post('/', (req, res) => {
  const { athleteId, matchId, sport, placement, resolution = '1080p' } = req.body;

  if (!athleteId || !matchId) {
    return res.status(400).json({ error: 'athleteId and matchId are required' });
  }

  const stream = {
    id: uuidv4(),
    athleteId,
    matchId,
    sport: sport || 'cricket',
    placement: placement || 'chest',
    resolution,
    status: 'pending',
    srtUrl: null,
    hlsUrl: null,
    createdAt: new Date().toISOString(),
    biometrics: { hr: null, spo2: null, temp: null },
  };

  // Generate SRT ingest URL
  stream.srtUrl = `srt://ingest.athleteview.in:9000?streamid=${stream.id}`;
  streams.set(stream.id, stream);

  res.status(201).json({ data: stream });
});

/**
 * GET /api/v1/streams
 * List all active streams
 */
router.get('/', (req, res) => {
  const { matchId, status } = req.query;
  let result = Array.from(streams.values());

  if (matchId) result = result.filter(s => s.matchId === matchId);
  if (status) result = result.filter(s => s.status === status);

  res.json({ data: result, total: result.length });
});

/**
 * GET /api/v1/streams/:id
 * Get stream details
 */
router.get('/:id', (req, res) => {
  const stream = streams.get(req.params.id);
  if (!stream) return res.status(404).json({ error: 'Stream not found' });
  res.json({ data: stream });
});

/**
 * PATCH /api/v1/streams/:id/start
 * Start processing a stream
 */
router.patch('/:id/start', (req, res) => {
  const stream = streams.get(req.params.id);
  if (!stream) return res.status(404).json({ error: 'Stream not found' });

  stream.status = 'live';
  stream.hlsUrl = `https://cdn.athleteview.in/live/${stream.id}/playlist.m3u8`;
  stream.startedAt = new Date().toISOString();

  // TODO: Trigger Kafka message to start AI pipeline
  // TODO: Trigger FFmpeg transcode pipeline

  res.json({ data: stream });
});

/**
 * PATCH /api/v1/streams/:id/stop
 * Stop a stream
 */
router.patch('/:id/stop', (req, res) => {
  const stream = streams.get(req.params.id);
  if (!stream) return res.status(404).json({ error: 'Stream not found' });

  stream.status = 'ended';
  stream.endedAt = new Date().toISOString();
  res.json({ data: stream });
});

module.exports = router;
