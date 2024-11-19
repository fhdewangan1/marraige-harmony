import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Registration.css";
import { ApiUrl } from "../../config/Config";
import axios from "axios";

const FullScreenModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CropContainer = styled.div`
  position: relative;
  width: 60vw;
  height: 90vh;
  background-color: #a1a1a1;

  @media (max-width: 768px) {
    width: 90vw;
  }
`;

const Button = styled.button`
  margin-top: 20px;
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
`;

const CloseIcon = styled(AiOutlineClose)`
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  z-index: 10;
  width: 30px;
  height: 30px;
`;

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
    mailId: "",
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCropScreenVisible, setIsCropScreenVisible] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState();

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 60); // 60 years ago

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18); // 18 years ago

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Set formData
    if (type === "file") {
      const file = files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file)); // Set the new image preview
        setCrop({ x: 0, y: 0 }); // Reset crop position
        setZoom(1); // Reset zoom
        setIsCropScreenVisible(true); // Open crop screen on image selection
        setFormData({ ...formData, profileImage: file }); // Set the profile image in form data
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "dob" && value) {
      const age = calculateAge(value);

      // Check for valid age (between 18 and 60)
      if (age < 18 || age > 60) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          age: "Age must be between 18 and 60",
        }));
        setFormData((prevData) => ({
          ...prevData,
          dob: value,
          age: "", // Clear age if invalid
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          dob: value,
          age, // Automatically set age if valid
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    validate(name, value); // Validate other fields
  };

  const validate = (name, value) => {
    const newErrors = {};

    // image validation
    if (name === "profileImage" && !value) {
      newErrors.profileImage = "Profile image is required";
    }
    // Check for required fields and other validations
    if (name === "firstName" && !value) {
      newErrors.firstName = "First name is required";
    }

    if (name === "lastName" && !value) {
      newErrors.lastName = "Last name is required";
    }

    if (name === "mobileNumber") {
      if (!value) {
        newErrors.mobileNumber = "Mobile number is required";
      } else if (!/^\d{10}$/.test(value)) {
        newErrors.mobileNumber = "Mobile must be of 10 digits";
      }
    }

    if (name === "mailId" && !value) {
      newErrors.mailId = "Email is required";
    }

    if (name === "age" && !value) {
      newErrors.age = "Age must be between 18 and 60";
    }

    if (name === "gender" && !value) {
      newErrors.gender = "Gender is required";
    }

    if (name === "dob" && !value) {
      newErrors.dob = "Birth date is required";
    }

    if (name === "religion" && !value) {
      newErrors.religion = "Religion is required"; // Validation for religion dropdown
    }

    if (name === "community" && !value) {
      newErrors.community = "Community is required"; // Validation for community dropdown
    }

    if (name === "residence" && !value) {
      newErrors.residence = "Residence is required";
    }

    if (name === "password" && !value) {
      newErrors.password = "Password is required";
    }

    if (name === "confirmPassword" && !value) {
      newErrors.confirmPassword = "Confirm Password is required";
    }

    setErrors(newErrors);
  };

  const validateAll = () => {
    const newErrors = {};
    const mobileNumberPattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const requiredFields = [
      { key: "mobileNumber", message: "Mobile number is required" },
      { key: "firstName", message: "First name is required" },
      { key: "lastName", message: "Last name is required" },
      {
        key: "age",
        message: "Age must be between 18 and 60",
      },
      { key: "gender", message: "Gender is required" },
      { key: "password", message: "Password is required" },
      { key: "confirmPassword", message: "Please confirm your password" },
      { key: "religion", message: "Religion is required" },
      { key: "community", message: "Community is required" },
      { key: "dob", message: "Date of birth is required" },
      { key: "residence", message: "Residence is required" },
      { key: "mailId", message: "Email is required" },
      { key: "profileImage", message: "Profile image is required" },
    ];

    const { mobileNumber, mailId, password, confirmPassword } = formData;

    // Check for missing required fields
    requiredFields.forEach((field) => {
      if (!formData[field.key]) {
        newErrors[field.key] = field.message;
      }
    });

    // Validate mobile number pattern
    if (mobileNumber && !mobileNumberPattern.test(mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits.";
    }

    // Validate mailId pattern
    if (mailId && !emailPattern.test(mailId)) {
      newErrors.mailId = "Please enter a valid mailId address.";
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setIsCropScreenVisible(true);
    }
  };

  // Handle image crop
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create cropped image blob
  const createCroppedImage = useCallback(() => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.src = imagePreview;

      image.onload = () => {
        const { width, height } = croppedAreaPixels;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          width,
          height,
          0,
          0,
          width,
          height
        );

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };
    });
  }, [imagePreview, croppedAreaPixels]);

  const handleSaveCroppedImage = async () => {
    const croppedImageBlob = await createCroppedImage();
    if (croppedImageBlob) {
      setFormData({ ...formData, profileImage: croppedImageBlob });
      setIsCropScreenVisible(false);
      setImagePreview(URL.createObjectURL(croppedImageBlob));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateAll()) {
      try {
        setLoading(true);

        const formDataToSend = new FormData();

        // Process each field before appending
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "dob" && value) {
            // Format the DOB to yyyy-MM-dd
            const formattedDob = new Date(value).toISOString().split("T")[0];
            formDataToSend.append(key, formattedDob);
          } else {
            formDataToSend.append(key, value);
          }
        });

        // Append profileImage if available
        // if (profileImageBlob) {
        //   formDataToSend.append("profileImage", profileImageBlob, "profile.jpg");
        // }

        await axios.post(`${ApiUrl}/auth/create-profile`, formDataToSend);

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
        console.error("Error:", error);
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: "There was an issue creating the profile.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      console.log("Form validation failed");
    }
  };

  function toPascalCase(text) {
    return text
      .toLowerCase()
      .replace(/(?:^|\s|-|_)\w/g, (match) => match.toUpperCase())
      .replace(/\s|-|_/g, "");
  }

  const handlePascalCaseChange = (e) => {
    const { name, value } = e.target;
    const pascalCaseValue = toPascalCase(value);

    // Pass the PascalCase value to the parent handleChange function
    handleChange({ target: { name, value: pascalCaseValue } });
  };

  const handleDateChange = (date) => {
    setStartDate(date); // Update selected date

    const dob = date; // Keep the date as a Date object
    const age = calculateAge(dob); // Calculate age based on Date object

    setFormData({
      ...formData,
      dob, // Store the Date object
      age, // Set the age based on DOB
    });
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Adjust age if the birthday hasn't occurred yet this year
    }
    return age;
  };

  return (
    <div style={{ maxHeight: "90vh" }}>
      <div className="mx-auto">
        <div className="py-2 text-end mr-12">
          <Link to={"/"} className="text-decoration-none">
            <i className="fa-solid fa-arrow-left-long"></i>
            <span className="ml-3 font-bold text-blue-500 hover:text-blue-700">
              Visit Home
            </span>
          </Link>
        </div>
        <div className="flex justify-center">
          <div className="w-full xl:w-4/5 lg:w-11/12 flex">
            <div
              className="w-full dark:bg-gray-800 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
              style={{
                backgroundImage:
                  "url('https://img.freepik.com/free-vector/man-using-face-mask-smartphone-illustration-designs_24877-63608.jpg?t=st=1729431096~exp=1729434696~hmac=2a804dbe0999555ea8a102307b1240a844cc3b5c26ef9f43eb8eb560918fcebe&w=740')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>

            <div className="w-full lg:w-7/12 bg-white dark:bg-gray-700 px-12 rounded-lg lg:rounded-l-none">
              <div
                className="flex items-center justify-center"
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
                      onChange={handleImageChange}
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
                        onClick={() => setIsCropScreenVisible(true)}
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
                {errors.profileImage && (
                  <p className="text-xs text-red-500">{errors.profileImage}</p>
                )}

                <h3 className="py-4 text-3xl text-center text-gray-800 dark:text-white ml-4">
                  Create Your Account!
                </h3>
              </div>
              <hr />
              <form
                className="bg-white dark:bg-gray-800 rounded-lg"
                onSubmit={handleSubmit}
              >
                {/* First and last name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <div>
                    <input
                      className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      onBlur={handlePascalCaseChange}
                      onChange={handleChange}
                      value={formData.firstName}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <input
                      className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      onBlur={handlePascalCaseChange}
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email and mobile number */}
                <div className="mb-4">
                  <input
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="mailId"
                    type="email"
                    placeholder="Email"
                    name="mailId"
                    onChange={handleChange}
                  />
                  {errors.mailId && (
                    <p className="text-xs text-red-500">{errors.mailId}</p>
                  )}
                </div>
                {/* Mobile number and gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <div>
                    <input
                      className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="mobileNumber"
                      type="tel"
                      placeholder="Mobile"
                      name="mobileNumber"
                      onChange={handleChange}
                      pattern="[\+0-9]{1}[0-9]{9,14}"
                      required
                    />
                    {errors.mobileNumber && (
                      <p className="text-xs text-red-500">
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <select
                      className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="gender"
                      name="gender"
                      onChange={handleChange}
                      defaultValue="" // To show a placeholder
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-xs text-red-500">{errors.gender}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 w-100">
                  {/* Date Picker with Custom Input */}
                  <div className="w-full">
                    {/* Date Picker */}
                    <div className=" w-full">
                      <DatePicker
                        selected={startDate}
                        onChange={handleDateChange}
                        showYearDropdown
                        showMonthDropdown
                        scrollableMonthDropdown
                        scrollableYearDropdown
                        dateFormat="MM/dd/yyyy"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholderText="Select Date of Birth"
                        minDate={minDate}
                        maxDate={maxDate}
                        yearDropdownItemNumber={50}
                      />
                    </div>
                  </div>

                  {/* Age Display */}
                  <div className="w-full">
                    <select
                      className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="age"
                      name="age"
                      value={formData.age}
                      disabled
                    >
                      <option value="" disabled>
                        Select Age
                      </option>
                      {formData.age && (
                        <option value={formData.age}>{formData.age}</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Religion and community */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <div>
                    <select
                      className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="religion"
                      name="religion"
                      onChange={handleChange}
                      defaultValue={" "}
                    >
                      <option value=" " disabled>
                        Select Religion
                      </option>
                      <option value={"Hindu"}>Hindu</option>
                      <option value={"Muslim"}>Muslim</option>
                      <option value={"Christian"}>Christian</option>
                      <option value={"Sikh"}>Sikh</option>
                      <option value={"Parsi"}>Parsi</option>
                      <option value={"Jain"}>Jain</option>
                      <option value={"Buddhist"}>Buddhist</option>
                      <option value={"Jewish"}>Jewish</option>
                      <option value={"No Religion"}>No Religion</option>
                      <option value={"Spiritual"}>Spiritual</option>
                      <option value={"Other"}>Other</option>
                    </select>
                    {errors.religion && (
                      <p className="text-xs text-red-500">{errors.religion}</p>
                    )}
                  </div>

                  {/* Community Dropdown */}
                  <div>
                    <select
                      className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="community"
                      name="community"
                      onChange={handleChange}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Community
                      </option>
                      <option value={"English"}>English</option>
                      <option value={"Hindi"}>Hindi</option>
                      <option value={"Marathi"}>Marathi</option>
                      <option value={"Urdu"}>Urdu</option>
                      <option value={"Telugu"}>Telugu</option>
                      <option value={"Tamil"}>Tamil</option>
                    </select>
                    {errors.community && (
                      <p className="text-xs text-red-500">{errors.community}</p>
                    )}
                  </div>
                </div>

                {/* Address and password */}
                <div className="mb-4">
                  <input
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="residence"
                    type="text"
                    placeholder="Address"
                    name="residence"
                    onChange={handleChange}
                  />
                  {errors.residence && (
                    <p className="text-xs text-red-500">{errors.residence}</p>
                  )}
                </div>

                {/* Password and confirm password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <div className="relative">
                    <input
                      className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                    {errors.password && (
                      <p className="text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="c_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3"
                    >
                      {showConfirmPassword ? (
                        <AiFillEyeInvisible />
                      ) : (
                        <AiFillEye />
                      )}
                    </button>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
                {/* Button for registration */}
                <div className="flex items-center justify-between mt-4">
                  <button
                    className={`mt-4 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSubmit}
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? (
                      <div className="loader">Loading...!</div>
                    ) : (
                      <>
                        <span className="ml-3">Register</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="login-link mt-4 text-center text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-500 hover:text-blue-700 text-decoration-none"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </div>

            {isCropScreenVisible && (
              <FullScreenModal
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCropScreenVisible(false)}
              >
                <CropContainer onClick={(e) => e.stopPropagation()}>
                  {/* Close Icon */}
                  <CloseIcon onClick={() => setIsCropScreenVisible(false)} />
                  <Cropper
                    image={imagePreview}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </CropContainer>
                <Button onClick={handleSaveCroppedImage}>Save Image</Button>
              </FullScreenModal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
