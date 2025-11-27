import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { useWeb3 } from '../../contexts/Web3Context';
import { useApp } from '../../contexts/AppContext';
import { marketAPI } from '../../services/api';
import { validateListingData } from '../../utils/validators';
import { formatAmount } from '../../utils/formatters';

const ListCreditsForm = ({ open, onClose, onSuccess }) => {
  const { account, balance, carbonCreditContract } = useWeb3();
  const { setLoading, setError } = useApp();
  
  const [formData, setFormData] = useState({
    amount: '',
    pricePerCredit: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gasEstimate, setGasEstimate] = useState('');

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Estimate gas when both fields are filled
    if (field === 'amount' || field === 'pricePerCredit') {
      if (formData.amount && formData.pricePerCredit && carbonCreditContract) {
        estimateGas();
      }
    }
  };

  const estimateGas = async () => {
    try {
      // This would be implemented with actual gas estimation
      // For now, we'll use a placeholder
      const estimatedGas = parseFloat(formData.amount) * 0.0001; // Placeholder calculation
      setGasEstimate(estimatedGas.toFixed(6));
    } catch (error) {
      console.error('Error estimating gas:', error);
      setGasEstimate('N/A');
    }
  };

  const validateForm = () => {
    const validationErrors = validateListingData(formData.amount, formData.pricePerCredit);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    if (!carbonCreditContract) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      await marketAPI.listCredits(formData.amount, formData.pricePerCredit);
      
      onSuccess?.();
      onClose();
      
      // Reset form
      setFormData({ amount: '', pricePerCredit: '' });
      setErrors({});
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ amount: '', pricePerCredit: '' });
    setErrors({});
    onClose();
  };

  const availableBalance = parseFloat(balance || 0);
  const listingAmount = parseFloat(formData.amount || 0);
  const totalValue = listingAmount * parseFloat(formData.pricePerCredit || 0);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div" fontWeight="600">
          List Carbon Credits for Sale
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create a new listing on the marketplace
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Balance Info */}
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            icon={false}
          >
            <Typography variant="body2" fontWeight="500">
              Available Balance: {formatAmount(availableBalance)} CCO2
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Amount Input */}
            <TextField
              label="Amount to List (CCO2)"
              type="number"
              value={formData.amount}
              onChange={handleChange('amount')}
              error={!!errors.amount}
              helperText={errors.amount}
              required
              fullWidth
              inputProps={{ 
                min: "0.000001",
                max: availableBalance,
                step: "0.000001"
              }}
            />

            {/* Price Input */}
            <TextField
              label="Price per Credit (ETH)"
              type="number"
              value={formData.pricePerCredit}
              onChange={handleChange('pricePerCredit')}
              error={!!errors.pricePerCredit}
              helperText={errors.pricePerCredit}
              required
              fullWidth
              inputProps={{ 
                min: "0.000001",
                step: "0.000001"
              }}
            />

            {/* Summary */}
            {(formData.amount && formData.pricePerCredit) && (
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: 'grey.50', 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Listing Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Amount:</Typography>
                  <Typography variant="body2" fontWeight="600">
                    {formatAmount(formData.amount)} CCO2
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Price per Credit:</Typography>
                  <Typography variant="body2" fontWeight="600">
                    {formatAmount(formData.pricePerCredit)} ETH
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Total Value:</Typography>
                  <Typography variant="body2" fontWeight="600" color="primary.main">
                    {formatAmount(totalValue)} ETH
                  </Typography>
                </Box>
                {gasEstimate && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2">Estimated Gas:</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ~{gasEstimate} ETH
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Validation Warnings */}
            {listingAmount > availableBalance && (
              <Alert severity="warning">
                Listing amount exceeds your available balance
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !formData.amount || !formData.pricePerCredit || listingAmount > availableBalance}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Listing...
              </>
            ) : (
              'List Credits'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ListCreditsForm;