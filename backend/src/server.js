const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Database setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Define Models
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  walletAddress: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('trader', 'project_owner', 'verifier', 'admin'),
    defaultValue: 'trader'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  projectType: {
    type: DataTypes.ENUM('reforestation', 'renewable_energy', 'mangrove_restoration', 'carbon_capture'),
    allowNull: false
  },
  methodology: {
    type: DataTypes.STRING,
    allowNull: false
  },
  verificationBody: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalCredits: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  creditsIssued: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  co2Reduction: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  areaProtected: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'verified', 'pending'),
    defaultValue: 'pending'
  },
  vintageYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transactionHash: {
    type: DataTypes.STRING,
    unique: true
  },
  fromAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  toAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  transactionType: {
    type: DataTypes.ENUM('purchase', 'transfer', 'issuance', 'retirement'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  }
});

const PerformanceMetric = sequelize.define('PerformanceMetric', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  transparency: {
    type: DataTypes.FLOAT,
    defaultValue: 95.5
  },
  latency: {
    type: DataTypes.FLOAT,
    defaultValue: 2.3
  },
  throughput: {
    type: DataTypes.FLOAT,
    defaultValue: 15.2
  },
  uptime: {
    type: DataTypes.FLOAT,
    defaultValue: 99.9
  },
  consensusEfficiency: {
    type: DataTypes.FLOAT,
    defaultValue: 98.2
  },
  creditAccuracy: {
    type: DataTypes.FLOAT,
    defaultValue: 97.8
  },
  fraudDetection: {
    type: DataTypes.FLOAT,
    defaultValue: 96.5
  }
});

// Initialize database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
    // Insert sample data
    initializeSampleData();
  })
  .catch(err => console.error('Database sync error:', err));

// Initialize sample data
async function initializeSampleData() {
  try {
    const projectCount = await Project.count();
    if (projectCount === 0) {
      await Project.bulkCreate([
        {
          name: "Amazon Rainforest Conservation",
          description: "Protecting 500,000 hectares of Amazon rainforest from deforestation",
          location: "Brazil, Amazon Basin",
          projectType: "reforestation",
          methodology: "REDD+",
          verificationBody: "Verra",
          totalCredits: 1000000,
          creditsIssued: 250000,
          co2Reduction: 2500000,
          areaProtected: 500000,
          status: "verified",
          vintageYear: 2024
        },
        {
          name: "Mangrove Restoration Project",
          description: "Restoring coastal mangrove ecosystems for carbon sequestration",
          location: "Southeast Asia",
          projectType: "mangrove_restoration",
          methodology: "VM0033",
          verificationBody: "Gold Standard",
          totalCredits: 500000,
          creditsIssued: 125000,
          co2Reduction: 1200000,
          areaProtected: 100000,
          status: "verified",
          vintageYear: 2024
        },
        {
          name: "Solar Farm Initiative",
          description: "Large-scale solar energy generation replacing fossil fuels",
          location: "India, Rajasthan",
          projectType: "renewable_energy",
          methodology: "ACM0002",
          verificationBody: "UNFCCC",
          totalCredits: 750000,
          creditsIssued: 200000,
          co2Reduction: 1800000,
          areaProtected: 5000,
          status: "verified",
          vintageYear: 2024
        }
      ]);
      console.log('Sample projects created');
    }

    const metricCount = await PerformanceMetric.count();
    if (metricCount === 0) {
      // Create performance metrics for the last 30 days
      const metrics = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        metrics.push({
          timestamp: date,
          transparency: 95.5 + (Math.random() - 0.5) * 2,
          latency: 2.3 + (Math.random() - 0.5) * 0.5,
          throughput: 15.2 + (Math.random() - 0.5) * 3,
          uptime: 99.9 - Math.random() * 0.5,
          consensusEfficiency: 98.2 + (Math.random() - 0.5) * 1,
          creditAccuracy: 97.8 + (Math.random() - 0.5) * 1.5,
          fraudDetection: 96.5 + (Math.random() - 0.5) * 2
        });
      }
      await PerformanceMetric.bulkCreate(metrics);
      console.log('Sample performance metrics created');
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}

// Routes

// User authentication
app.post('/api/auth/nonce', (req, res) => {
  const { walletAddress } = req.body;
  const nonce = Math.floor(Math.random() * 1000000).toString();
  // In production, store nonce associated with walletAddress
  res.json({ nonce });
});

app.post('/api/auth/verify', (req, res) => {
  const { walletAddress, signature } = req.body;
  // In production, verify signature against stored nonce
  const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
  res.json({ token, walletAddress });
});

// Project routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Performance metrics
app.get('/api/metrics', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const date = new Date();
    date.setDate(date.getDate() - parseInt(days));
    
    const metrics = await PerformanceMetric.findAll({
      where: {
        timestamp: {
          [Sequelize.Op.gte]: date
        }
      },
      order: [['timestamp', 'ASC']]
    });
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Platform statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalProjects = await Project.count();
    const totalCredits = await Project.sum('totalCredits');
    const issuedCredits = await Project.sum('creditsIssued');
    const totalCO2Reduction = await Project.sum('co2Reduction');
    
    const recentTransactions = await Transaction.count({
      where: {
        createdAt: {
          [Sequelize.Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    res.json({
      totalProjects,
      totalCredits,
      issuedCredits,
      totalCO2Reduction,
      dailyTransactions: recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transaction history
app.get('/api/transactions', async (req, res) => {
  try {
    const { walletAddress } = req.query;
    const where = walletAddress ? {
      [Sequelize.Op.or]: [
        { fromAddress: walletAddress },
        { toAddress: walletAddress }
      ]
    } : {};
    
    const transactions = await Transaction.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});