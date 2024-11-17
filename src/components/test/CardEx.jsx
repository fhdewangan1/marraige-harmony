import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ApiUrl } from "../../config/Config";

const API_BASE_URL = `${ApiUrl}/user/profiles`;
const IMAGE_API_URL = `${ApiUrl}/user/profile-image`;

const HARD_CODED_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4ODcxNjQxMjg2IiwiaWF0IjoxNzIzNzg1MDAzLCJleHAiOjE3MjM4NzE0MDN9.U7nAW8r-Ekc3FIBP5rfxixtr5mUM0jWISuqvC1c5NAk";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const MarriageProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(API_BASE_URL, {
          params: {
            gender: "",
            page: 0,
            size: 10,
            sortBy: "",
          },
          headers: {
            // Authorization: `Bearer ${HARD_CODED_TOKEN}`,
          },
        });
        setProfiles(response.data.result);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to load profiles. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const fetchProfileImage = async (mobileNumber) => {
    try {
      const response = await axios.get(
        `${IMAGE_API_URL}?mobileNumber=${mobileNumber}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${HARD_CODED_TOKEN}`,
          },
        }
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching profile image:", error);
      return ""; // Fallback to an empty string or a placeholder image URL
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const urls = {};
      for (const profile of profiles) {
        const imageUrl = await fetchProfileImage(profile.mobileNumber);
        urls[profile.mobileNumber] = imageUrl;
      }
      setImageUrls(urls);
    };

    if (profiles.length > 0) {
      loadImages();
    }
  }, [profiles]);

  if (loading)
    return <Typography variant="body1">Loading profiles...</Typography>;
  if (error)
    return (
      <Typography variant="body1" color="error">
        Error: {error}
      </Typography>
    );

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Typography variant="h5" gutterBottom color="textSecondary">
        Best Matches For You
      </Typography>
      <Grid container spacing={2}>
        {profiles.map((profile) => (
          <Grid item xs={12} key={profile.mobileNumber}>
            <Item>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <img
                    src={
                      imageUrls[profile.mobileNumber] || "placeholder-image-url"
                    }
                    alt={`${profile.firstName} ${profile.lastName}`}
                    style={{
                      width: "100%",
                      height: "300px",
                      borderRadius: "4px",
                      objectFit: "cover",
                    }}
                  />
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6">
                    {profile.firstName} {profile.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Age:</strong> {profile.age}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Mobile:</strong> {profile.mobileNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Languages:</strong>{" "}
                    {Array.isArray(profile.langKnown)
                      ? profile.langKnown.join(", ")
                      : profile.langKnown}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Religion:</strong> {profile.religion}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Community:</strong> {profile.community}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Gender:</strong> {profile.gender}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date of Birth:</strong> {profile.dob}
                  </Typography>
                </Grid>
              </Grid>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MarriageProfileList;
