import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserFamilyDetails.css";

// Fields data
export const familyFields = [
  { key: "fatherName", value: "Father's Name: " },
  { key: "fatherOccupation", value: "Father's Occupation: " },
  { key: "motherName", value: "Mother's Name: " },
  { key: "motherOccupation", value: "Mother's Occupation: " },
  { key: "noOfBrothers", value: "Number of Brothers: " },
  { key: "noOfBrothersMarried", value: "Number of Married Brothers: " },
  { key: "noOfSisters", value: "Number of Sisters: " },
  { key: "noOfSistersMarried", value: "Number of Married Sisters: " },
  { key: "noOfFamilyMembers", value: "Total Number of Family Members: " },
  { key: "familyValue", value: "Family Values: " },
  { key: "familyDetails", value: "Family Details: " },
  { key: "familyStatus", value: "Family Status: " },
  { key: "maternalGotra", value: "Maternal Gotra: " },
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

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = () => {
    setLoading(true);
    const apiUrl = response
      ? `https://shaadi-be.fino-web-app.agency/api/v1/update-user-family-details/${mobileNumber}`
      : `https://shaadi-be.fino-web-app.agency/api/v1/save-user-family-details?mobileNumber=${mobileNumber}`;

    fetch(apiUrl, {
      method: response ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
            toggleModal(); // Close modal after success
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

  return (
    <>
      <motion.div
        className="card shadow-sm mb-4 user-family-card"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {mobileNumber === session?.userName && (
          <div className="position-relative">
            <button
              className="btn btn-primary position-absolute top-0 end-0 m-3"
              onClick={toggleModal}
            >
              {response ? "Update" : "Add"}
            </button>
          </div>
        )}
        <div className="card-body family-card-body">
          <div className="row">
            {familyFields.map((field, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <strong className="label">{field.value}</strong>{" "}
                <span className="value">
                  {response && response[field.key]
                    ? Array.isArray(response[field.key])
                      ? response[field.key].join(", ")
                      : response[field.key]
                    : "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {isModalOpen && (
        <div className="modal show modal-background">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {response ? "Update Family Details" : "Add Family Details"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {familyFields.map((field, index) => (
                    <div className="col-md-6 mb-3" key={index}>
                      <label className="form-label">{field.value}</label>
                      <input
                        type={field.key.includes("noOf") ? "number" : "text"}
                        className="form-control"
                        value={updatedProfile[field.key] || ""}
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.value)
                        }
                        min={0}
                      />
                    </div>
                  ))}
                </div>

                {loading ? (
                  <div className="d-flex justify-content-center loader-container">
                    <RingLoader color="#003566" size={60} />
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ marginTop: "10px" }}
                  >
                    Save Changes
                  </button>
                )}
                <button
                  className="btn btn-secondary ms-2"
                  onClick={toggleModal}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserFamilyDetails;
