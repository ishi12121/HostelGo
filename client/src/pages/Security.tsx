import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "react-qr-scanner";
import axios from "axios";
import { Moon, Sun, LogOut, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { clearTokens, getAccessToken } from "../utils/tokenManager";
import { baseURL } from "../context/ApiInterceptor";

interface GuardRegisterEntry {
  name: string;
  ApprovedBy: string;
  ScannedDate: string;
  PhoneNo: string;
  ParentPhoneNo: string;
  Address: string;
  reason: string;
}

interface VerificationResult {
  _id: string;
  name: string;
  rollno: string;
  isValid: boolean;
  dateFrom: string;
  dateTo: string;
  error?: string;
}

const Security: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const [qrData, setQrData] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [guardRegister, setGuardRegister] = useState<GuardRegisterEntry[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGuardRegister();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchGuardRegister = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${baseURL}/guard/All`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setGuardRegister(response.data.data);
    } catch (error) {
      console.error("Error fetching guard register:", error);
    }
  };

  const handleScan = async (data: { text: string } | null) => {
    if (data && data.text) {
      setQrData(data.text);
      setIsVerifying(true);
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `${baseURL}/opDetails/verifyOutpass/${data.text}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setVerificationResult(response.data.data);
      } catch (error) {
        console.error("Error verifying outpass:", error);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  const handleApprove = async () => {
    if (verificationResult && verificationResult._id) {
      try {
        const token = getAccessToken();
        await axios.post(
          `${baseURL}/guard/registerDetails/${verificationResult._id}`,
          {},
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setIsScanning(false);
        setQrData(null);
        setVerificationResult(null);
        toast({
          title: "Entry Approved!",
          duration: 3000,
        });
        fetchGuardRegister();
      } catch (error) {
        console.error("Error approving entry:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Security Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsScanning(true)}
            >
              <QrCode className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
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
        <Card>
          <CardHeader>
            <CardTitle>Guard Register</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Scanned Date</TableHead>
                  <TableHead>Personal Phone No.</TableHead>
                  <TableHead>Parent Phone No.</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guardRegister.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.ApprovedBy}</TableCell>
                    <TableCell>{entry.ScannedDate}</TableCell>
                    <TableCell>{entry.PhoneNo}</TableCell>
                    <TableCell>{entry.ParentPhoneNo}</TableCell>
                    <TableCell>{entry.Address}</TableCell>
                    <TableCell>{entry.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isScanning} onOpenChange={setIsScanning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          {!qrData && (
            <div className="w-full max-w-sm mx-auto">
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%" }}
              />
            </div>
          )}
          {isVerifying && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          )}
          {verificationResult && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Verification Result:
              </h3>
              {verificationResult.error ? (
                <p className="text-red-500">{verificationResult.error}</p>
              ) : (
                <>
                  <p>Name: {verificationResult.name}</p>
                  <p>Roll No: {verificationResult.rollno}</p>
                  <p>Valid: {verificationResult.isValid ? "Yes" : "No"}</p>
                  <p>
                    From:{" "}
                    {new Date(verificationResult.dateFrom).toLocaleDateString()}
                  </p>
                  <p>
                    To:{" "}
                    {new Date(verificationResult.dateTo).toLocaleDateString()}
                  </p>
                  {verificationResult.isValid && (
                    <Button onClick={handleApprove} className="w-full mt-4">
                      Approve Entry
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                setIsScanning(false);
                setQrData(null);
                setVerificationResult(null);
              }}
            >
              Close Scanner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Security;
