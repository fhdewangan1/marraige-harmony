import "./UserFamilyDetails.css";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import { RingLoader } from "react-spinners";

// Family fields to show
const familyFields = [
  { key: "fatherName", label: "Father's Name", type: "text" },
  { key: "fatherOccupation", label: "Father's Occupation", type: "text" },
  { key: "motherName", label: "Mother's Name", type: "text" },
  { key: "motherOccupation", label: "Mother's Occupation", type: "text" },
  { key: "noOfBrothers", label: "Number of Brothers", type: "number" },
  {
    key: "noOfBrothersMarried",
    label: "Number of Married Brothers",
    type: "number",
  },
  { key: "noOfSisters", label: "Number of Sisters", type: "number" },
  {
    key: "noOfSistersMarried",
    label: "Number of Married Sisters",
    type: "number",
  },
  {
    key: "noOfFamilyMembers",
    label: "Total Number of Family Members",
    type: "number",
  },
  { key: "familyValue", label: "Family Values", type: "text" },
  { key: "familyDetails", label: "Family Details", type: "text" },
  { key: "familyStatus", label: "Family Status", type: "text" },
  { key: "maternalGotra", label: "Maternal Gotra", type: "text" },
];

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

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({ ...prevProfile, [key]: value }));
  };

  const validateForm = () => {
    for (const field of familyFields) {
      if (!updatedProfile[field.key]) {
        Swal.fire("Validation Error", `${field.label} is required!`, "error");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

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
          Swal.fire(
            "Error",
            data.message || "Failed to update user details",
            "error"
          );
        }
      })
      .catch(() => {
        setLoading(false);
        Swal.fire("Error", "An error occurred. Please try again.", "error");
      });
  };

  return (
    <section className="user-family-details-wrap">
      <div className="update-button">
        <FaRegEdit className="icon" onClick={toggleModal} disabled={loading} />
      </div>
      <div className="family-information-wrap">
        <div className="other-information-wrap">
          <div className="other-information">
            {familyFields.map(({ key, label }, index) => (
              <div className="info-item" key={index}>
                <span className="label">{label}:</span>
                <span className="value">{response?.[key] || "N/A"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>Update Family Details</Modal.Header>
          <Modal.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {familyFields.map(({ key, label, type }) => (
                <div className="form-group" key={key}>
                  <label htmlFor={key}>{label}</label>
                  <input
                    type={type}
                    className="form-control"
                    id={key}
                    value={updatedProfile[key] || ""}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  />
                </div>
              ))}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <RingLoader size={20} /> : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleModal}
                disabled={loading}
              >
                Cancel
              </button>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </section>
  );
};

export default UserFamilyDetails;
