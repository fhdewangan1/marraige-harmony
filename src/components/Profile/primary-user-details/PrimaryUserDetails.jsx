import "./PrimaryUserDetails.css";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";

const PrimaryUserDetails = ({
  status,
  setStatus,
  response,
  mobileNumber,
  imageUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    languageKnown: "",
    religion: "",
    community: "",
    dob: "",
    residence: "",
    mobileNumber: "",
    mailId: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

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
    <section className="primary-user-details-wrap">
      <div className="update-button">
        <FaRegEdit className="icon" onClick={toggleModal} disabled={loading} />
      </div>
      <div className="first-row-wrap">
        <div className="profile-image-wrap">
          <img src={imageUrl} alt="profile-image" className="profile-image" />
          <span>
            {response?.firstName}
            {response?.lastName}
          </span>
        </div>
      </div>
      <div className="other-information">
        <div className="name-wrap">
          <h3 className="name"> Age: {response?.age}</h3>
          <h3 className="name"> Gender: {response?.gender}</h3>
          <h3 className="name"> Language Known: {response?.languageKnown}</h3>
          <h3 className="name"> Religion : {response?.religion}</h3>
          <h3 className="name"> Community : {response?.community}</h3>
          <h3 className="name"> Date of Birth: {response?.dob}</h3>
          <h3 className="name"> Address: {response?.residence}</h3>
          <h3 className="name"> Mobile No: {response?.mobileNumber}</h3>
          <h3 className="name"> Email: {response?.mailId}</h3>
        </div>
      </div>

      {response && !loading && isModalOpen && (
        <Modal
          show={isModalOpen}
          onHide={toggleModal}
          className="modal-dialog modal-dialog-centered"
        >
          <Modal.Header closeButton>Update Profile</Modal.Header>
          <Modal.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={updatedProfile.firstName}
                  onChange={(e) =>
                    handleFieldChange("firstName", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={updatedProfile.lastName}
                  onChange={(e) =>
                    handleFieldChange("lastName", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="profileImage">Profile Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="profileImage"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {/* Remove the duplicated profile image input */}
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  className="form-control"
                  id="age"
                  name="age"
                  value={updatedProfile.age}
                  onChange={(e) => handleFieldChange("age", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <input
                  type="text"
                  className="form-control"
                  id="gender"
                  name="gender"
                  value={updatedProfile.gender}
                  onChange={(e) => handleFieldChange("gender", e.target.value)}
                />
              </div>
              {/* Add remaining fields as necessary */}
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
