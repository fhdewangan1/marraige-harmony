import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Registration from "./components/registration/Registration";
import Login from "./components/login/Login";
import Navbar from "./components/navbar/Navbar";
import CardEx from "./components/test/CardEx";
import FramerCardData from "./components/framer/FramerCardData";
import DemoCardDetails from "./components/framer/DemoCardDetails";
import FramerCard from "./components/framer/FramerCard/FramerCard";
import PrimaryUserDetails from "./components/Profile/primary-user-details/PrimaryUserDetails";
import LandingPage from "./components/landing/LandingPage";
import landingImage from "./images/bg-image-1.jpg";
import { Box, Card } from "@mui/material";
import ForgotPassword from "./components/forgot-password/ForgotPassword";
import ChangePassword from "./components/chnage-password/ChangePassword";

const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isRegisterPage = location.pathname === "/register";
  const isLoginPage = location.pathname === "/login";
  const isForgotPage = location.pathname === "/forgot-password";
  const isChangePass = location.pathname === "/change-password";
  console.log(location.pathname);
  return (
    <Card>
      <Box
        style={{
          height: "100vh", // Set to full viewport height
          width: "100vw", // Set to full viewport width
          overflow: "auto",
          backgroundColor:
            isLandingPage ||
            isRegisterPage ||
            isLoginPage ||
            isForgotPage ||
            isChangePass
              ? "transparent"
              : "var(--background-color)",
          color: "var(--text-color)",
          backgroundImage:
            isLandingPage ||
            isRegisterPage ||
            isLoginPage ||
            isForgotPage ||
            isChangePass
              ? `url(${landingImage})`
              : "none",
          backgroundSize: "cover",
          backgroundPosition: "center -17%", // Adjusted to move the image down
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          maxWidth: "100%",
          maxHeight: "100vh",
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Registration />} />
          {/* <Route path="/register" element={<DemoRegister />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/card" element={<CardEx />} />
          <Route path="/framer-data" element={<FramerCardData />} />
          <Route path="/profiles" element={<FramerCard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/all-details/:mobileNumber"
            element={<DemoCardDetails />}
          />
          <Route path="/grid" element={<PrimaryUserDetails />} />
        </Routes>
      </Box>
    </Card>
  );
};

function App() {
  return (
    <Card>
      <Router>
        <Navbar />
        <AppContent />
      </Router>
    </Card>
  );
}

export default App;
