const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { PROJECT_TYPES, METHODOLOGIES, VERIFICATION_BODIES } = require('../config/constants');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  projectType: {
    type: DataTypes.ENUM(Object.values(PROJECT_TYPES)),
    allowNull: false
  },
  methodology: {
    type: DataTypes.ENUM(Object.values(METHODOLOGIES)),
    allowNull: false
  },
  verificationBody: {
    type: DataTypes.ENUM(Object.values(VERIFICATION_BODIES)),
    allowNull: false
  },
  totalCredits: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  creditsIssued: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  co2Reduction: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  areaProtected: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'verified', 'pending', 'rejected'),
    defaultValue: 'pending'
  },
  vintageYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2000,
      max: 2030
    }
  },
  projectId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  verificationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ownerAddress: {
    type: DataTypes.STRING(42),
    allowNull: false,
    validate: {
      isLowercase: true,
      len: [42, 42]
    }
  }
}, {
  tableName: 'projects',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['projectId']
    },
    {
      fields: ['projectType']
    },
    {
      fields: ['status']
    },
    {
      fields: ['vintageYear']
    }
  ]
});

Project.prototype.getProgress = function() {
  return this.creditsIssued / this.totalCredits * 100;
};

Project.prototype.toJSON = function() {
  const values = { ...this.get() };
  values.progress = this.getProgress();
  return values;
};

module.exports = Project;