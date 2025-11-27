export const PROJECT_TYPES = {
  REFORESTATION: 'reforestation',
  RENEWABLE_ENERGY: 'renewable_energy',
  MANGROVE_RESTORATION: 'mangrove_restoration',
  CARBON_CAPTURE: 'carbon_capture'
};

export const PROJECT_TYPE_LABELS = {
  [PROJECT_TYPES.REFORESTATION]: 'Reforestation',
  [PROJECT_TYPES.RENEWABLE_ENERGY]: 'Renewable Energy',
  [PROJECT_TYPES.MANGROVE_RESTORATION]: 'Mangrove Restoration',
  [PROJECT_TYPES.CARBON_CAPTURE]: 'Carbon Capture'
};

export const METHODOLOGIES = {
  REDD_PLUS: 'REDD+',
  VM0033: 'VM0033',
  ACM0002: 'ACM0002',
  GS4GG: 'GS4GG'
};

export const METHODOLOGY_LABELS = {
  [METHODOLOGIES.REDD_PLUS]: 'REDD+',
  [METHODOLOGIES.VM0033]: 'VM0033',
  [METHODOLOGIES.ACM0002]: 'ACM0002',
  [METHODOLOGIES.GS4GG]: 'Gold Standard for Global Goals'
};

export const VERIFICATION_BODIES = {
  VERRA: 'Verra',
  GOLD_STANDARD: 'Gold Standard',
  UNFCCC: 'UNFCCC',
  CDM: 'CDM'
};

export const VERIFICATION_BODY_LABELS = {
  [VERIFICATION_BODIES.VERRA]: 'Verra',
  [VERIFICATION_BODIES.GOLD_STANDARD]: 'Gold Standard',
  [VERIFICATION_BODIES.UNFCCC]: 'UNFCCC',
  [VERIFICATION_BODIES.CDM]: 'CDM'
};

export const PROJECT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  VERIFIED: 'verified',
  INACTIVE: 'inactive',
  REJECTED: 'rejected'
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.PENDING]: 'Pending',
  [PROJECT_STATUS.ACTIVE]: 'Active',
  [PROJECT_STATUS.VERIFIED]: 'Verified',
  [PROJECT_STATUS.INACTIVE]: 'Inactive',
  [PROJECT_STATUS.REJECTED]: 'Rejected'
};

export const TRANSACTION_TYPES = {
  PURCHASE: 'purchase',
  TRANSFER: 'transfer',
  ISSUANCE: 'issuance',
  RETIREMENT: 'retirement'
};

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.PURCHASE]: 'Purchase',
  [TRANSACTION_TYPES.TRANSFER]: 'Transfer',
  [TRANSACTION_TYPES.ISSUANCE]: 'Issuance',
  [TRANSACTION_TYPES.RETIREMENT]: 'Retirement'
};

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

export const TRANSACTION_STATUS_LABELS = {
  [TRANSACTION_STATUS.PENDING]: 'Pending',
  [TRANSACTION_STATUS.COMPLETED]: 'Completed',
  [TRANSACTION_STATUS.FAILED]: 'Failed',
  [TRANSACTION_STATUS.CANCELLED]: 'Cancelled'
};

export const PERFORMANCE_METRICS = {
  TRANSPARENCY: 'transparency',
  LATENCY: 'latency',
  THROUGHPUT: 'throughput',
  UPTIME: 'uptime',
  CONSENSUS_EFFICIENCY: 'consensusEfficiency',
  CREDIT_ACCURACY: 'creditAccuracy',
  FRAUD_DETECTION: 'fraudDetection'
};

export const PERFORMANCE_METRIC_LABELS = {
  [PERFORMANCE_METRICS.TRANSPARENCY]: 'Transparency',
  [PERFORMANCE_METRICS.LATENCY]: 'Transaction Latency',
  [PERFORMANCE_METRICS.THROUGHPUT]: 'Throughput (TPS)',
  [PERFORMANCE_METRICS.UPTIME]: 'System Uptime',
  [PERFORMANCE_METRICS.CONSENSUS_EFFICIENCY]: 'Consensus Efficiency',
  [PERFORMANCE_METRICS.CREDIT_ACCURACY]: 'Credit Accuracy',
  [PERFORMANCE_METRICS.FRAUD_DETECTION]: 'Fraud Detection'
};

export const CHART_COLORS = {
  PRIMARY: '#2E7D32',
  SECONDARY: '#FF6F00',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#f44336',
  INFO: '#2196F3',
  REFORESTATION: '#4CAF50',
  RENEWABLE_ENERGY: '#FF9800',
  MANGROVE_RESTORATION: '#2196F3',
  CARBON_CAPTURE: '#9C27B0'
};

export const NETWORK_IDS = {
  MAINNET: 1,
  SEPOLIA: 11155111,
  LOCALHOST: 31337
};

export const NETWORK_NAMES = {
  [NETWORK_IDS.MAINNET]: 'Ethereum Mainnet',
  [NETWORK_IDS.SEPOLIA]: 'Sepolia Testnet',
  [NETWORK_IDS.LOCALHOST]: 'Localhost'
};

// Default values for forms
export const DEFAULT_VALUES = {
  PROJECT: {
    name: '',
    description: '',
    location: '',
    projectType: PROJECT_TYPES.REFORESTATION,
    methodology: METHODOLOGIES.REDD_PLUS,
    verificationBody: VERIFICATION_BODIES.VERRA,
    totalCredits: 1000,
    vintageYear: new Date().getFullYear(),
    co2Reduction: 0,
    areaProtected: 0
  },
  LISTING: {
    amount: '',
    pricePerCredit: ''
  }
};

// API configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME_MODE: 'themeMode',
  LANGUAGE: 'language'
};

// Environment configuration
export const ENV = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS,
  API_URL: process.env.REACT_APP_API_URL
};