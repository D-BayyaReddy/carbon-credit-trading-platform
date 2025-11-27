const express = require('express');
const authRoutes = require('./auth');
const projectRoutes = require('./projects');
const marketRoutes = require('./marketplace');
const analyticsRoutes = require('./analytics');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/market', marketRoutes);
router.use('/analytics', analyticsRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

module.exports = router;