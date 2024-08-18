import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, clearTokens } from "../utils/tokenManager";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Moon, Sun, LogOut, Check, X, Clock } from "lucide-react";
import { baseURL } from "../context/ApiInterceptor";

interface OpDetail {
  _id: string;
  id: string;
  name: string;
  dateFrom: string;
  timeFrom: string;
  timeTo: string;
  reason: string;
  isAccept: boolean | null;
}

const Staff: React.FC = () => {
  const navigate = useNavigate();
  const [opDetails, setOpDetails] = useState<OpDetail[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<OpDetail | null>(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
    } else {
      fetchOpDetails();
    }
  }, [navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchOpDetails = () => {
    const token = getAccessToken();
    axios
      .get(`${baseURL}/opDetails/staff/${localStorage.getItem("userId")}`, {
        headers: {
          "x-auth-token": token,
        },
      })
      .then((response) => {
        setOpDetails(response.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching operation details:", error);
      });
  };

  const handleOpenAcceptModal = (request: OpDetail) => {
    setSelectedRequest(request);
    setIsAcceptModalOpen(true);
  };

  const handleOpenRejectModal = (request: OpDetail) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAcceptModalOpen(false);
    setIsRejectModalOpen(false);
    setSelectedRequest(null);
  };

  const handleAccept = () => {
    if (!selectedRequest) return;
    const token = getAccessToken();
    axios
      .post(
        `${baseURL}/opDetails/accept`,
        {
          id: selectedRequest._id,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      )
      .then(() => {
        fetchOpDetails();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error accepting request:", error);
      });
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    const token = getAccessToken();
    axios
      .post(
        `${baseURL}/opDetails/reject`,
        {
          id: selectedRequest._id,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      )
      .then(() => {
        fetchOpDetails();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error rejecting request:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Warden Dashboard
          </h1>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="mr-4"
            >
              {darkMode ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                clearTokens();
                navigate("/login");
              }}
            >
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Outpass Requests
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {opDetails.map((detail) => (
            <Card
              key={detail.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="mr-4">
                    <AvatarFallback>{detail.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{detail.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Request ID: {detail.id}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">From:</span>{" "}
                    {new Date(detail.dateFrom).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Time:</span> {detail.timeFrom}{" "}
                    - {detail.timeTo}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Reason:</span> {detail.reason}
                  </p>
                </div>
                <div className="mt-4">
                  <Badge
                    variant={
                      detail.isAccept === true
                        ? "default" // Change "success" to "default" or another valid value
                        : detail.isAccept === false
                        ? "destructive"
                        : "secondary"
                    }
                    className="flex items-center"
                  >
                    {detail.isAccept === true ? (
                      <Check className="w-4 h-4 mr-1" />
                    ) : detail.isAccept === false ? (
                      <X className="w-4 h-4 mr-1" />
                    ) : (
                      <Clock className="w-4 h-4 mr-1" />
                    )}
                    {detail.isAccept === true
                      ? "Accepted"
                      : detail.isAccept === false
                      ? "Rejected"
                      : "Pending"}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 p-4">
                <Button
                  variant="outline"
                  onClick={() => handleOpenAcceptModal(detail)}
                  disabled={detail.isAccept !== null}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOpenRejectModal(detail)}
                  disabled={detail.isAccept !== null}
                >
                  Reject
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={isAcceptModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Accept</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleAccept}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Reject</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
