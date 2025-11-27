const analyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');

class AnalyticsController {
  async getPerformanceMetrics(req, res) {
    try {
      const { days } = req.query;
      const metrics = await analyticsService.getPerformanceTrends(parseInt(days) || 30);
      
      res.json({ metrics });
    } catch (error) {
      logger.error('Error getting performance metrics:', error);
      res.status(500).json({ error: 'Failed to get performance metrics' });
    }
  }

  async generateMetrics(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to generate metrics' });
      }

      const metric = await analyticsService.generatePerformanceMetrics();
      
      res.json({
        message: 'Performance metrics generated successfully',
        metric
      });
    } catch (error) {
      logger.error('Error generating performance metrics:', error);
      res.status(500).json({ error: 'Failed to generate performance metrics' });
    }
  }

  async getEnvironmentalImpact(req, res) {
    try {
      const impact = await analyticsService.getEnvironmentalImpact();
      
      res.json(impact);
    } catch (error) {
      logger.error('Error getting environmental impact:', error);
      res.status(500).json({ error: 'Failed to get environmental impact data' });
    }
  }

  async getUserAnalytics(req, res) {
    try {
      const analytics = await analyticsService.getUserAnalytics(req.user.walletAddress);
      
      res.json(analytics);
    } catch (error) {
      logger.error('Error getting user analytics:', error);
      res.status(500).json({ error: 'Failed to get user analytics' });
    }
  }

  async getPlatformStats(req, res) {
    try {
      const stats = await analyticsService.getPlatformStats();
      
      res.json(stats);
    } catch (error) {
      logger.error('Error getting platform stats:', error);
      res.status(500).json({ error: 'Failed to get platform statistics' });
    }
  }

  async getTradingAnalytics(req, res) {
    try {
      const { timeframe } = req.query;
      
      // Get various trading analytics
      const [volumeData, priceTrends, userActivity] = await Promise.all([
        analyticsService.getTradingVolume(timeframe),
        analyticsService.getPriceTrends(timeframe),
        analyticsService.getUserActivity(timeframe)
      ]);

      res.json({
        volumeData,
        priceTrends,
        userActivity
      });
    } catch (error) {
      logger.error('Error getting trading analytics:', error);
      res.status(500).json({ error: 'Failed to get trading analytics' });
    }
  }
}

module.exports = new AnalyticsController();