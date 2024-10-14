import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AxiosConfig } from "../../config/AxiosConfig";
import Swal from "sweetalert2"; // Import SweetAlert
import AuthHook from "../../auth/AuthHook";


function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Get the user session
  const session = AuthHook();
  const mobileNumber = session?.userName; // Use the userName from the session
//   const mobileNumber = 1234567890; // Use the userName from the session

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

    if (formData.newPassword !== formData.confirmNewPassword) {
      setLoading(false);
      Swal.fire({
        title: "Passwords do not match",
        text: "Please make sure your new passwords match.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await AxiosConfig.put(`/user/${mobileNumber}/change-password`, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (response.status === 200) {
        // Show SweetAlert success notification
        Swal.fire({
          title: "Password Changed Successfully",
          text: "Your password has been updated!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setLoading(false); // Stop loading
          navigate("/profiles"); // Navigate to profiles or desired page
        });
      } else {
        Swal.fire({
          title: "Change Password Failed",
          text: response.data.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Change password failed", error);
      setLoading(false); // Stop loading in case of error

      // Show SweetAlert error notification
      Swal.fire({
        title: "Change Password Failed",
        text: error.response?.data?.message || "Please try again later.",
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
          Change Your Password
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
              label="Old Password"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
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
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
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
              label="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
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
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ backgroundColor: "#001d4a", color: "#fff", mt: 2 }}
            >
              Change Password
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default ChangePassword;
