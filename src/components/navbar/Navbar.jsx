import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { motion } from "framer-motion";
import styled from "styled-components";
import AuthHook from "../../auth/AuthHook";
import Swal from "sweetalert2";
import "./Navbar.css";
import {
  FaUser,
  FaTachometerAlt,
  FaKey,
  FaSignOutAlt,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa"; // Import icons
import { GiHamburgerMenu } from "react-icons/gi";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(""); // Track active link
  const session = AuthHook();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [toggleNavbarColor, setToggleNavbarColor] = useState(
    !!session?.jwtToken
  );

  useEffect(() => {
    setToggleNavbarColor(!!session?.jwtToken);
  }, [session]);

  // Set the default active link based on the current location
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]); // Update activeLink when the path changes

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
          text: "You have been logged out successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  const handleProfileClick = () => {
    if (session?.userName) {
      setActiveLink("profile");
      navigate(`/all-details/${session.userName}`);
      setMenuOpen(false); // Close the sidebar
    }
  };

  const handleNavigation = (link) => {
    setActiveLink(link);
    setMenuOpen(false);
    navigate(link);
  };

  return (
    <>
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
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <GiHamburgerMenu className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto">
              {session?.jwtToken ? (
                <>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeLink === "profile" ? "active" : ""
                      }`}
                      onClick={handleProfileClick}
                    >
                      <span className="nav-icon desktop-only"></span>
                      My Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        activeLink === "/profiles" ? "active" : ""
                      }`}
                      to="/profiles"
                      onClick={() => handleNavigation("/profiles")}
                    >
                      <span className="nav-icon desktop-only"></span>
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        activeLink === "/change-password" ? "active" : ""
                      }`}
                      to="/change-password"
                      onClick={() => handleNavigation("/change-password")}
                    >
                      <span className="nav-icon desktop-only"></span>
                      Change Password
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" onClick={handleLogout}>
                      <span className="nav-icon desktop-only"></span>
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        activeLink === "/" ? "active" : ""
                      }`}
                      to="/"
                      onClick={() => handleNavigation("/")}
                    >
                      <span className="nav-icon desktop-only"></span>
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        activeLink === "/login" ? "active" : ""
                      }`}
                      to="/login"
                      onClick={() => handleNavigation("/login")}
                    >
                      <span className="nav-icon desktop-only"></span>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        activeLink === "/register" ? "active" : ""
                      }`}
                      to="/register"
                      onClick={() => handleNavigation("/register")}
                    >
                      <span className="nav-icon desktop-only"></span>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className={`responsive-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header-wrap">
          <div className="navbar-brand">Marriage Harmony</div>
          <button className="close-button" onClick={() => setMenuOpen(false)}>
            &times;
          </button>
        </div>
        <ul className="mobile-menu">
          {session?.jwtToken ? (
            <>
              <li
                className={`mobile-link ${
                  activeLink === "profile" ? "active" : ""
                }`}
                onClick={handleProfileClick}
              >
                <FaUser className="mobile-icon" />
                My Profile
              </li>
              <li
                className={`mobile-link ${
                  activeLink === "/profiles" ? "active" : ""
                }`}
                onClick={() => handleNavigation("/profiles")}
              >
                <FaTachometerAlt className="mobile-icon" />
                Dashboard
              </li>
              <li
                className={`mobile-link ${
                  activeLink === "/change-password" ? "active" : ""
                }`}
                onClick={() => handleNavigation("/change-password")}
              >
                <FaKey className="mobile-icon" />
                Change Password
              </li>
              <li className="mobile-link" onClick={handleLogout}>
                <FaSignOutAlt className="mobile-icon" />
                Logout
              </li>
            </>
          ) : (
            <>
              <li
                className={`mobile-link ${activeLink === "/" ? "active" : ""}`}
                onClick={() => handleNavigation("/")}
              >
                <FaHome className="mobile-icon" />
                Home
              </li>
              <li
                className={`mobile-link ${
                  activeLink === "/login" ? "active" : ""
                }`}
                onClick={() => handleNavigation("/login")}
              >
                <FaSignInAlt className="mobile-icon" />
                Login
              </li>
              <li
                className={`mobile-link ${
                  activeLink === "/register" ? "active" : ""
                }`}
                onClick={() => handleNavigation("/register")}
              >
                <FaUserPlus className="mobile-icon" />
                Register
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default Navbar;
