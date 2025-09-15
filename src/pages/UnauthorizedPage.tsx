import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SecurityRounded } from '@mui/icons-material';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Unauthorized</title>
      </Helmet>
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          textAlign="center"
        >
          <SecurityRounded sx={{ fontSize: '4rem', color: 'warning.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You don't have permission to access this resource.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default UnauthorizedPage;