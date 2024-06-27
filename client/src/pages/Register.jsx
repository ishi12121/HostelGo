import React from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import axios from 'axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useToast from '../hooks/useToast';
import Toast from '../components/Toast';
import { Link, useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  role: yup.string().required('Role is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

// Define the theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

// Animations and styled components
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderRadius: '16px',
  animation: `${fadeIn} 0.5s ease-out`,
}));

const Background = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  zIndex: -1,
});

const StyledForm = styled('form')({
  width: '100%',
  marginTop: theme.spacing(3),
});

const StyledButton = styled(Button)({
  margin: theme.spacing(3, 0, 2),
  borderRadius: '25px',
  padding: '12px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
});

// ... (use the same theme, styled components, and animations from LoginForm)

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { open, severity, message, showToast, hideToast } = useToast();
  const navigate = useNavigate();
  const role = watch("role");

  const onSubmit = async (data) => {
    try {
      const url =
        role === "student"
          ? "http://localhost:3030/auth/register/user"
          : "http://localhost:3030/auth/register/staff";

      const response = await axios.post(url, {
        role: data.role,
        email: data.email,
        password: data.password,
      });

      showToast("success", response.data.message || "Registration successful!");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login page after 2 seconds
    } catch (error) {
      console.error("Error during registration:", error);
      showToast("error", "Registration failed. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Background />
      <Toast
        open={open}
        severity={severity}
        message={message}
        onClose={hideToast}
      />
      <Container
        component="main"
        maxWidth="xs"
        sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
      >
        <StyledPaper elevation={6}>
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
          >
            Create Account
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: theme.palette.text.secondary }}
          >
            Please fill in the details to register
          </Typography>
          <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("role")}
              select
              label="Role"
              fullWidth
              variant="outlined"
              error={!!errors.role}
              helperText={errors.role?.message}
              margin="normal"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </TextField>
            <TextField
              {...register("email")}
              label="Email"
              fullWidth
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
            />
            <TextField
              {...register("password")}
              label="Password"
              fullWidth
              type="password"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              margin="normal"
            />
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Register
            </StyledButton>
          </StyledForm>
          <Typography variant="body2" style={{ marginTop: "1rem" }}>
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </StyledPaper>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterForm;
