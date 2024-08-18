import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import QRCode from "qrcode.react";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Icons
import {
  LogOut,
  Plus,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Sun,
  Moon,
} from "lucide-react";

// Import your utility functions and custom hooks
import { clearTokens, getAccessToken, getUserId } from "@/utils/tokenManager";
import { baseURL } from "@/context/ApiInterceptor";
import { schema } from "./FormData";

// Define your interfaces
interface StaffMember {
  _id: string;
  email: string;
}

interface OpDetail {
  _id: string;
  name: string;
  department: string;
  rollno: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  city: string;
  reason: string;
  isAccept: boolean | null;
  staffId?: string;
}

const Student: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [userOpDetails, setUserOpDetails] = useState<OpDetail[]>([]);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedOpDetail, setSelectedOpDetail] = useState<OpDetail | null>(
    null
  );
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  console.log(errors);
  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
    } else {
      fetchStaffList();
      fetchDetails();
    }
  }, [navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchStaffList = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${baseURL}/auth/getStaff`, {
        headers: { "x-auth-token": token },
      });
      setStaffList(response.data.data);
    } catch (error) {
      console.error("Error fetching staff list:", error);
      toast({
        title: "Error",
        description: "Failed to fetch staff list.",
        variant: "destructive",
      });
    }
  };

  const fetchDetails = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(
        `${baseURL}/opDetails/user/${getUserId()}`,
        { headers: { "x-auth-token": token } }
      );
      setUserOpDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user details.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const token = getAccessToken();
      const finalData = {
        ...data,
        userId: getUserId(),
      };
      await axios.post(`${baseURL}/opDetails`, finalData, {
        headers: { "x-auth-token": token },
      });
      toast({
        title: "Success",
        description: "Details submitted successfully!",
      });
      fetchDetails();
      reset();
      setFormModalOpen(false);
    } catch (error) {
      console.error("Error submitting details:", error);
      toast({
        title: "Error",
        description: "Failed to submit details.",
        variant: "destructive",
      });
    }
  };

  const assignToStaff = async () => {
    try {
      const token = getAccessToken();
      await axios.post(
        `${baseURL}/opDetails/assign`,
        {
          id: selectedOpDetail?._id,
          staffId: selectedStaff,
        },
        { headers: { "x-auth-token": token } }
      );
      toast({
        title: "Success",
        description: "Assigned to Warden successfully!",
      });
      fetchDetails();
      setAssignModalOpen(false);
    } catch (error) {
      console.error("Error assigning to staff:", error);
      toast({
        title: "Error",
        description: "Failed to assign to Warden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Student Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setFormModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New OP Form
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clearTokens();
                navigate("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userOpDetails.map((detail) => (
            <Card
              key={detail._id}
              className="hover:shadow-lg transition-shadow dark:bg-gray-800"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="mr-4">
                    <AvatarFallback>{detail.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold dark:text-white">
                      {detail.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {detail.department} - {detail.rollno}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 dark:text-gray-400" />
                    <span className="text-sm dark:text-gray-300">
                      From: {new Date(detail.dateFrom).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 dark:text-gray-400" />
                    <span className="text-sm dark:text-gray-300">
                      {detail.timeFrom} - {detail.timeTo}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 dark:text-gray-400" />
                    <span className="text-sm dark:text-gray-300">
                      {detail.city}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <FileText className="mr-2 h-4 w-4 mt-1 dark:text-gray-400" />
                    <span className="text-sm dark:text-gray-300">
                      {detail.reason}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Badge
                    variant={
                      detail?.isAccept === true
                        ? "default" // Change "success" to "default" or another valid value
                        : detail?.isAccept === false
                        ? "destructive"
                        : "outline" // Change "default" to "outline" or another valid value
                    }
                  >
                    {detail.isAccept === true
                      ? "Accepted"
                      : detail.isAccept === false
                      ? "Rejected"
                      : "Pending"}
                  </Badge>
                  {!detail.staffId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedOpDetail(detail);
                        setAssignModalOpen(true);
                      }}
                    >
                      Assign to Warden
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {detail.isAccept && (
                  <Button
                    variant="link"
                    onClick={() => {
                      setSelectedOpDetail(detail);
                      setQrModalOpen(true);
                    }}
                  >
                    View Ticket
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* New Form Modal */}
      <Dialog open={formModalOpen} onOpenChange={setFormModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New OP Form</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Student Name"
                  {...register("name")}
                  error={errors.name?.message}
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="Department"
                  {...register("department")}
                  error={errors.department?.message}
                />
              </div>
              <div>
                <Label htmlFor="rollno">Roll Number</Label>
                <Input
                  id="rollno"
                  placeholder="Roll Number"
                  {...register("rollno")}
                  error={errors.rollno?.message}
                />
              </div>
              <div>
                <Label htmlFor="dateFrom">From Date</Label>
                <Input
                  type="date"
                  id="dateFrom"
                  {...register("dateFrom")}
                  error={errors.dateFrom?.message}
                />
              </div>
              <div>
                <Label htmlFor="dateTo">To Date</Label>
                <Input
                  type="date"
                  id="dateTo"
                  {...register("dateTo")}
                  error={errors.dateTo?.message}
                />
              </div>
              <div>
                <Label htmlFor="timeFrom">From Time</Label>
                <Input
                  type="time"
                  id="timeFrom"
                  {...register("timeFrom")}
                  error={errors.timeFrom?.message}
                />
              </div>
              <div>
                <Label htmlFor="timeTo">To Time</Label>
                <Input
                  type="time"
                  id="timeTo"
                  {...register("timeTo")}
                  error={errors.timeTo?.message}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  {...register("city")}
                  error={errors.city?.message}
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  placeholder="Year"
                  {...register("year")}
                  error={errors.year?.message}
                />
              </div>
              <div>
                <Label htmlFor="phNo">Phone Number</Label>
                <Input
                  id="phNo"
                  placeholder="Phone Number"
                  {...register("phNo")}
                  error={errors.phNo?.message}
                />
              </div>
              <div>
                <Label htmlFor="parentPhNo">Parent Phone Number</Label>
                <Input
                  id="parentPhNo"
                  placeholder="Parent Phone Number"
                  {...register("parentPhNo")}
                  error={errors.parentPhNo?.message}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Reason"
                  {...register("reason")}
                  error={errors.reason?.message}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setFormModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Staff Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign to Warden</DialogTitle>
          </DialogHeader>
          <Select onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a warden" />
            </SelectTrigger>
            <SelectContent>
              {staffList.map((staff) => (
                <SelectItem key={staff._id} value={staff._id}>
                  {staff.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={assignToStaff}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Outpass QR Code</DialogTitle>
          </DialogHeader>
          {selectedOpDetail && (
            <div className="flex flex-col items-center">
              <QRCode value={selectedOpDetail._id} size={256} />
              <h3 className="mt-4 font-semibold">{selectedOpDetail.name}</h3>
              <p className="text-sm">Roll No: {selectedOpDetail.rollno}</p>
              <p className="text-sm">
                Valid from:{" "}
                {new Date(selectedOpDetail.dateFrom).toLocaleDateString()} to{" "}
                {new Date(selectedOpDetail.dateTo).toLocaleDateString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Student;
