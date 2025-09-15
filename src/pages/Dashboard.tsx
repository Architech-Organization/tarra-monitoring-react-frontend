import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  AlertTitle,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  useTheme,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Battery3Bar as BatteryIcon,
  Sensors as SensorsIcon,
  LocationOn as LocationIcon,
  Timeline as TimelineIcon,
  Visibility as VisibilityIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';

import { useDashboardData, useStartLiveStream, useStopLiveStream, useWebSocketData } from '../hooks/useSensorData';
import { SensorDataSummary, AlarmStatus, Status } from '../types';
import { SensorOverviewChart } from '../components/charts/SensorOverviewChart';
import { VibrationTrendChart } from '../components/charts/VibrationTrendChart';
import { LocationSummaryTable } from '../components/tables/LocationSummaryTable';
import { RecentEventsTable } from '../components/tables/RecentEventsTable';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch dashboard data
  const { summary, analytics, locations, isLoading, isError, error, refetch } = useDashboardData();
  
  // Live stream controls
  const startLiveStream = useStartLiveStream();
  const stopLiveStream = useStopLiveStream();
  
  // WebSocket connection for real-time data
  const { connectionStatus, isConnected } = useWebSocketData(true);

  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };

  // Handle live stream toggle
  const handleLiveStreamToggle = () => {
    if (isConnected) {
      stopLiveStream.mutate();
    } else {
      startLiveStream.mutate();
    }
  };

  // Get status color and icon
  const getStatusDisplay = (status: string, alarmStatus: string) => {
    const isOnline = status === Status.ONLINE;
    const isNormal = alarmStatus === AlarmStatus.NORMAL;
    
    if (!isOnline) {
      return { color: 'error', icon: <ErrorIcon />, text: 'Offline' };
    }
    
    if (alarmStatus === AlarmStatus.CRITICAL) {
      return { color: 'error', icon: <ErrorIcon />, text: 'Critical' };
    }
    
    if (alarmStatus === AlarmStatus.WARNING) {
      return { color: 'warning', icon: <WarningIcon />, text: 'Warning' };
    }
    
    return { color: 'success', icon: <CheckCircleIcon />, text: 'Normal' };
  };

  // Calculate summary statistics
  const summaryStats = React.useMemo(() => {
    if (!summary.data || !analytics.data) {
      return { totalSensors: 0, onlineSensors: 0, alertSensors: 0, avgBattery: 0 };
    }

    const totalSensors = summary.data.length;
    const onlineSensors = summary.data.filter(sensor => sensor.status === Status.ONLINE).length;
    const alertSensors = summary.data.filter(sensor => 
      sensor.alarm_status === AlarmStatus.WARNING || sensor.alarm_status === AlarmStatus.CRITICAL
    ).length;
    const avgBattery = totalSensors > 0 ? 
      summary.data.reduce((sum, sensor) => sum + sensor.battery_level, 0) / totalSensors : 0;

    return { totalSensors, onlineSensors, alertSensors, avgBattery };
  }, [summary.data, analytics.data]);

  if (isError) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Error</title>
        </Helmet>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            <AlertTitle>Failed to Load Dashboard Data</AlertTitle>
            {error?.message || 'An unexpected error occurred while loading the dashboard.'}
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={handleRefresh} startIcon={<RefreshIcon />}>
                Try Again
              </Button>
            </Box>
          </Alert>
        </Box>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Tarra monitoring system dashboard showing real-time sensor data and analytics" />
      </Helmet>
      
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Monitoring Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* WebSocket Status */}
            <Tooltip title={`WebSocket: ${connectionStatus}`}>
              <Chip
                icon={isConnected ? <CheckCircleIcon /> : <ErrorIcon />}
                label={isConnected ? 'Live' : 'Disconnected'}
                color={isConnected ? 'success' : 'error'}
                variant="outlined"
                size="small"
              />
            </Tooltip>

            {/* Live Stream Control */}
            <Tooltip title={isConnected ? 'Stop Live Stream' : 'Start Live Stream'}>
              <IconButton
                onClick={handleLiveStreamToggle}
                disabled={startLiveStream.isPending || stopLiveStream.isPending}
                color={isConnected ? 'error' : 'primary'}
              >
                {startLiveStream.isPending || stopLiveStream.isPending ? (
                  <CircularProgress size={20} />
                ) : isConnected ? (
                  <StopIcon />
                ) : (
                  <PlayIcon />
                )}
              </IconButton>
            </Tooltip>

            {/* Refresh Button */}
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} disabled={isLoading}>
                {isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SensorsIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {isLoading ? <CircularProgress size={20} /> : summaryStats.totalSensors}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      Total Sensors
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {isLoading ? <CircularProgress size={20} /> : summaryStats.onlineSensors}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      Online Sensors
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WarningIcon color="warning" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {isLoading ? <CircularProgress size={20} /> : summaryStats.alertSensors}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      Active Alerts
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <BatteryIcon color="info" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {isLoading ? <CircularProgress size={20} /> : `${Math.round(summaryStats.avgBattery)}%`}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      Avg Battery
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sensor Status Grid */}
        {!isLoading && summary.data && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SensorsIcon />
                Sensor Status Overview
              </Typography>
              
              <Grid container spacing={2}>
                {summary.data.map((sensor) => {
                  const statusDisplay = getStatusDisplay(sensor.status, sensor.alarm_status);
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={sensor.sensor_id}>
                      <Card 
                        variant="outlined"
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            boxShadow: 2,
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={() => {
                          setSelectedSensor(sensor.sensor_id);
                          setShowDetails(true);
                        }}
                      >
                        <CardContent sx={{ pb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle2" noWrap>
                              {sensor.sensor_id}
                            </Typography>
                            <Chip
                              icon={statusDisplay.icon}
                              label={statusDisplay.text}
                              color={statusDisplay.color}
                              size="small"
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <LocationIcon sx={{ fontSize: 16 }} />
                            {sensor.location}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2">
                              Battery: {Math.round(sensor.battery_level)}%
                            </Typography>
                            <Typography variant="body2">
                              {Math.round(sensor.temperature)}°C
                            </Typography>
                          </Box>
                          
                          <Typography variant="caption" color="text.secondary">
                            Last: {format(new Date(sensor.last_reading), 'MMM dd, HH:mm')}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Charts and Analytics */}
        <Grid container spacing={3}>
          {/* Vibration Trends Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimelineIcon />
                  Vibration Trends (24h)
                </Typography>
                {analytics.data?.vibration_trends ? (
                  <VibrationTrendChart data={analytics.data.vibration_trends} />
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    {isLoading ? <CircularProgress /> : <Typography>No trend data available</Typography>}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sensor Health Overview */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon />
                  Sensor Health
                </Typography>
                {analytics.data?.sensor_health ? (
                  <SensorOverviewChart data={analytics.data.sensor_health} />
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    {isLoading ? <CircularProgress /> : <Typography>No health data available</Typography>}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Location Summary */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon />
                  Location Summary
                </Typography>
                {analytics.data?.location_summary ? (
                  <LocationSummaryTable data={analytics.data.location_summary} />
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    {isLoading ? <CircularProgress /> : <Typography>No location data available</Typography>}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Events */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VisibilityIcon />
                  Recent Events
                </Typography>
                {analytics.data?.recent_events ? (
                  <RecentEventsTable data={analytics.data.recent_events} />
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    {isLoading ? <CircularProgress /> : <Typography>No recent events</Typography>}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sensor Details Dialog */}
        <Dialog 
          open={showDetails} 
          onClose={() => setShowDetails(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Sensor Details: {selectedSensor}
          </DialogTitle>
          <DialogContent>
            {selectedSensor && summary.data && (
              <Box sx={{ pt: 1 }}>
                {/* Sensor details content would go here */}
                <Typography>
                  Detailed information for sensor {selectedSensor} would be displayed here.
                  This could include historical charts, configuration, and detailed metrics.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDetails(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Dashboard;