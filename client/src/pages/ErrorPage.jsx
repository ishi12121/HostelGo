// src/pages/ErrorPage.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const ErrorPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1">
        Sorry, the page you are looking for does not exist.
      </Typography>
    </Container>
  );
};

export default ErrorPage;
