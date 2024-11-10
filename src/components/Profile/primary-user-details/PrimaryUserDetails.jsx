import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AuthHook from "../../../auth/AuthHook";

// Define fields configuration with label, key, and options for easy form generation
const fields = [
  { label: "First Name", key: "firstName", type: "text" },
  { label: "Last Name", key: "lastName", type: "text" },
  {
    label: "Age",
    key: "age",
    type: "text",
    isDisabled: true, // Disable Age field, as it's calculated from DOB
  },
  {
    label: "Gender",
    key: "gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  { label: "Language Known", key: "langKnown", type: "text" },
  {
    label: "Religion",
    key: "religion",
    type: "select",
    options: ["Hindu", "Muslim", "Christian", "Parsi", "Other"],
  },
  { label: "Community", key: "community", type: "text" },
  { label: "Date of Birth", key: "dob", type: "date" },
  { label: "Residence", key: "residence", type: "text" },
  { label: "Mobile No", key: "mobileNumber", type: "text", isDisabled: true },
  { label: "Email", key: "mailId", type: "text" },
];

// Utility function to convert to PascalCase
const toPascalCase = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const PrimaryUserDetails = ({
  response,
  refresAfterUpdate,
  setStatus,
  status,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const session = AuthHook();
  const { mobileNumber } = useParams();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: response || {}, // Setting default values
  });

  // Date restrictions (18-60 years)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 18); // Max: 18 years ago
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 60); // Min: 60 years ago

  // UseEffect to set form values when response changes
  useEffect(() => {
    if (response) {
      // Ensure that the form values are set when response is available
      Object.keys(response).forEach((key) => {
        setValue(key, response[key]);
      });
    }
  }, [response, setValue]);

  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Handle profile image selection
  const handleImageChange = (e) => setProfileImage(e.target.files[0]);

  // Calculate age based on DOB
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (
      month < birthDate.getMonth() ||
      (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Handle DOB change and update age
  const handleDobChange = (date) => {
    setValue("dob", date);
    const age = calculateAge(date);
    setValue("age", age);
  };

  // Submit profile update request
  const onSubmit = (data) => {
    setLoading(true);

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    if (profileImage) formData.append("profileImage", profileImage);

    fetch("https://shaadi-be.fino-web-app.agency/api/v1/auth/update-profile", {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 200 || data.status === 201) {
          setStatus(!status);
          refresAfterUpdate && refresAfterUpdate(!status);
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

  // Render individual field using react-hook-form Controller
  const FieldRenderer = ({ field }) => (
    <Form.Group className="mb-3">
      <Form.Label className="font-semibold text-base">{field.label}</Form.Label>
      <Controller
        name={field.key}
        control={control}
        rules={
          field.key === "mailId"
            ? {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              }
            : field.key === "dob"
            ? {
                required: "Date of birth is required",
                validate: (value) => {
                  const selectedDate = new Date(value);
                  if (selectedDate > maxDate) {
                    return "You must be at least 18 years old.";
                  }
                  if (selectedDate < minDate) {
                    return "You cannot be older than 60 years old.";
                  }
                  return true;
                },
              }
            : {}
        }
        render={({ field: { onChange, value } }) => {
          if (field.key === "dob") {
            return (
              <DatePicker
                selected={value || null}
                onChange={(date) => {
                  handleDobChange(date);
                }}
                maxDate={maxDate}
                minDate={minDate}
                className="form-control"
                dateFormat="yyyy/MM/dd"
              />
            );
          }
          return (
            <Form.Control
              type={field.type}
              value={value || ""}
              onChange={(e) => {
                const updatedValue = toPascalCase(e.target.value); // Convert input to PascalCase
                setValue(field.key, updatedValue);
                onChange(updatedValue);
              }}
              disabled={field.isDisabled}
              placeholder={`Enter ${field.label}`}
              className="border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 text-base"
            />
          );
        }}
      />
      {errors[field.key] && (
        <p className="text-red-500 text-sm mt-1">{errors[field.key].message}</p>
      )}
    </Form.Group>
  );

  return (
    <>
      {/* Main profile details display */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        {mobileNumber === session?.userName && (
          <div className="text-right mb-4">
            <Button
              variant="primary"
              onClick={toggleModal}
              style={{ backgroundColor: "#003566", borderColor: "#003566" }}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-base"
            >
              <i className="fas fa-pencil-alt mr-2"></i>
              {response ? "Update" : "Add"}
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b"
            >
              <strong className="text-primary text-base mr-4">
                {field.label}:
              </strong>
              <span className="text-gray-600 text-base">
                {field.key === "mobileNumber" &&
                session &&
                response?.mobileNumber === session.userName
                  ? response.mobileNumber
                  : response?.[field.key] || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for profile edit */}
      {isModalOpen && (
        <Modal show={isModalOpen} onHide={toggleModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-user-edit mr-2"></i>
              {response ? "Update Profile" : "Add Profile"}
            </Modal.Title>
          </Modal.Header>

          {/* Modal body with form fields */}
          <Modal.Body
            className="px-5 py-4"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            <Form onSubmit={handleSubmit(onSubmit)}>
              {fields.map((field, index) => (
                <FieldRenderer key={index} field={field} />
              ))}

              {/* Loading spinner */}
              {loading && (
                <Spinner
                  animation="border"
                  variant="primary"
                  className="d-block mx-auto my-4"
                />
              )}
            </Form>
          </Modal.Body>
          {/* Modal footer with save button */}
          <Modal.Footer className="d-flex justify-content-end">
            <Button
              variant="success"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              style={{
                backgroundColor: "rgb(219, 39, 119)",
                borderColor: "rgb(236, 72, 153)",
              }}
              className="bg-pink-500 border-pink-500 hover:bg-pink-600 hover:border-pink-600 text-base"
            >
              <i className="fas fa-save mr-2"></i> Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default PrimaryUserDetails;
