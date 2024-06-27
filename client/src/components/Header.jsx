// src/components/Header.js
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledAppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              letterSpacing: '1px',
              fontSize: isMobile ? '1.2rem' : '1.5rem'
            }}
          >
           HostelGO
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <StyledButton color="inherit" component={Link} to="/">
              Home
            </StyledButton>
            <StyledButton color="inherit" component={Link} to="/about">
              About
            </StyledButton>
            <StyledButton 
              color="inherit" 
              component={Link} 
              to="/login"
              variant="outlined"
              sx={{ 
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                }
              }}
            >
              Login
            </StyledButton>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;