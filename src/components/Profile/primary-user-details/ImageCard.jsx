import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { getProfileImage } from "../../../services/userAllDetailsService";

// CardContainer will be positioned on the left side of the viewport
const CardContainer = styled(motion.div)`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fcd5ce;
  position: relative;
  height: 300px;
  width: 100%;
  align-self: flex-start;
`;

const ImageWrapper = styled.div`
  flex: 1;
  background: url(${(props) => props.src}) no-repeat center center;
  background-size: cover;
  height: 100%;
  background-position: center 20%; // Adjust this value as needed
`;

const ImageCard = ({ mobileNumber, refresAfterUpdate, setStatus, status }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null); // Reset error on new fetch
    try {
      const { imageUrl, status: responseStatus } = await getProfileImage(mobileNumber);
      console.log('resimageUrl', imageUrl);
      console.log('imgsta', responseStatus);
      
      if (responseStatus === 200) {
        setProfileImage(imageUrl);
        setStatus('Image loaded successfully');
        refresAfterUpdate && refresAfterUpdate(true);
      } else {
        setError(`Failed to load profile image. Status code: ${responseStatus}`);
      }
    } catch (err) {
      setError("Failed to load profile image");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, [mobileNumber]); // Ensure it runs again if mobileNumber changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <CardContainer
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ImageWrapper src={profileImage || 'defaultImageUrl.jpg'} /> {/* Fallback image */}
    </CardContainer>
  );
};

export default ImageCard;
