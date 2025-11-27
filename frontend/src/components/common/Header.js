import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  Container,
  useScrollTrigger,
  Slide
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EcoIcon from '@mui/icons-material/Eco';
import { useWeb3 } from '../../contexts/Web3Context';
import { formatAddress, formatAmount } from '../../utils/formatters';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const { account, isConnected, connectWallet, disconnectWallet, balance } = useWeb3();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/projects', label: 'Projects' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/analytics', label: 'Analytics' }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <HideOnScroll>
      <AppBar position="sticky" elevation={2}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <EcoIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                CarbonCredit DApp
              </Typography>
            </Box>

            {/* Navigation */}
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  variant={isActivePath(item.path) ? 'outlined' : 'text'}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    minWidth: 'auto'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Wallet Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isConnected ? (
                <>
                  <Chip
                    icon={<AccountBalanceWalletIcon />}
                    label={`${formatAmount(balance)} CCO2`}
                    variant="outlined"
                    sx={{ 
                      color: 'white', 
                      borderColor: 'white',
                      fontWeight: 500
                    }}
                  />
                  <Chip
                    label={formatAddress(account)}
                    variant="outlined"
                    sx={{ 
                      color: 'white', 
                      borderColor: 'white',
                      fontWeight: 500
                    }}
                  />
                  <Button
                    color="inherit"
                    onClick={disconnectWallet}
                    sx={{ 
                      border: '1px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AccountBalanceWalletIcon />}
                  onClick={connectWallet}
                  sx={{
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Connect Wallet
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;