import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  EventNote as EventIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { RecentEventData, EventType } from '../../types';

interface RecentEventsTableProps {
  data: RecentEventData[];
  maxRows?: number;
}

export const RecentEventsTable: React.FC<RecentEventsTableProps> = ({ 
  data, 
  maxRows = 10 
}) => {
  const theme = useTheme();

  const getSeverityChip = (severity: string) => {
    const config = {
      low: { color: 'info' as const, label: 'Low' },
      medium: { color: 'warning' as const, label: 'Medium' },
      high: { color: 'error' as const, label: 'High' },
      critical: { color: 'error' as const, label: 'Critical' },
    };

    const severityConfig = config[severity as keyof typeof config] || config.medium;

    return (
      <Chip
        label={severityConfig.label}
        color={severityConfig.color}
        size="small"
        variant={severity === 'critical' ? 'filled' : 'outlined'}
      />
    );
  };

  const getEventTypeChip = (eventType: EventType) => {
    const config = {
      [EventType.VIBRATION]: { color: 'primary' as const, label: 'Vibration' },
      [EventType.BLAST]: { color: 'error' as const, label: 'Blast' },
      [EventType.CONSTRUCTION]: { color: 'warning' as const, label: 'Construction' },
      [EventType.TRAFFIC]: { color: 'info' as const, label: 'Traffic' },
      [EventType.UNKNOWN]: { color: 'default' as const, label: 'Unknown' },
    };

    const typeConfig = config[eventType] || config[EventType.UNKNOWN];

    return (
      <Chip
        label={typeConfig.label}
        color={typeConfig.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const displayData = React.useMemo(() => {
    if (!data) return [];
    return data
      .slice(0, maxRows)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [data, maxRows]);

  if (!data || data.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 200,
          color: theme.palette.text.secondary,
        }}
      >
        <Typography variant="body2">No recent events</Typography>
      </Box>
    );
  }

  return (
    <TableContainer sx={{ maxHeight: 400 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon sx={{ fontSize: 16 }} />
                Time
              </Box>
            </TableCell>
            <TableCell>Sensor</TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ fontSize: 16 }} />
                Location
              </Box>
            </TableCell>
            <TableCell>Event Type</TableCell>
            <TableCell align="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 16 }} />
                PPV
              </Box>
            </TableCell>
            <TableCell align="center">Frequency</TableCell>
            <TableCell align="center">Severity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayData.map((event, index) => (
            <TableRow key={`${event.sensor_id}-${event.timestamp}-${index}`} hover>
              <TableCell component="th" scope="row">
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  {format(parseISO(event.timestamp), 'MM/dd HH:mm:ss')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {event.sensor_id}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {event.location}
                </Typography>
              </TableCell>
              <TableCell>
                {getEventTypeChip(event.event_type)}
              </TableCell>
              <TableCell align="center">
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: event.ppv_value > 10 ? 'bold' : 'normal',
                    color: event.ppv_value > 20 ? theme.palette.error.main : 
                           event.ppv_value > 10 ? theme.palette.warning.main : 
                           'inherit'
                  }}
                >
                  {event.ppv_value.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  mm/s
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2">
                  {event.frequency.toFixed(1)}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Hz
                </Typography>
              </TableCell>
              <TableCell align="center">
                {getSeverityChip(event.severity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {data.length > maxRows && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Showing {maxRows} of {data.length} recent events
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};