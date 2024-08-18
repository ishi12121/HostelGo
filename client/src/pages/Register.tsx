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
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { baseURL } from "@/context/ApiInterceptor";
import { Moon, Sun, School, Briefcase, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import studentAnimation from "../components/lottie-files/student.json";
import wardenAnimation from "../components/lottie-files/warden.json";
import securityAnimation from "../components/lottie-files/security.json";
import Lottie from "react-lottie";

const studentOptions = {
  loop: true,
  autoplay: true,
  animationData: studentAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const wardenOptions = {
  loop: true,
  autoplay: true,
  animationData: wardenAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const securityOptions = {
  loop: true,
  autoplay: true,
  animationData: securityAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const schema = yup.object().shape({
  role: yup.string().required("Role is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type FormData = yup.InferType<typeof schema>;

const RegisterForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
      role: "student",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      let url;
      if (data.role === "security") {
        url = `${baseURL}/auth/register/Security`;
      } else {
        url =
          data.role === "student"
            ? `${baseURL}/auth/register/user`
            : `${baseURL}/auth/register/staff`;
      }

      const response = await axios.post(url, {
        email: data.email,
        password: data.password,
      });

      toast({
        title: "Success",
        description: response.data.message || "Registration successful!",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200 p-4">
      <Card className="w-full max-w-md shadow-lg dark:bg-gray-800">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="ml-auto"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
          <CardDescription>
            Please fill in the details to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Tabs
              defaultValue="student"
              onValueChange={(value) => setValue("role", value)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="staff">Warden</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="student">
                <Lottie options={studentOptions} height={120} width={120} />
              </TabsContent>
              <TabsContent value="staff">
                <Lottie options={wardenOptions} height={120} width={120} />
              </TabsContent>
              <TabsContent value="security">
                <Lottie options={securityOptions} height={120} width={120} />
              </TabsContent>
            </Tabs>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
          <p
            className="text-xs text-center opacity-70 cursor-pointer"
            onClick={handleCopyrightClick}
          >
            HostelGo © 2024
          </p>
        </CardFooter>
      </Card>

      <Dialog open={securityModalOpen} onOpenChange={setSecurityModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Security Guard Registration</DialogTitle>
            <DialogDescription>
              Enter your credentials to register as a security guard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="security-email">Email</Label>
              <Input
                id="security-email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="security-password">Password</Label>
              <Input
                id="security-password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={() => setValue("role", "security")}
            >
              Register as Security Guard
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterForm;
