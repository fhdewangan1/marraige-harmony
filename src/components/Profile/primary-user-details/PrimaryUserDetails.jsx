import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";
import "./PrimaryUserDetails.css";
import ImageCard from "./ImageCard";
// Fields array
export const fields = [
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
  { label: "Email Id", key: "mailId" },
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

  useEffect(() => {
    setUpdatedProfile(response);
  }, [response]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = () => {
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
        Swal.fire(
          "Error!",
          "Failed to update profile. Please try again.",
          "error"
        );
      });
  };

  return (
    <>
      <ImageCard setStatus={setStatus} mobileNumber={mobileNumber} />
      <motion.div
        className="card-container"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {mobileNumber === session?.userName && (
          <div className="button-container">
            <button className="btn btn-primary" onClick={toggleModal}>
              Update
            </button>
          </div>
        )}

        <div className="content-wrapper">
          {fields.map((field, index) => (
            <div className="field" key={index}>
              <strong>{field.label}:</strong>{" "}
              <span style={{ color: "#003566" }}>
                {response && response[field.key] !== undefined
                  ? Array.isArray(response[field.key])
                    ? response[field.key].join(", ")
                    : response[field.key]
                  : "N/A"}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">Update Profile</h2>
            <div className="form-wrapper">
              {fields.map((field, index) => (
                <div className="input-field" key={index}>
                  <label>{field.label}</label>
                  {field.key === "religion" || field.key === "community" ? (
                    <select
                      className="form-control"
                      value={updatedProfile[field.key] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                    >
                      {field.key === "religion" && (
                        <>
                          <option value="">Select Religion</option>
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
                          <option value="">Select Community</option>
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Urdu">Urdu</option>
                          <option value="Telugu">Telugu</option>
                          <option value="Tamil">Tamil</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <input
                      type={field.key === "mobileNumber" ? "text" : "text"}
                      className="form-control"
                      value={updatedProfile[field.key] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      disabled={field.isDisabled}
                    />
                  )}
                </div>
              ))}
              {/* Image Upload Input */}
              <div className="input-field">
                <label>Profile Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
              </div>
            </div>

            {loading ? (
              <div className="loader-container">
                <RingLoader color="#003566" size={60} />
              </div>
            ) : (
              <div className="message"></div>
            )}
            <br />
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={loading}
            >
              Save Changes
            </button>
            <button
              className="btn btn-secondary"
              onClick={toggleModal}
              style={{ marginLeft: "5px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PrimaryUserDetails;
