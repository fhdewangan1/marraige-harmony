import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import styled from "styled-components";

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

const ButtonContainer = styled.div`
  position: absolute; /* Keep it absolute */
  top: 20px;
  right: 20px;

  @media (max-width: 768px) {
    top: 10px; /* Adjust top position for mobile */
    right: 10px; /* Adjust right position for mobile */
  }
`;

const ContentWrapper = styled.div`
  max-height: 100vh;
  // top:30px

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
    font-size: 16px; /* Smaller font size on mobile */
  }
`;

// Fields data
export const lifeStyleAndEducationFields = [
  { key: "userOccupation", value: "Occupation " },
  { key: "userCurrentLoc", value: "Current Location " },
  { key: "drinking", value: "Drinking Habits " },
  { key: "smoking", value: "Smoking Habits " },
  { key: "diet", value: "Diet " },
  { key: "qualification", value: "Qualification " },
];

const UserLifeStyleAndEducation = ({
  response,
  refresAfterUpdate,
  setStatus,
  status,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(response || {});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
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
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async () => {
    // Basic validation
    for (const field of lifeStyleAndEducationFields) {
      if (!updatedProfile[field.key]) {
        setError(`${field.value} is required.`);
        return; // Stop if validation fails
      }
    }

    setLoading(true);
    const apiUrl = response
      ? `https://shaadi-be.fino-web-app.agency/api/v1/update-user-life-style-details/${mobileNumber}`
      : `https://shaadi-be.fino-web-app.agency/api/v1/save-user-life-style?mobileNumber=${mobileNumber}`;

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
        Swal.fire(
          "Success!",
          "User details updated successfully!",
          "success"
        ).then(() => {
          toggleModal();
        });
      } else {
        setError(data.message || "Failed to update user details");
        Swal.fire(
          "Error",
          data.message || "Failed to update user details",
          "error"
        );
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
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
              <i
                className="fas fa-pencil-alt me-2"
                style={{ fontSize: "1.2rem" }}
              ></i>
              {response ? "Update" : "Add"}
            </Button>
          </div>
        )}
        <ContentWrapper
          style={{
            marginTop: "29px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          {lifeStyleAndEducationFields.map((field, index) => (
            <div
              key={index}
              className="mb-3 p-2 d-flex justify-content-between align-items-center border-bottom"
            >
              <strong
                className="text-primary"
                style={{ fontSize: "1rem", fontFamily: "Arial, sans-serif" }}
              >
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
              <i className="fas fa-user-edit me-2"></i>
              {response
                ? "Update Lifestyle and Education Details"
                : "Add Lifestyle and Education Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "30px 50px" }}>
            <Form>
              {lifeStyleAndEducationFields.map((field, index) => (
                <Form.Group key={index} className="mb-4">
                  <Form.Label className="font-weight-bold">
                    {field.value}
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      value={updatedProfile[field.key] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      placeholder={`Enter ${field.value}`}
                      className="border-0 rounded-end"
                      style={{
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        marginLeft: "5px", // Slight margin for spacing consistency
                      }}
                    />
                  </div>
                </Form.Group>
              ))}
            </Form>
            {loading ? (
              <div className="d-flex justify-content-center my-3">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                {error && (
                  <Alert variant="danger" className="d-flex align-items-center">
                    <i className="fas fa-exclamation-circle me-2"></i> {error}
                  </Alert>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              style={{
                backgroundColor: "rgb(219, 39, 119)",
                borderColor: "#ec4899",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              <i className="fas fa-save me-2"></i> Save Changes
            </Button>
            {/* <Button
              variant="secondary"
              onClick={toggleModal}
              disabled={loading}
            >
              <i className="fas fa-times me-2"></i> Cancel
            </Button> */}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default UserLifeStyleAndEducation;
