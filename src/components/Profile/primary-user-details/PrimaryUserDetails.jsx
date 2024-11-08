import { useEffect, useState } from "react";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
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

const InputField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: #333;
`;

const FileInput = styled.input`
  margin-top: 5px;
`;

// Fields array
const fields = [
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
  { label: "Email", key: "mailId" },
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
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setUpdatedProfile(response);
  }, [response]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const validateFields = () => {
    const { mailId, ...otherFields } = updatedProfile;
    let errors = {};

    if (!updatedProfile.mobileNumber) {
      errors.mobileNumber = "Contact is required";
    } else if (!/^\d{10}$/.test(updatedProfile.mobileNumber)) {
      errors.mobileNumber = "Mobile must be a 10-digit number";
    }

    if (!updatedProfile.mailId) {
      errors.mailId = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailId)) {
      errors.mailId = "Please enter a valid email address.";
    }

    // Check if any other field is empty
    for (const key in otherFields) {
      if (!otherFields[key]) {
        errors[key] = `The field ${key} cannot be empty.`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validate = (name, value) => {
    let newErrors = { ...formErrors };

    switch (name) {
      case "mobileNumber":
        if (!value) {
          newErrors.mobileNumber = "Contact is required";
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.mobileNumber = "Mobile must be of 10 digits";
        } else {
          delete newErrors.mobileNumber;
        }
        break;

      case "mailId":
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "age":
        if (!value) {
          newErrors.age = "Age is required";
        } else if (value > 100) {
          newErrors.age = "Please enter age below 100";
        } else {
          delete newErrors.age;
        }
        break;

      default:
        if (!value) {
          newErrors[name] = `${name} is required`;
        } else {
          delete newErrors[name];
        }
    }

    setFormErrors(newErrors);
  };

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));

    validate(key, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) return;
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
            window.location.reload(); //temp fix
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
        {/* <div className="flex justify-end mb-4"> */}
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
        {/* </div> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className="mb-2 flex justify-between items-center py-2 border-b"
              style={{ flexWrap: "wrap" }}
            >
              <strong
                className="text-gray-700 text-sm text-primary"
                style={{ fontSize: "medium", marginRight: "20px" }}
              >
                {field.label}:
              </strong>
              <span
                className="text-gray-600 text-sm"
                style={{ fontSize: "large" }}
              >
                {/* {field.key === "mobileNumber" ? (
                  session && response?.mobileNumber === session.userName ? ( // Check if user is logged in and matches
                    response.mobileNumber // Show mobile number
                  ) : (
                    <Button>Request</Button> // Show button if user is not logged in or not the same user
                  )
                ) : response && response[field.key] !== undefined ? (
                  Array.isArray(response[field.key]) ? (
                    response[field.key].join(", ")
                  ) : (
                    response[field.key]
                  )
                ) : (
                  "N/A"
                )} */}

                {response && response[field.key] !== undefined
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
              <i className="fas fa-users me-2"></i>
              {response ? "Update Profile" : "Add Profile"}
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
              {fields.map((field, index) => (
                <Form.Group key={index} className="mb-4">
                  <Form.Label className="font-weight-bold">
                    {field.label}
                  </Form.Label>
                  <div className="input-group">
                    {field.key === "religion" || field.key === "community" ? (
                      <Form.Control
                        as="select"
                        value={updatedProfile[field.key] || ""}
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.value)
                        }
                        className={`border-0 rounded-end ${
                          formErrors[field.key] ? "border-red-500" : ""
                        }`}
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
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.value)
                        }
                        disabled={field.isDisabled}
                        placeholder={`Enter ${field.label}`}
                        className={`border-0 rounded-end ${
                          formErrors[field.key] ? "border-red-500" : ""
                        }`}
                        style={{ boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}
                      />
                    )}
                  </div>

                  {/* Display error message below the input */}
                  {formErrors[field.key] && (
                    <div className="text-red-500 text-sm mt-1">
                      {formErrors[field.key]}
                    </div>
                  )}
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

export default PrimaryUserDetails;
