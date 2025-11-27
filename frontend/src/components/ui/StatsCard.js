import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip
} from '@mui/material';
import { formatAmount, formatLargeNumber, formatPercentage } from '../../utils/formatters';

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'primary',
  progress,
  trend,
  size = 'medium'
}) => {
  const getTrendColor = (trendValue) => {
    if (trendValue > 0) return 'success';
    if (trendValue < 0) return 'error';
    return 'default';
  };

  const getTrendIcon = (trendValue) => {
    if (trendValue > 0) return '↗';
    if (trendValue < 0) return '↘';
    return '→';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardContent sx={{ p: size === 'small' ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography 
              variant={size === 'small' ? 'body2' : 'body1'} 
              color="text.secondary" 
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography 
              variant={size === 'small' ? 'h5' : 'h4'} 
              component="div"
              sx={{ 
                fontWeight: 600,
                color: `${color}.main`
              }}
            >
              {typeof value === 'number' ? formatLargeNumber(value) : value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>

        {subtitle && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: progress || trend ? 2 : 0 }}
          >
            {subtitle}
          </Typography>
        )}

        {progress !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatPercentage(progress)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: `${color}.main`,
                  borderRadius: 3
                }
              }}
            />
          </Box>
        )}

        {trend !== undefined && trend !== null && (
          <Chip
            label={`${getTrendIcon(trend)} ${Math.abs(trend)}%`}
            size="small"
            color={getTrendColor(trend)}
            variant="outlined"
            sx={{ 
              fontWeight: 500,
              borderWidth: 2
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;