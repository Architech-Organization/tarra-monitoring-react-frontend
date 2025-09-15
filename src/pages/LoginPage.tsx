import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useMsal } from '@azure/msal-react';
import { LoginRounded } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { loginRequest } from '../config/authConfig';

const LoginPage: React.FC = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login to Tarra monitoring system" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Paper elevation={1} sx={{ p: 6, width: '100%', textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Tarra Monitoring System
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Please sign in with your Microsoft account to access the monitoring dashboard.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginRounded />}
              onClick={handleLogin}
              sx={{ mt: 3 }}
            >
              Sign In with Microsoft
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
