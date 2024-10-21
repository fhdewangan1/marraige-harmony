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
  margin-bottom: 40px;
  align-self: flex-start;
`;

const ImageWrapper = styled.div`
  flex: 1;
  background-image: ${(props) => `url(${props.src})`};
  background-repeat: no-repeat;
  background-position: center 20%;
  background-size: cover;
  height: 100%;
`;

const ImageCard = ({ mobileNumber }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { imageUrl, status: responseStatus } = await getProfileImage(
        mobileNumber
      );

      if (responseStatus === 200) {
        setProfileImage(imageUrl);
      } else {
        setError(`Failed to load profile image.Status code: ${responseStatus}`);
      }
    } catch (err) {
      setError("Failed to load profile image");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [mobileNumber]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <CardContainer
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ImageWrapper src={profileImage || "defaultImageUrl.jpg"} />{" "}
      {/* Fallback image */}
    </CardContainer>
  );
};

export default ImageCard;
