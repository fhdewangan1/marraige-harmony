import { Card, Typography } from "@mui/material";
import React from "react";

const FamilyDetails = ({ familyDetails }) => {
    console.log(familyDetails);
  return (
    <Card >
      <Typography>{familyDetails?.familyStatus}</Typography>
    </Card>
  );
};

export default FamilyDetails;
