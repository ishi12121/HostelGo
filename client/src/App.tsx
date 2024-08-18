import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import About from "./pages/About";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import Register from "./pages/Register";
import Student from "./pages/Student";
import Staff from "./pages/Staff";
import Security from "./pages/Security";

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  useEffect(() => {
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
    <div className="container mx-auto p-4">
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
    </div>
  );
}

export default App;
