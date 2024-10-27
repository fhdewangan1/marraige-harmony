import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import Cropper from "react-easy-crop";
import { getProfileImage } from "../../../services/userAllDetailsService";
import axios from "axios";
import Swal from "sweetalert2";
import AuthHook from "../../../auth/AuthHook";

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
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  flex: 1;
  background-image: ${(props) => `url(${props.src})`};
  background-repeat: no-repeat;
  background-position: center 20%;
  background-size: cover;
  height: 100%;
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
  width: 90vw;
  height: 90vh;
  background-color: #333;
`;

const Button = styled.button`
  margin-top: 20px;
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
`;

const ImageCard = ({ mobileNumber, userDetails }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const session = AuthHook();

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const { imageUrl, status: responseStatus } = await getProfileImage(
        mobileNumber
      );

      if (responseStatus === 200) {
        setProfileImage(imageUrl);
      } else {
        setError(
          `Failed to load profile image. Status code: ${responseStatus}`
        );
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
          setCroppedImageUrl(url); // Store blob URL
          resolve(blob);
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
          src={croppedImageUrl || profileImage || "defaultImageUrl.jpg"}
          onClick={() => setIsFullScreen(mobileNumber === session?.userName)}
        />
      </CardContainer>

      {isFullScreen && (
        <FullScreenModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFullScreen(false)}
        >
          <CropContainer onClick={(e) => e.stopPropagation()}>
            <Cropper
              image={profileImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
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
