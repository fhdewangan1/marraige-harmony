import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
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
import { Modal } from "react-bootstrap";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(""); // Track active link
  const session = AuthHook();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [toggleNavbarColor, setToggleNavbarColor] = useState(
    !!session?.jwtToken
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
                      onClick={toggleModal}
                    >
                      <span className="nav-icon desktop-only"></span>
                      My Requests
                    </button>
                  </li>
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
                  activeLink === "/profiles" ? "active" : ""
                }`}
                onClick={toggleModal}
              >
                <FaTachometerAlt className="mobile-icon" />
                My Requests
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

      {isModalOpen && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-users me-2"></i> Connection Requests
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              padding: "30px 50px",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            {/* Accepted Requests Section */}
            <h5 className="text-primary mb-3">Accepted Requests</h5>
            {[
              // Sample accepted user data
              {
                id: 1,
                name: "Alice Johnson",
                image: "https://via.placeholder.com/50",
              },
              {
                id: 2,
                name: "Bob Smith",
                image: "https://via.placeholder.com/50",
              },
            ].map((user, index) => (
              <div
                key={user.id}
                className="request-item d-flex align-items-center mb-3 p-2"
                style={{
                  borderRadius: "8px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f1f8f5",
                }}
              >
                <span className="serial-number me-3 text-muted">
                  {index + 1}.
                </span>
                <img
                  src={user.image}
                  alt={`${user.name}'s profile`}
                  className="user-image me-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <span
                  className="user-name flex-grow-1"
                  style={{ fontWeight: "500" }}
                >
                  {user.name}
                </span>
                <button
                  className="btn btn-success btn-sm mx-1"
                  onClick={() => handleAccept(user.id)}
                  style={{
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger btn-sm mx-1"
                  onClick={() => handleAccept(user.id)}
                  style={{
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  Reject
                </button>
              </div>
            ))}

            {/* Rejected Requests Section */}
            <h5 className="text-danger mt-4 mb-3">Rejected Requests</h5>
            {[
              // Sample rejected user data
              {
                id: 3,
                name: "Charlie Brown",
                image: "https://via.placeholder.com/50",
              },
              {
                id: 4,
                name: "David Lee",
                image: "https://via.placeholder.com/50",
              },
            ].map((user, index) => (
              <div
                key={user.id}
                className="request-item d-flex align-items-center mb-3 p-2"
                style={{
                  borderRadius: "8px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f9e9e9",
                }}
              >
                <span className="serial-number me-3 text-muted">
                  {index + 1}.
                </span>
                <img
                  src={user.image}
                  alt={`${user.name}'s profile`}
                  className="user-image me-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <span
                  className="user-name flex-grow-1"
                  style={{ fontWeight: "500" }}
                >
                  {user.name}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  Rejected
                </button>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={toggleModal}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Navbar;
