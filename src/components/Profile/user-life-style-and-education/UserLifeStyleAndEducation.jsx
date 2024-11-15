import { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Select from "react-select";

const CardContainer = styled.div`
  &:hover {
    transform: translateY(-5px);
  }
`;

// Fields data
const lifeStyleAndEducationFields = [
  { key: "userOccupation", value: "Occupation" },
  { key: "userCurrentLoc", value: "Current Location" },
  { key: "drinking", value: "Drinking Habits" },
  { key: "smoking", value: "Smoking Habits" },
  { key: "diet", value: "Diet" },
  { key: "qualification", value: "Qualification" },
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
  const [error, setError] = useState("");
  const session = AuthHook();
  const { mobileNumber } = useParams();
  const [errors, setErrors] = useState({});

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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

    // Find the label for the current key
    const fieldLabel = lifeStyleAndEducationFields.find(
      (field) => field.key === key
    )?.value;

    if (!value) {
      newErrors[key] = `${fieldLabel} is required`;
    } else {
      delete newErrors[key];
    }

    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

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
      console.log("err :", err);
      setLoading(false);
      setError("An error occurred. Please try again.");
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
  };

  const handleFieldChange = (key, value) => {
    // Apply the Packcal case transformation to text fields
    if (key !== "drinking" && key !== "smoking" && key !== "diet") {
      value = value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }

    // Update the state with the new value
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));

    // Validate the field
    validate(key, value);
  };

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  return (
    <>
      <CardContainer
        className="bg-white p-6 rounded-lg shadow-lg mb-6"
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
        <div className="grid grid-cols-1 gap-4">
          {lifeStyleAndEducationFields.map((field, index) => (
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
                {response && response[field.key]
                  ? Array.isArray(response[field.key])
                    ? response[field.key].join(", ")
                    : response[field.key]
                  : "N/A"}
              </span>
            </div>
          ))}
        </div>
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
          <Modal.Body
            style={{
              padding: "30px 50px",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <Form>
              {lifeStyleAndEducationFields.map((field, index) => (
                <Form.Group key={index} className="mb-4">
                  <Form.Label className="font-weight-bold">
                    {field.value}
                  </Form.Label>
                  <div
                    className="input-group"
                    style={{ flexDirection: "column" }}
                  >
                    {/* Use React Select for fields like drinking, smoking, diet */}
                    {["drinking", "smoking", "diet"].includes(field.key) ? (
                      <Select
                        value={
                          updatedProfile[field.key]
                            ? {
                                label: updatedProfile[field.key],
                                value: updatedProfile[field.key],
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleFieldChange(
                            field.key,
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        options={
                          field.key === "drinking"
                            ? [
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" },
                                {
                                  label: "Occasionally",
                                  value: "Occasionally",
                                },
                              ]
                            : field.key === "smoking"
                            ? [
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" },
                                {
                                  label: "Occasionally",
                                  value: "Occasionally",
                                },
                              ]
                            : field.key === "diet"
                            ? [
                                { label: "Vegetarian", value: "Vegetarian" },
                                {
                                  label: "Non-Vegetarian",
                                  value: "Non-Vegetarian",
                                },
                                { label: "Eggetarian", value: "Eggetarian" },
                              ]
                            : []
                        }
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderRadius: "0.375rem",
                            borderColor: "#ccc",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }),
                        }}
                      />
                    ) : (
                      // Text input for other fields
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
                          width: "100%",
                          marginLeft: "5px",
                        }}
                      />
                    )}

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
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default UserLifeStyleAndEducation;
