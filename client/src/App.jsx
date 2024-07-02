import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/Header";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import { Container } from "@mui/material";
import "./App.css";
import { ApiProvider } from "./context/ApiContext";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Student from "./pages/Student";
import Staff from "./pages/Staff";

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
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" &&
        location.pathname !== "/register" &&
        location.pathname !== "/student" &&
        location.pathname !== "/staff" && <Header />}
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Student" element={<Student />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<ProtectedRoute />}>
            <Route path="" element={<Login />} />
          </Route>
          <Route path="/register" element={<ProtectedRoute />}>
            <Route path="" element={<Register />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
