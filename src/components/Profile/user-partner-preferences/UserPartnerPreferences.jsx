import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const CardContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 100px;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Fields data
const partnerPreferencesFields = [
  { key: "familyStatus", value: "Family Status" },
  { key: "familyValue", value: "Family Values" },
  { key: "preferredLocation", value: "Preferred Locations" },
  { key: "desiredJobValue", value: "Desired Job" },
  { key: "anyOtherPreferences", value: "Other Preferences" },
];

const UserPartnerPreferences = ({
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));

    validate(key, value);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setSuccess(false);
    setError("");
  };

  const validateFields = () => {
    let errors = {};

    // Check if any other field is empty
    for (const key in updatedProfile) {
      if (!updatedProfile[key]) {
        errors[key] = `The field ${key} cannot be empty.`;
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validate = (key, value) => {
    let newErrors = { ...errors };

    if (!value) {
      newErrors[key] = `Data is required`;
    } else if (key === "desiredJobValue") {
      // No additional validation, as both letters and numbers are allowed
      delete newErrors[key];
    } else if (typeof value !== "string" || /\d/.test(value)) {
      newErrors[key] = `Input should contain only letters`;
    } else {
      delete newErrors[key];
    }

    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setLoading(true);
    const apiUrl = response
      ? `https://shaadi-be.fino-web-app.agency/api/v1/update-user-partner-preferences/${mobileNumber}`
      : `https://shaadi-be.fino-web-app.agency/api/v1/save-user-partner-preferences?mobileNumber=${mobileNumber}`;

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
          toggleModal(); // Close modal after success
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
      console.log("err :", err);
      setLoading(false);
      setError("An error occurred. Please try again.");
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
  };

  return (
    <CardContainer
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {mobileNumber === session?.userName && (
        <div className="d-flex justify-content-end mb-2">
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

      <div className="grid grid-cols-1 gap-4">
        {partnerPreferencesFields.map((field, index) => (
          <div
            key={index}
            className="mb-2 p-2 d-flex justify-content-between align-items-center border-bottom"
            style={{ flexWrap: "wrap" }}
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
              {response && response[field.key] ? response[field.key] : "N/A"}
            </span>
          </div>
        ))}
      </div>

      <Modal show={isModalOpen} onHide={toggleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user-edit me-2"></i> Update Partner Preferences
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ padding: "30px 50px", maxHeight: "60vh", overflowY: "auto" }}
        >
          <Form>
            {partnerPreferencesFields.map((field, index) => (
              <Form.Group key={index} className="mb-4">
                <Form.Label className="font-weight-bold">
                  {field.value}
                </Form.Label>
                <div
                  className="input-group"
                  style={{ flexDirection: "column" }}
                >
                  <Form.Control
                    type="text"
                    value={updatedProfile[field.key] || ""}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.value)
                    }
                    placeholder={`Enter ${field.value}`}
                    className="border-0 rounded-end" // Style the control
                    style={{
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      marginLeft: "5px",
                      width: "100%",
                    }}
                  />
                  {errors[field.key] && (
                    <div
                      className="text-danger mt-1"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {errors[field.key]}
                    </div>
                  )}
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
              {success && (
                <Alert variant="success" className="d-flex align-items-center">
                  <i className="fas fa-check-circle me-2"></i> Profile updated
                  successfully!
                </Alert>
              )}
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
              borderColor: "rgb(219, 39, 119)",
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            <i className="fas fa-save me-2"></i> Save
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
    </CardContainer>
  );
};

export default UserPartnerPreferences;
