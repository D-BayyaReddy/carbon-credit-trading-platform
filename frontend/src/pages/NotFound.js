import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material';
import {
  Home,
  SearchOff
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container 
      maxWidth="md" 
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
          p: 8, 
          textAlign: 'center',
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 4
        }}
      >
        <SearchOff sx={{ fontSize: 96, color: 'text.secondary', mb: 3 }} />
        
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
          The page you're looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to the homepage.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            startIcon={<Home />}
            sx={{ px: 4 }}
          >
            Go to Homepage
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </Box>

        {/* Additional Help */}
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Looking for something specific?
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
            <Button component={Link} to="/marketplace" variant="text" size="small">
              Marketplace
            </Button>
            <Button component={Link} to="/projects" variant="text" size="small">
              Projects
            </Button>
            <Button component={Link} to="/portfolio" variant="text" size="small">
              Portfolio
            </Button>
            <Button component={Link} to="/analytics" variant="text" size="small">
              Analytics
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;