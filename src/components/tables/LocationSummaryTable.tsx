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
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { LocationSummaryData, AlarmStatus } from '../../types';

interface LocationSummaryTableProps {
  data: LocationSummaryData[];
}

export const LocationSummaryTable: React.FC<LocationSummaryTableProps> = ({ data }) => {
  const theme = useTheme();

  const getStatusChip = (status: AlarmStatus) => {
    const config = {
      [AlarmStatus.NORMAL]: { 
        color: 'success' as const, 
        icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, 
        label: 'Normal' 
      },
      [AlarmStatus.WARNING]: { 
        color: 'warning' as const, 
        icon: <WarningIcon sx={{ fontSize: 16 }} />, 
        label: 'Warning' 
      },
      [AlarmStatus.CRITICAL]: { 
        color: 'error' as const, 
        icon: <ErrorIcon sx={{ fontSize: 16 }} />, 
        label: 'Critical' 
      },
    };

    const statusConfig = config[status] || config[AlarmStatus.NORMAL];

    return (
      <Chip
        icon={statusConfig.icon}
        label={statusConfig.label}
        color={statusConfig.color}
        size="small"
        variant="outlined"
      />
    );
  };

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
        <Typography variant="body2">No location data available</Typography>
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
                <LocationIcon sx={{ fontSize: 16 }} />
                Location
              </Box>
            </TableCell>
            <TableCell align="center">Sensors</TableCell>
            <TableCell align="center">Avg PPV</TableCell>
            <TableCell align="center">Max PPV</TableCell>
            <TableCell align="center">Alerts</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((location) => (
            <TableRow key={location.location} hover>
              <TableCell component="th" scope="row">
                <Typography variant="body2" fontWeight="medium">
                  {location.location}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2">
                  {location.sensor_count}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2">
                  {location.avg_ppv.toFixed(2)} mm/s
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: location.max_ppv > 10 ? 'bold' : 'normal',
                    color: location.max_ppv > 20 ? theme.palette.error.main : 
                           location.max_ppv > 10 ? theme.palette.warning.main : 
                           'inherit'
                  }}
                >
                  {location.max_ppv.toFixed(2)} mm/s
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  {location.alert_count > 0 ? (
                    <Chip
                      label={location.alert_count}
                      color="error"
                      size="small"
                      variant="filled"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      0
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell align="center">
                {getStatusChip(location.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};