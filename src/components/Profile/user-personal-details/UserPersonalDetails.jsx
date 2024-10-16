import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";

// Fields to show in the user information
const showFields = [
  { key: "userHeight", label: "Height", type: "text", required: true },
  { key: "userWeight", label: "Weight", type: "text", required: true },
  { key: "gotra", label: "Gotra", type: "text" },
  { key: "manglik", label: "Manglik", type: "text" },
  { key: "maritalStatus", label: "Marital Status", type: "text" },
  { key: "isPersonDisabled", label: "Is Disabled", type: "text" },
  { key: "userIncome", label: "Monthly Income", type: "text" },
  { key: "isUserStayingAlone", label: "Is Staying Alone", type: "text" },
  { key: "hobbies", label: "Hobbies", type: "text" },
  { key: "birthPlace", label: "Birth Place", type: "text" },
  { key: "complexion", label: "Complexion", type: "text" },
  { key: "rashi", label: "Rashi", type: "text" },
  { key: "bloodGroup", label: "Blood Group", type: "text" },
  { key: "bodyType", label: "Body Type", type: "text" },
];

const UserPersonalDetails = ({ status, setStatus, response }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({ ...prevProfile, [key]: value }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    showFields.forEach(({ key, required }) => {
      if (required && !updatedProfile[key]) {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = () => {
    if (!validateForm()) return; // Validate before submitting

    setLoading(true);
    fetch(
      `https://shaadi-be.fino-web-app.agency/api/v1/update-user-personal-details/${response.mobileNumber}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 200 || data.status === 201) {
          setStatus(!status);
          Swal.fire(
            "Success!",
            "User details updated successfully!",
            "success"
          ).then(() => {
            toggleModal();
            window.location.reload();
          });
        } else {
          Swal.fire(
            "Error!",
            "Failed to update user details. Please try again.",
            "error"
          );
        }
      })
      .catch(() => {
        setLoading(false);
        Swal.fire("Error!", "An error occurred. Please try again.", "error");
      });
  };

  return (
    <section className="user-personal-details-wrap">
      <div className="update-button">
        <FaRegEdit className="icon" onClick={toggleModal} disabled={loading} />
      </div>
      <div className="other-information-wrap">
        <div className="other-information">
          {showFields.map(({ key, label }, index) => (
            <div className="info-item" key={index}>
              <span className="label">{label}:</span>
              <span className="value">{response?.[key] || "N/A"}</span>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && !loading && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>Update Personal Details</Modal.Header>
          <Modal.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {showFields.map(({ key, label, type }) => (
                <div className="form-group" key={key}>
                  <label htmlFor={key}>{label}</label>
                  <input
                    type={type}
                    className={`form-control ${
                      errors[key] ? "is-invalid" : ""
                    }`} // Add validation class
                    id={key}
                    name={key}
                    value={updatedProfile[key] || ""}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  />
                  {errors[key] && (
                    <div className="invalid-feedback">{errors[key]}</div>
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Loading..." : "Update"}
              </button>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </section>
  );
};

export default UserPersonalDetails;
