const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { USER_ROLES } = require('../config/constants');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  walletAddress: {
    type: DataTypes.STRING(42),
    unique: true,
    allowNull: false,
    validate: {
      isLowercase: true,
      len: [42, 42]
    }
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [2, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: DataTypes.ENUM(Object.values(USER_ROLES)),
    defaultValue: USER_ROLES.TRADER
  },
  company: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profileImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['walletAddress']
    },
    {
      fields: ['role']
    }
  ]
});

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = User;