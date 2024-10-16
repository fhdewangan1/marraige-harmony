import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { Modal } from "react-bootstrap"; // Import Modal component

const partnerPreferencesFields = [
  { key: "familyStatus", label: "Family Status" },
  { key: "familyValue", label: "Family Values" },
  { key: "preferredLocation", label: "Preferred Locations" },
  { key: "desiredJobValue", label: "Desired Job" },
  { key: "anyOtherPreferences", label: "Other Preferences" },
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

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    const apiUrl = response
      ? `https://shaadi-be.fino-web-app.agency/api/v1/update-user-partner-preferences/${mobileNumber}`
      : `https://shaadi-be.fino-web-app.agency/api/v1/save-user-partner-preferences?mobileNumber=${mobileNumber}`;

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

  const limitWords = (text, limit) => {
    if (!text) return "N/A";
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "..."; // Add ellipsis if truncated
  };

  return (
    <section className="user-partner-preferences-wrap">
      <div className="update-button">
        <FaRegEdit className="icon" onClick={toggleModal} disabled={loading} />
      </div>
      <div className="other-information-wrap">
        <div className="other-information">
          {partnerPreferencesFields.map(({ key, label }, index) => (
            <div className="info-item" key={index}>
              <span className="label">{label}:</span>
              <span className="value">{response?.[key] || "N/A"}</span>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Partner Preferences</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {partnerPreferencesFields.map(({ key, label }) => (
              <div className="mb-3" key={key}>
                <label htmlFor={key} className="form-label">
                  {label}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={key}
                  value={updatedProfile[key] || ""}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                />
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={toggleModal}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <RingLoader size={24} /> : "Save Changes"}
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </section>
  );
};

export default UserPartnerPreferences;
