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
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";

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
      paper: "#c8e6c9",
    },
  },
});

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
        `http://localhost:3030/opDetails/staffId?staffId=${localStorage.getItem(
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
      .post("http://localhost:3030/opDetails/accept", {
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
      .post("http://localhost:3030/opDetails/reject", {
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
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Request ID: {detail.id}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Student: {detail.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    From: {new Date(detail.dateFrom).toLocaleDateString()}{" "}
                    {detail.timeFrom}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    To: {new Date(detail.dateTo).toLocaleDateString()}{" "}
                    {detail.timeTo}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Reason: {detail.reason}
                  </Typography>
                  <Box mt={2}>
                    <Chip
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
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleOpenAcceptModal(detail)}
                    disabled={detail.isAccept !== null}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleOpenRejectModal(detail)}
                    disabled={detail.isAccept !== null}
                  >
                    Reject
                  </Button>
                </CardActions>
              </Card>
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
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default Staff;
