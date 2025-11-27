import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  TrendingUp,
  Eco,
  ShowChart,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

import { useWeb3 } from '../contexts/Web3Context';
import { useApp } from '../contexts/AppContext';
import StatsCard from '../components/ui/StatsCard';
import PerformanceChart from '../components/charts/PerformanceChart';
import TradingVolumeChart from '../components/charts/TradingVolumeChart';
import EnvironmentalImpactChart from '../components/charts/EnvironmentalImpactChart';
import { analyticsAPI, marketAPI } from '../services/api';
import { formatAmount, formatLargeNumber, formatCO2Reduction } from '../utils/formatters';

const Analytics = () => {
  const { isConnected, account } = useWeb3();
  const { setLoading, setError } = useApp();
  
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [environmentalImpact, setEnvironmentalImpact] = useState(null);
  const [tradingVolume, setTradingVolume] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeframe]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [metricsRes, impactRes, volumeRes] = await Promise.all([
        analyticsAPI.getPerformanceMetrics(30),
        analyticsAPI.getEnvironmentalImpact(),
        marketAPI.getTradingVolume(timeframe)
      ]);

      setPerformanceMetrics(metricsRes.data.metrics);
      setEnvironmentalImpact(impactRes.data);
      setTradingVolume(volumeRes.data.volumeData);

      if (isConnected && account) {
        const userAnalyticsRes = await analyticsAPI.getUserAnalytics();
        setUserAnalytics(userAnalyticsRes.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const platformStats = [
    {
      title: 'Transparency',
      value: 95.5,
      subtitle: 'Blockchain transparency score',
      icon: <AnalyticsIcon sx={{ color: 'success.main' }} />,
      color: 'success',
      progress: 95.5
    },
    {
      title: 'Transaction Latency',
      value: 2.3,
      subtitle: 'Average confirmation time',
      icon: <ShowChart sx={{ color: 'info.main' }} />,
      color: 'info',
      progress: 97.7 // Inverse for better visualization
    },
    {
      title: 'System Uptime',
      value: 99.9,
      subtitle: 'Platform availability',
      icon: <TrendingUp sx={{ color: 'primary.main' }} />,
      color: 'primary',
      progress: 99.9
    },
    {
      title: 'Fraud Detection',
      value: 96.5,
      subtitle: 'Accuracy rate',
      icon: <Eco sx={{ color: 'warning.main' }} />,
      color: 'warning',
      progress: 96.5
    }
  ];

  const environmentalStats = environmentalImpact ? [
    {
      title: 'Total CO₂ Reduction',
      value: environmentalImpact.total?.totalCO2Reduction || 0,
      subtitle: 'Tons of CO₂ reduced',
      icon: <Eco sx={{ color: 'success.main' }} />,
      color: 'success'
    },
    {
      title: 'Area Protected',
      value: environmentalImpact.total?.totalAreaProtected || 0,
      subtitle: 'Hectares conserved',
      icon: <TrendingUp sx={{ color: 'primary.main' }} />,
      color: 'primary'
    },
    {
      title: 'Verified Projects',
      value: environmentalImpact.total?.totalProjects || 0,
      subtitle: 'Active initiatives',
      icon: <AnalyticsIcon sx={{ color: 'info.main' }} />,
      color: 'info'
    }
  ] : [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Platform Analytics
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Comprehensive insights into platform performance and environmental impact
        </Typography>
      </Box>

      {/* Platform Performance Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {platformStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Environmental Impact Stats */}
      {environmentalStats.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Environmental Impact
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {environmentalStats.map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <StatsCard {...stat} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* User Analytics */}
      {isConnected && userAnalytics && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Your Trading Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Transactions"
                value={userAnalytics.transactionStats?.totalTransactions || 0}
                subtitle="All-time trades"
                color="primary"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Trading Volume"
                value={userAnalytics.transactionStats?.totalVolume || 0}
                subtitle="Total value traded"
                color="success"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Average Price"
                value={userAnalytics.transactionStats?.averagePrice || 0}
                subtitle="Per credit"
                color="info"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Platform Rank"
                value={userAnalytics.overallRank || 'N/A'}
                subtitle="Among all traders"
                color="warning"
                size="small"
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Charts Section */}
      <Grid container spacing={4}>
        {/* Performance Metrics Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Platform Performance Metrics
              </Typography>
            </Box>
            <PerformanceChart 
              data={performanceMetrics} 
              height={400}
            />
          </Paper>
        </Grid>

        {/* Environmental Impact Chart */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Environmental Impact by Project Type
            </Typography>
            {environmentalImpact && (
              <EnvironmentalImpactChart 
                data={environmentalImpact.byProjectType} 
                height={400}
              />
            )}
          </Paper>
        </Grid>

        {/* Trading Volume Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Trading Volume Analytics
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={timeframe}
                  label="Timeframe"
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <MenuItem value="24h">24 Hours</MenuItem>
                  <MenuItem value="7d">7 Days</MenuItem>
                  <MenuItem value="30d">30 Days</MenuItem>
                  <MenuItem value="1y">1 Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TradingVolumeChart 
              data={tradingVolume} 
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Detailed Metrics */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Detailed Performance Metrics
        </Typography>
        <Grid container spacing={3}>
          {performanceMetrics.slice(-1).map((metric, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Throughput
                    </Typography>
                    <Typography variant="h4" color="primary.main" fontWeight="600">
                      {metric.throughput} TPS
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transactions per second
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Credit Accuracy
                    </Typography>
                    <Typography variant="h4" color="success.main" fontWeight="600">
                      {metric.creditAccuracy}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verification accuracy rate
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Consensus Efficiency
                    </Typography>
                    <Typography variant="h4" color="info.main" fontWeight="600">
                      {metric.consensusEfficiency}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Blockchain efficiency
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Analytics;