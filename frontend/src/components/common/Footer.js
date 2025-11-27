import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton
} from '@mui/material';
import { GitHub, Twitter, LinkedIn, Email } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 4,
        mt: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              CarbonCredit DApp
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              A blockchain-based carbon credit trading platform creating transparent, 
              efficient, and trustworthy environmental markets for a sustainable future.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                color="inherit" 
                component="a" 
                href="https://github.com" 
                target="_blank"
              >
                <GitHub />
              </IconButton>
              <IconButton 
                color="inherit" 
                component="a" 
                href="https://twitter.com" 
                target="_blank"
              >
                <Twitter />
              </IconButton>
              <IconButton 
                color="inherit" 
                component="a" 
                href="https://linkedin.com" 
                target="_blank"
              >
                <LinkedIn />
              </IconButton>
              <IconButton 
                color="inherit" 
                component="a" 
                href="mailto:info@carboncredit.com"
              >
                <Email />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/marketplace" color="inherit" underline="hover">
                Marketplace
              </Link>
              <Link href="/projects" color="inherit" underline="hover">
                Projects
              </Link>
              <Link href="/analytics" color="inherit" underline="hover">
                Analytics
              </Link>
              <Link href="/portfolio" color="inherit" underline="hover">
                Portfolio
              </Link>
            </Box>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/docs" color="inherit" underline="hover">
                Documentation
              </Link>
              <Link href="/faq" color="inherit" underline="hover">
                FAQ
              </Link>
              <Link href="/privacy" color="inherit" underline="hover">
                Privacy Policy
              </Link>
              <Link href="/terms" color="inherit" underline="hover">
                Terms of Service
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            mt: 4,
            pt: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 CarbonCredit DApp. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Building a sustainable future with blockchain technology
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;