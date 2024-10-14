import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme, useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import AuthHook from "../../auth/AuthHook";
import logo from "../../images/Logo.png"; // Import the logo

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
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo !== null;
  });

  const session = AuthHook();
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Simulate a loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogin = (userInfo) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setIsLoggedIn(true);
    navigate("/profiles");
  };

  const handleProfileClick = () => {
    if (session?.userName) {
      navigate(`/all-details/${session.userName}`);
    }
  };

  const drawerItems = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {session?.jwtToken ? (
          <>
            <ListItem button onClick={handleProfileClick}>
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem button component={Link} to="/profiles">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/change-password">
              <ListItemText primary="Change Password" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

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
    <>
      <AppBar sx={{ padding: 0, backgroundColor: "pink", color: "gray" }} position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontFamily: "serif",
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", md: "2rem" }, // Responsive font size
              color: "#f50057",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
              background: "linear-gradient(to right, #f50057, #ff4081)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Marriage Harmony
          </Typography>

          {isMobile ? (
            <>
              <IconButton color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
                sx={{ "& .MuiDrawer-paper": { paddingTop: "60px" } }} // Padding for better layout
              >
                {drawerItems}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: "10px" }}>
              {session?.jwtToken ? (
                <>
                  <Button color="inherit" onClick={handleProfileClick}>
                    My Profile
                  </Button>
                  <Button color="inherit" component={Link} to="/profiles">
                    Dashboard
                  </Button>
                  <Button color="inherit" component={Link} to="/change-password">
                  Change Password
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/">
                    Home
                  </Button>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
