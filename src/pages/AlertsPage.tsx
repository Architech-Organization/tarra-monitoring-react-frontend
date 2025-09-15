import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';

const AlertsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Alerts</title>
      </Helmet>
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Alerts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage system alerts.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default AlertsPage;