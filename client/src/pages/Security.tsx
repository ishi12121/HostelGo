import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "react-qr-scanner";
import axios from "axios";
import { Moon, Sun, LogOut, QrCode, Search, RefreshCw } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Lottie from "react-lottie";
import successAnimation from "../components/Animation - 1723995189593.json"; // Make sure you have the animation JSON file

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
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
      toast({
        title: "Error",
        description: "Failed to fetch guard register. Please try again.",
        variant: "destructive",
      });
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
        toast({
          title: "Error",
          description: "Failed to verify outpass. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    toast({
      title: "Error",
      description: "Failed to scan QR code. Please try again.",
      variant: "destructive",
    });
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
        // Show success animation
        setShowSuccessAnimation(true);

        // Hide the scanner and reset states after animation
        setTimeout(() => {
          setShowSuccessAnimation(false);
          // setIsScanning(false);
          setQrData(null);
          setVerificationResult(null);
        }, 3000);

        fetchGuardRegister();
      } catch (error) {
        console.error("Error approving entry:", error);
        toast({
          title: "Error",
          description: "Failed to approve entry. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredGuardRegister = guardRegister.filter((entry) =>
    entry[filterBy as keyof GuardRegisterEntry]
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {showSuccessAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      )}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Security Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsScanning(true)}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scan QR
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
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
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="flex flex-wrap justify-between items-center">
            <CardTitle>Guard Register</CardTitle>
            <div className="flex flex-wrap items-center space-x-2">
              <Select
                onValueChange={(value) => setFilterBy(value)}
                defaultValue="name"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="ApprovedBy">Approved By</SelectItem>
                  <SelectItem value="reason">Reason</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchGuardRegister}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                  {filteredGuardRegister.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.ApprovedBy}</TableCell>
                      <TableCell>
                        {new Date(entry.ScannedDate).toLocaleString()}
                      </TableCell>
                      <TableCell>{entry.PhoneNo}</TableCell>
                      <TableCell>{entry.ParentPhoneNo}</TableCell>
                      <TableCell>{entry.Address}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.reason}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
