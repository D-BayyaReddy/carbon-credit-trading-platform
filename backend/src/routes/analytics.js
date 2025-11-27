const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/performance', analyticsController.getPerformanceMetrics);
router.get('/environmental-impact', analyticsController.getEnvironmentalImpact);

// Protected routes
router.get('/user', authenticateToken, analyticsController.getUserAnalytics);
router.get('/trading', authenticateToken, analyticsController.getTradingAnalytics);

// Admin routes
router.post('/generate-metrics', authenticateToken, requireRole(['admin']), analyticsController.generateMetrics);

module.exports = router;