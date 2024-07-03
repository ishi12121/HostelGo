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

// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(-20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

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

const StyledChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === "Accepted"
      ? theme.palette.success.main
      : status === "Pending"
      ? theme.palette.warning.main
      : theme.palette.error.main,
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
      const response = await axios.get("http://localhost:3030/auth/getStaff");
      setStaffList(response.data.data);
    } catch (error) {}
  };

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3030/opDetails/userId?userId=${getUserId()}`
      );
      setUserOpDetails(response.data.data);
    } catch (error) {}
  };

  const onSubmit = async (data) => {
    try {
      const finalData = {
        ...data,
        userId: getUserId(),
      };
      const response = await axios.post(
        `http://localhost:3030/opDetails`,
        finalData
      );
      showToast("success", "Details submitted successfully!");
      fetchDetails();
      reset();
      setFormModalOpen(false);
    } catch (error) {
      showToast("error", "Failed to submit details.");
    }
  };

  const assignToStaff = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:3030/opDetails/assign",
        {
          id: selectedOpDetail._id,
          staffId: id,
        }
      );
      showToast("success", "Assigned to staff successfully!");
      fetchDetails();
      setAssignModalOpen(false);
    } catch (error) {
      showToast("error", "Failed to assign to staff.");
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
          <IconButton color="inherit" onClick={() => setFormModalOpen(true)}>
            <AddIcon />
          </IconButton>
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {userOpDetails.map((detail) => (
            <Grid item xs={12} sm={6} md={4} key={detail._id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {detail.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {detail.department} - {detail.rollno}
                  </Typography>
                  <Typography variant="body2" component="p">
                    From: {new Date(detail.dateFrom).toLocaleDateString()}{" "}
                    {detail.timeFrom}
                  </Typography>
                  <Typography variant="body2" component="p">
                    To: {new Date(detail.dateTo).toLocaleDateString()}{" "}
                    {detail.timeTo}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Reason: {detail.reason}
                  </Typography>
                  <Box mt={2}>
                    <StyledChip
                      icon={<PersonIcon />}
                      label={detail.isAccept ? "Accepted" : "Pending"}
                      status={detail.isAccept ? "Accepted" : "Pending"}
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  {!detail.staffId && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        setSelectedOpDetail(detail);
                        setAssignModalOpen(true);
                      }}
                    >
                      Assign to Staff
                    </Button>
                  )}
                </CardActions>
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
      <Dialog open={assignModalOpen} onClose={() => setAssignModalOpen(false)}>
        <DialogTitle>Assign to Staff</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Select Staff"
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
          <Button
            onClick={() => assignToStaff(selectedOpDetail._id)}
            color="primary"
            variant="contained"
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Student;
