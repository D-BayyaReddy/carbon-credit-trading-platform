import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button
} from '@mui/material';
import {
  TrendingUp,
  Eco,
  AccountBalance,
  ShowChart,
  Add
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useWeb3 } from '../contexts/Web3Context';
import { useApp } from '../contexts/AppContext';
import StatsCard from '../components/ui/StatsCard';
import ProjectCard from '../components/ui/ProjectCard';
import PerformanceChart from '../components/charts/PerformanceChart';
import { projectsAPI, marketAPI, analyticsAPI } from '../services/api';
import { formatAmount, formatLargeNumber, formatCO2Reduction } from '../utils/formatters';

const Dashboard = () => {
  const { isConnected, account } = useWeb3();
  const { setLoading, setError, projects, marketData, setProjects, setMarketData } = useApp();
  
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [userPortfolio, setUserPortfolio] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [isConnected, account]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const promises = [
        projectsAPI.getProjects({ limit: 6 }),
        marketAPI.getMarketOverview(),
        analyticsAPI.getPerformanceMetrics(7)
      ];

      if (isConnected && account) {
        promises.push(marketAPI.getUserPortfolio());
      }

      const [projectsRes, marketRes, metricsRes, portfolioRes] = await Promise.all(promises);

      setProjects(projectsRes.data.projects);
      setMarketData(marketRes.data);
      setPerformanceMetrics(metricsRes.data.metrics);
      
      if (portfolioRes) {
        setUserPortfolio(portfolioRes.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Credits',
      value: marketData?.totalSupply || 0,
      subtitle: 'Available for trading',
      icon: <Eco sx={{ color: 'primary.main' }} />,
      color: 'primary'
    },
    {
      title: 'Market Volume',
      value: marketData?.totalVolume || 0,
      subtitle: 'Total trading volume',
      icon: <TrendingUp sx={{ color: 'success.main' }} />,
      color: 'success'
    },
    {
      title: 'Active Projects',
      value: projects.length,
      subtitle: 'Verified initiatives',
      icon: <AccountBalance sx={{ color: 'secondary.main' }} />,
      color: 'secondary'
    },
    {
      title: 'Daily Transactions',
      value: marketData?.recentTransactions?.length || 0,
      subtitle: '24h trading activity',
      icon: <ShowChart sx={{ color: 'info.main' }} />,
      color: 'info'
    }
  ];

  const portfolioStats = userPortfolio ? [
    {
      title: 'Your Balance',
      value: userPortfolio.balance,
      subtitle: 'Carbon credits owned',
      icon: <Eco sx={{ color: 'primary.main' }} />,
      color: 'primary'
    },
    {
      title: 'Portfolio Value',
      value: userPortfolio.portfolioValue,
      subtitle: 'Current market value',
      icon: <AccountBalance sx={{ color: 'success.main' }} />,
      color: 'success'
    },
    {
      title: 'Active Listings',
      value: userPortfolio.activeListings?.length || 0,
      subtitle: 'Your marketplace listings',
      icon: <ShowChart sx={{ color: 'warning.main' }} />,
      color: 'warning'
    }
  ] : [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome to CarbonCredit DApp
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Trade carbon credits transparently on the blockchain. Support environmental projects worldwide.
        </Typography>

        {!isConnected && (
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Connect Your Wallet to Get Started
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Connect your Ethereum wallet to start trading carbon credits and supporting environmental projects.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Platform Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* User Portfolio Stats */}
      {isConnected && userPortfolio && (
        <>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Your Portfolio
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {portfolioStats.map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <StatsCard {...stat} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Grid container spacing={4}>
        {/* Performance Metrics */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Platform Performance
              </Typography>
              <Button 
                component={Link} 
                to="/analytics" 
                variant="outlined"
                size="small"
              >
                View Detailed Analytics
              </Button>
            </Box>
            <PerformanceChart data={performanceMetrics} height={300} />
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                component={Link}
                to="/marketplace"
                variant="contained"
                size="large"
                startIcon={<ShowChart />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Browse Marketplace
              </Button>
              <Button
                component={Link}
                to="/projects"
                variant="outlined"
                size="large"
                startIcon={<Eco />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Explore Projects
              </Button>
              {isConnected && (
                <Button
                  component={Link}
                  to="/portfolio"
                  variant="outlined"
                  size="large"
                  startIcon={<AccountBalance />}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  View Portfolio
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Featured Projects */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Featured Environmental Projects
              </Typography>
              <Button 
                component={Link} 
                to="/projects" 
                variant="outlined"
                startIcon={<Add />}
              >
                View All Projects
              </Button>
            </Box>
            
            {projects.length > 0 ? (
              <Grid container spacing={3}>
                {projects.slice(0, 3).map((project) => (
                  <Grid item xs={12} md={4} key={project.projectId}>
                    <ProjectCard 
                      project={project} 
                      showActions={true}
                      onViewDetails={(project) => {
                        // Navigate to project details
                        window.location.href = `/projects/${project.projectId}`;
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No projects available at the moment.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;