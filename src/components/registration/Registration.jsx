import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";

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
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [passwordError, setPasswordError] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // const handleChange = (e) => {
  //   const { name, value, type, files } = e.target;
  //   setFormData((prevData) => {
  //     const updatedData = {
  //       ...prevData,
  //       [name]: type === "file" ? files[0] : value,
  //     };

  //     if (name === "mobileNumber") {
  //       updatedData.mobileNumber = value.toString();
  //     }

  //     if (updatedData.password !== updatedData.confirmPassword) {
  //       setPasswordError(true);
  //     } else {
  //       setPasswordError(false);
  //     }

  //     return updatedData;
  //   });

  //   if (type === "file") {
  //     const file = files[0];
  //     if (file) {
  //       setImagePreview(URL.createObjectURL(file));
  //     } else {
  //       setImagePreview(null);
  //     }
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });

    if (type === "file") {
      const file = files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    }

    validate(name, value);
  };

  const validate = (name, value) => {
    const newErrors = {};

    if (name === "firstName") {
      if (!value) {
        newErrors.firstName = "Firstname is required";
      }
    }
    if (name === "lastName") {
      if (!value) {
        newErrors.lastName = "Lastname is required";
      }
    }
    if (name === "mobileNumber") {
      if (!value) {
        newErrors.lastName = "Lastname is required";
      } else if (!/^\d{10}$/.test(value)) {
        newErrors.mobileNumber = "Mobile must be of 10 digits";
      }
    }
    if (name === "email") {
      if (!value) {
        newErrors.email = "Email is required";
      }
    }
    if (name === "age") {
      if (!value) {
        newErrors.age = "Age is required";
      }
    }
    if (name === "gender") {
      if (!value) {
        newErrors.gender = "Gender is required";
      }
    }
    if (name === "dob") {
      if (!value) {
        newErrors.dob = "Birth date is required";
      }
    }
    if (name === "religion") {
      if (!value) {
        newErrors.religion = "Religion is required";
      }
    }
    if (name === "community") {
      if (!value) {
        newErrors.community = "Community is required";
      }
    }
    if (name === "residence") {
      if (!value) {
        newErrors.residence = "Residence is required";
      }
    }
    if (name === "password") {
      if (!value) {
        newErrors.password = "Password is required";
      }
    }
    if (name === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Confirm Password is required";
      }
    }

    setErrors(newErrors);
  };

  const validateAll = () => {
    const newErrors = {};
    const mobileNumberPattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Check for missing fields
    if (!mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!age) newErrors.age = "Age is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (!religion) newErrors.religion = "Religion is required";
    if (!community) newErrors.community = "Community is required";
    if (!dob) newErrors.dob = "Date of birth is required";
    if (!residence) newErrors.residence = "Residence is required";
    if (!email) newErrors.email = "Email is required";
    if (!profileImage) newErrors.profileImage = "Profile image is required";

    // Validate mobile number pattern
    if (mobileNumber && !mobileNumberPattern.test(mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits.";
    }

    // Validate email pattern
    if (email && !emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Check password match
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.password = "Passwords do not match.";
    }

    // Update the errors state
    setErrors(newErrors);

    // Return true if no errors, otherwise false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateAll()) {
      try {
        setLoading(true); // Set loading before sending the request

        const formDataToSend = new FormData();
        for (const key in formData) {
          formDataToSend.append(
            key === "email" ? "userMailId" : key,
            formData[key]
          );
        }

        // Send form data
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
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all fields and upload a profile image.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    // <Box
    //   sx={{
    //     backgroundColor: "#fefae0",
    //     maxWidth: "600px",
    //     margin: "auto",
    //     mt: 15,
    //     p: 3,
    //     boxShadow: 3,
    //     borderRadius: 2,
    //     display: "flex",
    //     flexDirection: "column",
    //     overflowY: "auto", // Enable vertical scrolling
    //     maxHeight: "90vh", // Limit the height for mobile
    //   }}
    // >
    //   <Typography variant="h4" component="h1" gutterBottom align="center">
    //     User Registration
    //   </Typography>

    //   <Box
    //     sx={{
    //       display: "flex",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       mb: 2,
    //     }}
    //   >
    //     <Box
    //       component="img"
    //       src={imagePreview || "https://via.placeholder.com/80"}
    //       alt="Profile Preview"
    //       sx={{
    //         width: { xs: "60px", md: "80px" },
    //         height: { xs: "60px", md: "80px" },
    //         borderRadius: "50%",
    //         border: "1px solid #ccc",
    //         objectFit: "cover",
    //         mr: 2,
    //       }}
    //     />
    //     <label htmlFor="profile-image-upload">
    //       <input
    //         type="file"
    //         name="profileImage"
    //         accept="image/jpeg"
    //         onChange={handleChange}
    //         style={{ display: "none" }}
    //         id="profile-image-upload"
    //       />
    //       <Button
    //         variant="contained"
    //         component="span"
    //         size="small"
    //         sx={{ mr: 2 }}
    //       >
    //         Upload Profile Image
    //       </Button>
    //     </label>
    //     <Typography variant="caption" color="primary">
    //       Image type is .JPG with size up to 1 mb
    //     </Typography>
    //   </Box>

    //   <form onSubmit={handleSubmit} style={{ overflowY: "auto", flexGrow: 1 }}>
    //     <Grid container spacing={2}>
    //       <Grid item xs={12} sm={6}>
    //         <TextField
    //           name="firstName"
    //           label="First Name"
    //           fullWidth
    //           onChange={handleChange}
    //           required
    //           size="small"
    //         />
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <TextField
    //           name="lastName"
    //           label="Last Name"
    //           fullWidth
    //           onChange={handleChange}
    //           required
    //           size="small"
    //         />
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <TextField
    //           name="mobileNumber"
    //           label="Mobile Number"
    //           type="number"
    //           fullWidth
    //           onChange={handleChange}
    //           required
    //           size="small"
    //           inputProps={{ maxLength: 10 }}
    //           onInput={(e) => {
    //             if (e.target.value.length > 10) {
    //               e.target.value = e.target.value.slice(0, 10);
    //             }
    //           }}
    //         />
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <TextField
    //           name="dob"
    //           label="Date of Birth"
    //           type="date"
    //           fullWidth
    //           InputLabelProps={{ shrink: true }}
    //           onChange={handleChange}
    //           required
    //           size="small"
    //         />
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <TextField
    //           name="age"
    //           label="Age"
    //           type="number"
    //           fullWidth
    //           onChange={handleChange}
    //           required
    //           size="small"
    //         />
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <FormControl fullWidth size="small">
    //           <InputLabel id="gender-select-label">Gender</InputLabel>
    //           <Select
    //             name="gender"
    //             value={formData.gender}
    //             onChange={handleChange}
    //             required
    //             label={"Gender"}
    //           >
    //             <MenuItem value="Male">Male</MenuItem>
    //             <MenuItem value="Female">Female</MenuItem>
    //             <MenuItem value="Others">Others</MenuItem>
    //           </Select>
    //         </FormControl>
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <FormControl fullWidth size="small">
    //           <InputLabel id="religion-select-label">Religion</InputLabel>
    //           <Select
    //             name="religion"
    //             value={formData.religion}
    //             onChange={handleChange}
    //             required
    //             label={"Religion"}
    //           >
    //             <MenuItem value="Hindu">Hindu</MenuItem>
    //             <MenuItem value="Muslim">Muslim</MenuItem>
    //             <MenuItem value="Christian">Christian</MenuItem>
    //             <MenuItem value="Sikh">Sikh</MenuItem>
    //             <MenuItem value="Parsi">Parsi</MenuItem>
    //             <MenuItem value="Jain">Jain</MenuItem>
    //             <MenuItem value="Buddhist">Buddhist</MenuItem>
    //             <MenuItem value="Jewish">Jewish</MenuItem>
    //             <MenuItem value="No Religion">No Religion</MenuItem>
    //             <MenuItem value="Spiritual - not religious">Spiritual</MenuItem>
    //             <MenuItem value="Other">Other</MenuItem>
    //           </Select>
    //         </FormControl>
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <FormControl fullWidth size="small">
    //           <InputLabel id="community-select-label">Community</InputLabel>
    //           <Select
    //             name="community"
    //             value={formData.community}
    //             onChange={handleChange}
    //             required
    //             label="Community"
    //           >
    //             <MenuItem value="English">English</MenuItem>
    //             <MenuItem value="Hindi">Hindi</MenuItem>
    //             <MenuItem value="Urdu">Urdu</MenuItem>
    //             <MenuItem value="Telugu">Telugu</MenuItem>
    //             <MenuItem value="Tamil">Tamil</MenuItem>
    //           </Select>
    //         </FormControl>
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <TextField
    //           name="residence"
    //           label="Residence"
    //           fullWidth
    //           onChange={handleChange}
    //           required
    //           size="small"
    //         />
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <TextField
    //           name="email"
    //           label="Email"
    //           type="email"
    //           fullWidth
    //           onChange={handleChange}
    //           required
    //           size="small"
    //         />
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <TextField
    //           name="password"
    //           label="Password"
    //           type={showPassword ? "text" : "password"}
    //           fullWidth
    //           onChange={handleChange}
    //           required
    //           size="small"
    //           InputProps={{
    //             endAdornment: (
    //               <Button onClick={() => setShowPassword(!showPassword)}>
    //                 {showPassword ? <VisibilityOff /> : <Visibility />}
    //               </Button>
    //             ),
    //           }}
    //         />
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <TextField
    //           name="confirmPassword"
    //           label="Confirm Password"
    //           type={showConfirmPassword ? "text" : "password"}
    //           fullWidth
    //           onChange={handleChange}
    //           required
    //           size="small"
    //           InputProps={{
    //             endAdornment: (
    //               <Button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
    //                 {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
    //               </Button>
    //             ),
    //           }}
    //         />
    //         {passwordError && (
    //           <Typography color="error" variant="caption">
    //             Passwords do not match
    //           </Typography>
    //         )}
    //       </Grid>
    //       <Grid item xs={12}>
    //         <Button
    //           type="submit"
    //           variant="contained"
    //           color="primary"
    //           fullWidth
    //           disabled={loading}
    //           onClick={handleSubmit}
    //           sx={{ mt: 2 }} // Add some margin at the top
    //         >
    //           {loading ? <ClipLoader size={20} color="#ffffff" /> : "Register"}
    //         </Button>
    //       </Grid>
    //     </Grid>
    //   </form>
    // </Box>

    <div className="h-auto hover:bg-gray-50 transition duration-100">
      <div className="mx-auto my-16">
        <div className="flex justify-center">
          <div className="w-full xl:w-4/5 lg:w-11/12 flex">
            <div
              className="w-full dark:bg-gray-800 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
              style={{
                backgroundImage:
                  "url('https://www.affck.com/uploads/article/23666/DDEDOSjFLhb447ri.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="w-full lg:w-7/12 bg-white dark:bg-gray-700 p-8 rounded-lg lg:rounded-l-none">
              <div
                className="flex items-center justify-center mb-4"
                style={{ justifyContent: "space-around" }}
              >
                <div className="relative">
                  <label htmlFor="profileImage" className="cursor-pointer">
                    <input
                      id="profileImage"
                      className="hidden"
                      type="file"
                      name="profileImage"
                      accept="image/jpeg"
                      onChange={handleChange}
                    />
                    <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                      {/* Display uploaded image or a placeholder */}
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-200">
                          Add Photo
                        </span>
                      )}
                    </div>
                    {/* Edit icon overlay */}
                    <div className="absolute bottom-0 right-0 bg-blue-500 dark:bg-blue-700 text-white p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536M7.5 18.5l-4-4 9-9 4 4-9 9zM16.5 10.5l-1.086-1.086"
                        />
                      </svg>
                    </div>
                  </label>
                </div>

                <h3 className="py-4 text-3xl text-center text-gray-800 dark:text-white ml-4">
                  Create Your Account!
                </h3>
              </div>
              <hr />
              <form
                className="pt-6 bg-white dark:bg-gray-800 rounded"
                onSubmit={handleSubmit}
              >
                <div className="mb-2 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      onChange={handleChange}
                    />
                    {errors.firstName && (
                      <p className="text-xs italic text-red-500">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <p className="text-xs italic text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="lastName"
                    >
                      Mobile
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="mobileNumber"
                      type="text"
                      placeholder="Mobile"
                      name="mobileNumber"
                      onChange={handleChange}
                    />
                    {errors.mobileNumber && (
                      <p className="text-xs italic text-red-500">
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-2 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="Email"
                      name="email"
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="text-xs italic text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="email"
                    >
                      Age
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="age"
                      type="Number"
                      placeholder="Age"
                      name="age"
                      onChange={handleChange}
                    />
                    {errors.age && (
                      <p className="text-xs italic text-red-500">
                        {errors.age}
                      </p>
                    )}
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="lastName"
                    >
                      Gender
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="gender"
                      type="text"
                      placeholder="Gender"
                      name="gender"
                      onChange={handleChange}
                    />
                    {errors.gender && (
                      <p className="text-xs italic text-red-500">
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-2 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="email"
                    >
                      Date of Birth
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="dob"
                      type="Date"
                      placeholder="Date of Birth"
                      name="dob"
                      onChange={handleChange}
                    />
                    {errors.dob && (
                      <p className="text-xs italic text-red-500">
                        {errors.dob}
                      </p>
                    )}
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="lastName"
                    >
                      Religion
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="religion"
                      type="text"
                      placeholder="Religion"
                      name="religion"
                      onChange={handleChange}
                    />
                    {errors.religion && (
                      <p className="text-xs italic text-red-500">
                        {errors.religion}
                      </p>
                    )}
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="email"
                    >
                      Community
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="community"
                      type="text"
                      placeholder="Community"
                      name="community"
                      onChange={handleChange}
                    />
                    {errors.community && (
                      <p className="text-xs italic text-red-500">
                        {errors.community}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-2 md:flex">
                  <div className="w-full">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="lastName"
                    >
                      Residence
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="residence"
                      type="text"
                      placeholder="Residence"
                      name="residence"
                      onChange={handleChange}
                    />
                    {errors.residence && (
                      <p className="text-xs italic text-red-500">
                        {errors.residence}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-2 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border border-red-500 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="password"
                      type="password"
                      placeholder="******************"
                      name="password"
                      onChange={handleChange}
                    />
                    {errors.password && (
                      <p className="text-xs italic text-red-500">
                        {errors.password}
                      </p>
                    )}
                    {/* <p className="text-xs italic text-red-500">Please choose a password.</p> */}
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="c_password"
                    >
                      Confirm Password
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="c_password"
                      type="password"
                      placeholder="******************"
                      name="confirmPassword"
                      onChange={handleChange}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs italic text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6 text-center">
                  <button
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Register Account
                  </button>
                </div>

                <hr className="mb-6 border-t" />
                <div className="text-center">
                  <a
                    className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="text-center">
                  <a
                    className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                    href="./index.html"
                  >
                    Already have an account? Login!
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
