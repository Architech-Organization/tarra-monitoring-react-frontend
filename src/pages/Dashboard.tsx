import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  Divider,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Sensors as SensorsIcon,
  LocationOn as LocationIcon,
  Timeline as TimelineIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';

import { useDashboardData, useAnalyticsData } from '../hooks/useSensorData';
import { SensorDataSummary, AlarmStatus, Status } from '../types';
import { ApiDataCard } from '../components/ApiDataCard';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [timeRange, setTimeRange] = useState<number>(24);

  // Fetch dashboard data (keep for sensor details)
  const { summary, isLoading: summaryLoading, isError: summaryError, error: summaryErrorMsg, refetch: refetchSummary } = useDashboardData();

  // Fetch analytics data (main dashboard data)
  const { data: analytics, isLoading: analyticsLoading, isError: analyticsError, error: analyticsErrorMsg, refetch: refetchAnalytics } = useAnalyticsData(timeRange);

  // Combined loading and error states
  const isLoading = summaryLoading || analyticsLoading;
  const isError = summaryError || analyticsError;
  const error = summaryErrorMsg || analyticsErrorMsg;

  // Handle refresh
  const handleRefresh = () => {
    refetchSummary();
    refetchAnalytics();
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


  if (isError) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Error</title>
        </Helmet>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            <AlertTitle>Failed to Load Dashboard Data</AlertTitle>
            {error?.message || 'Cannot connect to backend API. Please check that your backend server is running on port 8000.'}
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={handleRefresh} startIcon={<RefreshIcon />}>
                Try Again
              </Button>
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Troubleshooting Steps:
                </Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                  <li>Make sure your Python backend is running on <strong>http://localhost:8002</strong></li>
                  <li>Check that CORS is enabled in your backend for localhost:3001</li>
                  <li>Verify your backend API endpoints are working at <strong>http://localhost:8002/docs</strong></li>
                  <li>Check the browser Network tab for specific API error details</li>
                </Typography>
              </Box>
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
        <meta name="description" content="Tarra monitoring system dashboard showing sensor data and analytics" />
      </Helmet>
      
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Monitoring Dashboard
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Time Range Selector */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(Number(e.target.value))}
              >
                <MenuItem value={1}>Last Hour</MenuItem>
                <MenuItem value={6}>Last 6 Hours</MenuItem>
                <MenuItem value={24}>Last 24 Hours</MenuItem>
                <MenuItem value={168}>Last Week</MenuItem>
                <MenuItem value={720}>Last Month</MenuItem>
              </Select>
            </FormControl>

            {/* Auto-refresh indicator */}
            <Tooltip title="Data refreshes automatically every minute">
              <Chip
                icon={<RefreshIcon />}
                label="Auto-refresh"
                color="info"
                variant="outlined"
                size="small"
              />
            </Tooltip>

            {/* Manual Refresh Button */}
            {isLoading ? (
              <Box sx={{ display: 'inline-flex' }}>
                <Tooltip title="Refreshing data...">
                  <span>
                    <IconButton disabled>
                      <CircularProgress size={20} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            ) : (
              <Tooltip title="Refresh Data">
                <IconButton onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Analytics Overview Cards */}
        {analytics?.summary && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SensorsIcon color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {isLoading ? <CircularProgress size={20} /> : analytics.summary.sensor_count}
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
                    <AssessmentIcon color="info" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {isLoading ? <CircularProgress size={20} /> : analytics.summary.total_readings.toLocaleString()}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        Total Readings ({timeRange}h)
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
                    <SpeedIcon color="success" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {isLoading ? <CircularProgress size={20} /> : analytics.hoskin_m80?.readings_count || 0}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        Hoskin M80 Readings
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
                        {isLoading ? <CircularProgress size={20} /> : (analytics.hoskin_m80?.threshold_exceedances || 0) + (analytics.sixense?.warning_alerts || 0) + (analytics.sixense?.critical_alerts || 0)}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        Total Alerts ({timeRange}h)
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}


        {/* Analytics Overview */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Hoskin M80 Analytics */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SpeedIcon />
                  Hoskin M80 Analytics
                </Typography>
                {analytics?.hoskin_m80 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Max PPV:</Typography>
                      <Chip label={`${analytics.hoskin_m80.max_ppv} mm/s`} color="warning" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Average PPV:</Typography>
                      <Typography variant="body2">{analytics.hoskin_m80.avg_ppv.toFixed(2)} mm/s</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Threshold Exceedances:</Typography>
                      <Chip
                        label={analytics.hoskin_m80.threshold_exceedances}
                        color={analytics.hoskin_m80.threshold_exceedances > 0 ? 'error' : 'success'}
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle2" gutterBottom>Event Types:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Object.entries(analytics.hoskin_m80.event_types).map(([type, count]) => (
                        <Chip
                          key={type}
                          label={`${type}: ${count}`}
                          size="small"
                          variant="outlined"
                          color={type === 'blast' ? 'error' : type === 'construction' ? 'warning' : 'default'}
                        />
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    {isLoading ? <CircularProgress /> : <Typography>No Hoskin M80 data available</Typography>}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sixense Analytics */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SensorsIcon />
                  Sixense Analytics
                </Typography>
                {analytics?.sixense ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Max PPV:</Typography>
                      <Chip label={`${analytics.sixense.max_ppv} mm/s`} color="info" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Average PPV:</Typography>
                      <Typography variant="body2">{analytics.sixense.avg_ppv.toFixed(2)} mm/s</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Critical Alerts:</Typography>
                      <Chip
                        label={analytics.sixense.critical_alerts}
                        color={analytics.sixense.critical_alerts > 0 ? 'error' : 'success'}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Warning Alerts:</Typography>
                      <Chip
                        label={analytics.sixense.warning_alerts}
                        color={analytics.sixense.warning_alerts > 0 ? 'warning' : 'success'}
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="h3" color="primary">
                        {analytics.sixense.readings_count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Readings in {timeRange}h
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    {isLoading ? <CircularProgress /> : <Typography>No Sixense data available</Typography>}
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
            {selectedSensor && summary?.data && (
              <Box sx={{ pt: 1 }}>
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