const User = require('./User');
const Project = require('./Project');
const Transaction = require('./Transaction');
const PerformanceMetric = require('./PerformanceMetric');

// Define associations
User.hasMany(Project, {
  foreignKey: 'ownerAddress',
  sourceKey: 'walletAddress',
  as: 'projects'
});

Project.belongsTo(User, {
  foreignKey: 'ownerAddress',
  targetKey: 'walletAddress',
  as: 'owner'
});

User.hasMany(Transaction, {
  foreignKey: 'fromAddress',
  sourceKey: 'walletAddress',
  as: 'sentTransactions'
});

User.hasMany(Transaction, {
  foreignKey: 'toAddress',
  sourceKey: 'walletAddress',
  as: 'receivedTransactions'
});

Project.hasMany(Transaction, {
  foreignKey: 'projectId',
  sourceKey: 'projectId',
  as: 'transactions'
});

module.exports = {
  User,
  Project,
  Transaction,
  PerformanceMetric,
  sequelize: require('../config/database').sequelize
};