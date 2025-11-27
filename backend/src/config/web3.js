const { Web3 } = require('web3');
const carbonCreditArtifact = require('../contracts/CarbonCredit.json');
const contractAddresses = require('../contracts/contract-addresses.json');

let web3;
let carbonCreditContract;

const initializeWeb3 = () => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Browser environment
      web3 = new Web3(window.ethereum);
    } else {
      // Node.js environment
      const providerUrl = process.env.ETHEREUM_NETWORK_URL || 'http://localhost:8545';
      web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    }

    // Initialize contract
    carbonCreditContract = new web3.eth.Contract(
      carbonCreditArtifact.abi,
      contractAddresses.CarbonCredit
    );

    console.log('Web3 initialized successfully');
    return { web3, carbonCreditContract };
  } catch (error) {
    console.error('Error initializing Web3:', error);
    throw error;
  }
};

const getWeb3 = () => {
  if (!web3) {
    return initializeWeb3();
  }
  return { web3, carbonCreditContract };
};

const getContract = () => {
  if (!carbonCreditContract) {
    initializeWeb3();
  }
  return carbonCreditContract;
};

module.exports = {
  initializeWeb3,
  getWeb3,
  getContract
};