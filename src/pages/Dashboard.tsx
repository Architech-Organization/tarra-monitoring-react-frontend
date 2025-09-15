import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';

const Dashboard: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Tarra monitoring system dashboard" />
      </Helmet>
      
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to the Tarra Monitoring System dashboard. This is where sensor data and analytics will be displayed.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
