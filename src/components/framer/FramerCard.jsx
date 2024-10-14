import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  getAllProfiles,
  getProfileImage,
} from "../../services/userAllDetailsService";
import { Box, TextField, Pagination, Button } from "@mui/material";
import AuthHook from "../../auth/AuthHook";

const CardContainer = styled(motion.div)`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1100px;
  margin: 20px auto;
  background-color: #fcd5ce;
  position: relative;
  height: 320px;
`;

const ImageWrapper = styled.div`
  flex: 1;
  background: url(${(props) => props.src}) no-repeat center center;
  background-size: cover;
  height: 100%;
  background-position: center 20%; // Adjust this value as needed
`;


const ContentWrapper = styled.div`
  flex: 2;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 10px;
  overflow-y: auto;
`;

const Title = styled.h2`
  grid-column: 1 / 2;
  margin: 0 0 10px;
`;

const MoreDetailsButton = styled.button`
  grid-column: 2 / 3;
  align-self: center;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  justify-self: end;

  &:hover {
    background-color: #0056b3;
  }
`;

const Field = styled.div`
  padding: 8px;
  border-radius: 4px;
  color: #1f7a8c;
  font-size: 17px;
`;

const Loader = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const LoaderAnimation = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 5px solid #007bff;
  border-top: 5px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px;
  width: 100%;
  margin-top: 70px;
   @media (max-width: 768px) {
    margin-top: 130px
   }
`;

const ScrollableContainer = styled(Box)`
  max-height: 80vh;
  overflow-y: auto;
  margin-bottom: 20px;
`;

export const fields = [
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Mobile Number", key: "mobileNumber" },
  { label: "Age", key: "age" },
  { label: "Gender", key: "gender" },
  { label: "Language Known", key: "langKnown" },
  { label: "Religion", key: "religion" },
  { label: "Community", key: "community" },
  { label: "Date of Birth", key: "dob" },
  { label: "Residence", key: "residence" },
];

const FramerCard = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [allUserDetails, setAllUserDetails] = useState([]);
  const [profileImages, setProfileImages] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const pageSize = 10;

  const session = AuthHook();
  const userGender = session.gender; // Get the logged-in user's gender
  const oppositeGender = userGender === 'male' ? 'female' : 'male'; // Determine the opposite gender

  const handleMoreDetailsClick = (item) => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/all-details/${item?.mobileNumber}`);
      setLoading(false);
    }, 500);
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Pass the opposite gender to the API
      const details = await getAllProfiles({ page, size: pageSize, gender: userGender });
      setUserDetails(details?.result || []);
      setAllUserDetails(details?.result || []);
      setTotalPages(details?.totalPages || 1);

      const images = {};
      const mobileNumbers = details?.result.map((user) => user.mobileNumber);

      await Promise.all(
        mobileNumbers.map(async (number) => {
          const { imageUrl } = await getProfileImage(number);
          images[number] = imageUrl;
        })
      );

      setProfileImages(images);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [page, userGender]); // Include userGender as a dependency if needed

  if (error) return <div>{error}</div>;

  const handleSearch = () => {
    const filteredUsers = allUserDetails.filter((item) =>
      `${item.firstName} ${item.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setUserDetails(filteredUsers);
    setTotalPages(Math.ceil(filteredUsers.length / pageSize));
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setUserDetails(allUserDetails);
    setTotalPages(Math.ceil(allUserDetails.length / pageSize));
    setPage(0);
  };

  return (
    <Box>
      {/* Search and Clear Buttons */}
      <SearchContainer>
        <TextField
          variant="outlined"
          placeholder="Search by name..."
          sx={{ bgcolor: "white", width: "300px", left: "-20px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch} variant="contained" sx={{ ml: 1, mr: 1 }}>
          Search
        </Button>
        <Button onClick={handleClearSearch} sx={{ ml: 1, mr: 2, color:'brown', bgcolor:'pink' }}>
          Clear
        </Button>
      </SearchContainer>

      {loading ? (
        <Loader
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LoaderAnimation />
        </Loader>
      ) : (
        <ScrollableContainer>
          {Array.isArray(userDetails) &&
            userDetails
              .slice(page * pageSize, (page + 1) * pageSize)
              .map((item, index) => (
                <CardContainer
                  key={`profile-card-${index}`}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ImageWrapper src={profileImages[item.mobileNumber]} />
                  <ContentWrapper>
                    <Title>
                      {item.firstName} {item.lastName}
                    </Title>
                    <MoreDetailsButton onClick={() => handleMoreDetailsClick(item)}>
                      More Details
                    </MoreDetailsButton>
                    {fields.map((field, index) => (
                      <Field key={index}>
                        <strong>{field.label}:</strong>{" "}
                        {item[field.key] ? item[field.key] : "N/A"}
                      </Field>
                    ))}
                  </ContentWrapper>
                </CardContainer>
              ))}
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(event, value) => setPage(value - 1)}
            variant="outlined"
            shape="rounded"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              marginBottom: "20px",
              bgcolor: "white",
            }}
          />
        </ScrollableContainer>
      )}
    </Box>
  );
};

export default FramerCard;
