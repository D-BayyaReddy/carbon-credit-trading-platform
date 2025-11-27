import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Button,
  CardActions,
  Avatar
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  Verified,
  Eco
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { 
  formatAmount, 
  formatCO2Reduction, 
  formatArea, 
  formatPercentage,
  formatProjectType,
  formatDate
} from '../../utils/formatters';
import { PROJECT_STATUS_LABELS, CHART_COLORS } from '../../utils/constants';

const ProjectCard = ({ project, showActions = false, onViewDetails }) => {
  const {
    projectId,
    name,
    description,
    location,
    projectType,
    status,
    totalCredits,
    creditsIssued,
    co2Reduction,
    areaProtected,
    vintageYear,
    verificationBody,
    createdAt
  } = project;

  const progress = (creditsIssued / totalCredits) * 100;
  const availableCredits = totalCredits - creditsIssued;

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'active': return 'primary';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getProjectIcon = (type) => {
    switch (type) {
      case 'reforestation': return '🌳';
      case 'renewable_energy': return '☀️';
      case 'mangrove_restoration': return '🌊';
      case 'carbon_capture': return '🏭';
      default: return '🌍';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: CHART_COLORS[projectType.toUpperCase()] || CHART_COLORS.PRIMARY,
                width: 40,
                height: 40
              }}
            >
              <Typography variant="body1">
                {getProjectIcon(projectType)}
              </Typography>
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                {name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={PROJECT_STATUS_LABELS[status] || status}
                  size="small"
                  color={getStatusColor(status)}
                  variant={status === 'verified' ? 'filled' : 'outlined'}
                />
                <Chip
                  label={formatProjectType(projectType)}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Description */}
        {description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            {description.length > 120 
              ? `${description.substring(0, 120)}...` 
              : description
            }
          </Typography>
        )}

        {/* Location and Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {vintageYear}
            </Typography>
          </Box>
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Credits Issued
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {formatAmount(creditsIssued)} / {formatAmount(totalCredits)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: CHART_COLORS[projectType.toUpperCase()] || CHART_COLORS.PRIMARY,
                borderRadius: 4
              }
            }}
          />
        </Box>

        {/* Impact Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              CO₂ Reduction
            </Typography>
            <Typography variant="body1" fontWeight="600">
              {formatCO2Reduction(co2Reduction)}
            </Typography>
          </Box>
          {areaProtected > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Area Protected
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {formatArea(areaProtected)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Verification */}
        {verificationBody && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Verified sx={{ fontSize: 18, color: 'success.main' }} />
            <Typography variant="body2" color="text.secondary">
              Verified by {verificationBody}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => onViewDetails && onViewDetails(project)}
            startIcon={<Eco />}
          >
            View Details
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default ProjectCard;