import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/Icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { setTokens } from "@/utils/tokenManager";
import { baseURL } from "@/context/ApiInterceptor";
import { Moon, Sun } from "lucide-react";

// Validation schema
const schema = yup.object().shape({
  role: yup.string().required("Role is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

const LoginForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<string>("");
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "",
      email: "",
      password: "",
    },
  });

  const role = watch("role");

  const onSubmit = async (data: FormData) => {
    try {
      const url = `${baseURL}/auth/login`;
      console.log("Sending request to:", url);
      console.log("Request payload:", data);
      const response = await axios.post(url, data);
      const { accessToken, refreshToken, role, userId } = response.data;
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      setTokens(accessToken, refreshToken);
      toast({
        title: "Success",
        description: response.data.message || "Login successful!",
      });
      navigateBasedOnRole(role);
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
      }
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navigateBasedOnRole = (role: string) => {
    switch (role) {
      case "student":
        navigate("/student");
        break;
      case "staff":
        navigate("/staff");
        break;
      case "security":
        navigate("/security");
        break;
      default:
        navigate("/");
    }
  };

  const handleRoleSelection = (role: string) => {
    setValue("role", role);
    setSelectedRole(role);
  };

  const handleCopyrightClick = useCallback(() => {
    setTapCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount >= 10) {
        setSecurityModalOpen(true);
        return 0;
      }
      return newCount;
    });
  }, []);

  useEffect(() => {
    if (tapCount > 0 && tapCount < 6) {
      const timer = setTimeout(() => setTapCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [tapCount]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200`}
    >
      <Card className="w-full max-w-md shadow-lg dark:bg-gray-800">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="ml-auto"
            >
              {darkMode ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </Button>
          </div>
          <CardDescription className="text-center">
            Please log in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-around mb-4">
              <Button
                type="button"
                variant={role === "student" ? "default" : "outline"}
                className={`flex flex-col items-center transition-all duration-200 ${
                  role === "student" ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => handleRoleSelection("student")}
              >
                <Icons.school className="h-6 w-6 mb-2" />
                Student
              </Button>
              <Button
                type="button"
                variant={role === "staff" ? "default" : "outline"}
                className={`flex flex-col items-center transition-all duration-200 ${
                  role === "staff" ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => handleRoleSelection("staff")}
              >
                <Icons.work className="h-6 w-6 mb-2" />
                Warden
              </Button>
            </div>
            {errors.role && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.role.message}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={`${
                  errors.email ? "border-red-500" : ""
                } dark:bg-gray-700 dark:text-white`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={`${
                  errors.password ? "border-red-500" : ""
                } dark:bg-gray-700 dark:text-white`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
          <p className="text-sm text-center mt-4 dark:text-gray-300">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
          <p
            className="text-xs text-center mt-4 opacity-70 cursor-pointer dark:text-gray-400"
            onClick={handleCopyrightClick}
          >
            HostelGo © 2024
          </p>
        </CardContent>
      </Card>

      <Dialog open={securityModalOpen} onOpenChange={setSecurityModalOpen}>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Security Login</DialogTitle>
            <DialogDescription>
              Enter your credentials to login as security.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="security-email">Email</Label>
              <Input
                id="security-email"
                type="email"
                {...register("email")}
                className={`${
                  errors.email ? "border-red-500" : ""
                } dark:bg-gray-700 dark:text-white`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="security-password">Password</Label>
              <Input
                id="security-password"
                type="password"
                {...register("password")}
                className={`${
                  errors.password ? "border-red-500" : ""
                } dark:bg-gray-700 dark:text-white`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={() => setValue("role", "security")}
            >
              Login as Security
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginForm;
