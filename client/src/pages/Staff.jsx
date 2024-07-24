import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, clearTokens } from "../utils/tokenManager";
import axios from "axios";
import {
  Container,
  Grid,
  Button,
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
  Paper,
  TextField,
  InputAdornment,
  Tooltip,
  Dialog,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocationCity as LocationCityIcon,
  Description as DescriptionIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { baseURL } from "../context/ApiInterceptor";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

const StyledCard = styled(motion(Paper))(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  position: "relative",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: "bold",
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1,
}));

const Background = styled(motion.div)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
}));

const ModalPaper = styled(motion.div)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '20px',
  padding: theme.spacing(3),
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const ModalContent = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const ModalActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
}));

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor, icon }) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    PaperComponent={ModalPaper}
    PaperProps={{
      initial: { y: -50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.3 },
    }}
  >
    <ModalHeader>
      <ModalTitle>{title}</ModalTitle>
      <IconButton onClick={onClose} size="small">
        <CloseIcon />
      </IconButton>
    </ModalHeader>
    <ModalContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: confirmColor, mr: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="body1">{message}</Typography>
      </Box>
    </ModalContent>
    <ModalActions>
      <Button onClick={onClose} variant="outlined">
        Cancel
      </Button>
      <Button onClick={onConfirm} variant="contained" color={confirmColor}>
        {confirmText}
      </Button>
    </ModalActions>
  </Dialog>
);

const Staff = () => {
  const navigate = useNavigate();
  const [opDetails, setOpDetails] = useState([]);
  const [filteredOpDetails, setFilteredOpDetails] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
    } else {
      fetchOpDetails();
    }
  }, [navigate]);

  useEffect(() => {
    filterRequests();
  }, [opDetails, searchTerm, filterStatus]);

  const fetchOpDetails = () => {
    axios
      .get(`${baseURL}/opDetails/staff/${localStorage.getItem("userId")}`)
      .then((response) => {
        setOpDetails(response.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching operation details:", error);
      });
  };

  const filterRequests = () => {
    let filtered = opDetails.filter((detail) =>
      detail.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((detail) => {
        if (filterStatus === "accepted") return detail.isAccept === true;
        if (filterStatus === "rejected") return detail.isAccept === false;
        if (filterStatus === "pending") return detail.isAccept === null;
        return true;
      });
    }

    setFilteredOpDetails(filtered);
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
      <Background
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
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
        <Typography variant="h4" gutterBottom color="textPrimary">
          Outpass Requests
        </Typography>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <TextField
            variant="outlined"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2, flexGrow: 1 }}
          />
          <Tooltip title="Filter by status" arrow>
            <IconButton
              onClick={() => {
                const statuses = ["all", "accepted", "rejected", "pending"];
                const currentIndex = statuses.indexOf(filterStatus);
                const nextStatus =
                  statuses[(currentIndex + 1) % statuses.length];
                setFilterStatus(nextStatus);
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Chip
            label={`Filter: ${
              filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)
            }`}
            onDelete={() => setFilterStatus("all")}
            sx={{ ml: 1 }}
          />
        </Box>
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredOpDetails.map((detail, index) => (
              <Grid item xs={12} sm={6} md={4} key={detail._id}>
                <StyledCard
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}
                      >
                        {detail.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {detail.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {detail.rollno} | {detail.department}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" alignItems="center" mb={1}>
                      <EventIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        From: {new Date(detail.dateFrom).toLocaleDateString()} -
                        To: {new Date(detail.dateTo).toLocaleDateString()}
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
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationCityIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">{detail.city}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <PhoneIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Student: {detail.phNo} | Parent: {detail.parentPhNo}
                      </Typography>
                    </Box>

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
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", mt: "auto" }}>
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
          </AnimatePresence>
        </Grid>
      </Container>

      <ConfirmationModal
        isOpen={isAcceptModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleAccept}
        title="Confirm Accept"
        message="Are you sure you want to accept this request?"
        confirmText="Accept"
        confirmColor="primary"
        icon={<CheckCircleOutlineIcon />}
      />

      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleReject}
        title="Confirm Reject"
        message="Are you sure you want to reject this request?"
        confirmText="Reject"
        confirmColor="error"
        icon={<CancelOutlinedIcon />}
      />
    </ThemeProvider>
  );
};

export default Staff;