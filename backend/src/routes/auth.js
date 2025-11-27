const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateUserRegistration } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/nonce', authController.generateNonce);
router.post('/verify', authController.verifySignature);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, validateUserRegistration, authController.updateProfile);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;