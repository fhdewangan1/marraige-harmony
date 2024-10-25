import { useEffect, useState } from "react";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

// Fields array
const fields = [
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
  { label: "Email", key: "mailId" },
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

  const handleSubmit = (e) => {
    e.preventDefault();
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
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 transition-transform hover:scale-105">
        <div className="flex justify-end mb-4">
          {mobileNumber === session?.userName && (
            <Button
              variant="primary"
              onClick={toggleModal}
              className="px-4 py-2 rounded-lg text-base font-medium shadow-sm flex items-center bg-blue-600 text-white"
            >
              <i className="fas fa-pencil-alt mr-2"></i>
              {response ? "Update Profile" : "Add Profile"}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b"
            >
              <strong className="text-gray-700 text-sm">{field.label}:</strong>
              <span className="text-gray-600 text-sm">
                {response && response[field.key] !== undefined
                  ? Array.isArray(response[field.key])
                    ? response[field.key].join(", ")
                    : response[field.key]
                  : "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for editing profile */}
      {isModalOpen && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="flex items-center">
              <i className="fas fa-user-edit mr-2"></i>
              {response ? "Update Profile" : "Add Profile"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {fields.map((field, index) => (
                <Form.Group key={index} className="mb-4">
                  <Form.Label className="font-semibold">
                    {field.label}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedProfile[field.key] || ""}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.value)
                    }
                    disabled={field.isDisabled}
                    className="border rounded-md w-full px-3 py-2"
                  />
                </Form.Group>
              ))}
              <Form.Group className="mb-4">
                <Form.Label className="font-semibold">
                  Profile Image:
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>
            </Form>
            {loading && (
              <div className="flex justify-center mt-4">
                <Spinner animation="border" variant="primary" />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 border-green-600 text-white px-4 py-2"
            >
              <i className="fas fa-save mr-2"></i>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default PrimaryUserDetails;
