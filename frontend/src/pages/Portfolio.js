import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  ShoppingCart,
  Receipt
} from '@mui/icons-material';

import { useWeb3 } from '../contexts/Web3Context';
import { useApp } from '../contexts/AppContext';
import StatsCard from '../components/ui/StatsCard';
import { marketAPI } from '../services/api';
import { formatAmount, formatPrice, formatDate, formatAddress } from '../utils/formatters';
import { TRANSACTION_TYPE_LABELS, TRANSACTION_STATUS_LABELS } from '../utils/constants';

const Portfolio = () => {
  const { isConnected, account } = useWeb3();
  const { setLoading, setError } = useApp();
  
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (isConnected && account) {
      loadPortfolioData();
    }
  }, [isConnected, account]);

  const loadPortfolioData = async () => {
    setLoading(true);
    try {
      const [portfolioRes, transactionsRes, listingsRes] = await Promise.all([
        marketAPI.getUserPortfolio(),
        marketAPI.getUserTransactions({ limit: 20 }),
        marketAPI.getUserListings()
      ]);

      setPortfolio(portfolioRes.data);
      setTransactions(transactionsRes.data.transactions);
      setUserListings(listingsRes.data.listings);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'purchase': return 'success';
      case 'transfer': return 'info';
      case 'issuance': return 'warning';
      case 'retirement': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  if (!isConnected) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <AccountBalanceWallet sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Connect Your Wallet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please connect your wallet to view your portfolio and transaction history.
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!portfolio) {
    return null; // Loading handled by global loader
  }

  const portfolioStats = [
    {
      title: 'Carbon Credits',
      value: portfolio.balance,
      subtitle: 'Current balance',
      icon: <AccountBalanceWallet sx={{ color: 'primary.main' }} />,
      color: 'primary'
    },
    {
      title: 'Portfolio Value',
      value: portfolio.portfolioValue,
      subtitle: 'Market value',
      icon: <TrendingUp sx={{ color: 'success.main' }} />,
      color: 'success'
    },
    {
      title: 'Total Invested',
      value: portfolio.totalSpent,
      subtitle: 'Total purchases',
      icon: <ShoppingCart sx={{ color: 'info.main' }} />,
      color: 'info'
    },
    {
      title: 'Net Performance',
      value: portfolio.performance,
      subtitle: 'Profit/Loss',
      icon: <Receipt sx={{ color: portfolio.performance >= 0 ? 'success.main' : 'error.main' }} />,
      color: portfolio.performance >= 0 ? 'success' : 'error',
      trend: portfolio.performance >= 0 ? 5 : -5 // Example trend
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Your Portfolio
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your carbon credit investments and track your environmental impact
        </Typography>
      </Box>

      {/* Portfolio Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {portfolioStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Active Listings */}
      {portfolio.activeListings && portfolio.activeListings.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Active Listings ({portfolio.activeListings.length})
          </Typography>
          <Grid container spacing={2}>
            {portfolio.activeListings.map((listing, index) => (
              <Grid item xs={12} md={6} key={listing.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {formatAmount(listing.amount)} CCO2
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatPrice(listing.pricePerCredit, 'ETH')} per credit
                        </Typography>
                      </Box>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Total: {formatPrice(listing.amount * listing.pricePerCredit, 'ETH')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Tabs for Transactions and Listings */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label={`Transactions (${transactions.length})`} />
            <Tab label={`All Listings (${userListings.length})`} />
          </Tabs>
        </Box>

        {/* Transactions Tab */}
        {activeTab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total Value</TableCell>
                  <TableCell>Counterparty</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Chip
                        label={TRANSACTION_TYPE_LABELS[transaction.transactionType]}
                        color={getTransactionColor(transaction.transactionType)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {formatAmount(transaction.amount)} CCO2
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatPrice(transaction.price, 'ETH')}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {formatPrice(transaction.totalValue, 'ETH')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.fromAddress === account ? 
                          `To: ${formatAddress(transaction.toAddress)}` :
                          `From: ${formatAddress(transaction.fromAddress)}`
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatDate(transaction.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={TRANSACTION_STATUS_LABELS[transaction.status]}
                        color={getStatusColor(transaction.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {transactions.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No transactions found
                </Typography>
              </Box>
            )}
          </TableContainer>
        )}

        {/* Listings Tab */}
        {activeTab === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Listed Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userListings.map((listing) => (
                  <TableRow key={listing.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {formatAmount(listing.amount)} CCO2
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatPrice(listing.pricePerCredit, 'ETH')}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {formatPrice(listing.amount * listing.pricePerCredit, 'ETH')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={listing.active ? 'Active' : 'Inactive'}
                        color={listing.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {formatDate(listing.listingDate)}
                    </TableCell>
                    <TableCell>
                      {listing.active && (
                        <Button size="small" variant="outlined" color="error">
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {userListings.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No listings found
                </Typography>
              </Box>
            )}
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default Portfolio;