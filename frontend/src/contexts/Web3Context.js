import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import CarbonCreditABI from '../contracts/CarbonCredit.json';
import { carbonCreditAddress } from '../contracts/contract-addresses.json';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [carbonCreditContract, setCarbonCreditContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [networkId, setNetworkId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const connectWallet = async () => {
    if (!window.ethereum) {
      enqueueSnackbar('Please install MetaMask!', { variant: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      const currentAccount = accounts[0];
      setAccount(currentAccount);
      setIsConnected(true);

      const networkId = await web3Instance.eth.net.getId();
      setNetworkId(networkId);

      // Initialize contract
      const contract = new web3Instance.eth.Contract(
        CarbonCreditABI.abi,
        carbonCreditAddress
      );
      setCarbonCreditContract(contract);

      // Get balance
      await updateBalance(currentAccount, contract, web3Instance);

      // Set up event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      enqueueSnackbar('Wallet connected successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      enqueueSnackbar('Failed to connect wallet', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
      enqueueSnackbar('Wallet disconnected', { variant: 'info' });
    } else {
      setAccount(accounts[0]);
      await updateBalance(accounts[0], carbonCreditContract, web3);
    }
  };

  const handleChainChanged = (chainId) => {
    setNetworkId(parseInt(chainId, 16));
    enqueueSnackbar('Network changed', { variant: 'info' });
  };

  const updateBalance = async (account, contract, web3Instance) => {
    try {
      if (contract && account) {
        const creditBalance = await contract.methods.balanceOf(account).call();
        setBalance(web3Instance.utils.fromWei(creditBalance, 'ether'));
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setCarbonCreditContract(null);
    setIsConnected(false);
    setBalance('0');
    setNetworkId(null);

    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  const switchNetwork = async (networkId) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${networkId.toString(16)}` }],
      });
    } catch (error) {
      console.error('Error switching network:', error);
      enqueueSnackbar('Failed to switch network', { variant: 'error' });
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnectedWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Error checking connected wallet:', error);
        }
      }
    };

    checkConnectedWallet();
  }, []);

  const value = {
    web3,
    account,
    carbonCreditContract,
    isConnected,
    balance,
    networkId,
    isLoading,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    updateBalance: () => updateBalance(account, carbonCreditContract, web3)
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};