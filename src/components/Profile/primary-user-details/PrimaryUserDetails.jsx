import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import AuthHook from "../../../auth/AuthHook";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import ReactSelect from "react-select";
import { ApiUrl } from "../../../config/Config";

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

// Define fields configuration with label, key, and options for easy form generation
const fields = [
  { label: "First Name", key: "firstName", type: "text" },
  { label: "Last Name", key: "lastName", type: "text" },
  {
    label: "Gender",
    key: "gender",
    type: "text",
    isDisabled: true,
  },
  {
    label: "Language Known",
    key: "langKnown",
    type: "Select Language",
    options: ["English", "Hindi", "Marathi", "Urdu", "Telugu", "Tamil"],
  },
  {
    label: "Religion",
    key: "religion",
    type: "Select Religion",
    options: ["Hindu", "Muslim", "Christian", "Parsi", "Other"],
  },
  {
    label: "Community",
    key: "community",
    type: "Select Community",
    options: ["English", "Hindi", "Marathi", "Urdu", "Telugu", "Tamil"],
  },
  { label: "Date of Birth", key: "dob", type: "date" },
  {
    label: "Age",
    key: "age",
    type: "text",
    isDisabled: true, // Disable Age field, as it's calculated from DOB
  },
  {
    label: "Enter Location (Area, City, State)",
    key: "residence",
    type: "text",
  },
  { label: "Mobile No", key: "mobileNumber", type: "text", isDisabled: true },
  { label: "Email", key: "mailId", type: "text" },
];

