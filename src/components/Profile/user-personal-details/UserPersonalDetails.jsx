import { useEffect, useState } from "react";
import styled from "styled-components";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

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

// Personal Fields
const personalFields = [
  { key: "userHeight", value: "Height" },
  { key: "userWeight", value: "Weight" },
  { key: "gotra", value: "Gotra" },
  { key: "manglik", value: "Manglik" },
  { key: "maritalStatus", value: "Marital Status" },
  { key: "isPersonDisabled", value: "Is Disabled" },
  { key: "userIncome", value: "Monthly Income" },
  { key: "isUserStayingAlone", value: "Is Staying Alone" },
  { key: "hobbies", value: "Hobbies" },
  { key: "birthPlace", value: "Birth Place" },
  { key: "complexion", value: "Complexion" },
  { key: "rashi", value: "Rashi" },
  { key: "bloodGroup", value: "Blood Group" },
  { key: "bodyType", value: "Body Type" },
];

const UserPersonalDetails = ({
  response,
  refresAfterUpdate,
  setStatus,
  status,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(response || {});
  const [loading, setLoading] = useState(false);
  const session = AuthHook();
  const { mobileNumber } = useParams();
  const [errors, setErrors] = useState({});

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));

    validate(key, value);
  };

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const validateFields = () => {
    const { userHeight, userWeight, ...otherFields } = updatedProfile;
    let errors = {};

    if (!updatedProfile.userHeight) {
      errors.userHeight = "value is required";
    } else if (userHeight.length > 3) {
      errors.userHeight = "Please enter a valid value of height in centimeter";
    }

    if (!updatedProfile.userWeight) {
      errors.userWeight = "value is required.";
    } else if (userWeight.length > 3) {
      errors.userWeight = "Please enter a valid value of weight in kilograms";
    }

    // Check if any other field is empty
    for (const key in otherFields) {
      if (!otherFields[key]) {
        errors[key] = `The field cannot be empty.`;
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validate = (key, value) => {
    let newErrors = { ...errors };

    if (!value) {
      newErrors[key] = `${key} is required`;
    } else if (key === "userHeight" && value.length > 3) {
      newErrors[key] = "please enter height in 3 digits in CM";
    } else if (key === "userWeight" && value.length > 3) {
      newErrors[key] = "please enter weight in 3 digits in KG";
    } else {
      delete newErrors[key];
    }

    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

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
        Swal.fire(
          "Success!",
          "User details updated successfully!",
          "success"
        ).then(() => {
          toggleModal(); // Close modal after success
        });
      } else {
        Swal.fire(
          "Error",
          data.message || "Failed to update user details",
          "error"
        );
      }
    } catch (err) {
      console.log("err :", err);
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
              <i
                className="fas fa-pencil-alt me-2"
                style={{ fontSize: "1.2rem" }}
              ></i>
              {response ? "Update" : "Add"}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
          {personalFields.map((field, index) => (
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
                  ? response[field.key].toString()
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
              {response ? "Update Personal Details" : "Add Personal Details"}
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
              {personalFields.map((field, index) => (
                <Form.Group key={index} className="mb-4">
                  <Form.Label className="font-weight-bold">
                    {field.value}
                  </Form.Label>
                  <div
                    className="input-group"
                    style={{ flexDirection: "column" }}
                  >
                    {[
                      "maritalStatus",
                      "isPersonDisabled",
                      "isUserStayingAlone",
                      "rashi",
                      "bloodGroup",
                      "bodyType",
                      "gotra",
                      "manglik",
                    ].includes(field.key) ? (
                      <Form.Select
                        value={updatedProfile[field.key] || ""}
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.value)
                        }
                        className="border-0 rounded-end"
                        style={{
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          marginLeft: "5px",
                          width: "100%",
                        }}
                      >
                        <option value="">Select {field.value}</option>
                        {field.key === "gotra" && (
                          <>
                            <option value="Viśvāmitra">Viśvāmitra</option>
                            <option value="Jamadagni">Jamadagni</option>
                            <option value="Bharadvāja">Bharadvāja</option>
                            <option value="Bharadvāja">Gautama</option>
                            <option value="Bharadvāja">Atri</option>
                            <option value="Bharadvāja">Vasiṣṭha</option>
                            <option value="Bharadvāja">Kaśyapa</option>
                            <option value="Bharadvāja">Agastya</option>
                          </>
                        )}
                        {field.key === "manglik" && (
                          <>
                            <option value="Manglik">
                              Manglik (Mangal Dosha)
                            </option>
                            <option value="Non-Manglik">Non-Manglik</option>
                          </>
                        )}
                        {field.key === "maritalStatus" && (
                          <>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                          </>
                        )}
                        {field.key === "isPersonDisabled" && (
                          <>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </>
                        )}
                        {field.key === "isUserStayingAlone" && (
                          <>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </>
                        )}
                        {field.key === "rashi" && (
                          <>
                            <option value="Mesh">Mesh</option>
                            <option value="Vrishabha">Vrishabha</option>
                            <option value="Mithuna">Mithuna</option>
                            <option value="Karka">Karka</option>
                            <option value="Simha">Simha</option>
                            <option value="Kanya">Kanya</option>
                            <option value="Tula">Tula</option>
                            <option value="Vrishchika">Vrishchika</option>
                            <option value="Dhanu">Dhanu</option>
                            <option value="Makara">Makara</option>
                            <option value="Meena">Meena</option>
                          </>
                        )}
                        {field.key === "bloodGroup" && (
                          <>
                            <option value="A">A+</option>
                            <option value="A">A-</option>
                            <option value="B">B+</option>
                            <option value="B">B-</option>
                            <option value="AB">AB+</option>
                            <option value="AB">AB-</option>
                            <option value="O">O+</option>
                            <option value="O">O-</option>
                          </>
                        )}
                        {field.key === "bodyType" && (
                          <>
                            <option value="Slim">Slim</option>
                            <option value="Average">Average</option>
                            <option value="Athletic">Athletic</option>
                            <option value="Chubby">Chubby</option>
                            <option value="Obese">Obese</option>
                          </>
                        )}
                      </Form.Select>
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
                          marginLeft: "5px",
                          width: "100%",
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

export default UserPersonalDetails;
