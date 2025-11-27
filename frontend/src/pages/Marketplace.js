import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add,
  Search,
  FilterList
} from '@mui/icons-material';

import { useWeb3 } from '../contexts/Web3Context';
import { useApp } from '../contexts/AppContext';
import StatsCard from '../components/ui/StatsCard';
import ListingCard from '../components/ui/ListingCard';
import ListCreditsForm from '../components/forms/ListCreditsForm';
import { marketAPI } from '../services/api';
import { formatAmount, formatPrice } from '../utils/formatters';

const Marketplace = () => {
  const { isConnected, account } = useWeb3();
  const { setLoading, setError } = useApp();
  
  const [activeTab, setActiveTab] = useState(0);
  const [listings, setListings] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [marketOverview, setMarketOverview] = useState(null);
  const [showListForm, setShowListForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadMarketData();
  }, [isConnected, account]);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const [overviewRes, listingsRes] = await Promise.all([
        marketAPI.getMarketOverview(),
        marketAPI.getActiveListings()
      ]);

      setMarketOverview(overviewRes.data);
      setListings(listingsRes.data.listings);

      if (isConnected && account) {
        const userListingsRes = await marketAPI.getUserListings();
        setUserListings(userListingsRes.data.listings);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (listingId, totalPrice) => {
    if (!isConnected) {
      setError('Please connect your wallet to make a purchase');
      return;
    }

    setLoading(true);
    try {
      await marketAPI.purchaseCredits(listingId, totalPrice);
      setError('Purchase completed successfully!');
      loadMarketData(); // Refresh data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelListing = async (listingId) => {
    setLoading(true);
    try {
      await marketAPI.cancelListing(listingId);
      setError('Listing cancelled successfully!');
      loadMarketData(); // Refresh data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleListSuccess = () => {
    setError('Credits listed successfully!');
    loadMarketData();
  };

  // Filter and sort listings
  const filteredListings = listings.filter(listing => 
    listing.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatAmount(listing.amount).includes(searchTerm) ||
    formatAmount(listing.pricePerCredit).includes(searchTerm)
  );

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.pricePerCredit - b.pricePerCredit;
      case 'price-high':
        return b.pricePerCredit - a.pricePerCredit;
      case 'amount-low':
        return a.amount - b.amount;
      case 'amount-high':
        return b.amount - a.amount;
      case 'newest':
      default:
        return new Date(b.listingDate) - new Date(a.listingDate);
    }
  });

  const marketStats = marketOverview ? [
    {
      title: 'Total Supply',
      value: marketOverview.totalSupply,
      subtitle: 'Available credits',
      color: 'primary'
    },
    {
      title: 'Active Listings',
      value: marketOverview.activeListings,
      subtitle: 'On marketplace',
      color: 'secondary'
    },
    {
      title: 'Total Volume',
      value: marketOverview.totalVolume,
      subtitle: 'Trading volume',
      color: 'success'
    },
    {
      title: 'Avg Price',
      value: marketOverview.averagePrice,
      subtitle: 'Per credit',
      color: 'info'
    }
  ] : [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Carbon Credit Marketplace
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Buy and sell carbon credits in a transparent, efficient marketplace
        </Typography>
      </Box>

      {/* Market Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {marketStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        {/* Header with Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ minHeight: 'auto' }}
          >
            <Tab label={`All Listings (${listings.length})`} />
            {isConnected && <Tab label={`My Listings (${userListings.length})`} />}
          </Tabs>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <TextField
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />

            {/* Sort */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="amount-low">Amount: Low to High</MenuItem>
                <MenuItem value="amount-high">Amount: High to Low</MenuItem>
              </Select>
            </FormControl>

            {/* List Credits Button */}
            {isConnected && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowListForm(true)}
                sx={{ minWidth: 'auto' }}
              >
                List Credits
              </Button>
            )}
          </Box>
        </Box>

        {/* Listings Grid */}
        {activeTab === 0 ? (
          <Grid container spacing={3}>
            {sortedListings.length > 0 ? (
              sortedListings.map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing.id}>
                  <ListingCard
                    listing={listing}
                    onPurchase={handlePurchase}
                    onCancel={handleCancelListing}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No active listings found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Be the first to list credits for sale'}
                  </Typography>
                  {isConnected && (
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setShowListForm(true)}
                      sx={{ mt: 2 }}
                    >
                      List Credits
                    </Button>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        ) : (
          // My Listings Tab
          <Grid container spacing={3}>
            {userListings.length > 0 ? (
              userListings.map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing.id}>
                  <ListingCard
                    listing={listing}
                    onPurchase={handlePurchase}
                    onCancel={handleCancelListing}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    You don't have any active listings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start selling your carbon credits on the marketplace
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowListForm(true)}
                  >
                    List Credits
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Paper>

      {/* List Credits Dialog */}
      <ListCreditsForm
        open={showListForm}
        onClose={() => setShowListForm(false)}
        onSuccess={handleListSuccess}
      />
    </Container>
  );
};

export default Marketplace;