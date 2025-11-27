import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { formatDate, formatPercentage } from '../../utils/formatters';

const PerformanceChart = ({ data, height = 300 }) => {
  const theme = useTheme();

  const chartData = data.map(metric => ({
    ...metric,
    timestamp: new Date(metric.timestamp).toLocaleDateString()
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" fontWeight="600" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color }}
            >
              {entry.name}: {formatPercentage(entry.value)}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            dataKey="timestamp" 
            stroke={theme.palette.text.secondary}
            fontSize={12}
          />
          <YAxis 
            stroke={theme.palette.text.secondary}
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="transparency"
            stroke={theme.palette.success.main}
            strokeWidth={2}
            name="Transparency"
            dot={{ fill: theme.palette.success.main, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="uptime"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            name="Uptime"
            dot={{ fill: theme.palette.primary.main, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="creditAccuracy"
            stroke={theme.palette.info.main}
            strokeWidth={2}
            name="Credit Accuracy"
            dot={{ fill: theme.palette.info.main, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="fraudDetection"
            stroke={theme.palette.warning.main}
            strokeWidth={2}
            name="Fraud Detection"
            dot={{ fill: theme.palette.warning.main, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PerformanceChart;