import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";

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
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three columns for desktop */
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  // top:30px

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); /* Responsive for mobile */
  }
`;

const Field = styled.div`
  padding: 10px;
  border-radius: 4px;
  color: #1f7a8c;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 16px; /* Smaller font size on mobile */
  }
`;

const ButtonContainer = styled.div`
  position: absolute; /* Keep it absolute */
  top: 20px;
  right: 20px;

  @media (max-width: 768px) {
    top: 10px; /* Adjust top position for mobile */
    right: 10px; /* Adjust right position for mobile */
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

//   &:hover {
//     background-color: #1f7a8c;
//   }

//   @media (max-width: 768px) {
//     font-size: 16px;
//     padding: 8px 16px;
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
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px; /* Increased padding for desktop */
  border-radius: 8px;
  width: 80%; /* Adjusted width for desktop */
  max-width: 600px; /* Maximum width for desktop */
  max-height: 80vh; /* Limit modal height */
  overflow-y: auto; /* Enable vertical scrolling for content */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px; /* Less padding on mobile */
  }
`;

const ModalHeader = styled.h2`
  margin: 0;
  margin-bottom: 20px;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 16px; /* Smaller font size on mobile */
  }
`;

const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns for desktop */
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column on mobile */
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

  @media (max-width: 768px) {
    font-size: 14px; /* Smaller font size on mobile */
  }
`;

const Message = styled.div`
  margin-top: 15px;
  font-size: 16px;
  color: ${({ success }) => (success ? "green" : "red")};
`;

// Fields data
export const familyFields = [
  { key: "fatherName", value: "Father's Name: " },
  { key: "fatherOccupation", value: "Father's Occupation: " },
  { key: "motherName", value: "Mother's Name: " },
  { key: "motherOccupation", value: "Mother's Occupation: " },
  { key: "noOfBrothers", value: "Number of Brothers: " },
  { key: "noOfBrothersMarried", value: "Number of Married Brothers: " },
  { key: "noOfSisters", value: "Number of Sisters: " },
  { key: "noOfSistersMarried", value: "Number of Married Sisters: " },
  { key: "noOfFamilyMembers", value: "Total Number of Family Members: " },
  { key: "familyValue", value: "Family Values: " },
  { key: "familyDetails", value: "Family Details: " },
  { key: "familyStatus", value: "Family Status: " },
  { key: "maternalGotra", value: "Maternal Gotra: " },
];

const UserFamilyDetails = ({ response, refresAfterUpdate, setStatus, status }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(response || {});
  const [loading, setLoading] = useState(false);
  const session = AuthHook();
  const { mobileNumber } = useParams();

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = () => {
    setLoading(true);
    const apiUrl = response
      ? `https://shaadi-be.fino-web-app.agency/api/v1/update-user-family-details/${mobileNumber}`
      : `https://shaadi-be.fino-web-app.agency/api/v1/save-user-family-details?mobileNumber=${mobileNumber}`;

    fetch(apiUrl, {
      method: response ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 200 || data.status === 201) {
          setStatus(!status);
          refresAfterUpdate && refresAfterUpdate(!status);
          Swal.fire("Success!", "User details updated successfully!", "success").then(() => {
            toggleModal(); // Close modal after success
          });
        } else {
          Swal.fire("Error", "Failed to update user details", "error");
        }
      })
      .catch(() => {
        setLoading(false);
        Swal.fire("Error", "An error occurred. Please try again.", "error");
      });
  };


  return (
    <>

      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {mobileNumber === session?.userName && (
          <div className="d-flex justify-content-end mb-4">
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
          </div>
        )}
        <ContentWrapper style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          {familyFields.map((field, index) => (
            <div
              key={index}
              className="mb-3 p-2 d-flex justify-content-between align-items-center border-bottom"
            >
              <strong className="text-primary" style={{ fontSize: "1rem", fontFamily: "Arial, sans-serif" }}>
                {field.value}:
              </strong>
              <span
                className="text-dark"
                style={{
                  fontSize: "0.9rem",
                  fontFamily: "Verdana, sans-serif",
                  paddingLeft: "10px",
                }}
              >
                {response && response[field.key]
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
              {response ? "Update Family Details" : "Add Family Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "30px 50px", maxHeight: "60vh", overflowY: "auto" }}>
            <Form>
              {familyFields.map((field, index) => (
                <Form.Group key={index} className="mb-4">
                  <Form.Label className="font-weight-bold">{field.value}</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend px-2">
                      <span className="input-group-text text-white border-0 h-full" style={{ backgroundColor: "rgb(219, 39, 119)" }}>
                        <i className="fas fa-edit text-white"></i>
                      </span>
                    </div>
                    <Form.Control
                      type={field.key.includes("noOf") ? "number" : "text"}
                      value={updatedProfile[field.key] || ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      min={0}
                      placeholder={`Enter ${field.value}`}
                      className="border-0 rounded-end"
                      style={{ boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}
                    />
                  </div>
                </Form.Group>
              ))}
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

export default UserFamilyDetails;
