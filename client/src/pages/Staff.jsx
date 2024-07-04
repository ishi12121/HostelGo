import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, clearTokens } from "../utils/tokenManager";
import axios from "axios";
import {
  Container,
  Grid,
  Button,
  Modal,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  ThemeProvider,
  createTheme,
  Avatar,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import {
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocationCity as LocationCityIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { baseURL } from "../context/ApiInterceptor";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1b5e20",
    },
    secondary: {
      main: "#b71c1c",
    },
    background: {
      default: "#e8f5e9",
      paper: "#ffffff",
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: "bold",
}));

const Staff = () => {
  const navigate = useNavigate();
  const [opDetails, setOpDetails] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
    } else {
      fetchOpDetails();
    }
  }, [navigate]);

  const fetchOpDetails = () => {
    axios
      .get(
        `${baseURL}/opDetails/staff/${localStorage.getItem(
          "userId"
        )}`
      )
      .then((response) => {
        setOpDetails(response.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching operation details:", error);
      });
  };

  const handleOpenAcceptModal = (request) => {
    setSelectedRequest(request);
    setIsAcceptModalOpen(true);
  };

  const handleOpenRejectModal = (request) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAcceptModalOpen(false);
    setIsRejectModalOpen(false);
    setSelectedRequest(null);
  };

  const handleAccept = () => {
    axios
      .post(`${baseURL}/opDetails/accept`, {
        id: selectedRequest._id,
      })
      .then(() => {
        fetchOpDetails();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error accepting request:", error);
      });
  };

  const handleReject = () => {
    axios
      .post(`${baseURL}/opDetails/reject`, {
        id: selectedRequest._id,
      })
      .then(() => {
        fetchOpDetails();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error rejecting request:", error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Warden Dashboard
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => {
                clearTokens();
                navigate("/login");
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Outpass Requests
        </Typography>
        <Grid container spacing={3}>
          {opDetails.map((detail) => (
            <Grid item xs={12} sm={6} md={4} key={detail.id}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      {detail.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {detail.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Request ID: {detail.id}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" alignItems="center" mb={1}>
                    <EventIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      From: {new Date(detail.dateFrom).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ScheduleIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {detail.timeFrom} - {detail.timeTo}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="flex-start" mb={1}>
                    <DescriptionIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                    <Typography variant="body2">{detail.reason}</Typography>
                  </Box>

                  <Box
                    mt={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <StyledChip
                      icon={
                        detail.isAccept === true ? (
                          <CheckCircleIcon />
                        ) : detail.isAccept === false ? (
                          <CancelIcon />
                        ) : (
                          <PendingIcon />
                        )
                      }
                      label={
                        detail.isAccept === true
                          ? "Accepted"
                          : detail.isAccept === false
                          ? "Rejected"
                          : "Pending"
                      }
                      color={
                        detail.isAccept === true
                          ? "success"
                          : detail.isAccept === false
                          ? "error"
                          : "warning"
                      }
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenAcceptModal(detail)}
                    disabled={detail.isAccept !== null}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenRejectModal(detail)}
                    disabled={detail.isAccept !== null}
                  >
                    Reject
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Modal open={isAcceptModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Confirm Accept
          </Typography>
          <Typography>Are you sure you want to accept this request?</Typography>
          <Button
            onClick={handleAccept}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Confirm
          </Button>
        </Box>
      </Modal>

      <Modal open={isRejectModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Confirm Reject
          </Typography>
          <Typography>Are you sure you want to reject this request?</Typography>
          <Button
            onClick={handleReject}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default Staff;
