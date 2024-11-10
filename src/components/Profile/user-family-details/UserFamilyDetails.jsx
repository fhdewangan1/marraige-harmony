import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";

const familyFields = [
  { key: "fatherName", value: "Father" },
  { key: "fatherOccupation", value: "Father's Occupation" },
  { key: "motherName", value: "Mother" },
  { key: "motherOccupation", value: "Mother's Occupation" },
  { key: "noOfBrothers", value: "Number of Brothers" },
  { key: "noOfBrothersMarried", value: "Number of Married Brothers" },
  { key: "noOfSisters", value: "Number of Sisters" },
  { key: "noOfSistersMarried", value: "Number of Married Sisters" },
  { key: "noOfFamilyMembers", value: "Total Number of Family Members" },
  { key: "familyValue", value: "Family Values" },
  { key: "familyDetails", value: "Family Details" },
  { key: "familyStatus", value: "Family Status" },
  { key: "maternalGotra", value: "Maternal Gotra" },
];

const MAX_VALUE = 100;

const UserFamilyDetails = ({
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

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  const validateFields = () => {
    const errors = {};

    // Required fields validation
    if (!updatedProfile.fatherName)
      errors.fatherName = "Father's Name is required.";
    if (!updatedProfile.fatherOccupation)
      errors.fatherOccupation = "Father's Occupation is required.";
    if (!updatedProfile.motherName)
      errors.motherName = "Mother's Name is required.";
    if (!updatedProfile.motherOccupation)
      errors.motherOccupation = "Mother's Occupation is required.";
    if (!updatedProfile.noOfBrothers)
      errors.noOfBrothers = "Number of Brothers is required.";
    if (!updatedProfile.noOfBrothersMarried)
      errors.noOfBrothersMarried = "Number of Married Brothers is required.";
    if (!updatedProfile.noOfSisters)
      errors.noOfSisters = "Number of Sisters is required.";
    if (!updatedProfile.noOfSistersMarried)
      errors.noOfSistersMarried = "Number of Married Sisters is required.";
    if (!updatedProfile.noOfFamilyMembers)
      errors.noOfFamilyMembers = "Total Number of Family Members is required.";

    // Max value validation
    if (updatedProfile.noOfFamilyMembers > MAX_VALUE)
      errors.noOfFamilyMembers = `Total Number of Family Members must be below ${MAX_VALUE}`;
    if (updatedProfile.noOfBrothers > MAX_VALUE)
      errors.noOfBrothers = `Number of Brothers must be below ${MAX_VALUE}`;
    if (updatedProfile.noOfSisters > MAX_VALUE)
      errors.noOfSisters = `Number of Sisters must be below ${MAX_VALUE}`;

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({ ...prevProfile, [key]: value }));

    // Apply max value check
    if (value > MAX_VALUE) {
      setErrors((prev) => ({
        ...prev,
        [key]: `Value must be below ${MAX_VALUE}`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const handleSubmit = () => {
    if (!validateFields()) return;

    setLoading(true);
    const apiUrl = response
      ? `https://shaadi-be.fino-web-app.agency/api/v1/update-user-family-details/${mobileNumber}`
      : `https://shaadi-be.fino-web-app.agency/api/v1/save-user-family-details?mobileNumber=${mobileNumber}`;

    fetch(apiUrl, {
      method: response ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => res.json())
      .then((data) => {
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
          Swal.fire("Error", "Failed to update user details", "error");
        }
      })
      .catch(() => {
        setLoading(false);
        Swal.fire("Error", "An error occurred. Please try again.", "error");
      });
  };

  const renderFamilyFields = () => {
    return familyFields.map((field, index) => (
      <div
        key={index}
        className="mb-2 p-2 d-flex justify-content-between align-items-center border-bottom"
        style={{ flexWrap: "wrap" }}
      >
        <strong className="text-primary" style={{ fontSize: "1rem" }}>
          {field.value}:
        </strong>
        <span
          className="text-dark"
          style={{ fontSize: "1rem", paddingLeft: "10px" }}
        >
          {response && response[field.key]
            ? Array.isArray(response[field.key])
              ? response[field.key].join(", ")
              : response[field.key]
            : "N/A"}
        </span>
      </div>
    ));
  };

  const renderFormFields = () => {
    return familyFields.map((field, index) => (
      <Form.Group key={index} className="mb-4">
        <Form.Label className="font-weight-bold">{field.value}</Form.Label>
        <div className="input-group" style={{ flexDirection: "column" }}>
          <Form.Control
            type={field.key.includes("noOf") ? "number" : "text"}
            value={updatedProfile[field.key] || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            min={0}
            placeholder={`Enter ${field.value}`}
            className="border-0 rounded-end"
            style={{ boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", width: "100%" }}
          />
          {errors[field.key] && (
            <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>
              {errors[field.key]}
            </div>
          )}
        </div>
      </Form.Group>
    ));
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        {mobileNumber === session?.userName && (
          <div className="d-flex justify-content-end mb-4">
            <Button
              variant="primary"
              onClick={toggleModal}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: "#003566",
                borderColor: "#003566",
              }}
            >
              <i className="fas fa-pencil-alt me-2"></i>
              {response ? "Update" : "Add"}
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
          {renderFamilyFields()}
        </div>
      </div>

      {isModalOpen && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-users me-2"></i>
              {response ? "Update Family Details" : "Add Family Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              padding: "30px 50px",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <Form>{renderFormFields()}</Form>
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

export default UserFamilyDetails;
