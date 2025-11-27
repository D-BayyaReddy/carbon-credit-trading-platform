const { Web3 } = require('web3');

const web3 = new Web3();

const isValidEthereumAddress = (address) => {
  return web3.utils.isAddress(address);
};

const isValidTransactionHash = (hash) => {
  return /^0x([A-Fa-f0-9]{64})$/.test(hash);
};

const isValidAmount = (amount) => {
  if (typeof amount !== 'string' && typeof amount !== 'number') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num <= Number.MAX_SAFE_INTEGER;
};

const isValidPrice = (price) => {
  if (typeof price !== 'string' && typeof price !== 'number') return false;
  const num = parseFloat(price);
  return !isNaN(num) && num >= 0 && num <= Number.MAX_SAFE_INTEGER;
};

const isValidProjectType = (type) => {
  const validTypes = ['reforestation', 'renewable_energy', 'mangrove_restoration', 'carbon_capture'];
  return validTypes.includes(type);
};

const isValidMethodology = (methodology) => {
  const validMethods = ['REDD+', 'VM0033', 'ACM0002', 'GS4GG'];
  return validMethods.includes(methodology);
};

const isValidVerificationBody = (body) => {
  const validBodies = ['Verra', 'Gold Standard', 'UNFCCC', 'CDM'];
  return validBodies.includes(body);
};

const isValidVintageYear = (year) => {
  const currentYear = new Date().getFullYear();
  const num = parseInt(year);
  return !isNaN(num) && num >= 2000 && num <= currentYear + 5;
};

const isValidPagination = (page, limit) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  return !isNaN(pageNum) && pageNum > 0 && !isNaN(limitNum) && limitNum > 0 && limitNum <= 100;
};

const validateProjectData = (data) => {
  const errors = [];

  if (!data.name || data.name.length < 2 || data.name.length > 200) {
    errors.push('Project name must be between 2 and 200 characters');
  }

  if (!data.location) {
    errors.push('Project location is required');
  }

  if (!isValidProjectType(data.projectType)) {
    errors.push('Invalid project type');
  }

  if (!isValidMethodology(data.methodology)) {
    errors.push('Invalid methodology');
  }

  if (!isValidVerificationBody(data.verificationBody)) {
    errors.push('Invalid verification body');
  }

  if (!isValidVintageYear(data.vintageYear)) {
    errors.push('Invalid vintage year');
  }

  if (!data.totalCredits || !isValidAmount(data.totalCredits)) {
    errors.push('Total credits must be a positive number');
  }

  return errors;
};

module.exports = {
  isValidEthereumAddress,
  isValidTransactionHash,
  isValidAmount,
  isValidPrice,
  isValidProjectType,
  isValidMethodology,
  isValidVerificationBody,
  isValidVintageYear,
  isValidPagination,
  validateProjectData
};