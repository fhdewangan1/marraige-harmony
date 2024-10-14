import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";

const CardContainer = styled(motion.div)`
  display: flex;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  background-color: #fcd5ce;
  max-height: 350px;
  margin-bottom: 40px;
  padding-bottom: 60px;
`;

const ContentWrapper = styled.div`
  flex: 2;
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  max-height: 250px;
  overflow-y: auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-height: 200px;
    padding: 15px;
  }
`;

const Field = styled.div`
  padding: 10px;
  border-radius: 4px;
  color: #1f7a8c;
  font-size: 20px;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;

  @media (max-width: 768px) {
    top: 10px; /* Adjust top position */
    right: 10px; /* Adjust right position */
  }
`;


const Button = styled.button`
  background-color: #003566;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background-color: #1f7a8c;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%; /* Responsive width */
  max-width: 800px; /* Maximum width for larger screens */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px; /* Adjust padding for mobile */
  }
`;

const ModalHeader = styled.h2`
  margin: 0;
  margin-bottom: 20px;
  font-size: 24px; /* Default font size */

  @media (max-width: 768px) {
    font-size: 20px; /* Smaller font size on mobile */
  }
`;

const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column on mobile */
  }
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px; /* Smaller font size on mobile */
  }
`;

const Message = styled.div`
  margin-top: 15px;
  font-size: 16px;
  color: ${({ success }) => (success ? "green" : "red")};
`;

// Fields data
export const lifeStyleAndEducationFields = [
  { key: "userOccupation", value: "Occupation: " },
  { key: "userCurrentLoc", value: "Current Location: " },
  { key: "drinking", value: "Drinking Habits: " },
  { key: "smoking", value: "Smoking Habits: " },
  { key: "diet", value: "Diet: " },
  { key: "qualification", value: "Qualification: " },
];

const UserLifeStyleAndEducation = ({
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
    // Basic validation
    for (const field of lifeStyleAndEducationFields) {
      if (!updatedProfile[field.key]) {
        setError(`${field.value} is required.`);
        return; // Stop if validation fails
      }
    }

    setLoading(true);
    const apiUrl = response
      ? `https://shaadi-be.fino-web-app.agency/api/v1/update-user-life-style-details/${mobileNumber}`
      : `https://shaadi-be.fino-web-app.agency/api/v1/save-user-life-style?mobileNumber=${mobileNumber}`;

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
        Swal.fire("Success!", "User details updated successfully!", "success").then(() => {
          toggleModal();
        });
      } else {
        setError(data.message || "Failed to update user details");
        Swal.fire("Error", data.message || "Failed to update user details", "error");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
  };

  return (
    <>
      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {mobileNumber === session?.userName && (
          <ButtonContainer>
            <Button onClick={toggleModal}>{response ? "Update" : "Add"}</Button>
          </ButtonContainer>
        )}
         <ContentWrapper style={{marginTop:'29px'}}>
          {lifeStyleAndEducationFields.map((field, index) => (
            <Field key={index}>
              {field.value}{" "}
              <span style={{ color: "#003566" }}>
                {response && response[field.key]
                  ? Array.isArray(response[field.key])
                    ? response[field.key].join(", ")
                    : response[field.key]
                  : "N/A"}
              </span>
            </Field>
          ))}
        </ContentWrapper>
      </CardContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              {response ? "Update Lifestyle and Education Details" : "Add Lifestyle and Education Details"}
            </ModalHeader>
            <FormWrapper>
              {lifeStyleAndEducationFields.map((field, index) => (
                <InputField key={index}>
                  <Label>{field.value}</Label>
                  <Input
                    type="text"
                    value={updatedProfile[field.key] || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  />
                </InputField>
              ))}
            </FormWrapper>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                }}
              >
                <RingLoader color="#003566" size={60} />
              </div>
            ) : (
              <>
                {error && <Message>{error}</Message>}
              </>
            )}
                <Button onClick={handleSubmit} disabled={loading} style={{marginTop:'5px'}}>
              Save Changes
            </Button>
            <Button
              onClick={toggleModal}
              style={{ marginLeft: "5px", marginTop:'10px' }}
              disabled={loading}
            >
              Cancel
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default UserLifeStyleAndEducation;
