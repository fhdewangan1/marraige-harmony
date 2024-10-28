import { useState } from "react";
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
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { AxiosConfig } from "../../config/AxiosConfig";

function DemoRegister() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    langKnown: [],
    password: "",
    confirmPassword: "",
    religion: "",
    community: "",
    dob: "",
    residence: "",
    profileImage: null,
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null); // For image preview
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Navigation hook

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // If uploading profile image, set the preview
    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, profileImage: file });

      // Create an image preview URL
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      await AxiosConfig.post("auth/create-profile", formDataToSend);

      setLoading(false);

      Swal.fire({
        title: "Success!",
        text: "Profile creation successful!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/profiles");
      });
    } catch (error) {
      console.log("error :", error);
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
        width: { xs: "100%", md: "60%" },
        margin: "auto",
        mt: 5,
        boxShadow: 3,
        p: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" textAlign="center" mb={2}>
        Please Register to Proceed
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              size="small"
              required
            />
          </Grid>
          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              size="small"
              required
            />
          </Grid>
          {/* Mobile Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              size="small"
              required
            />
          </Grid>
          {/* Age */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              size="small"
              required
            />
          </Grid>
          {/* Gender */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Religion */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Religion"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          {/* Community */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Community"
              name="community"
              value={formData.community}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          {/* Date of Birth */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {/* Residence */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Residence"
              name="residence"
              value={formData.residence}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          {/* Profile Image */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              {/* Preview Avatar */}
              {profileImagePreview ? (
                <Avatar
                  src={profileImagePreview}
                  alt="Profile Preview"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
              ) : (
                <Avatar sx={{ width: 56, height: 56, mr: 2 }}>N/A</Avatar>
              )}
              <Button
                variant="outlined"
                component="label"
                sx={{ textTransform: "none" }}
              >
                Upload Profile Image
                <input
                  type="file"
                  hidden
                  name="profileImage"
                  onChange={handleChange}
                  accept="image/*"
                />
              </Button>
            </Box>
          </Grid>
          {/* Password */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              size="small"
              required
            />
          </Grid>
          {/* Confirm Password */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              size="small"
              required
            />
          </Grid>
        </Grid>

        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Register"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default DemoRegister;
