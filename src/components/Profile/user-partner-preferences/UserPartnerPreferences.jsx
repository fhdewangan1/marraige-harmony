import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Select from "react-select";
import { AxiosConfig } from "../../../config/AxiosConfig";

const CardContainer = styled.div`
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

const locationOptions = [
  { value: "Pune", label: "Pune" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Raipur", label: "Raipur" },
  { value: "Chennai", label: "Chennai" },
  { value: "Bengaluru", label: "Bengaluru" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Delhi", label: "Delhi" },
  { value: "Nagpur", label: "Nagpur" },
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
  const [dynamicLocations, setDynamicLocations] = useState([
    ...locationOptions,
  ]);

  const jobOptions = [
    { value: "Private", label: "Private" },
    { value: "Government", label: "Government" },
    { value: "Business", label: "Business" },
  ];

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

    const endpoint = response
      ? `/update-user-partner-preferences/${mobileNumber}`
      : `/save-user-partner-preferences?mobileNumber=${mobileNumber}`;

    const requestConfig = {
      method: response ? "PUT" : "POST",
      url: endpoint,
      data: response ? updatedProfile : { mobileNumber, ...updatedProfile }, // Adjust payload for POST requests
    };

    try {
      const { data } = await AxiosConfig(requestConfig);
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
      console.error("Error:", err);
      setLoading(false);
      setError("An error occurred. Please try again.");
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
  };

  const handleFieldChange = (key, value) => {
    // Check if the field is a text input (exclude Select fields like job or location)
    if (key !== "preferredLocation" && key !== "desiredJobValue") {
      // Apply the transformation to packcal case (first letter capitalized, others lowercase)
      value = value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }

    // Update the state with the transformed value
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));

    // Validate the updated value
    validate(key, value);
  };

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-5">
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
              <i className="fas fa-user-edit me-2"></i> Update Partner
              Preferences
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
              {partnerPreferencesFields.map((field, index) => (
                <Form.Group key={index} className="mb-4">
                  <Form.Label className="font-weight-bold">
                    {field.value}
                  </Form.Label>
                  <div className="input-group">
                    {field.key === "desiredJobValue" ? (
                      <Select
                        isMulti
                        options={jobOptions}
                        value={
                          updatedProfile[field.key]
                            ? updatedProfile[field.key]
                                .split(",")
                                .map((value) => ({ label: value, value }))
                            : []
                        }
                        onChange={(selectedOptions) => {
                          const selectedValues = selectedOptions.map(
                            (option) => option.value
                          );
                          handleFieldChange(
                            field.key,
                            selectedValues.join(",")
                          );
                        }}
                        className="react-select-container w-100"
                        classNamePrefix="react-select"
                      />
                    ) : field.key === "preferredLocation" ? (
                      <div className="d-flex flex-column flex-md-row w-100">
                        <div className="d-flex align-items-center w-100 mb-2 mb-md-0">
                          <Select
                            isMulti
                            options={[
                              ...dynamicLocations, // Include dynamic locations in the options
                              ...(updatedProfile.customLocations
                                ? updatedProfile.customLocations.map((loc) => ({
                                    value: loc,
                                    label: loc,
                                  }))
                                : []),
                            ]}
                            value={
                              updatedProfile[field.key]
                                ? updatedProfile[field.key]
                                    .split(",")
                                    .map((value) => ({ label: value, value }))
                                : []
                            }
                            onChange={(selectedOptions) => {
                              const selectedValues = selectedOptions.map(
                                (option) => option.value
                              );
                              handleFieldChange(
                                field.key,
                                selectedValues.join(",")
                              );
                            }}
                            className="react-select-container flex-grow-1"
                            classNamePrefix="react-select"
                          />
                        </div>

                        {/* Button in the same row on medium and larger screens */}
                        <div className="w-1/2 w-md-100 mt-2 mt-md-0 ml-auto mr-0 ">
                          <Button
                            onClick={() => {
                              const newLocation = prompt(
                                "Enter the custom location:"
                              );
                              if (
                                newLocation &&
                                !updatedProfile[field.key].includes(newLocation)
                              ) {
                                const updatedLocations = updatedProfile[
                                  field.key
                                ]
                                  ? `${
                                      updatedProfile[field.key]
                                    },${newLocation}`
                                  : newLocation;
                                handleFieldChange(field.key, updatedLocations);
                                setDynamicLocations((prevLocations) => [
                                  ...prevLocations,
                                  { value: newLocation, label: newLocation },
                                ]);
                              } else {
                                alert(
                                  "Location is either empty or already added."
                                );
                              }
                            }}
                            style={{
                              height: "38px",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              flexShrink: 0,
                              width: "120px",
                            }}
                            className="btn btn-dark d-block w-md-auto"
                          >
                            <i
                              className="fas fa-plus"
                              style={{ marginRight: "5px" }}
                            ></i>
                            Add City
                          </Button>
                        </div>
                      </div>
                    ) : (
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
                {success && (
                  <Alert
                    variant="success"
                    className="d-flex align-items-center"
                  >
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
              <i className="fas fa-save me-2"></i>Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </CardContainer>
    </div>
  );
};

export default UserPartnerPreferences;
