import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  IconButton,
  Grid,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useToast from "../hooks/useToast";
import Toast from "../components/Toast";
import { Link, useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";

// Validation schema
const schema = yup.object().shape({
  role: yup.string().required("Role is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

// Define themes for student and staff
const studentTheme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

const staffTheme = createTheme({
  palette: {
    primary: {
      main: "#00695c",
    },
    secondary: {
      main: "#d32f2f",
    },
    background: {
      default: "#f5f5f5",
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
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  animation: `${fadeIn} 0.5s ease-out`,
}));

const Background = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: theme.palette.background.default,
  zIndex: -1,
}));

const StyledForm = styled("form")({
  width: "100%",
  marginTop: 3,
});

const StyledButton = styled(Button)({
  margin: 3,
  borderRadius: "25px",
  padding: "12px",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  },
});

const RoleSelection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  marginBottom: theme.spacing(2),
  width: "100%",
  "& > *": {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: "8px",
    border: `2px solid ${theme.palette.primary.main}`,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  "& .selected": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { open, severity, message, showToast, hideToast } = useToast();
  const navigate = useNavigate();
  const role = watch("role");
  const [selectedRole, setSelectedRole] = useState("");

  const onSubmit = async (data) => {
    try {
      const url =
        role === "student"
          ? "http://localhost:3030/auth/register/user"
          : "http://localhost:3030/auth/register/staff";

      const response = await axios.post(url, {
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

  const handleRoleSelection = (role) => {
    setValue("role", role);
    setSelectedRole(role);
  };

  const theme = selectedRole === "student" ? studentTheme : staffTheme;

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
            <RoleSelection>
              <Box
                className={role === "student" ? "selected" : ""}
                onClick={() => handleRoleSelection("student")}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: theme.spacing(2),
                }}
              >
                <SchoolIcon fontSize="large" />
                <Typography variant="h6">Student</Typography>
              </Box>
              <Box
                className={role === "staff" ? "selected" : ""}
                onClick={() => handleRoleSelection("staff")}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: theme.spacing(2),
                }}
              >
                <WorkIcon fontSize="large" />
                <Typography variant="h6">Warden</Typography>
              </Box>
            </RoleSelection>
            {errors.role && (
              <Typography color="error" variant="body2">
                {errors.role.message}
              </Typography>
            )}
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
