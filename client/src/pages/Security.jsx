import React, { useState, useEffect } from "react";
import ReusableTable from "../components/ReusableTable";
import LargeToast from "../components/LargeToast";
import {
  Modal,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Container,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { QrReader } from "react-qr-reader";
import LogoutIcon from "@mui/icons-material/Logout";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../utils/tokenManager";
import axios from "axios";
import { baseURL } from "../context/ApiInterceptor";

const Security = () => {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const [qrData, setQrData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [guardRegister, setGuardRegister] = useState([]);
  const [largeToastOpen, setLargeToastOpen] = useState(false);

  const columns = [
    { id: "name", label: "Name" },
    { id: "ApprovedBy", label: "Approved By" },
    { id: "ScannedDate", label: "Scanned Date" },
    { id: "PhoneNo", label: "Personal Phone No." },
    { id: "ParentPhoneNo", label: "Parent Phone No." },
    { id: "Address", label: "Address" },
    { id: "reason", label: "Reason" },
  ];

  useEffect(() => {
    fetchGuardRegister();
  }, []);

  const fetchGuardRegister = async () => {
    try {
      const response = await axios.get(`${baseURL}/guard/All`);
      setGuardRegister(response.data.data);
    } catch (error) {
      console.error("Error fetching guard register:", error);
    }
  };

  const handleScan = async (result) => {
    if (result) {
      setQrData(result.text);
      setIsVerifying(true);
      try {
        const response = await axios.get(
          `${baseURL}/opDetails/verifyOutpass/${result.text}`
        );
        setVerificationResult(response.data.data);
      } catch (error) {
        console.error("Error verifying outpass:", error);
        setVerificationResult({ error: "Failed to verify outpass" });
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleApprove = async () => {
    if (verificationResult && verificationResult._id) {
      try {
        await axios.post(
          `${baseURL}/guard/registerDetails/${verificationResult._id}`
        );
        setIsScanning(false);
        setQrData(null);
        setVerificationResult(null);
        setLargeToastOpen(true);
        setTimeout(() => {
          setLargeToastOpen(false);
          fetchGuardRegister();
        }, 3000);
      } catch (error) {
        console.error("Error approving entry:", error);
      }
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Security Dashboard
          </Typography>
          <Tooltip title="Scan QR Code" placement="bottom" arrow>
            <IconButton color="inherit" onClick={() => setIsScanning(true)}>
              <QrCodeScannerIcon />
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
        <Typography variant="h4" gutterBottom>
          Guard Register
        </Typography>
        <ReusableTable
          columns={columns}
          data={guardRegister}
          title="Scanned Entries"
        />
      </Container>

      <Modal open={isScanning} onClose={() => setIsScanning(false)}>
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <IconButton
              sx={{ position: "absolute", right: -16, top: -16 }}
              onClick={() => {
                setIsScanning(false);
                setQrData(null);
                setVerificationResult(null);
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom align="center">
              Scan QR Code
            </Typography>
            {!qrData && (
              <Box
                sx={{
                  border: "2px solid #3f51b5",
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                <QrReader
                  onResult={(result, error) => {
                    if (result) {
                      handleScan(result);
                    }
                    if (error) {
                      console.error(error);
                    }
                  }}
                  style={{ width: "100%" }}
                  constraints={{ facingMode: "environment" }}
                />
              </Box>
            )}
            {isVerifying && (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress />
              </Box>
            )}
            {verificationResult && (
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Verification Result:
                </Typography>
                {verificationResult.error ? (
                  <Typography color="error">
                    {verificationResult.error}
                  </Typography>
                ) : (
                  <>
                    <Typography>Name: {verificationResult.name}</Typography>
                    <Typography>
                      Roll No: {verificationResult.rollno}
                    </Typography>
                    <Typography>
                      Valid: {verificationResult.isValid ? "Yes" : "No"}
                    </Typography>
                    <Typography>
                      From:{" "}
                      {new Date(
                        verificationResult.dateFrom
                      ).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      To:{" "}
                      {new Date(verificationResult.dateTo).toLocaleDateString()}
                    </Typography>
                    {verificationResult.isValid && (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleApprove}
                        sx={{ mt: 2 }}
                      >
                        Approve Entry
                      </Button>
                    )}
                  </>
                )}
              </Box>
            )}
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setIsScanning(false);
                setQrData(null);
                setVerificationResult(null);
              }}
              sx={{ mt: 2 }}
            >
              Close Scanner
            </Button>
          </Box>
        </Paper>
      </Modal>
      <LargeToast
        isOpen={largeToastOpen}
        onClose={() => setLargeToastOpen(false)}
        message="Entry Approved!"
      />
    </>
  );
};

export default Security;
