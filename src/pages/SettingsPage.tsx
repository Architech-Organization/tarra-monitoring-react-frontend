import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';

const SettingsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your system settings.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default SettingsPage;