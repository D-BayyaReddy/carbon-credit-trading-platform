const express = require('express');
const marketController = require('../controllers/marketController');
const { authenticateToken } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/overview', marketController.getMarketOverview);
router.get('/listings', marketController.getActiveListings);
router.get('/volume', marketController.getTradingVolume);

// Protected routes
router.post('/list', authenticateToken, marketController.listCredits);
router.post('/purchase/:listingId', authenticateToken, marketController.purchaseCredits);
router.get('/portfolio', authenticateToken, marketController.getUserPortfolio);
router.get('/transactions', authenticateToken, validatePagination, marketController.getUserTransactions);
router.get('/user/listings', authenticateToken, marketController.getUserListings);
router.delete('/listings/:listingId', authenticateToken, marketController.cancelListing);

module.exports = router;