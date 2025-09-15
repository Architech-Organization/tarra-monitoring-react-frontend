import React from 'react';
import { Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SensorHealthData } from '../../types';

interface SensorOverviewChartProps {
  data: SensorHealthData[];
  height?: number;
}

export const SensorOverviewChart: React.FC<SensorOverviewChartProps> = ({ 
  data, 
  height = 300 
}) => {
  const theme = useTheme();

  // Transform data for pie chart
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    const statusCounts = data.reduce((acc, sensor) => {
      acc[sensor.status] = (acc[sensor.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: ((count / data.length) * 100).toFixed(1),
    }));
  }, [data]);

  // Color mapping for sensor status
  const colors = {
    healthy: theme.palette.success.main,
    warning: theme.palette.warning.main,
    critical: theme.palette.error.main,
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            p: 2,
            boxShadow: theme.shadows[4],
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold', textTransform: 'capitalize' }}>
            {data.name}: {data.value} sensors
          </p>
          <p style={{ margin: '4px 0', color: theme.palette.text.secondary }}>
            {data.percentage}% of total
          </p>
        </Box>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: theme.palette.text.secondary,
        }}
      >
        No sensor health data available
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[entry.name as keyof typeof colors] || theme.palette.primary.main} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};