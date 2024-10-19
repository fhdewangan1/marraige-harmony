import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="h-auto hover:bg-gray-50 transition duration-100">
      <div className="mx-auto my-2">
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

            <div className="w-full lg:w-7/12 bg-white dark:bg-gray-700 px-12 py-4 rounded-lg lg:rounded-l-none">
              <div className="py-3 text-end">
                <Link to={"/"} className="text-decoration-none">
                  <i className="fa-solid fa-arrow-left-long"></i>
                  <span className="ml-3 font-bold text-blue-500 hover:text-blue-700">
                    Visit Home
                  </span>
                </Link>
              </div>
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
                className="bg-white dark:bg-gray-800 rounded"
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
                    className="w-full px-4 py-3 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Register Account
                  </button>
                </div>

                <hr className="mb-6 border-t" />
                <div className="text-center">
                  <Link
                    className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                    to={"/login"}
                  >
                    Already have an account? Login!
                  </Link>
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
