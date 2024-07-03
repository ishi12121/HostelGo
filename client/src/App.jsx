import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import About from "./pages/About";
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
  return (
    <>
      <Container>
        <Routes>
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
