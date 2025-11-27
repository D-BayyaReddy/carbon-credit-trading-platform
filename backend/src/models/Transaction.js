const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { TRANSACTION_TYPES } = require('../config/constants');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transactionHash: {
    type: DataTypes.STRING(66),
    unique: true,
    allowNull: true
  },
  fromAddress: {
    type: DataTypes.STRING(42),
    allowNull: false,
    validate: {
      isLowercase: true,
      len: [42, 42]
    }
  },
  toAddress: {
    type: DataTypes.STRING(42),
    allowNull: false,
    validate: {
      isLowercase: true,
      len: [42, 42]
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  totalValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  transactionType: {
    type: DataTypes.ENUM(Object.values(TRANSACTION_TYPES)),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending'
  },
  blockNumber: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gasUsed: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  projectId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['transactionHash']
    },
    {
      fields: ['fromAddress']
    },
    {
      fields: ['toAddress']
    },
    {
      fields: ['transactionType']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

Transaction.beforeSave((transaction) => {
  if (transaction.amount && transaction.price) {
    transaction.totalValue = transaction.amount * transaction.price;
  }
});

module.exports = Transaction;