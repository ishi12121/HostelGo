import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
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
      {location.pathname !== "/login" && <Header />}
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
