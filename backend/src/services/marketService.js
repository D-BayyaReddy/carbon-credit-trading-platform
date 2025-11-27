const { Transaction, User } = require('../models');
const blockchainService = require('./blockchainService');
const logger = require('../utils/logger');

class MarketService {
  async getMarketOverview() {
    try {
      const [platformStats, recentTransactions, activeListings] = await Promise.all([
        blockchainService.getPlatformStats(),
        this.getRecentTransactions(5),
        blockchainService.getActiveListings()
      ]);

      const totalVolume = await Transaction.sum('totalValue', {
        where: { 
          transactionType: 'purchase',
          status: 'completed'
        }
      });

      const averagePrice = await Transaction.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice']
        ],
        where: { 
          transactionType: 'purchase',
          status: 'completed'
        }
      });

      return {
        totalSupply: platformStats.totalSupply,
        activeListings: activeListings.length,
        totalTransactions: platformStats.transactions,
        totalVolume: totalVolume || 0,
        averagePrice: parseFloat(averagePrice?.dataValues?.avgPrice || 0),
        recentTransactions
      };
    } catch (error) {
      logger.error('Error getting market overview:', error);
      throw new Error('Failed to get market overview');
    }
  }

  async getRecentTransactions(limit = 10) {
    try {
      const transactions = await Transaction.findAll({
        where: { status: 'completed' },
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['walletAddress', 'username']
          },
          {
            model: User,
            as: 'receiver',
            attributes: ['walletAddress', 'username']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit)
      });

      return transactions;
    } catch (error) {
      logger.error('Error getting recent transactions:', error);
      throw new Error('Failed to get recent transactions');
    }
  }

  async getUserPortfolio(walletAddress) {
    try {
      const [balance, listings, sentTransactions, receivedTransactions] = await Promise.all([
        blockchainService.getBalance(walletAddress),
        blockchainService.getUserListings(walletAddress),
        this.getUserTransactions(walletAddress, 'sent'),
        this.getUserTransactions(walletAddress, 'received')
      ]);

      const portfolioValue = await Transaction.sum('totalValue', {
        where: { 
          toAddress: walletAddress,
          transactionType: 'purchase',
          status: 'completed'
        }
      });

      const totalSpent = await Transaction.sum('totalValue', {
        where: { 
          fromAddress: walletAddress,
          transactionType: 'purchase',
          status: 'completed'
        }
      });

      return {
        balance: parseFloat(balance),
        activeListings: listings.filter(l => l.active),
        portfolioValue: portfolioValue || 0,
        totalSpent: totalSpent || 0,
        totalTransactions: sentTransactions.length + receivedTransactions.length,
        performance: portfolioValue - totalSpent
      };
    } catch (error) {
      logger.error('Error getting user portfolio:', error);
      throw new Error('Failed to get user portfolio');
    }
  }

  async getUserTransactions(walletAddress, type = 'all', limit = 20) {
    try {
      const where = { status: 'completed' };
      
      if (type === 'sent') {
        where.fromAddress = walletAddress;
      } else if (type === 'received') {
        where.toAddress = walletAddress;
      } else {
        where[Op.or] = [
          { fromAddress: walletAddress },
          { toAddress: walletAddress }
        ];
      }

      const transactions = await Transaction.findAll({
        where,
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['walletAddress', 'username']
          },
          {
            model: User,
            as: 'receiver',
            attributes: ['walletAddress', 'username']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit)
      });

      return transactions;
    } catch (error) {
      logger.error('Error getting user transactions:', error);
      throw new Error('Failed to get user transactions');
    }
  }

  async getTradingVolume(timeframe = '7d') {
    try {
      let where = {};
      const now = new Date();
      
      switch (timeframe) {
        case '24h':
          where.createdAt = { [Op.gte]: new Date(now - 24 * 60 * 60 * 1000) };
          break;
        case '7d':
          where.createdAt = { [Op.gte]: new Date(now - 7 * 24 * 60 * 60 * 1000) };
          break;
        case '30d':
          where.createdAt = { [Op.gte]: new Date(now - 30 * 24 * 60 * 60 * 1000) };
          break;
        case '1y':
          where.createdAt = { [Op.gte]: new Date(now - 365 * 24 * 60 * 60 * 1000) };
          break;
      }

      const volumeData = await Transaction.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
          [sequelize.fn('SUM', sequelize.col('totalValue')), 'volume'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'transactions'],
          [sequelize.fn('AVG', sequelize.col('price')), 'averagePrice']
        ],
        where: {
          ...where,
          transactionType: 'purchase',
          status: 'completed'
        },
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
      });

      return volumeData;
    } catch (error) {
      logger.error('Error getting trading volume:', error);
      throw new Error('Failed to get trading volume data');
    }
  }
}

module.exports = new MarketService();