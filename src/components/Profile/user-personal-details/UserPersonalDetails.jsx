import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";

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

const Header = styled.div`
  display: flex;
  justify-content: flex-end; /* Aligns all items to the right */
  align-items: center;
  margin-bottom: 20px;
  width: 100%; /* Ensure it takes full width */
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three columns for desktop */
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;

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
    font-size: 16px;
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
  z-index: 1000; /* Adjust as necessary */
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.h2`
  margin: 0 0 20px;
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
    font-size: 14px;
  }
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const FormWrapper = styled.div`
  padding: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

// Personal Fields
export const personalFields = [
  { key: "userHeight", value: "Height: " },
  { key: "userWeight", value: "Weight: " },
  { key: "gotra", value: "Gotra: " },
  { key: "manglik", value: "Manglik: " },
  { key: "maritalStatus", value: "Marital Status: " },
  { key: "isPersonDisabled", value: "Is Disabled: " },
  { key: "userIncome", value: "Monthly Income" },
  { key: "isUserStayingAlone", value: "Is Staying Alone: " },
  { key: "hobbies", value: "Hobbies: " },
  { key: "birthPlace", value: "Birth Place: " },
  { key: "complexion", value: "Complexion: " },
  { key: "rashi", value: "Rashi: " },
  { key: "bloodGroup", value: "Blood Group: " },
  { key: "bodyType", value: "Body Type: " },
];

const UserPersonalDetails = ({ response, refresAfterUpdate, setStatus, status }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(response || {});
  const [loading, setLoading] = useState(false);
  const session = AuthHook();
  const { mobileNumber } = useParams();

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const apiUrl = response
      ? `https://shaadi-be.fino-web-app.agency/api/v1/update-user-personal-details/${mobileNumber}`
      : `https://shaadi-be.fino-web-app.agency/api/v1/save-user-personal-details?mobileNumber=${mobileNumber}`;

    try {
      const res = await fetch(apiUrl, {
        method: response ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });
      const data = await res.json();
      setLoading(false);

      if (data.status === 200 || data.status === 201) {
        setStatus(!status);
        refresAfterUpdate && refresAfterUpdate(!status);
        Swal.fire("Success!", "User details updated successfully!", "success").then(() => {
          toggleModal(); // Close modal after success
        });
      } else {
        Swal.fire("Error", data.message || "Failed to update user details", "error");
      }
    } catch (err) {
      setLoading(false);
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
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
          {personalFields.map((field, index) => (
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
                {response && response[field.key] ? response[field.key].toString() : "N/A"}
              </span>
            </div>
          ))}
        </ContentWrapper>
      </CardContainer>


      {isModalOpen && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-user-edit me-2"></i>
              {response ? "Update Personal Details" : "Add Personal Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "30px 50px", maxHeight: "60vh", overflowY: "auto" }}>
            <Form>
              {personalFields.map((field, index) => (
                <Form.Group key={index} className="mb-4">
                  <Form.Label className="font-weight-bold">{field.value}</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text text-white border-0 h-full" style={{ backgroundColor: "rgb(219, 39, 119)" }}>
                        <i className="fas fa-edit text-white"></i>
                      </span>
                    </div>
                    <Form.Control
                      type="text"
                      value={updatedProfile[field.key] || ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={`Enter ${field.value}`}
                      className="border-0 rounded-end"
                      style={{ boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", marginLeft: '5px', }}
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

export default UserPersonalDetails;
