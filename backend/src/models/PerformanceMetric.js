const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PerformanceMetric = sequelize.define('PerformanceMetric', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  transparency: {
    type: DataTypes.FLOAT,
    defaultValue: 95.5,
    validate: {
      min: 0,
      max: 100
    }
  },
  latency: {
    type: DataTypes.FLOAT,
    defaultValue: 2.3,
    validate: {
      min: 0
    }
  },
  throughput: {
    type: DataTypes.FLOAT,
    defaultValue: 15.2,
    validate: {
      min: 0
    }
  },
  uptime: {
    type: DataTypes.FLOAT,
    defaultValue: 99.9,
    validate: {
      min: 0,
      max: 100
    }
  },
  consensusEfficiency: {
    type: DataTypes.FLOAT,
    defaultValue: 98.2,
    validate: {
      min: 0,
      max: 100
    }
  },
  creditAccuracy: {
    type: DataTypes.FLOAT,
    defaultValue: 97.8,
    validate: {
      min: 0,
      max: 100
    }
  },
  fraudDetection: {
    type: DataTypes.FLOAT,
    defaultValue: 96.5,
    validate: {
      min: 0,
      max: 100
    }
  },
  activeUsers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  dailyTransactions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalVolume: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'performance_metrics',
  timestamps: true,
  indexes: [
    {
      fields: ['timestamp']
    }
  ]
});

PerformanceMetric.prototype.getOverallScore = function() {
  const metrics = [
    this.transparency,
    this.uptime,
    this.consensusEfficiency,
    this.creditAccuracy,
    this.fraudDetection
  ];
  return metrics.reduce((sum, metric) => sum + metric, 0) / metrics.length;
};

module.exports = PerformanceMetric;