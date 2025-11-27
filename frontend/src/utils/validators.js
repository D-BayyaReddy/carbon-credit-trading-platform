export const isValidEthereumAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isValidAmount = (amount) => {
  if (!amount) return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num <= Number.MAX_SAFE_INTEGER;
};

export const isValidPrice = (price) => {
  if (!price) return false;
  const num = parseFloat(price);
  return !isNaN(num) && num >= 0 && num <= Number.MAX_SAFE_INTEGER;
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidProjectName = (name) => {
  return name && name.length >= 2 && name.length <= 200;
};

export const isValidVintageYear = (year) => {
  const currentYear = new Date().getFullYear();
  const num = parseInt(year);
  return !isNaN(num) && num >= 2000 && num <= currentYear + 5;
};

export const validateProjectData = (data) => {
  const errors = {};

  if (!isValidProjectName(data.name)) {
    errors.name = 'Project name must be between 2 and 200 characters';
  }

  if (!data.location) {
    errors.location = 'Project location is required';
  }

  if (!data.projectType) {
    errors.projectType = 'Project type is required';
  }

  if (!data.methodology) {
    errors.methodology = 'Methodology is required';
  }

  if (!data.verificationBody) {
    errors.verificationBody = 'Verification body is required';
  }

  if (!isValidVintageYear(data.vintageYear)) {
    errors.vintageYear = 'Valid vintage year is required (2000-2030)';
  }

  if (!isValidAmount(data.totalCredits)) {
    errors.totalCredits = 'Total credits must be a positive number';
  }

  if (data.co2Reduction && !isValidAmount(data.co2Reduction)) {
    errors.co2Reduction = 'CO2 reduction must be a positive number';
  }

  if (data.areaProtected && !isValidAmount(data.areaProtected)) {
    errors.areaProtected = 'Area protected must be a positive number';
  }

  return errors;
};

export const validateListingData = (amount, pricePerCredit) => {
  const errors = {};

  if (!isValidAmount(amount)) {
    errors.amount = 'Valid amount is required';
  }

  if (!isValidPrice(pricePerCredit)) {
    errors.pricePerCredit = 'Valid price per credit is required';
  }

  return errors;
};

export const validatePurchaseData = (totalPrice) => {
  const errors = {};

  if (!isValidPrice(totalPrice)) {
    errors.totalPrice = 'Valid total price is required';
  }

  return errors;
};