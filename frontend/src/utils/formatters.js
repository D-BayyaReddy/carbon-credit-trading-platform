import { format } from 'date-fns';

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatAmount = (amount, decimals = 4) => {
  if (!amount) return '0';
  const num = parseFloat(amount);
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatPrice = (price, currency = 'USD') => {
  if (!price) return '$0.00';
  const num = parseFloat(price);
  
  if (currency === 'ETH') {
    return `${num.toFixed(6)} ETH`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(num);
};

export const formatLargeNumber = (num) => {
  if (!num) return '0';
  const number = parseFloat(num);
  
  if (number >= 1000000) {
    return (number / 1000000).toFixed(2) + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(2) + 'K';
  }
  return number.toString();
};

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    return '';
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const formatPercentage = (value, decimals = 1) => {
  if (!value) return '0%';
  return `${parseFloat(value).toFixed(decimals)}%`;
};

export const formatTransactionHash = (hash) => {
  if (!hash) return '';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

export const formatProjectType = (type) => {
  const typeMap = {
    'reforestation': 'Reforestation',
    'renewable_energy': 'Renewable Energy',
    'mangrove_restoration': 'Mangrove Restoration',
    'carbon_capture': 'Carbon Capture'
  };
  return typeMap[type] || type;
};

export const formatMethodology = (methodology) => {
  const methodMap = {
    'REDD+': 'REDD+',
    'VM0033': 'VM0033',
    'ACM0002': 'ACM0002',
    'GS4GG': 'Gold Standard for Global Goals'
  };
  return methodMap[methodology] || methodology;
};

export const calculateTotalValue = (amount, price) => {
  if (!amount || !price) return 0;
  return parseFloat(amount) * parseFloat(price);
};

export const calculateProgress = (current, total) => {
  if (!total || total === 0) return 0;
  return (current / total) * 100;
};

export const formatCO2Reduction = (tons) => {
  if (!tons) return '0 tons';
  if (tons >= 1000000) {
    return `${(tons / 1000000).toFixed(2)}M tons`;
  }
  if (tons >= 1000) {
    return `${(tons / 1000).toFixed(2)}K tons`;
  }
  return `${parseFloat(tons).toFixed(2)} tons`;
};

export const formatArea = (hectares) => {
  if (!hectares) return '0 ha';
  if (hectares >= 1000000) {
    return `${(hectares / 1000000).toFixed(2)}M ha`;
  }
  if (hectares >= 1000) {
    return `${(hectares / 1000).toFixed(2)}K ha`;
  }
  return `${parseFloat(hectares).toFixed(2)} ha`;
};