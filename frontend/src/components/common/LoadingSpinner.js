import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
import { useApp } from '../../contexts/AppContext';

const LoadingSpinner = () => {
  const { isLoading } = useApp();

  if (!isLoading) return null;

  return (
    <Backdrop
      open={isLoading}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2
      }}
    >
      <CircularProgress color="inherit" size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading...
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Please wait while we process your request
      </Typography>
    </Backdrop>
  );
};

export default LoadingSpinner;