import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
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
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken, getUserId } from "../utils/tokenManager";
import useToast from "../hooks/useToast";
import Toast from "../components/Toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import {
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocationCity as LocationCityIcon,
  Description as DescriptionIcon,
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
  backgroundColor: theme.palette.grey[50],
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
}));

const Student = () => {
  const navigate = useNavigate();
  const { open, severity, message, showToast, hideToast } = useToast();
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [userOpDetails, setUserOpDetails] = useState([]);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedOpDetail, setSelectedOpDetail] = useState(null);

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

  const fetchStaffList = async () => {
    try {
      const response = await axios.get(`${baseURL}/auth/getStaff`);
      setStaffList(response.data.data);
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/opDetails/user/${getUserId()}`
      );
      setUserOpDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
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

  return (
    <ThemeProvider theme={theme}>
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
          <Tooltip title="logout" placement="bottom" arrow>
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
        <Grid container spacing={3}>
          {userOpDetails.map((detail) => (
            <Grid item xs={12} sm={6} md={4} key={detail._id}>
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
                      icon={<PersonIcon />}
                      label={
                        detail.isAccept === true
                          ? "Accepted"
                          : detail.isAccept === false
                          ? "Rejected"
                          : "Pending"
                      }
                      status={
                        detail.isAccept === true
                          ? "Accepted"
                          : detail.isAccept === false
                          ? "Rejected"
                          : "Pending"
                      }
                    />
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
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Form Modal */}
      <Dialog
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>New OP Form</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Staff Modal */}
      <Dialog
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Assign to Warden</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Select Warden"
            fullWidth
            variant="outlined"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            margin="normal"
          >
            {staffList.map((staff) => (
              <MenuItem key={staff._id} value={staff._id}>
                {staff.email}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignModalOpen(false)}>Cancel</Button>
          <Button onClick={assignToStaff} color="primary" variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Student;
