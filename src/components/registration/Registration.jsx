import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Registration() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
    religion: "",
    community: "",
    dob: "",
    residence: "",
    email: "",
    profileImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: type === "file" ? files[0] : value,
      };

      if (name === "mobileNumber") {
        updatedData.mobileNumber = value.toString();
      }

      if (updatedData.password !== updatedData.confirmPassword) {
        setPasswordError(true);
      } else {
        setPasswordError(false);
      }

      return updatedData;
    });

    if (type === "file") {
      const file = files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      mobileNumber,
      firstName,
      lastName,
      age,
      gender,
      password,
      confirmPassword,
      religion,
      community,
      dob,
      residence,
      email,
      profileImage,
    } = formData;

    if (
      !mobileNumber ||
      !firstName ||
      !lastName ||
      !age ||
      !gender ||
      !password ||
      !confirmPassword ||
      !religion ||
      !community ||
      !dob ||
      !residence ||
      !email ||
      !profileImage
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all fields and upload a profile image.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const mobileNumberPattern = /^[0-9]{10}$/;
    if (!mobileNumberPattern.test(mobileNumber)) {
      Swal.fire({
        title: "Error!",
        text: "Mobile number must be exactly 10 digits.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid email address.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(true);
      Swal.fire({
        title: "Error!",
        text: "Passwords do not match.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key === "email" ? "userMailId" : key, formData[key]);
    }

    try {
      await axios.post(
        "https://shaadi-be.fino-web-app.agency/api/v1/auth/create-profile",
        formDataToSend
      );
      setLoading(false);

      Swal.fire({
        title: "Success!",
        text: "Profile creation successful!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: "There was an issue creating the profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fefae0",
        maxWidth: "600px",
        margin: "auto",
        mt: 15,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto", // Enable vertical scrolling
        maxHeight: "90vh", // Limit the height for mobile
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        User Registration
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          component="img"
          src={imagePreview || "https://via.placeholder.com/80"}
          alt="Profile Preview"
          sx={{
            width: { xs: "60px", md: "80px" },
            height: { xs: "60px", md: "80px" },
            borderRadius: "50%",
            border: "1px solid #ccc",
            objectFit: "cover",
            mr: 2,
          }}
        />
        <label htmlFor="profile-image-upload">
          <input
            type="file"
            name="profileImage"
            accept="image/jpeg"
            onChange={handleChange}
            style={{ display: "none" }}
            id="profile-image-upload"
          />
          <Button
            variant="contained"
            component="span"
            size="small"
            sx={{ mr: 2 }}
          >
            Upload Profile Image
          </Button>
        </label>
        <Typography variant="caption" color="primary">
          Image type is .JPG with size up to 1 mb
        </Typography>
      </Box>

      <form onSubmit={handleSubmit} style={{ overflowY: "auto", flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              label="First Name"
              fullWidth
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="mobileNumber"
              label="Mobile Number"
              type="number"
              fullWidth
              onChange={handleChange}
              required
              size="small"
              inputProps={{ maxLength: 10 }}
              onInput={(e) => {
                if (e.target.value.length > 10) {
                  e.target.value = e.target.value.slice(0, 10);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="dob"
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="age"
              label="Age"
              type="number"
              fullWidth
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="gender-select-label">Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                label={"Gender"}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="religion-select-label">Religion</InputLabel>
              <Select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                required
                label={"Religion"}
              >
                <MenuItem value="Hindu">Hindu</MenuItem>
                <MenuItem value="Muslim">Muslim</MenuItem>
                <MenuItem value="Christian">Christian</MenuItem>
                <MenuItem value="Sikh">Sikh</MenuItem>
                <MenuItem value="Parsi">Parsi</MenuItem>
                <MenuItem value="Jain">Jain</MenuItem>
                <MenuItem value="Buddhist">Buddhist</MenuItem>
                <MenuItem value="Jewish">Jewish</MenuItem>
                <MenuItem value="No Religion">No Religion</MenuItem>
                <MenuItem value="Spiritual - not religious">Spiritual</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="community-select-label">Community</InputLabel>
              <Select
                name="community"
                value={formData.community}
                onChange={handleChange}
                required
                label="Community"
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Hindi">Hindi</MenuItem>
                <MenuItem value="Urdu">Urdu</MenuItem>
                <MenuItem value="Telugu">Telugu</MenuItem>
                <MenuItem value="Tamil">Tamil</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="residence"
              label="Residence"
              fullWidth
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              onChange={handleChange}
              required
              size="small"
              InputProps={{
                endAdornment: (
                  <Button onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              onChange={handleChange}
              required
              size="small"
              InputProps={{
                endAdornment: (
                  <Button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
            />
            {passwordError && (
              <Typography color="error" variant="caption">
                Passwords do not match
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              onClick={handleSubmit}
              sx={{ mt: 2 }} // Add some margin at the top
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Register"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Registration;
