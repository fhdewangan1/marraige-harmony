import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AxiosConfig } from "../../config/AxiosConfig";
import Swal from "sweetalert2"; // Import SweetAlert

function Login() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await AxiosConfig.get("/auth/login-profile", {
        params: formData,
      });
      if (response?.data?.statusCode === 200) {
        localStorage.setItem("userInfo", JSON.stringify(response.data));

        // Show SweetAlert success notification
        Swal.fire({
          title: "Login Successful",
          text: "You have successfully logged in!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setLoading(false); // Stop loading
          navigate("/profiles"); // Navigate to profiles after successful login
        });
      } else {
        Swal.fire({
          title: "Login failed",
          text: response?.data?.statusMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Login failed", error);
      setLoading(false); // Stop loading in case of error

      // Show SweetAlert error notification
      Swal.fire({
        title: "Login Failed",
        text: "Please check your credentials and try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:
          "url('/path/to/your/background/image.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.3)", // Semi-transparent background
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", mb: 2, color: "#001d4a" }}
        >
          Welcome to Shubh Shaadi
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", mb: 2, color: "#001d4a" }}
        >
          Login To Proceed
        </Typography>

        {/* Show loading spinner if loading is true */}
        {loading ? (
          <CircularProgress sx={{ margin: "2rem 0" }} />
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              variant="outlined"
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.7)", // Light background for input
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.5)", // Border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#001d4a", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#001d4a", // Border color when focused
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#001d4a", // Label color
                  "&.Mui-focused": {
                    color: "#001d4a", // Focused label color
                  },
                },
              }}
            />
            <TextField
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.7)", // Light background for input
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.5)", // Border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#001d4a", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#001d4a", // Border color when focused
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#001d4a", // Label color
                  "&.Mui-focused": {
                    color: "#001d4a", // Focused label color
                  },
                },
              }}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ backgroundColor: "#001d4a", color: "#fff", mt: 2 }}
            >
              Login
            </Button>
          </Box>
        )}

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: "center",
            color: "white",
            fontWeight: "bold", // Make the text bold
            letterSpacing: "0.5px", // Add some letter spacing
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "blue", // A contrasting color for the link
              textDecoration: "underline", // Underline the link
              fontWeight: "bold", // Bold link
              transition: "color 0.3s", // Smooth transition for hover effect
            }}
            // onMouseEnter={(e) => (e.target.style.color = "#ffd700")} // Change color on hover
            // onMouseLeave={(e) => (e.target.style.color = "#ffcc00")} // Reset color on mouse leave
          >
            Register here
          </Link>
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: "center",
            color: "white",
            fontWeight: "bold", // Make the text bold
            letterSpacing: "0.5px", // Add some letter spacing
          }}
        >
          Forgot Password?{" "}
          <Link
            to="/forgot-password"
            style={{
              color: "blue", // A contrasting color for the link
              textDecoration: "underline", // Underline the link
              fontWeight: "bold", // Bold link
              transition: "color 0.3s", // Smooth transition for hover effect
            }}
            // onMouseEnter={(e) => (e.target.style.color = "#ffd700")} // Change color on hover
            // onMouseLeave={(e) => (e.target.style.color = "#ffcc00")} // Reset color on mouse leave
          >
            Click here
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Login;
