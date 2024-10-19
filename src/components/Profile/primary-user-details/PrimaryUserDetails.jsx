import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// Styled components
const CardContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 50px;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ContentWrapper = styled.div`
  flex: 2;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: -5px;
  max-height: 320px; /* Adjust this height based on your design */
  overflow-y: auto; /* Make the content scrollable */

  @media (max-width: 768px) {
    grid-template-columns: repeat(
      auto-fill,
      minmax(120px, 1fr)
    ); /* Responsive for mobile */
  }
`;

const Field = styled.div`
  padding: 10px;
  border-radius: 4px;
  color: #1f7a8c;
  font-size: 20px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 10px;

  font-size: 16px;
    padding: 8px 16px;
          @media (max-width: 768px) {
    font-size: 16px;
    padding: 1px 1px;
  }
  }
`;

// const Button = styled.button`
//   background-color: #003566;
//   color: white;
//   padding: 10px 20px;
//   border: none;
//   border-radius: 4px;
//   font-size: 18px;
//   cursor: pointer;
//   width: auto;

//   @media (max-width: 768px) {
//     width: 100%;
//     margin: 5px 0;
//   width:'20px',
//   position:fixed
//   }

//   &:hover {
//     background-color: #1f7a8c;
//   }
// `;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh; /* Limit the height */
  overflow-y: auto; /* Allow scrolling */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;

  @media (max-width: 768px) {
    top:'2rem',
    width: 40%;
    padding: 20px;
  }
`;

const ModalHeader = styled.h2`
  margin: 0;
  margin-bottom: 20px;
`;

const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(
      auto-fill,
      minmax(120px, 1fr)
    ); /* Responsive for mobile */
  }
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const StyledSelect = styled(Select)`
  height: 41px;
  padding: 0 14px;
`;

const FileInput = styled.input`
  margin-top: 5px;
`;

const Message = styled.div`
  margin-top: 15px;
  font-size: 16px;
  color: ${({ success }) => (success ? "green" : "red")};

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

// Fields array
export const fields = [
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Age", key: "age" },
  { label: "Gender", key: "gender" },
  { label: "Language Known", key: "langKnown" },
  { label: "Religion", key: "religion" },
  { label: "Community", key: "community" },
  { label: "Date of Birth", key: "dob" },
  { label: "Residence", key: "residence" },
  { label: "Mobile No", key: "mobileNumber", isDisabled: true },
  { label: "Email Id", key: "mailId" },
];

// Main Component
const PrimaryUserDetails = ({
  response,
  refresAfterUpdate,
  setStatus,
  status,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(response || {});
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const session = AuthHook();
  const { mobileNumber } = useParams();

  useEffect(() => {
    setUpdatedProfile(response);
  }, [response]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    setLoading(true);

    const formData = new FormData();
    Object.keys(updatedProfile).forEach((key) => {
      formData.append(key, updatedProfile[key]);
    });
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    fetch("https://shaadi-be.fino-web-app.agency/api/v1/auth/update-profile", {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 200 || data.status === 201) {
          setStatus(!status);
          refresAfterUpdate && refresAfterUpdate(!status);

          if (data.profileImage) {
            setUpdatedProfile((prevProfile) => ({
              ...prevProfile,
              profileImage: data.profileImage,
            }));
          }

          Swal.fire(
            "Success!",
            "Profile updated successfully!",
            "success"
          ).then(() => {
            setIsModalOpen(false);
            // Reload the page after closing the modal
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

  return (
    <>

      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="d-flex justify-content-end mb-4">
          {mobileNumber === session?.userName && (
            <Button
              variant="primary"
              onClick={toggleModal}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "1rem",
                fontFamily: "Verdana, sans-serif",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#003566",
                borderColor: "#003566",
              }}
            >
              <i className="fas fa-pencil-alt me-2" style={{ fontSize: "1.2rem" }}></i>
              {response ? "Update" : "Add"}
            </Button>
          )}
        </div>
        <ContentWrapper style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          {fields.map((field, index) => (
            <div
              key={index}
              className="mb-3 p-2 d-flex justify-content-between align-items-center border-bottom"
            >
              <strong className="text-primary" style={{ fontSize: "1rem", fontFamily: "Arial, sans-serif" }}>
                {field.label}:
              </strong>
              <span
                className="text-dark"
                style={{
                  fontSize: "0.9rem",
                  fontFamily: "Verdana, sans-serif",
                  paddingLeft: "10px",
                }}
              >
                {response && response[field.key] !== undefined
                  ? Array.isArray(response[field.key])
                    ? response[field.key].join(", ")
                    : response[field.key]
                  : "N/A"}
              </span>
            </div>
          ))}
        </ContentWrapper>
      </CardContainer>


      {isModalOpen && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-users me-2"></i>
              {response ? "Update Profile" : "Add Profile"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "30px 50px", maxHeight: "60vh", overflowY: "auto" }}>
            <Form>
              {fields.map((field, index) => (
                <Form.Group key={index} className="mb-4">
                  <Form.Label className="font-weight-bold">{field.label}</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend px-2">
                      <span className="input-group-text text-white border-0 h-full" style={{ backgroundColor: "rgb(219, 39, 119)" }}>
                        <i className="fas fa-edit text-white"></i>
                      </span>
                    </div>
                    {field.key === "religion" || field.key === "community" ? (
                      <Form.Control
                        as="select"
                        value={updatedProfile[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="border-0 rounded-end"
                        style={{ boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}
                      >
                        {/* Add your select options here based on the field.key */}
                        {field.key === "religion" && (
                          <>
                            <option value="Hindu">Hindu</option>
                            <option value="Muslim">Muslim</option>
                            <option value="Christian">Christian</option>
                            <option value="Sikh">Sikh</option>
                            <option value="Parsi">Parsi</option>
                            <option value="Jain">Jain</option>
                            <option value="Buddhist">Buddhist</option>
                            <option value="Jewish">Jewish</option>
                            <option value="No Religion">No Religion</option>
                          </>
                        )}
                        {field.key === "community" && (
                          <>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Urdu">Urdu</option>
                            <option value="Telugu">Telugu</option>
                            <option value="Tamil">Tamil</option>
                          </>
                        )}
                      </Form.Control>
                    ) : (
                      <Form.Control
                        type={field.key === "mobileNumber" ? "text" : "text"}
                        value={updatedProfile[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        disabled={field.isDisabled}
                        placeholder={`Enter ${field.label}`}
                        className="border-0 rounded-end"
                        style={{ boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}
                      />
                    )}
                  </div>
                </Form.Group>
              ))}

              {/* Image Upload Input */}
              <InputField>
                <Label>Profile Image:</Label>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </InputField>
            </Form>

            {loading && (
              <div className="d-flex justify-content-center my-3">
                <Spinner animation="border" variant="primary" />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "space-between" }}>
            <Button
              variant="success"
              style={{ backgroundColor: "rgb(219, 39, 119)", borderColor: "#ec4899" }}
              onClick={handleSubmit}
              disabled={loading}
            >
              <i className="fas fa-save me-2"></i> Save Changes
            </Button>
            <Button variant="secondary" onClick={toggleModal} disabled={loading}>
              <i className="fas fa-times me-2"></i> Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}

    </>
  );
};

export default PrimaryUserDetails;
