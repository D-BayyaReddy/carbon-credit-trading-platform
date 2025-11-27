import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider
} from '@mui/material';
import {
  AccountBalanceWallet,
  ShoppingCart,
  Cancel
} from '@mui/icons-material';
import { formatAddress, formatAmount, formatPrice, formatDate } from '../../utils/formatters';
import { useWeb3 } from '../../contexts/Web3Context';

const ListingCard = ({ listing, onPurchase, onCancel, showActions = true }) => {
  const { account, carbonCreditContract } = useWeb3();
  
  const {
    id,
    seller,
    amount,
    pricePerCredit,
    totalPrice,
    listingDate,
    active
  } = listing;

  const isOwnListing = seller?.toLowerCase() === account?.toLowerCase();

  const handlePurchase = async () => {
    if (onPurchase) {
      await onPurchase(id, totalPrice);
    }
  };

  const handleCancel = async () => {
    if (onCancel) {
      await onCancel(id);
    }
  };

  if (!active) return null;

  return (
    <Card 
      sx={{ 
        transition: 'all 0.3s ease',
        border: isOwnListing ? '2px solid' : '1px solid',
        borderColor: isOwnListing ? 'primary.main' : 'divider',
        backgroundColor: isOwnListing ? 'primary.light + 04' : 'background.paper',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              {formatAmount(amount)} CCO2
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalanceWallet sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {formatAddress(seller)}
              </Typography>
              {isOwnListing && (
                <Chip label="Your Listing" size="small" color="primary" variant="outlined" />
              )}
            </Box>
          </Box>
          <Chip 
            label="Active" 
            color="success" 
            size="small" 
            variant="outlined"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Pricing */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Price per Credit:
            </Typography>
            <Typography variant="body1" fontWeight="600">
              {formatPrice(pricePerCredit, 'ETH')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total Value:
            </Typography>
            <Typography variant="h6" color="primary.main" fontWeight="700">
              {formatPrice(totalPrice, 'ETH')}
            </Typography>
          </Box>
        </Box>

        {/* Listing Date */}
        <Typography variant="caption" color="text.secondary">
          Listed on {formatDate(listingDate)}
        </Typography>

        {/* Actions */}
        {showActions && (
          <Box sx={{ mt: 3 }}>
            {isOwnListing ? (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<Cancel />}
                onClick={handleCancel}
              >
                Cancel Listing
              </Button>
            ) : (
              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handlePurchase}
                disabled={!carbonCreditContract}
                sx={{
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Purchase Credits
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ListingCard;