import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AccountBalanceWallet,
  VerifiedUser
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useWeb3 } from '../contexts/Web3Context';
import { useApp } from '../contexts/AppContext';
import { authAPI } from '../services/api';

const Login = () => {
  const { isConnected, account, connectWallet } = useWeb3();
  const { setUser, setError } = useApp();
  const navigate = useNavigate();
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState('connect'); // connect -> sign -> complete

  useEffect(() => {
    if (isConnected && account) {
      handleAuthentication();
    }
  }, [isConnected, account]);

  const handleAuthentication = async () => {
    if (!account) return;

    setIsAuthenticating(true);
    setAuthStep('sign');

    try {
      // Generate nonce for signing
      const nonceResponse = await authAPI.generateNonce(account);
      const { nonce, message } = nonceResponse.data;

      // Request signature from wallet
      const signature = await requestSignature(message);
      
      if (!signature) {
        throw new Error('Signature request was cancelled');
      }

      setAuthStep('complete');

      // Verify signature with backend
      const authResponse = await authAPI.verifySignature(account, signature);
      const { token, user } = authResponse.data;

      // Store token and user data
      localStorage.setItem('authToken', token);
      setUser(user);

      // Redirect to dashboard
      navigate('/');
      
    } catch (error) {
      setError(error.message || 'Authentication failed');
      setAuthStep('connect');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const requestSignature = async (message) => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account],
      });
      return signature;
    } catch (error) {
      if (error.code === 4001) {
        // User rejected the signature request
        return null;
      }
      throw error;
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      setError(error.message);
    }
  };

  const getStepContent = () => {
    switch (authStep) {
      case 'connect':
        return (
          <>
            <AccountBalanceWallet sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Connect Your Wallet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              To access the CarbonCredit platform, please connect your Ethereum wallet. 
              We support MetaMask and other Web3 wallets.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AccountBalanceWallet />}
              onClick={handleConnectWallet}
              disabled={isAuthenticating}
              sx={{ px: 4, py: 1.5 }}
            >
              Connect Wallet
            </Button>
          </>
        );

      case 'sign':
        return (
          <>
            <VerifiedUser sx={{ fontSize: 64, color: 'warning.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Verify Ownership
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Please sign the message in your wallet to verify ownership of your Ethereum address. 
              This action does not cost any gas fees.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                Waiting for signature...
              </Typography>
            </Box>
          </>
        );

      case 'complete':
        return (
          <>
            <VerifiedUser sx={{ fontSize: 64, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Authentication Complete
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Welcome to CarbonCredit! You're being redirected to your dashboard.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                Redirecting...
              </Typography>
            </Box>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        py: 8,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: 6, 
          width: '100%',
          textAlign: 'center',
          border: '2px solid',
          borderColor: 'divider',
          borderRadius: 4
        }}
      >
        {getStepContent()}

        {/* Help Text */}
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            New to Ethereum wallets?
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              • Install MetaMask browser extension
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • Create or import an Ethereum wallet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • Ensure you're on the correct network
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • Make sure you have some ETH for gas fees
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;