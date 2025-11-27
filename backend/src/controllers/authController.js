const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validateEthereumAddress } = require('../utils/helpers');
const logger = require('../utils/logger');

class AuthController {
  async generateNonce(req, res) {
    try {
      const { walletAddress } = req.body;

      if (!walletAddress || !validateEthereumAddress(walletAddress)) {
        return res.status(400).json({ error: 'Valid Ethereum address required' });
      }

      // In a real implementation, you'd store this nonce and verify it later
      const nonce = Math.floor(Math.random() * 1000000).toString();
      
      // For demo purposes, we'll just return it
      res.json({ 
        nonce,
        message: `Please sign this nonce to authenticate: ${nonce}`
      });
    } catch (error) {
      logger.error('Error generating nonce:', error);
      res.status(500).json({ error: 'Failed to generate authentication nonce' });
    }
  }

  async verifySignature(req, res) {
    try {
      const { walletAddress, signature } = req.body;

      if (!walletAddress || !signature) {
        return res.status(400).json({ error: 'Wallet address and signature are required' });
      }

      if (!validateEthereumAddress(walletAddress)) {
        return res.status(400).json({ error: 'Invalid Ethereum address' });
      }

      // In production, you would:
      // 1. Retrieve the stored nonce for this walletAddress
      // 2. Verify the signature matches the nonce and walletAddress
      // 3. Use a library like eth-sig-util to verify the signature

      // For demo purposes, we'll assume the signature is valid
      let user = await User.findOne({ where: { walletAddress } });

      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          walletAddress: walletAddress.toLowerCase(),
          username: `user_${walletAddress.slice(2, 8)}`,
          role: 'trader'
        });
        logger.info('New user created:', { walletAddress });
      } else {
        // Update last login
        await user.update({ lastLogin: new Date() });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          walletAddress: user.walletAddress,
          userId: user.id,
          role: user.role 
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
          role: user.role,
          company: user.company
        }
      });
    } catch (error) {
      logger.error('Error verifying signature:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      logger.error('Error getting user profile:', error);
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  }

  async updateProfile(req, res) {
    try {
      const { username, email, company } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.update({
        username: username || user.username,
        email: email || user.email,
        company: company || user.company
      });

      res.json({
        message: 'Profile updated successfully',
        user: {
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
          role: user.role,
          company: user.company
        }
      });
    } catch (error) {
      logger.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  async logout(req, res) {
    try {
      // In a real implementation, you might blacklist the token
      // For JWT, since it's stateless, we just inform the client to discard the token
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Error during logout:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  }
}

module.exports = new AuthController();