import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/tokenManager";
import axios from "axios";
import { Container, Grid, Button, Modal, Box, Typography } from "@mui/material";

const Staff = () => {
  const navigate = useNavigate();
  const [opDetails, setOpDetails] = useState();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
console.log(opDetails)
  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
    } else {
      // Fetch operation details by staff ID
      axios
        .get(
          `http://localhost:3030/opDetails/staffId?staffId=${localStorage.getItem(
            "userId"
          )}`
        )
        .then((response) => {
          setOpDetails(response.data?.data);
        })
        .catch((error) => {
          console.error("Error fetching operation details:", error);
        });
    }
  }, [navigate]);

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
        id: selectedRequest.id,
      })
      .then((response) => {
        setOpDetails(
          opDetails.map((detail) =>
            detail.id === selectedRequest.id
              ? { ...detail, isAccept: true }
              : detail
          )
        );
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error accepting request:", error);
      });
  };

  const handleReject = () => {
    axios
      .post("http://localhost:3030/opDetails/reject", {
        id: selectedRequest.id,
      })
      .then((response) => {
        setOpDetails(
          opDetails?.map((detail) =>
            detail.id === selectedRequest.id
              ? { ...detail, isAccept: false }
              : detail
          )
        );
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error rejecting request:", error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" style={{ color: "green", marginBottom: "20px" }}>
        Staff Page
      </Typography>
      <Grid container spacing={3}>
        {opDetails?.map((detail) => (
          <Grid item xs={12} key={detail.id}>
            <Box border={1} padding={2} borderColor="grey.400">
              <Typography variant="h6">Request ID: {detail.id}</Typography>
              <Typography>
                Status:{" "}
                {detail.isAccept === true
                  ? "Accepted"
                  : detail.isAccept === false
                  ? "Rejected"
                  : "Pending"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenAcceptModal(detail)}
                disabled={detail.isAccept !== null}
                style={{ marginRight: "10px" }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOpenRejectModal(detail)}
                disabled={detail.isAccept !== null}
              >
                Reject
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Modal open={isAcceptModalOpen} onClose={handleCloseModal}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6">Confirm Accept</Typography>
          <Typography>Are you sure you want to accept this request?</Typography>
          <Button
            onClick={handleAccept}
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
          >
            Confirm
          </Button>
        </Box>
      </Modal>

      <Modal open={isRejectModalOpen} onClose={handleCloseModal}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6">Confirm Reject</Typography>
          <Typography>Are you sure you want to reject this request?</Typography>
          <Button
            onClick={handleReject}
            variant="contained"
            color="secondary"
            style={{ marginTop: "20px" }}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
    </Container>
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
