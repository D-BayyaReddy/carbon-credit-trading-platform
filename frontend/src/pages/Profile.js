import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  AccountCircle
} from '@mui/icons-material';

import { useWeb3 } from '../contexts/Web3Context';
import { useApp } from '../contexts/AppContext';
import { authAPI } from '../services/api';
import { formatAddress, formatDate } from '../utils/formatters';

const Profile = () => {
  const { account, isConnected } = useWeb3();
  const { setLoading, setError, user, setUser } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    company: ''
  });
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        company: user.company || ''
      });
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!isConnected) return;
    
    setLoading(true);
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadUserProfile();
    }
  }, [isConnected]);

  const handleEdit = () => {
    setIsEditing(true);
    setSaveMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      company: user?.company || ''
    });
    setSaveMessage('');
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await authAPI.updateProfile(formData);
      setUser(response.data.user);
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  if (!isConnected) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <AccountCircle sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Connect Your Wallet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please connect your wallet to view and edit your profile.
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!user) {
    return null; // Loading handled by global loader
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Your Profile
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your account information and preferences
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Profile Information
              </Typography>
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>

            {saveMessage && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {saveMessage}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Wallet Address (Read-only) */}
              <Grid item xs={12}>
                <TextField
                  label="Wallet Address"
                  value={user.walletAddress}
                  fullWidth
                  disabled
                  helperText="Your Ethereum wallet address (cannot be changed)"
                />
              </Grid>

              {/* Username */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Username"
                  value={formData.username}
                  onChange={handleChange('username')}
                  fullWidth
                  disabled={!isEditing}
                  helperText={isEditing ? "Choose a display name" : ""}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  fullWidth
                  disabled={!isEditing}
                  helperText={isEditing ? "Your contact email" : ""}
                />
              </Grid>

              {/* Company */}
              <Grid item xs={12}>
                <TextField
                  label="Company/Organization"
                  value={formData.company}
                  onChange={handleChange('company')}
                  fullWidth
                  disabled={!isEditing}
                  helperText={isEditing ? "Your company or organization name" : ""}
                />
              </Grid>

              {/* Role */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Role"
                  value={user.role}
                  fullWidth
                  disabled
                  helperText="Your platform role"
                />
              </Grid>

              {/* Member Since */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Member Since"
                  value={user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  fullWidth
                  disabled
                  helperText="When you joined the platform"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Account Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
            >
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {user.username || 'Unnamed User'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formatAddress(user.walletAddress)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Role: <Typography component="span" variant="body2" fontWeight="600" color="primary">
                  {user.role}
                </Typography>
              </Typography>
              
              {user.company && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Company: <Typography component="span" variant="body2" fontWeight="600">
                    {user.company}
                  </Typography>
                </Typography>
              )}
              
              {user.email && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email: <Typography component="span" variant="body2">
                    {user.email}
                  </Typography>
                </Typography>
              )}

              {user.lastLogin && (
                <Typography variant="body2" color="text.secondary">
                  Last Login: <Typography component="span" variant="body2">
                    {formatDate(user.lastLogin)}
                  </Typography>
                </Typography>
              )}
            </Box>
          </Paper>

          {/* Quick Stats Card */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Account Status
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Status:
                </Typography>
                <Typography variant="body2" fontWeight="600" color="success.main">
                  Active
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Verification:
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {user.role === 'verified' ? 'Verified' : 'Basic'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Member Since:
                </Typography>
                <Typography variant="body2">
                  {user.createdAt ? formatDate(user.createdAt, 'MMM yyyy') : 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;