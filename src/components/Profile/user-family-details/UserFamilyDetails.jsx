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
    padding: 20px;
  margin-bottom: 40px;
`;

const ContentWrapper = styled.div`
    display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three columns for desktop */
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  // top:30px

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); /* Responsive for mobile */
  }
`;

const Field = styled.div`
  padding: 10px;
  border-radius: 4px;
  color: #1f7a8c;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 16px; /* Smaller font size on mobile */
  }
`;

const ButtonContainer = styled.div`
  position: absolute; /* Keep it absolute */
  top: 20px;
  right: 20px;

  @media (max-width: 768px) {
    top: 10px; /* Adjust top position for mobile */
    right: 10px; /* Adjust right position for mobile */
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
    font-size: 16px;
    padding: 8px 16px;
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
  padding: 30px; /* Increased padding for desktop */
  border-radius: 8px;
  width: 80%; /* Adjusted width for desktop */
  max-width: 600px; /* Maximum width for desktop */
  max-height: 80vh; /* Limit modal height */
  overflow-y: auto; /* Enable vertical scrolling for content */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px; /* Less padding on mobile */
  }
`;

const ModalHeader = styled.h2`
  margin: 0;
  margin-bottom: 20px;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 16px; /* Smaller font size on mobile */
  }
`;

const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns for desktop */
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

const UserFamilyDetails = ({ response, refresAfterUpdate, setStatus, status }) => {
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
          Swal.fire("Success!", "User details updated successfully!", "success").then(() => {
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
      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {mobileNumber === session?.userName && (
          <ButtonContainer>
            <Button onClick={toggleModal}>
              {response ? "Update" : "Add"}
            </Button>
          </ButtonContainer>
        )}
        <ContentWrapper style={{marginTop:'25px'}}>
          {familyFields.map((field, index) => (
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
            <ModalHeader>{response ? "Update Family Details" : "Add Family Details"}</ModalHeader>
            <FormWrapper>
              {familyFields.map((field, index) => (
                <InputField key={index}>
                  <Label>{field.value}</Label>
                  <Input
                    type={field.key.includes("noOf") ? "number" : "text"}
                    value={updatedProfile[field.key] || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    min={0}
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
                  height: "100px"
                }}
              >
                <RingLoader color="#003566" size={60} />
              </div>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} style={{marginTop:'10px'}}>
                Save Changes
              </Button>
            )}
            <Button onClick={toggleModal} disabled={loading} style={{marginLeft:'5px'}}>
              Cancel
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default UserFamilyDetails;
