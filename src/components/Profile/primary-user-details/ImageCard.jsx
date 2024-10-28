import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import Cropper from "react-easy-crop";
import { getProfileImage } from "../../../services/userAllDetailsService";
import axios from "axios";
import Swal from "sweetalert2";
import AuthHook from "../../../auth/AuthHook";
import { FaPencilAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

const CardContainer = styled(motion.div)`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fcd5ce;
  position: relative;
  height: 300px;
  width: 100%;
  margin-bottom: 20px;
  align-self: flex-start;
  ${"" /* cursor: pointer; */}
`;

const ImageWrapper = styled.div`
  flex: 1;
  background-image: ${(props) => `url(${props.src})`};
  background-repeat: no-repeat;
  background-position: center 20%;
  background-size: cover;
  height: 100%;
  cursor: pointer;
`;

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

const UpdateIconWrapper = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const UpdateIcon = styled(FaPencilAlt)`
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 6px;
  border-radius: 50%;
  font-size: 2.1rem;
  cursor: pointer;
  &:hover + span {
    opacity: 1;
    visibility: visible;
  }
`;

const Tooltip = styled.span`
  position: absolute;
  ${"" /* top: -30px; */}
  right: 40px;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
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

const ImageCard = ({ mobileNumber, userDetails }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false); // Full screen state
  const [FullScreen, setFullScreen] = useState(false); // Full screen state

  // Crop-related states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null); // To store the final cropped area
  const session = AuthHook();

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
      console.log("err :", err);
      setError("Failed to load profile image");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line
  }, [mobileNumber]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImageBlob = useCallback(async () => {
    if (!profileImage || !croppedAreaPixels) return null;

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.src = profileImage;

      image.onload = () => {
        const scaleX = image.width / image.naturalWidth;
        const scaleY = image.height / image.naturalHeight;

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x * scaleX,
          croppedAreaPixels.y * scaleY,
          croppedAreaPixels.width * scaleX,
          croppedAreaPixels.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        );

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          setCroppedImage(url); // Store blob URL
          resolve(blob);
          setIsFullScreen(false);
        }, "image/jpeg");
      };
    });
  }, [profileImage, croppedAreaPixels]);

  const handleSubmit = async () => {
    try {
      const imageBlob = await createImageBlob();
      if (!imageBlob) throw new Error("Image processing failed.");

      const formData = new FormData();
      formData.append("profileImage", imageBlob);

      Object.entries(userDetails.response).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await axios.put(
        "https://shaadi-be.fino-web-app.agency/api/v1/auth/update-profile",
        formData
      );

      if (res.status === 200 || res.status === 201) {
        await Swal.fire("Success!", "Profile updated successfully!", "success");
        fetchUserData();
        setFullScreen(false);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.log("error :", error);
      await Swal.fire(
        "Error!",
        "There was an issue updating the profile.",
        "error"
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ImageWrapper
          src={croppedImage || profileImage || "defaultImageUrl.jpg"}
          onClick={() => setFullScreen(true)}
        >
          {mobileNumber === session?.userName && (
            <UpdateIconWrapper>
              <UpdateIcon onClick={() => setIsFullScreen(true)} />
              <Tooltip>Edit Image</Tooltip>
            </UpdateIconWrapper>
          )}
        </ImageWrapper>
      </CardContainer>

      {/* Full-screen view modal */}
      {FullScreen && (
        <FullScreenModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setFullScreen(false)} // Close on click outside
        >
          <CropContainer onClick={(e) => e.stopPropagation()}>
            {/* Close Icon */}
            <CloseIcon onClick={() => setFullScreen(false)} />
            {/* Display the image without cropping */}
            <img
              src={profileImage || "defaultImageUrl.jpg"}
              alt="Full screen view"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </CropContainer>
        </FullScreenModal>
      )}

      {/* Crop modal */}
      {isFullScreen && (
        <FullScreenModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFullScreen(false)} // Close on click outside
        >
          <CropContainer onClick={(e) => e.stopPropagation()}>
            {/* Close Icon */}
            <CloseIcon onClick={() => setIsFullScreen(false)} />
            <Cropper
              image={profileImage}
              crop={crop}
              zoom={zoom}
              aspect={1} // Aspect ratio for square cropping
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </CropContainer>
          <Button onClick={handleSubmit}>Save Image</Button>
        </FullScreenModal>
      )}
    </>
  );
};

export default ImageCard;
