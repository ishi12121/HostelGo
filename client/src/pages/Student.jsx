import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode.react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
  Paper,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken, getUserId } from "../utils/tokenManager";
import useToast from "../hooks/useToast";
import Toast from "../components/Toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocationCity as LocationCityIcon,
  Description as DescriptionIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { baseURL } from "../context/ApiInterceptor";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  department: yup.string().required("Department is required"),
  rollno: yup.string().required("Roll Number is required"),
  year: yup.string().required("Year is required"),
  dateFrom: yup.date().required("Date From is required"),
  dateTo: yup.date().required("Date To is required"),
  timeFrom: yup.string().required("Time From is required"),
  timeTo: yup.string().required("Time To is required"),
  phNo: yup.string().required("Phone Number is required"),
  parentPhNo: yup.string().required("Parent Phone Number is required"),
  reason: yup.string().required("Reason is required"),
  city: yup.string().required("City is required"),
});

const theme = createTheme({
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

const StyledCard = styled(motion(Paper))(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  overflow: "hidden",
  position: "relative",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));
const StyledChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === "Accepted"
      ? theme.palette.success.main
      : status === "Pending"
      ? theme.palette.warning.main
      : status === "Rejected"
      ? theme.palette.error.main
      : theme.palette.grey[500],
  color: theme.palette.common.white,
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
}));

const Background = styled(motion.div)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: `linear-gradient(45deg, #b3e5fc, #81d4fa)`,
}));

// const ModalContent = styled(Box)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: theme.shape.borderRadius,
//   padding: theme.spacing(3),
//   boxShadow: theme.shadows[5],
// }));

const QRCodeWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));
const ModalPaper = styled(motion.div)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "20px",
  padding: theme.spacing(3),
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
}));
const ModalHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));
const ModalTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: theme.palette.primary.main,
}));

const ModalContent = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const ModalActions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
}));

