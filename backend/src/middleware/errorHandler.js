const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Default error
  let error = { 
    message: 'Internal server error',
    status: 500 
  };

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    error = {
      message: 'Validation failed',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      })),
      status: 400
    };
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    error = {
      message: 'Resource already exists',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      })),
      status: 409
    };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401
    };
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      status: 401
    };
  }

  // Custom error with status code
  if (err.status && err.message) {
    error = {
      message: err.message,
      status: err.status
    };
  }

  res.status(error.status).json({
    error: error.message,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};