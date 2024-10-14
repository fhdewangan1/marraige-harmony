import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";

// Styled components
const CardContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fcd5ce;
  padding: 20px;
  margin-bottom: 40px;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end; /* Aligns all items to the right */
  align-items: center;
  margin-bottom: 20px;
  width: 100%; /* Ensure it takes full width */
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three columns for desktop */
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;

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
    font-size: 16px;
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
  z-index: 1000; /* Adjust as necessary */
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.h2`
  margin: 0 0 20px;
`;

const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three columns for desktop */
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); /* Responsive for mobile */
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
    font-size: 14px;
  }
`;

// Personal Fields
export const personalFields = [
  { key: "userHeight", value: "Height: " },
  { key: "userWeight", value: "Weight: " },
  { key: "gotra", value: "Gotra: " },
  { key: "manglik", value: "Manglik: " },
  { key: "maritalStatus", value: "Marital Status: " },
  { key: "isPersonDisabled", value: "Is Disabled: " },
  { key: "userIncome", value: "Monthly Income" },
  { key: "isUserStayingAlone", value: "Is Staying Alone: " },
  { key: "hobbies", value: "Hobbies: " },
  { key: "birthPlace", value: "Birth Place: " },
  { key: "complexion", value: "Complexion: " },
  { key: "rashi", value: "Rashi: " },
  { key: "bloodGroup", value: "Blood Group: " },
  { key: "bodyType", value: "Body Type: " },
];

const UserPersonalDetails = ({ response, refresAfterUpdate, setStatus, status }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(response || {});
  const [loading, setLoading] = useState(false);
  const session = AuthHook();
  const { mobileNumber } = useParams();

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const apiUrl = response
      ? `https://shaadi-be.fino-web-app.agency/api/v1/update-user-personal-details/${mobileNumber}`
      : `https://shaadi-be.fino-web-app.agency/api/v1/save-user-personal-details?mobileNumber=${mobileNumber}`;

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
          toggleModal(); // Close modal after success
        });
      } else {
        Swal.fire("Error", data.message || "Failed to update user details", "error");
      }
    } catch (err) {
      setLoading(false);
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
        <Header>
          {mobileNumber === session?.userName && (
            <Button onClick={toggleModal}>{response ? "Update" : "Add"}</Button>
          )}
        </Header>
        <ContentWrapper>
          {personalFields.map((field, index) => (
            <Field key={index}>
              {field.value}{" "}
              <span style={{ color: "#003566" }}>
                {response && response[field.key] ? response[field.key].toString() : "N/A"}
              </span>
            </Field>
          ))}
        </ContentWrapper>
      </CardContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>{response ? "Update Personal Details" : "Add Personal Details"}</ModalHeader>
            <FormWrapper>
              {personalFields.map((field, index) => (
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

            {loading && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                <RingLoader color="#003566" size={60} />
              </div>
            )}
            <Button onClick={handleSubmit} disabled={loading}>
              Save Changes
            </Button>
            <Button onClick={toggleModal} style={{ marginTop: "10px", marginLeft: '5px' }} disabled={loading}>
              Cancel
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default UserPersonalDetails;