// Utility function to convert to PascalCase
const toPascalCase = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const PrimaryUserDetails = ({
  response,
  refresAfterUpdate,
  setStatus,
  status,
  imageUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const session = AuthHook();
  const { mobileNumber } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [isCropScreenVisible, setIsCropScreenVisible] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [profileImageBlob, setProfileImageBlob] = useState(null);
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: response || {}, // Setting default values
  });

  // Date restrictions (18-60 years)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 18); // Max: 18 years ago
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 60); // Min: 60 years ago

  // UseEffect to set form values when response changes
  useEffect(() => {
    if (response) {
      // Ensure that the form values are set when response is available
      Object.keys(response).forEach((key) => {
        setValue(key, response[key]);
      });
    }
  }, [response, setValue]);

  useEffect(() => {
    setImagePreview(imageUrl);
  }, [imageUrl]);

  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Handle profile image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      imageOpen();
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
        // Calculate width and height based on cropped area or adjust if out of bounds
        let { x, y, width, height } = croppedAreaPixels;

        if (x + width > image.width) {
          width = image.width - x;
        }
        if (y + height > image.height) {
          height = image.height - y;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw the cropped area onto the canvas
        ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const croppedUrl = URL.createObjectURL(blob);
          setImagePreview(croppedUrl); // Set preview to cropped image
          imageOpen();
          resolve(blob); // Return the blob to handleSubmit for uploading
        }, "image/jpeg");
      };
    });
  }, [imagePreview, croppedAreaPixels]);

  const handleSaveCroppedImage = async () => {
    const croppedImageBlob = await createCroppedImage();
    if (croppedImageBlob) {
      setProfileImageBlob(croppedImageBlob); // Save binary blob instead of URL
      setImagePreview(URL.createObjectURL(croppedImageBlob)); // Display preview
      setIsCropScreenVisible(false);
      setIsModalOpen(true);
    }
  };

  const imageOpen = () => {
    if (isCropScreenVisible) {
      setIsCropScreenVisible(false);
      setIsModalOpen(true);
    } else {
      setIsCropScreenVisible(true);
      setIsModalOpen(false);
    }
  };

  // Submit profile update request
  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    // Attach the binary blob directly to FormData
    if (profileImageBlob)
      formData.append("profileImage", profileImageBlob, "profile.jpg");

    fetch(`${ApiUrl}/auth/update-profile`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 200 || data.status === 201) {
          setStatus(!status);
          refresAfterUpdate && refresAfterUpdate(!status);
          Swal.fire(
            "Success!",
            "Profile updated successfully!",
            "success"
          ).then(() => {
            setIsModalOpen(false);
            window.location.reload();
          });
        } else {
          Swal.fire(
            "Error!",
            "Failed to update profile. Please try again.",
            "error"
          );
        }
      })
      .catch(() => {
        setLoading(false);
        Swal.fire(
          "Error!",
          "Failed to update profile. Please try again.",
          "error"
        );
      });
  };
  // Calculate age based on DOB
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Handle DOB Change: Calculate age automatically
  const handleDobChange = (e) => {
    const updatedDob = e.target.value;
    setValue("dob", updatedDob);

    // Calculate age
    const age = calculateAge(updatedDob);

    // Check for age restrictions
    if (age < 18 || age > 60) {
      setValue("age", "");
      setError("age", {
        type: "manual",
        message: "Age must be between 18 and 60.",
      });
    } else {
      setValue("age", age);
    }
  };

  // Render individual field using react-hook-form Controller
  const FieldRenderer = ({ field }) => (
    <Form.Group className="mb-3">
      <Form.Label className="font-semibold text-base">{field.label}</Form.Label>
      <Controller
        name={field.key}
        control={control}
        rules={
          field.key === "mailId"
            ? {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              }
            : field.key === "dob"
            ? {
                required: "Date of birth is required",
                validate: (value) => {
                  const selectedDate = new Date(value);
                  if (selectedDate > maxDate) {
                    return "You must be at least 18 years old.";
                  }
                  if (selectedDate < minDate) {
                    return "You cannot be older than 60 years old.";
                  }
                  return true;
                },
              }
            : {}
        }
        render={({ field: { onChange, value } }) => {
          if (field.key === "dob") {
            return (
              <input
                type="date"
                value={value || ""}
                onChange={handleDobChange} // Use custom DOB change handler
                disabled={field.isDisabled}
                placeholder={`Enter ${field.label}`}
                className="form-control"
              />
            );
          }
          return (
            <Form.Control
              type={field.type}
              value={value || ""}
              onChange={(e) => {
                // Only apply PascalCase for fields other than email
                const updatedValue =
                  field.key === "mailId"
                    ? e.target.value
                    : toPascalCase(e.target.value); // Apply PascalCase for non-email fields
                setValue(field.key, updatedValue);
                onChange(updatedValue);
              }}
              disabled={field.isDisabled}
              placeholder={`Enter ${field.label}`}
              className="border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 text-base"
            />
          );
        }}
      />
      {errors[field.key] && (
        <p className="text-red-500 text-sm mt-1">{errors[field.key].message}</p>
      )}
    </Form.Group>
  );

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        {mobileNumber === session?.userName && (
          <div className="text-right mb-4">
            <Button
              variant="primary"
              onClick={toggleModal}
              style={{ backgroundColor: "#003566", borderColor: "#003566" }}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-base"
            >
              <i className="fas fa-pencil-alt mr-2"></i>
              {response ? "Update" : "Add"}
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b"
            >
              <strong className="text-primary text-base mr-4">
                {field.label}:
              </strong>
              <span
                className="text-gray-600 text-base"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {field.key === "mobileNumber" &&
                session &&
                response?.mobileNumber === session.userName
                  ? response.mobileNumber
                  : response?.[field.key] || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for profile edit */}
      {isModalOpen && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-user-edit mr-2"></i>
              {response ? "Update Profile" : "Add Profile"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body
            className="px-5 py-4"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            {/* Display Profile Image Preview in Circular Shape */}
            <div className="d-flex justify-content-center mb-4">
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
                      onClick={() => imageOpen()} // Only open the crop screen again for the same image
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
            </div>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {fields.map((field, index) => (
                <div key={index} className="mb-4">
                  {field.type.startsWith("Select") ? (
                    // Render dropdown for select fields using react-select
                    <div className="form-group">
                      <label htmlFor={field.key}>{field.label}</label>
                      <ReactSelect
                        id={field.key}
                        options={field.options.map((option) => ({
                          value: option,
                          label: option,
                        }))}
                        value={
                          field.key === "langKnown"
                            ? watch(field.key) === "NA" || !watch(field.key)
                              ? [] // If value is "NA" or empty, set to empty array
                              : watch(field.key)
                                  .split(", ")
                                  .map((value) => ({ value, label: value }))
                            : {
                                value: watch(field.key),
                                label: watch(field.key),
                              }
                        } // Bind selected value for language or other fields
                        onChange={(selectedOption) => {
                          // If it's the language field, convert the selected values to a comma-separated string
                          if (field.key === "langKnown") {
                            const selectedLanguages = selectedOption
                              ? selectedOption
                                  .map((option) => option.value)
                                  .join(", ")
                              : ""; // Set to empty string if no languages are selected

                            // If selected value is "NA", set to empty string
                            setValue(
                              field.key,
                              selectedLanguages === "NA"
                                ? ""
                                : selectedLanguages
                            );
                          } else {
                            // For other select fields, just update the selected value
                            setValue(
                              field.key,
                              selectedOption ? selectedOption.value : ""
                            );
                          }
                        }}
                        isMulti={field.key === "langKnown"} // Enable multi-select for the "Language Known" field
                        className="react-select-container mb-2"
                        classNamePrefix="react-select"
                      />
                    </div>
                  ) : (
                    // Render other input types using FieldRenderer
                    <FieldRenderer field={field} />
                  )}
                </div>
              ))}

              {/* Loading spinner */}
              {loading && (
                <Spinner
                  animation="border"
                  variant="primary"
                  className="d-block mx-auto my-4"
                />
              )}
            </Form>
          </Modal.Body>

          <Modal.Footer className="d-flex justify-content-end">
            <Button
              variant="success"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              style={{
                backgroundColor: "rgb(219, 39, 119)",
                borderColor: "rgb(236, 72, 153)",
              }}
              className="bg-pink-500 border-pink-500 hover:bg-pink-600 hover:border-pink-600 text-base"
            >
              <i className="fas fa-save mr-2"></i> Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal for crop image */}
      {isCropScreenVisible && (
        <FullScreenModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => imageOpen()}
        >
          <CropContainer onClick={(e) => e.stopPropagation()}>
            {/* Close Icon */}
            <CloseIcon onClick={() => imageOpen()} />
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              maxZoom={2} // Limit the max zoom level
            />
          </CropContainer>
          <Button onClick={handleSaveCroppedImage}>Save Image</Button>
        </FullScreenModal>
      )}
    </>
  );
};

export default PrimaryUserDetails;
