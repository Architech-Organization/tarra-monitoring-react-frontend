import React from 'react';
import { Box, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { VibrationTrendData } from '../../types';

interface VibrationTrendChartProps {
  data: VibrationTrendData[];
  height?: number;
}

export const VibrationTrendChart: React.FC<VibrationTrendChartProps> = ({ 
  data, 
  height = 300 
}) => {
  const theme = useTheme();

  // Transform data for chart
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    // Group by timestamp and aggregate PPV values by location
    const grouped = data.reduce((acc: any[], item) => {
      const timestamp = format(parseISO(item.timestamp), 'HH:mm');
      const existingItem = acc.find(d => d.time === timestamp);
      
      if (existingItem) {
        existingItem[`ppv_${item.location}`] = Math.max(
          existingItem[`ppv_${item.location}`] || 0, 
          item.ppv_max
        );
        existingItem[`freq_${item.location}`] = item.frequency;
      } else {
        acc.push({
          time: timestamp,
          timestamp: item.timestamp,
          [`ppv_${item.location}`]: item.ppv_max,
          [`freq_${item.location}`]: item.frequency,
        });
      }
      
      return acc;
    }, []);

    return grouped.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [data]);

  // Get unique locations for color mapping
  const locations = React.useMemo(() => {
    return [...new Set(data.map(item => item.location))];
  }, [data]);

  // Color palette
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.success.main,
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color, margin: '4px 0' }}>
              {`${entry.dataKey.replace('ppv_', '')}: ${entry.value.toFixed(2)} mm/s`}
            </p>
          ))}
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
        No vibration trend data available
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="time" 
            stroke={theme.palette.text.secondary}
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            label={{ value: 'PPV (mm/s)', angle: -90, position: 'insideLeft' }}
            stroke={theme.palette.text.secondary}
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {locations.map((location, index) => (
            <Line
              key={location}
              type="monotone"
              dataKey={`ppv_${location}`}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              name={location}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};