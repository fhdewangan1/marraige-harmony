import "./UserLifeStyleAndEducation.css";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";

// Fields to show in the user information (top section)
const showFields = [
  { key: "userOccupation", label: "Occupation", type: "text", required: true },
  {
    key: "userCurrentLoc",
    label: "Current Location",
    type: "text",
    required: true,
  },
  { key: "drinking", label: "Drinking Habits", type: "text" },
  { key: "smoking", label: "Smoking Habits", type: "text" },
  { key: "diet", label: "Diet", type: "text" },
  { key: "qualification", label: "Qualification", type: "text" },
];

const UserLifeStyleAndEducation = ({
  response,
  refresAfterUpdate,
  setStatus,
  status,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setErrors({});
  };

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    showFields.forEach(({ key, required }) => {
      if (required && !updatedProfile[key]) {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Validate before submitting

    setLoading(true);
    const apiUrl = response
      ? `https://shaadi-be.fino-web-app.agency/api/v1/update-user-life-style-details/${response.mobileNumber}`
      : `https://shaadi-be.fino-web-app.agency/api/v1/save-user-life-style?mobileNumber=${response.mobileNumber}`;

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
        setErrors({ api: data.message || "Failed to update user details" });
        Swal.fire(
          "Error",
          data.message || "Failed to update user details",
          "error"
        );
      }
    } catch (err) {
      console.log("err :", err);
      setLoading(false);
      setErrors({ api: "An error occurred. Please try again." });
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
  };

  return (
    <section className="profile-wrap">
      <div className="update-button">
        <FaRegEdit className="icon" onClick={toggleModal} disabled={loading} />
      </div>
      <div className="other-information">
        {showFields.map(({ key, label }, index) => (
          <div className="info-item" key={index}>
            <span className="label">{label}:</span>
            <span className="value">{response?.[key] || "N/A"}</span>
          </div>
        ))}
      </div>

      {isModalOpen && !loading && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Lifestyle and Education Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {/* Show all fields in the modal */}
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
              <Modal.Footer>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Update"}
                </button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </section>
  );
};

export default UserLifeStyleAndEducation;
