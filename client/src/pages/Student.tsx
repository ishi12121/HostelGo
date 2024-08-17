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

// Define your schema
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

      {/* New OP Form Modal */}
      <Dialog open={formModalOpen} onOpenChange={setFormModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New OP Form</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  {...register("name")}
                  error={errors.name?.message}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Input
                  id="department"
                  className="col-span-3"
                  {...register("department")}
                  error={errors.department?.message}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rollno" className="text-right">
                  Roll Number
                </Label>
                <Input
                  id="rollno"
                  className="col-span-3"
                  {...register("rollno")}
                  error={errors.rollno?.message}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">
                  Year
                </Label>
                <Input
                  id="year"
                  className="col-span-3"
                  {...register("year")}
                  error={errors.year?.message}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateFrom" className="text-right">
                  Date From
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  className="col-span-3"
                  {...register("dateFrom")}
                  error={errors.dateFrom?.message}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateTo" className="text-right">
                  Date To
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  className="col-span-3"
                  {...register("dateTo")}
                  error={errors.dateTo?.message}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timeFrom" className="text-right">
                  Time From
                </Label>
                <Input
                  id="timeFrom"
                  type="time"
                  className="col-span-3"
                  {...register("timeFrom")}
                  error={errors.timeFrom?.message}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timeTo" className="text-right">
                  Time To
                </Label>
                <Input
                  id="timeTo"
                  type="time"
                  className="col-span-3"
                  {...register("timeTo")}
                  error={errors.timeTo?.message}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phNo" className="text-right">
                  Phone Number
                </Label>
                <Input
                  id="phNo"
                  className="col-span-3"
                  {...register("phNo")}
                  error={errors.phNo?.message}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentPhNo" className="text-right">
                  Parent Phone
                </Label>
                <Input
                  id="parentPhNo"
                  className="col-span-3"
                  {...register("parentPhNo")}
                  error={errors.parentPhNo?.message}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  City
                </Label>
                <Input
                  id="city"
                  className="col-span-3"
                  {...register("city")}
                  error={errors.city?.message}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Textarea
                  id="reason"
                  className="col-span-3"
                  {...register("reason")}
                  error={errors.reason?.message}
                />
              </div>
            </div>
            <DialogFooter>
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
