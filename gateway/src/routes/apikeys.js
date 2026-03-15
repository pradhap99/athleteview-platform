/**
 * API Key Management Routes
 * For broadcaster partners (Hotstar, JioCinema, FanCode)
 */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const apiKeys = new Map();

router.post('/', (req, res) => {
  const { name, organization, tier = 'starter', permissions = ['read'] } = req.body;
  const key = {
    id: uuidv4(),
    key: `av_${tier}_${uuidv4().replace(/-/g, '').substring(0, 32)}`,
    name,
    organization,
    tier,
    permissions,
    rateLimit: tier === 'enterprise' ? 10000 : tier === 'pro' ? 1000 : 100,
    usage: { requests: 0, streams: 0, lastUsed: null },
    createdAt: new Date().toISOString(),
    active: true,
  };
  apiKeys.set(key.id, key);
  res.status(201).json({ data: key });
});

router.get('/', (req, res) => {
  res.json({ data: Array.from(apiKeys.values()).map(k => ({ ...k, key: k.key.substring(0, 12) + '...' })) });
});

module.exports = router;
