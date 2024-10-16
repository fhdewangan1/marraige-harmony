import "./PrimaryUserDetails.css";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";

// Fields to show in the user information (top section)
const showFields = [
  { key: "firstName", label: "First Name", type: "text", required: true },
  { key: "lastName", label: "Last Name", type: "text", required: true },
  { key: "age", label: "Age", type: "number", required: true },
  { key: "gender", label: "Gender", type: "text", required: true },
  { key: "languageKnown", label: "Language Known", type: "text" },
  { key: "religion", label: "Religion", type: "text" },
  { key: "community", label: "Community", type: "text" },
  { key: "dob", label: "Date of Birth", type: "date", required: true },
  { key: "residence", label: "Address", type: "text", required: true },
  { key: "mobileNumber", label: "Mobile No", type: "text", required: true },
  { key: "mailId", label: "Email", type: "email", required: true },
];

// Fields to hide from the top section
const hideFields = ["profileImage", "firstName", "lastName"];

const PrimaryUserDetails = ({ status, setStatus, response, imageUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({ ...prevProfile, [key]: value }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
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

    // Additional validations
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (updatedProfile.mailId && !emailPattern.test(updatedProfile.mailId)) {
      newErrors.mailId = "Invalid email format";
    }

    const mobilePattern = /^\d{10}$/; // Assuming Indian mobile numbers
    if (
      updatedProfile.mobileNumber &&
      !mobilePattern.test(updatedProfile.mobileNumber)
    ) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = () => {
    if (!validateForm()) return; // Validate before submitting

    setLoading(true);
    const formData = new FormData();
    showFields.forEach(({ key }) =>
      formData.append(key, updatedProfile[key] || "")
    );
    if (profileImage) formData.append("profileImage", profileImage);

    fetch("https://shaadi-be.fino-web-app.agency/api/v1/auth/update-profile", {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 200 || data.status === 201) {
          setStatus(!status);
          Swal.fire(
            "Success!",
            "Profile updated successfully!",
            "success"
          ).then(() => {
            toggleModal();
            window.location.reload();
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
        Swal.fire("Error!", "An error occurred. Please try again.", "error");
      });
  };

  return (
    <section className="primary-user-details-wrap">
      <div className="update-button">
        <FaRegEdit className="icon" onClick={toggleModal} disabled={loading} />
      </div>
      <div className="first-row-wrap">
        <div className="profile-image-wrap">
          <img src={imageUrl} alt="profile" className="profile-image" />
          {/* Displaying names separately */}
          <span>
            {response?.firstName} {response?.lastName}
          </span>
        </div>
      </div>
      <div className="other-information-wrap">
        <div className="other-information">
          {showFields
            .filter(({ key }) => !hideFields.includes(key)) // Filter out hidden fields
            .map(({ key, label }, index) => (
              <div className="info-item" key={index}>
                <span className="label">{label}:</span>
                <span className="value">{response?.[key] || "N/A"}</span>
              </div>
            ))}
        </div>
      </div>

      {isModalOpen && !loading && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>Update Profile</Modal.Header>
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

export default PrimaryUserDetails;
