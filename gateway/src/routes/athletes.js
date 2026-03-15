/**
 * Athlete Management Routes
 */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const athletes = new Map();

router.post('/', (req, res) => {
  const { name, sport, team, jerseyNumber, position } = req.body;
  const athlete = {
    id: uuidv4(),
    name,
    sport: sport || 'cricket',
    team,
    jerseyNumber,
    position,
    devices: [],
    createdAt: new Date().toISOString(),
  };
  athletes.set(athlete.id, athlete);
  res.status(201).json({ data: athlete });
});

router.get('/', (req, res) => {
  const { team, sport } = req.query;
  let result = Array.from(athletes.values());
  if (team) result = result.filter(a => a.team === team);
  if (sport) result = result.filter(a => a.sport === sport);
  res.json({ data: result, total: result.length });
});

router.get('/:id', (req, res) => {
  const athlete = athletes.get(req.params.id);
  if (!athlete) return res.status(404).json({ error: 'Athlete not found' });
  res.json({ data: athlete });
});

router.get('/:id/biometrics', (req, res) => {
  // TODO: Query TimescaleDB for athlete's biometric history
  res.json({
    data: {
      athleteId: req.params.id,
      current: { hr: 142, spo2: 97, temp: 37.2, hydration: 'normal' },
      history: [],
    },
  });
});

module.exports = router;
