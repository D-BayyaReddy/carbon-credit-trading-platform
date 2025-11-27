import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { formatAmount, formatPrice } from '../../utils/formatters';

const TradingVolumeChart = ({ data, height = 300 }) => {
  const theme = useTheme();

  const chartData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString()
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" fontWeight="600" gutterBottom>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.primary.main }}>
            Volume: {formatPrice(payload[0].value)}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Transactions: {payload[0].payload.transactions}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Avg Price: {formatPrice(payload[0].payload.averagePrice, 'ETH')}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="date" 
            stroke={theme.palette.text.secondary}
            fontSize={12}
          />
          <YAxis 
            stroke={theme.palette.text.secondary}
            fontSize={12}
            tickFormatter={(value) => formatAmount(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="volume" 
            fill={theme.palette.primary.main}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TradingVolumeChart;