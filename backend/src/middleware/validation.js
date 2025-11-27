const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('walletAddress')
    .isEthereumAddress()
    .withMessage('Valid Ethereum address required'),
  body('username')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Username must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email required'),
  handleValidationErrors
];

// Project validation rules
const validateProjectCreation = [
  body('name')
    .isLength({ min: 2, max: 200 })
    .withMessage('Project name must be between 2 and 200 characters'),
  body('location')
    .notEmpty()
    .withMessage('Project location is required'),
  body('projectType')
    .isIn(['reforestation', 'renewable_energy', 'mangrove_restoration', 'carbon_capture'])
    .withMessage('Valid project type required'),
  body('methodology')
    .isIn(['REDD+', 'VM0033', 'ACM0002', 'GS4GG'])
    .withMessage('Valid methodology required'),
  body('verificationBody')
    .isIn(['Verra', 'Gold Standard', 'UNFCCC', 'CDM'])
    .withMessage('Valid verification body required'),
  body('totalCredits')
    .isInt({ min: 1 })
    .withMessage('Total credits must be a positive integer'),
  body('vintageYear')
    .isInt({ min: 2000, max: 2030 })
    .withMessage('Valid vintage year required (2000-2030)'),
  body('co2Reduction')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('CO2 reduction must be a positive number'),
  handleValidationErrors
];

// Transaction validation rules
const validateTransaction = [
  body('fromAddress')
    .isEthereumAddress()
    .withMessage('Valid from address required'),
  body('toAddress')
    .isEthereumAddress()
    .withMessage('Valid to address required'),
  body('amount')
    .isFloat({ min: 0.000001 })
    .withMessage('Amount must be a positive number'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('transactionType')
    .isIn(['purchase', 'transfer', 'issuance', 'retirement'])
    .withMessage('Valid transaction type required'),
  handleValidationErrors
];

// Query validation rules
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateProjectCreation,
  validateTransaction,
  validatePagination,
  handleValidationErrors
};