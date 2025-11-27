const marketService = require('../services/marketService');
const blockchainService = require('../services/blockchainService');
const logger = require('../utils/logger');

class MarketController {
  async getMarketOverview(req, res) {
    try {
      const overview = await marketService.getMarketOverview();
      
      res.json(overview);
    } catch (error) {
      logger.error('Error getting market overview:', error);
      res.status(500).json({ error: 'Failed to get market overview' });
    }
  }

  async getActiveListings(req, res) {
    try {
      const listings = await blockchainService.getActiveListings();
      
      res.json({ listings });
    } catch (error) {
      logger.error('Error getting active listings:', error);
      res.status(500).json({ error: 'Failed to get active listings' });
    }
  }

  async listCredits(req, res) {
    try {
      const { amount, pricePerCredit } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount required' });
      }

      if (!pricePerCredit || pricePerCredit <= 0) {
        return res.status(400).json({ error: 'Valid price per credit required' });
      }

      const result = await blockchainService.listCredits(
        req.user.walletAddress,
        amount,
        pricePerCredit
      );

      res.json({
        message: 'Credits listed successfully',
        listingId: result.listingId,
        transactionHash: result.transactionHash
      });
    } catch (error) {
      logger.error('Error listing credits:', error);
      res.status(500).json({ error: 'Failed to list credits' });
    }
  }

  async purchaseCredits(req, res) {
    try {
      const { listingId } = req.params;
      const { totalPrice } = req.body;

      if (!totalPrice || totalPrice <= 0) {
        return res.status(400).json({ error: 'Valid total price required' });
      }

      const result = await blockchainService.purchaseCredits(
        req.user.walletAddress,
        parseInt(listingId),
        totalPrice
      );

      res.json({
        message: 'Credits purchased successfully',
        transactionHash: result.transactionHash,
        amount: result.amount,
        totalPrice: result.totalPrice
      });
    } catch (error) {
      logger.error('Error purchasing credits:', error);
      res.status(500).json({ error: 'Failed to purchase credits' });
    }
  }

  async getUserPortfolio(req, res) {
    try {
      const portfolio = await marketService.getUserPortfolio(req.user.walletAddress);
      
      res.json(portfolio);
    } catch (error) {
      logger.error('Error getting user portfolio:', error);
      res.status(500).json({ error: 'Failed to get user portfolio' });
    }
  }

  async getUserTransactions(req, res) {
    try {
      const { type, limit } = req.query;
      const transactions = await marketService.getUserTransactions(
        req.user.walletAddress,
        type,
        limit
      );
      
      res.json({ transactions });
    } catch (error) {
      logger.error('Error getting user transactions:', error);
      res.status(500).json({ error: 'Failed to get user transactions' });
    }
  }

  async getTradingVolume(req, res) {
    try {
      const { timeframe } = req.query;
      const volumeData = await marketService.getTradingVolume(timeframe);
      
      res.json({ volumeData });
    } catch (error) {
      logger.error('Error getting trading volume:', error);
      res.status(500).json({ error: 'Failed to get trading volume data' });
    }
  }

  async cancelListing(req, res) {
    try {
      const { listingId } = req.params;

      const result = await blockchainService.cancelListing(
        req.user.walletAddress,
        parseInt(listingId)
      );

      res.json({
        message: 'Listing cancelled successfully',
        transactionHash: result.transactionHash
      });
    } catch (error) {
      logger.error('Error cancelling listing:', error);
      res.status(500).json({ error: 'Failed to cancel listing' });
    }
  }

  async getUserListings(req, res) {
    try {
      const listings = await blockchainService.getUserListings(req.user.walletAddress);
      
      res.json({ listings });
    } catch (error) {
      logger.error('Error getting user listings:', error);
      res.status(500).json({ error: 'Failed to get user listings' });
    }
  }
}

module.exports = new MarketController();