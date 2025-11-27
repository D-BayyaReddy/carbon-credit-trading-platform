import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { formatCO2Reduction, formatLargeNumber } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/constants';

const EnvironmentalImpactChart = ({ data, height = 300 }) => {
  const theme = useTheme();

  const chartData = data.map(item => ({
    name: item.projectType,
    value: item.totalCO2Reduction,
    area: item.totalAreaProtected,
    projects: item.projectCount
  }));

  const COLORS = [
    CHART_COLORS.REFORESTATION,
    CHART_COLORS.RENEWABLE_ENERGY,
    CHART_COLORS.MANGROVE_RESTORATION,
    CHART_COLORS.CARBON_CAPTURE
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" fontWeight="600" gutterBottom>
            {data.name}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
            CO₂ Reduction: {formatCO2Reduction(data.value)}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.primary.main }}>
            Area: {formatLargeNumber(data.area)} ha
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Projects: {data.projects}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                borderRadius: '50%'
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default EnvironmentalImpactChart;