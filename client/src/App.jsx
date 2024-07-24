import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import About from "./pages/About";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import { ApiProvider } from "./context/ApiContext";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Student from "./pages/Student";
import Staff from "./pages/Staff";
import Security from "./pages/Security";

function App() {
  return (
    <AppProvider>
      <ApiProvider>
        <Router>
          <Main />
        </Router>
      </ApiProvider>
    </AppProvider>
  );
}

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Redirect based on role when accessing the root path
    if (location.pathname === "/") {
      if (role === "student") {
        navigate("/student");
      } else if (role === "staff") {
        navigate("/staff");
      } else {
        navigate("/login");
      }
    }
  }, [location.pathname, navigate, role]);

  return (
    <>
      <Routes>
        <Route
          path="/student"
          element={role === "student" ? <Student /> : <Navigate to="/login" />}
        />
        <Route
          path="/staff"
          element={role === "staff" ? <Staff /> : <Navigate to="/login" />}
        />
        <Route
          path="/security"
          element={
            role === "security" ? <Security /> : <Navigate to="/login" />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
