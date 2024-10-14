import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  getAllUserDetails,
  getProfileImage,
} from "../../services/userAllDetailsService";
import FamilyDetails from "./FamilyDetails";
import { Box, Button, Grid } from "@mui/material";
// import UserProfile from "../utils/UserProfile";
import PrimaryUserDetails from "../Profile/primary-user-details/PrimaryUserDetails";
import ImageCard from "../Profile/primary-user-details/ImageCard";
import UserFamilyDetails from "../Profile/user-family-details/UserFamilyDetails";
import UserPersonalDetails from "../Profile/user-personal-details/UserPersonalDetails";
import UserLifeStyleAndEducation from "../Profile/user-life-style-and-education/UserLifeStyleAndEducation";
import UserPartnerPreferences from "../Profile/user-partner-preferences/UserPartnerPreferences";
import AuthHook from "../../auth/AuthHook";

const CardContainer = styled(motion.div)`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  margin: 20px auto;
  background-color: #fcd5ce;
`;

const ContentWrapper = styled.div`
  flex: 2;
  padding: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  grid-template-rows: auto 1fr;
  gap: 15px;
`;

const Title = styled.h2`
  grid-column: 1 / 2;
  margin: 0 0 15px;
`;

const MoreDetailsButton = styled.button`
  grid-column: 2 / 3;
  align-self: center;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  justify-self: end; /* Aligns the button to the end of its column */

  &:hover {
    background-color: #0056b3;
  }
`;

const Field = styled.div`
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: maroon;
  font-size: 19px;
`;
const fields = [
  "Field 1: Some content here",
  "Field 2: More content here",
  "Field 3: Even more content",
  "Field 4: And more content",
  "Field 5: Additional content",
  "Field 6: Extra content",
  "Field 7: Another piece of content",
  "Field 8: More information",
  "Field 9: Continuing with content",
  "Field 10: Final content piece",
];

// Inside your ImageCard component's styled component
const ImageWrapper = styled.div`
  flex: 1;
  background: url(${(props) => props.src}) no-repeat center;
  background-size: cover;
  height: 100%;
  background-position: center 20%; // Adjust this value as needed
`;

const DemoCardDetails = () => {
  const session = AuthHook();
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const { mobileNumber } = useParams();
  console.log(mobileNumber);
  const fetchUserData = async (mobileNumber) => {
    try {
      const allData = await getAllUserDetails(mobileNumber);
      setUserDetails(allData);
      console.log("userDetails ", userDetails);
      const imageUrl = await getProfileImage(mobileNumber);
      setProfileImage(imageUrl);
    } catch (err) {
      // setError("Failed to load data");
    }
  };
  const [status, setStatus] = useState(false);
  const refresAfterUpdate = (status) => {
    setStatus(status);
  };

  console.log("userDetails ", userDetails);
  useEffect(() => {
    fetchUserData(mobileNumber);
  }, [status]);

  console.log(status);

  return (
    <>
      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginTop:'8rem'}}
      >
        <h2
          style={{
            color: "#003566",
            display: "flex",
            justifyContent: "center", // Horizontally center
            alignItems: "center", // Vertically center
            textAlign: "center", // Center text alignment
            width: "100%", // Ensure it takes full width of the container
           
          }}
        >
          Basic Information
        </h2>
      </CardContainer>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "80%" }}>
          <Grid container>
            <Grid item xs={12} md={3}>
              <Box sx={{ padding: 2, height: "100%" }}>
                {/* {
                  mobileNumber == session?.userName && <Button>Add</Button>
                } */}
                <ImageCard
                  status={status}
                  setStatus={setStatus}
                  refresAfterUpdate={refresAfterUpdate}
                  mobileNumber={mobileNumber}
                  imageUrl={profileImage} // Pass the image URL to ImageCard
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Box sx={{ padding: 2, height: "100%" }}>
                <PrimaryUserDetails
                  status={status}
                  setStatus={setStatus}
                  refresAfterUpdate={refresAfterUpdate}
                  response={userDetails?.response}
                />
                {/* <UserProfile response={userDetails?.response} /> */}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2
          style={{
            color: "#003566",
            display: "flex",
            justifyContent: "center", // Horizontally center
            alignItems: "center", // Vertically center
            textAlign: "center", // Center text alignment
            width: "100%", // Ensure it takes full width of the container
          }}
        >
          Personal Details
        </h2>
      </CardContainer>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "80%" }}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Box sx={{ padding: 2, height: "100%" }}>
                <UserPersonalDetails
                  status={status}
                  setStatus={setStatus}
                  refresAfterUpdate={refresAfterUpdate}
                  response={userDetails?.response?.userPersonalDetails}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2
          style={{
            color: "#003566",
            display: "flex",
            justifyContent: "center", // Horizontally center
            alignItems: "center", // Vertically center
            textAlign: "center", // Center text alignment
            width: "100%", // Ensure it takes full width of the container
          }}
        >
          Family Details
        </h2>
      </CardContainer>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "80%" }}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Box sx={{ padding: 2, height: "100%" }}>
                <UserFamilyDetails
                  status={status}
                  setStatus={setStatus}
                  refresAfterUpdate={refresAfterUpdate}
                  response={userDetails?.response?.userFamilyDetails}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2
          style={{
            color: "#003566",
            display: "flex",
            justifyContent: "center", // Horizontally center
            alignItems: "center", // Vertically center
            textAlign: "center", // Center text alignment
            width: "100%", // Ensure it takes full width of the container
          }}
        >
          Life Style And Education Details
        </h2>
      </CardContainer>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "80%" }}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Box sx={{ padding: 2, height: "100%" }}>
                <UserLifeStyleAndEducation
                  status={status}
                  setStatus={setStatus}
                  refresAfterUpdate={refresAfterUpdate}
                  response={userDetails?.response?.userLifeStyleAndEducation}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2
          style={{
            color: "#003566",
            display: "flex",
            justifyContent: "center", // Horizontally center
            alignItems: "center", // Vertically center
            textAlign: "center", // Center text alignment
            width: "100%", // Ensure it takes full width of the container
          }}
        >
          Partner Preferences
        </h2>
      </CardContainer>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "80%" }}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Box sx={{ padding: 2, height: "100%" }}>
                <UserPartnerPreferences
                  status={status}
                  setStatus={setStatus}
                  refresAfterUpdate={refresAfterUpdate}
                  response={userDetails?.response?.userPartnerPreferences}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default DemoCardDetails;
