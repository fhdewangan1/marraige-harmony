import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import {
  getAllProfiles,
  getProfileImage,
} from "../../../services/userAllDetailsService";
import AuthHook from "../../../auth/AuthHook";
import "./FramerCard.css";
import { GiTireIronCross } from "react-icons/gi";

export const fields = [
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Age", key: "age" },
  { label: "Religion", key: "religion" },
  { label: "Community", key: "community" },
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
  const pageSize = 9; // Total cards per page (3 rows of 3 cards)

  const session = AuthHook();
  const userGender = session.gender;
  const oppositeGender = userGender === "male" ? "female" : "male";

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
      const details = await getAllProfiles({
        page,
        size: pageSize,
        gender: oppositeGender,
      });
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
      console.log("err :", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [page, userGender]);

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
    <div className="container framer-card-wrap">
      <div className="search-bar">
        <InputGroup>
          <input
            type="text"
            placeholder="Search for profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-input"
          />
          {searchTerm && (
            <Button
              variant="outline-secondary"
              onClick={handleClearSearch}
              className="clear-button"
              aria-label="Clear search"
            >
              <GiTireIronCross />
            </Button>
          )}
          <Button
            variant="outline-success"
            onClick={handleSearch}
            className="search-button"
            aria-label="Search"
          >
            Search
          </Button>
        </InputGroup>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="row">
          {userDetails
            .slice(page * pageSize, (page + 1) * pageSize)
            .map((item, index) => (
              <div key={`profile-card-${index}`} className="col-md-4 mb-4">
                <div className="card h-100 profile-card">
                  <img
                    src={profileImages[item.mobileNumber]}
                    className="card-img-top"
                    alt={`${item.firstName} ${item.lastName}`}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {item.firstName} {item.lastName}
                    </h5>
                    <p className="card-text">
                      <strong>Age:</strong> {item.age} <br />
                      <strong>Religion:</strong> {item.religion} <br />
                      <strong>Community:</strong> {item.community}
                    </p>
                    <button
                      className="btn btn-info more-details-button"
                      onClick={() => handleMoreDetailsClick(item)}
                    >
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-2 mb-2">
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(i)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
};

export default FramerCard;
