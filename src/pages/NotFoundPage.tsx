import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HomeRounded } from '@mui/icons-material';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Page Not Found</title>
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
          <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', mb: 2 }}>
            404
          </Typography>
          <Typography variant="h4" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you're looking for doesn't exist.
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeRounded />}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default NotFoundPage;