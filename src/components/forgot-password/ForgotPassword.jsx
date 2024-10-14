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
import qs from "qs"; // Import qs for URL encoding
import { AxiosConfig } from "../../config/AxiosConfig"; // Adjust the path as needed
import Swal from "sweetalert2"; // Import SweetAlert

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`; // Convert to dd-MM-yyyy
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format the dateOfBirth before sending
    const formattedData = {
      ...formData,
      dateOfBirth: formatDate(formData.dateOfBirth),
    };

    try {
      const response = await AxiosConfig.post(
        "/user/forgot-password",
        qs.stringify(formattedData), // Stringify the data
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.statusCode === 200) {
        Swal.fire({
          title: "Success!",
          text: "Password reset email has been sent to your registered email ID!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setLoading(false);
          navigate("/login"); // Navigate to login after successful submission
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.statusMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error sending reset email", error.response || error);
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: "Failed to send reset email. Please try again.",
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
          backgroundColor: "rgba(255, 255, 255, 0.3)",
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
          Forgot Password
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
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#001d4a",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#001d4a",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#001d4a",
                  "&.Mui-focused": {
                    color: "#001d4a",
                  },
                },
              }}
            />
            <TextField
              variant="outlined"
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#001d4a",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#001d4a",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#001d4a",
                  "&.Mui-focused": {
                    color: "#001d4a",
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
              Send Reset Email
            </Button>
          </Box>
        )}

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          Remembered your password?{" "}
          <Link
            to="/login"
            style={{
              color: "blue",
              textDecoration: "underline",
              fontWeight: "bold",
              transition: "color 0.3s",
            }}
          >
            Login here
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
