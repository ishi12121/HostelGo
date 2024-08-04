import { Container } from "@mui/material";
import  { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { ApiProvider } from "./context/ApiContext";
import { AppProvider } from "./context/AppContext";
import About from "./pages/About";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Security from "./pages/Security";
import Staff from "./pages/Staff";
import Student from "./pages/Student";

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
      <Container>
        <Routes>
          <Route
            path="/student"
            element={
              role === "student" ? <Student /> : <Navigate to="/login" />
            }
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
      </Container>
    </>
  );
}

export default App;
