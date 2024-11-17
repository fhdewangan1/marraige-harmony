import { Card, Typography } from "@mui/material";

const FamilyDetails = ({ familyDetails }) => {
  return (
    <Card>
      <Typography>{familyDetails?.familyStatus}</Typography>
    </Card>
  );
};

export default FamilyDetails;
