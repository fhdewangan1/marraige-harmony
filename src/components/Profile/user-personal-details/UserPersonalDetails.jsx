import { useEffect, useState } from "react";
import styled from "styled-components";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Select from "react-select"; // Import react-select
import { AxiosConfig } from "../../../config/AxiosConfig";

// Styled components
const CardContainer = styled.div`
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

const UserPersonalDetails = ({ response, setStatus, status }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(response || {});
  const [loading, setLoading] = useState(false);
  const session = AuthHook();
  const { mobileNumber } = useParams();
  const [errors, setErrors] = useState({});

  const manglikOptions = [
    { value: "Manglik", label: "Manglik" },
    { value: "Non Manglik", label: "Non Manglik" },
    { value: "Partial Manglik", label: "Partial Manglik" },
  ];

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));

    validate(key, value);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const validateFields = () => {
    const { userHeight, userWeight, ...otherFields } = updatedProfile;
    let errors = {};

    if (!userHeight) {
      errors.userHeight = "Height is required";
    } else if (userHeight < 100 || userHeight > 300) {
      errors.userHeight = "Please enter a valid height between 100 and 300 cm";
    }

    if (!userWeight) {
      errors.userWeight = "Weight is required.";
    } else if (userWeight < 20 || userWeight > 300) {
      errors.userWeight = "Please enter a valid weight between 20 and 300 kg";
    }

    // Check if any other field is empty
    for (const key in otherFields) {
      if (!otherFields[key]) {
        errors[key] = `${
          personalFields.find((field) => field.key === key)?.value
        } cannot be empty.`;
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validate = (key, value) => {
    let newErrors = { ...errors };

    if (!value) {
      newErrors[key] = `${key} is required`;
    } else if (key === "userHeight") {
      if (value < 100 || value > 300) {
        newErrors[key] = "Please enter a height between 100 and 300 cm";
      } else {
        delete newErrors[key];
      }
    } else if (key === "userWeight") {
      if (value < 10 || value > 300) {
        newErrors[key] = "Please enter a weight between 10 and 300 kg";
      } else {
        delete newErrors[key];
      }
    } else {
      delete newErrors[key];
    }

    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setLoading(true);

    const endpoint = response
      ? `/update-user-personal-details/${mobileNumber}`
      : `/save-user-personal-details?mobileNumber=${mobileNumber}`;

    const requestConfig = {
      method: response ? "PUT" : "POST",
      url: endpoint,
      data: response ? updatedProfile : { mobileNumber, ...updatedProfile }, // Include mobileNumber in POST payload
    };

    try {
      const { data } = await AxiosConfig(requestConfig);
      setLoading(false);

      if (data.status === 200 || data.status === 201) {
        setStatus(!status);
        Swal.fire(
          "Success!",
          "User details updated successfully!",
          "success"
        ).then(() => {
          toggleModal(); // Close modal on success
        });
      } else {
        Swal.fire(
          "Error",
          data.message || "Failed to update user details",
          "error"
        );
      }
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
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
                {field.key === "userHeight" && updatedProfile[field.key]
                  ? `${updatedProfile[field.key]} cm`
                  : field.key === "userWeight" && updatedProfile[field.key]
                  ? `${updatedProfile[field.key]} kg`
                  : updatedProfile && updatedProfile[field.key] !== undefined
                  ? updatedProfile[field.key].toString()
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
                    {/* Handle Monthly Income field to show Rs/ Year */}
                    {field.key === "userIncome" ? (
                      <div className="d-flex">
                        <Form.Control
                          type="number"
                          value={
                            (updatedProfile && updatedProfile[field.key]) || ""
                          }
                          onChange={(e) =>
                            handleFieldChange(field.key, e.target.value)
                          }
                          placeholder={`Enter ${field.value}`}
                          className="border-0 rounded-start"
                          style={{
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }}
                          min={0}
                        />
                        <span
                          className="input-group-text"
                          style={{
                            width: "40%",
                            backgroundColor: "#f1f1f1",
                          }}
                        >
                          Rs/Year
                        </span>
                      </div>
                    ) : field.key === "manglik" ? (
                      <Select
                        options={manglikOptions}
                        value={manglikOptions.find(
                          (option) => option.value === updatedProfile[field.key]
                        )}
                        onChange={(selectedOption) =>
                          handleFieldChange(field.key, selectedOption.value)
                        }
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }),
                        }}
                      />
                    ) : field.key === "maritalStatus" ? (
                      <Select
                        options={[
                          { value: "Married", label: "Married" },
                          { value: "Unmarried", label: "Unmarried" },
                          { value: "Divorced", label: "Divorced" },
                        ]}
                        value={["Married", "Unmarried", "Divorced"]
                          .map((option) => ({
                            value: option,
                            label: option,
                          }))
                          .find(
                            (option) =>
                              option.value === updatedProfile[field.key]
                          )}
                        onChange={(selectedOption) =>
                          handleFieldChange(field.key, selectedOption.value)
                        }
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }),
                        }}
                      />
                    ) : field.key === "isStayingAlone" ? (
                      <Select
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        value={["Yes", "No"]
                          .map((option) => ({
                            value: option,
                            label: option,
                          }))
                          .find(
                            (option) =>
                              option.value === updatedProfile[field.key]
                          )}
                        onChange={(selectedOption) =>
                          handleFieldChange(field.key, selectedOption.value)
                        }
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }),
                        }}
                      />
                    ) : field.key === "isPersonDisabled" ? (
                      <Select
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        value={["Yes", "No"]
                          .map((option) => ({
                            value: option,
                            label: option,
                          }))
                          .find(
                            (option) =>
                              option.value === updatedProfile[field.key]
                          )}
                        onChange={(selectedOption) =>
                          handleFieldChange(field.key, selectedOption.value)
                        }
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }),
                        }}
                      />
                    ) : field.key === "isUserStayingAlone" ? (
                      <Select
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        value={["Yes", "No"]
                          .map((option) => ({
                            value: option,
                            label: option,
                          }))
                          .find(
                            (option) =>
                              option.value === updatedProfile[field.key]
                          )}
                        onChange={(selectedOption) =>
                          handleFieldChange(field.key, selectedOption.value)
                        }
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }),
                        }}
                      />
                    ) : field.key === "rashi" ? (
                      <Select
                        options={[
                          { value: "Mesh", label: "Mesh (Aries)" },
                          { value: "Vrishabh", label: "Vrishabh (Taurus)" },
                          { value: "Mithun", label: "Mithun (Gemini)" },
                          { value: "Karka", label: "Karka (Cancer)" },
                          { value: "Singh", label: "Singh (Leo)" },
                          { value: "Kanya", label: "Kanya (Virgo)" },
                          { value: "Tula", label: "Tula (Libra)" },
                          { value: "Vrishchik", label: "Vrishchik (Scorpio)" },
                          { value: "Dhanu", label: "Dhanu (Sagittarius)" },
                          { value: "Makar", label: "Makar (Capricorn)" },
                          { value: "Kumbh", label: "Kumbh (Aquarius)" },
                          { value: "Meen", label: "Meen (Pisces)" },
                        ]}
                        value={[
                          "Mesh",
                          "Vrishabh",
                          "Mithun",
                          "Karka",
                          "Singh",
                          "Kanya",
                          "Tula",
                          "Vrishchik",
                          "Dhanu",
                          "Makar",
                          "Kumbh",
                          "Meen",
                        ]
                          .map((option) => ({
                            value: option,
                            label: option,
                          }))
                          .find(
                            (option) =>
                              option.value === updatedProfile[field.key]
                          )}
                        onChange={(selectedOption) =>
                          handleFieldChange(field.key, selectedOption.value)
                        }
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }),
                        }}
                      />
                    ) : field.key === "bloodGroup" ? (
                      <Select
                        options={[
                          { value: "A+", label: "A+" },
                          { value: "A-", label: "A-" },
                          { value: "B+", label: "B+" },
                          { value: "B-", label: "B-" },
                          { value: "O+", label: "O+" },
                          { value: "O-", label: "O-" },
                          { value: "AB+", label: "AB+" },
                          { value: "AB-", label: "AB-" },
                        ]}
                        value={[
                          "A+",
                          "A-",
                          "B+",
                          "B-",
                          "O+",
                          "O-",
                          "AB+",
                          "AB-",
                        ]
                          .map((option) => ({
                            value: option,
                            label: option,
                          }))
                          .find(
                            (option) =>
                              option.value === updatedProfile[field.key]
                          )}
                        onChange={(selectedOption) =>
                          handleFieldChange(field.key, selectedOption.value)
                        }
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }),
                        }}
                      />
                    ) : field.key === "bodyType" ? (
                      <Select
                        options={[
                          { value: "Slim", label: "Slim" },
                          { value: "Athletic", label: "Athletic" },
                          { value: "Average", label: "Average" },
                          { value: "Heavy", label: "Heavy" },
                          { value: "Chubby", label: "Chubby" },
                          { value: "Curvy", label: "Curvy" },
                        ]}
                        value={[
                          "Slim",
                          "Athletic",
                          "Average",
                          "Heavy",
                          "Chubby",
                          "Curvy",
                        ]
                          .map((option) => ({
                            value: option,
                            label: option,
                          }))
                          .find(
                            (option) =>
                              option.value === updatedProfile[field.key]
                          )}
                        onChange={(selectedOption) =>
                          handleFieldChange(field.key, selectedOption.value)
                        }
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }),
                        }}
                      />
                    ) : field.key === "complexion" ? (
                      <Select
                        options={[
                          { value: "Fair", label: "Fair" },
                          { value: "Wheatish", label: "Wheatish" },
                          { value: "Medium", label: "Medium" },
                          { value: "Dusky", label: "Dusky" },
                          { value: "Dark", label: "Dark" },
                          { value: "Very Fair", label: "Very Fair" },
                          { value: "Light Brown", label: "Light Brown" },
                          { value: "Olive", label: "Olive" },
                          { value: "Fair to Medium", label: "Fair to Medium" },
                          { value: "Pale", label: "Pale" },
                        ]}
                        value={[
                          "Fair",
                          "Wheatish",
                          "Medium",
                          "Dusky",
                          "Dark",
                          "Very Fair",
                          "Light Brown",
                          "Olive",
                          "Fair to Medium",
                          "Pale",
                        ]
                          .map((option) => ({
                            value: option,
                            label: option,
                          }))
                          .find(
                            (option) =>
                              option.value === updatedProfile[field.key]
                          )}
                        onChange={(selectedOption) =>
                          handleFieldChange(field.key, selectedOption.value)
                        }
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }),
                        }}
                      />
                    ) : ["userHeight", "userWeight"].includes(field.key) ? (
                      <div className="d-flex">
                        <Form.Control
                          type="number"
                          value={updatedProfile[field.key] || ""}
                          onChange={(e) =>
                            handleFieldChange(field.key, e.target.value)
                          }
                          placeholder={`Enter ${field.value}`}
                          className="border-0 rounded-start"
                          style={{
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }}
                          min={field.key === "userHeight" ? 100 : 20}
                          max={field.key === "userHeight" ? 300 : 300}
                        />
                        <span
                          className="input-group-text"
                          style={{
                            width: "20%",
                            backgroundColor: "#f1f1f1",
                          }}
                        >
                          {field.key === "userHeight" ? "cm" : "kg"}
                        </span>
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
