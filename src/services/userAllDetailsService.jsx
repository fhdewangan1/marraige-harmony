import axios from "axios";
import { AxiosConfig } from "../config/AxiosConfig";

// Define the base URL for your API
const BASE_URL = "AxiosConfig/user"; // Replace with your actual API URL

// Function to get all user details
export const getAllUserDetails = async (mobileNumber) => {
  try {
    const response = await AxiosConfig.get(`user/get-user-all-details`, {
      params: { mobileNumber },
    });
    return response.data; // Adjust based on your response structure
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
export const getAllProfiles = async (data) => {
  try {
    const response = await AxiosConfig.get(`user/profiles`, {
      params: data,
    });
    return response.data; // Adjust based on your response structure
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const getProfileImage = async (mobileNumber) => {
  try {
    const response = await AxiosConfig.get(`user/profile-image`, {
      params: { mobileNumber },
      responseType: "blob", // Necessary for binary data
    });

    const imageUrl = URL.createObjectURL(response.data);
    return { imageUrl, status: response.status }; // Return both the image URL and status code
  } catch (error) {
    console.error("Error fetching profile image:", error);
    throw error; // You can also handle specific status codes here if needed
  }
};
