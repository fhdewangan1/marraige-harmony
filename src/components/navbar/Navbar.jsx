import { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import AuthHook from "../../auth/AuthHook";
import Swal from "sweetalert2"; // Import SweetAlert
import "./Navbar.css";

const Loader = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const LoaderAnimation = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 5px solid #007bff;
  border-top: 5px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toggleNavbarColor, setToggleNavbarColor] = useState(false);
  const session = AuthHook();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo !== null;
  });

  useEffect(() => {
    setToggleNavbarColor(session?.jwtToken ? true : false);
  }, [session]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Simulate a loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  // Handle Logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout now!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout now!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("userInfo");
        Swal.fire({
          title: "Logout Successfully",
          text: "You have been logout successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setIsLoggedIn(false);
          navigate("/");
        });
      } else {
        Swal.fire({
          title: "Logout Failed",
          text: response.data.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    });
    // setIsLoggedIn(false);
    // navigate("/login");
  };

  const handleProfileClick = () => {
    if (session?.userName) {
      navigate(`/all-details/${session.userName}`);
    }
  };

  if (loading) {
    return (
      <Loader
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LoaderAnimation />
      </Loader>
    );
  }

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        toggleNavbarColor ? "nav-bg-white" : "nav-bg-transparent"
      }`}
    >
      <div className="container">
        <div className="navbar-brand">Marriage Harmony</div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon "></span>
        </button>
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto ">
            {session?.jwtToken ? (
              <>
                <li className="nav-item">
                  <button className="nav-link" onClick={handleProfileClick}>
                    My Profile
                  </button>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profiles">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/change-password">
                    Change Password
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
