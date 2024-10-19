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
import { FaPhone, FaCalendarAlt } from "react-icons/fa"; // Import Font Awesome Icons
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

    <div
      className="flex justify-center items-center min-h-screen bg-fixed bg-cover"
      style={{ backgroundImage: "url('/path/to/your/background/image.jpg')" }}
    >
      <div className="w-11/12 md:w-1/2 lg:w-1/3 py-8">
        <div className="container bg-white bg-opacity-80 p-6 rounded-lg shadow-md ">
          <h3 className="text-center mb-4 text-blue-800 font-semibold">Forgot Password</h3>

          {loading && (
            <div className="text-center mb-4">
              <div className="spinner-border text-blue-800" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <form
            id="forgotPasswordForm"
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <label htmlFor="mobileNumber" className="block font-medium">
                Mobile Number
              </label>
              <div className="flex items-center border border-gray-300 rounded">
                <span className="px-2 text-blue-800">
                  <i className="fas fa-phone-alt"></i>
                </span>
                <input
                  type="tel"
                  className="p-2 flex-1 rounded outline-none"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="dateOfBirth" className="block font-medium">
                Date of Birth
              </label>
              <div className="flex items-center border border-gray-300 rounded">
                <span className="px-2 text-blue-800">
                  <i className="fas fa-calendar-alt"></i>
                </span>
                <input
                  type="date"
                  className="p-2 flex-1 rounded outline-none"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-3 bg-blue-800 text-white rounded hover:bg-blue-700 transition duration-300"
            >
              Send Reset Email
            </button>
          </form>

          <p className="mt-3 text-center text-black font-semibold">
            Remembered your password?{" "}
            <a href="/login" className="text-blue-800 underline hover:text-blue-700 transition duration-300">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>

  );

};

export default ForgotPassword;
