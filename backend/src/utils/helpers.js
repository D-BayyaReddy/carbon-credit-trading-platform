const { Web3 } = require('web3');

const web3 = new Web3();

const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatAmount = (amount, decimals = 4) => {
  return parseFloat(amount).toFixed(decimals);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(price);
};

const formatLargeNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
};

const validateEthereumAddress = (address) => {
  return web3.utils.isAddress(address);
};

const generateProjectId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `PROJ-${timestamp}-${random}`.toUpperCase();
};

const calculateCarbonOffset = (credits, creditToCO2Ratio = 1) => {
  return credits * creditToCO2Ratio;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '');
};

module.exports = {
  formatAddress,
  formatAmount,
  formatPrice,
  formatLargeNumber,
  validateEthereumAddress,
  generateProjectId,
  calculateCarbonOffset,
  delay,
  sanitizeInput
};