const Student = () => {
  const navigate = useNavigate();
  const { open, severity, message, showToast, hideToast } = useToast();
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [userOpDetails, setUserOpDetails] = useState([]);
  const [filteredOpDetails, setFilteredOpDetails] = useState([]);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedOpDetail, setSelectedOpDetail] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
    } else {
      fetchStaffList();
      fetchDetails();
    }
  }, [navigate]);

  useEffect(() => {
    filterOpDetails();
  }, [userOpDetails, searchTerm, tabValue]);

  const fetchStaffList = async () => {
    try {
      const response = await axios.get(`${baseURL}/auth/getStaff`);
      setStaffList(response.data.data);
    } catch (error) {
      console.error("Error fetching staff list:", error);
      showToast("error", "Failed to fetch staff list.");
    }
  };

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/opDetails/user/${getUserId()}`
      );
      setUserOpDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      showToast("error", "Failed to fetch outpass details.");
    } finally {
      setLoading(false);
    }
  };

  const filterOpDetails = () => {
    let filtered = userOpDetails.filter((detail) =>
      detail.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (tabValue) {
      case 1:
        filtered = filtered.filter((detail) => detail.isAccept === true);
        break;
      case 2:
        filtered = filtered.filter((detail) => detail.isAccept === false);
        break;
      case 3:
        filtered = filtered.filter((detail) => detail.isAccept === null);
        break;
      default:
        break;
    }

    setFilteredOpDetails(filtered);
  };

  const onSubmit = async (data) => {
    try {
      const finalData = {
        ...data,
        userId: getUserId(),
      };
      await axios.post(`${baseURL}/opDetails`, finalData);
      showToast("success", "Details submitted successfully!");
      fetchDetails();
      reset();
      setFormModalOpen(false);
    } catch (error) {
      showToast("error", "Failed to submit details.");
    }
  };

  const assignToStaff = async () => {
    try {
      await axios.post(`${baseURL}/opDetails/assign`, {
        id: selectedOpDetail._id,
        staffId: selectedStaff,
      });
      showToast("success", "Assigned to Warden successfully!");
      fetchDetails();
      setAssignModalOpen(false);
    } catch (error) {
      showToast("error", "Failed to assign to Warden.");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Background
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <Toast
        open={open}
        severity={severity}
        message={message}
        onClose={hideToast}
      />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student Dashboard
          </Typography>
          <Tooltip title="Fill outPass Form" placement="bottom" arrow>
            <IconButton color="inherit" onClick={() => setFormModalOpen(true)}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout" placement="bottom" arrow>
            <IconButton
              color="inherit"
              onClick={() => {
                clearTokens();
                navigate("/login");
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by reason"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="All" />
          <Tab label="Accepted" />
          <Tab label="Rejected" />
          <Tab label="Pending" />
        </Tabs>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
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
                          <Typography color="textSecondary" variant="subtitle2">
                            {detail.department} - {detail.rollno}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box display="flex" alignItems="center" mb={1}>
                        <EventIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          From: {new Date(detail.dateFrom).toLocaleDateString()}
                          <br />
                          To: {new Date(detail.dateTo).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <ScheduleIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {detail.timeFrom} - {detail.timeTo}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationCityIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">{detail.city}</Typography>
                      </Box>
                      <Box display="flex" alignItems="flex-start" mb={1}>
                        <DescriptionIcon
                          color="action"
                          sx={{ mr: 1, mt: 0.5 }}
                        />
                        <Typography variant="body2">{detail.reason}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <PhoneIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {detail.phNo} (Student) <br />
                          {detail.parentPhNo} (Parent)
                        </Typography>
                      </Box>

                      <StyledChip
                        icon={<PersonIcon />}
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
                    <CardActions>
                      {!detail.staffId && (
                        <Button
                          size="small"
                          color="primary"
                          variant="outlined"
                          onClick={() => {
                            setSelectedOpDetail(detail);
                            setAssignModalOpen(true);
                          }}
                        >
                          Assign to Warden
                        </Button>
                      )}
                      {detail.isAccept && !detail.isScanned && (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedOpDetail(detail);
                            setQrModalOpen(true);
                          }}
                        >
                          View Ticket
                        </Button>
                      )}
                      {detail.isScanned && (
                        <Typography variant="body2" color="error">
                          Expired
                        </Typography>
                      )}
                    </CardActions>
                  </StyledCard>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Container>
      {/* Form Modal */}
      <Dialog
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperComponent={ModalPaper}
        PaperProps={{
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: 0.3 },
        }}
      >
        <ModalHeader>
          <ModalTitle>New OP Form</ModalTitle>
          <IconButton onClick={() => setFormModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>

        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("name")}
                  label="Name"
                  fullWidth
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  margin="normal"
                />
                <TextField
                  {...register("department")}
                  label="Department"
                  fullWidth
                  variant="outlined"
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  margin="normal"
                />
                <TextField
                  {...register("rollno")}
                  label="Roll Number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.rollno}
                  helperText={errors.rollno?.message}
                  margin="normal"
                />
                <TextField
                  {...register("year")}
                  label="Year"
                  fullWidth
                  variant="outlined"
                  error={!!errors.year}
                  helperText={errors.year?.message}
                  margin="normal"
                />
                <TextField
                  {...register("dateFrom")}
                  label="Date From"
                  type="date"
                  fullWidth
                  variant="outlined"
                  error={!!errors.dateFrom}
                  helperText={errors.dateFrom?.message}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  {...register("dateTo")}
                  label="Date To"
                  type="date"
                  fullWidth
                  variant="outlined"
                  error={!!errors.dateTo}
                  helperText={errors.dateTo?.message}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  {...register("timeFrom")}
                  label="Time From"
                  fullWidth
                  variant="outlined"
                  error={!!errors.timeFrom}
                  helperText={errors.timeFrom?.message}
                  margin="normal"
                />
                <TextField
                  {...register("timeTo")}
                  label="Time To"
                  fullWidth
                  variant="outlined"
                  error={!!errors.timeTo}
                  helperText={errors.timeTo?.message}
                  margin="normal"
                />
                <TextField
                  {...register("phNo")}
                  label="Phone Number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.phNo}
                  helperText={errors.phNo?.message}
                  margin="normal"
                />
                <TextField
                  {...register("parentPhNo")}
                  label="Parent Phone Number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.parentPhNo}
                  helperText={errors.parentPhNo?.message}
                  margin="normal"
                />
                <TextField
                  {...register("reason")}
                  label="Reason"
                  fullWidth
                  variant="outlined"
                  error={!!errors.reason}
                  helperText={errors.reason?.message}
                  margin="normal"
                />
                <TextField
                  {...register("city")}
                  label="City"
                  fullWidth
                  variant="outlined"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </form>
        </ModalContent>

        <ModalActions>
          <Button onClick={() => setFormModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </ModalActions>
      </Dialog>
      
      <Dialog
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperComponent={ModalPaper}
        PaperProps={{
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: 0.3 },
        }}
      >
        <ModalHeader>
          <ModalTitle>Assign to Warden</ModalTitle>
          <IconButton onClick={() => setAssignModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>
        <ModalContent>
          <TextField
            select
            label="Select Warden"
            fullWidth
            variant="outlined"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
          >
            {staffList.map((staff) => (
              <MenuItem key={staff._id} value={staff._id}>
                {staff.email}
              </MenuItem>
            ))}
          </TextField>
        </ModalContent>
        <ModalActions>
          <Button onClick={() => setAssignModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={assignToStaff} color="primary" variant="contained">
            Assign
          </Button>
        </ModalActions>
      </Dialog>
      <Dialog
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        PaperComponent={ModalPaper}
        PaperProps={{
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.3 },
        }}
      >
        <ModalHeader>
          <ModalTitle>Outpass QR Code</ModalTitle>
          <IconButton onClick={() => setQrModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>
        <ModalContent>
          {selectedOpDetail && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <QRCode value={selectedOpDetail._id} size={256} />
              <Typography variant="h6" mt={2}>
                {selectedOpDetail.name}
              </Typography>
              <Typography variant="body1">
                Roll No: {selectedOpDetail.rollno}
              </Typography>
              <Typography variant="body2">
                Valid from:{" "}
                {new Date(selectedOpDetail.dateFrom).toLocaleDateString()} to{" "}
                {new Date(selectedOpDetail.dateTo).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </ModalContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default Student;
