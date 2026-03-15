/**
 * AI-Generated Highlights Routes
 */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const { matchId, athleteId, type, limit = 20 } = req.query;
  // TODO: Query highlights from PostgreSQL
  res.json({
    data: [],
    total: 0,
    filters: { matchId, athleteId, type, limit: parseInt(limit) },
  });
});

router.get('/:id', (req, res) => {
  // TODO: Fetch specific highlight clip
  res.json({
    data: {
      id: req.params.id,
      type: 'boundary',
      confidence: 0.94,
      startTime: '00:15:32',
      duration: 8.5,
      clipUrl: null,
      thumbnailUrl: null,
    },
  });
});

router.post('/:id/export', (req, res) => {
  const { format = 'mp4', resolution = '1080p' } = req.body;
  // TODO: Trigger clip export pipeline
  res.json({
    data: {
      id: req.params.id,
      exportStatus: 'processing',
      format,
      resolution,
      estimatedTime: 30,
    },
  });
});

module.exports = router;
