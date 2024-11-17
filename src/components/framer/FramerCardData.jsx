import React from "react";
import FramerCard from "./FramerCard/FramerCard";
import Phone from "@mui/icons-material/Phone";

// FramerCardData.js
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
];

const FramerCardData = () => {
  return (
    <div>
      <FramerCard
        imageSrc="https://images.pexels.com/photos/27635097/pexels-photo-27635097/free-photo-of-retratos-de-um-comissario-de-bordo.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
        title="User Name"
        fields={fields}
      />
    </div>
  );
};

export default FramerCardData;
