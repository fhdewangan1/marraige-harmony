import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProfiles,
  getProfileImage,
} from "../../../services/userAllDetailsService";
import {
  FaUserCircle,
  FaUser,
  FaPrayingHands,
  FaMapMarkerAlt,
} from "react-icons/fa";
import AuthHook from "../../../auth/AuthHook";
import "../Cards.css";

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
  const oppositeGender = userGender === "male" ? "female" : "male"; // Determine the opposite gender

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
      const details = await getAllProfiles({
        page,
        size: pageSize,
        gender: userGender,
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
    <section className="profile-carousel container mx-auto px-4 my-16">
      <div className="flex flex-wrap">
        <div className="row">
          {/* Search Section */}
          <div
            className="col-lg-3 col-md-6 col-sm-12"
            style={{ padding: "20px 5px" }}
          >
            <div className="filters-column">
              <div className="w-full">
                <h5 className="text-xl font-semibold">Filters</h5>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search for profiles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control search-input w-full p-2"
                  />
                </div>
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="clear-button bg-red-500 text-white px-4 py-2 rounded-full mt-2 transition duration-200 ease-in-out transform hover:scale-105"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  className="search-button bg-green-500 text-white px-4 py-2 rounded-full mt-2 transition duration-200 ease-in-out transform hover:scale-105"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="col-lg-9 col-md-6 col-sm-12 vertical-scroll">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              userDetails
                .slice(page * pageSize, (page + 1) * pageSize)
                .map((profile, index) => (
                  <div
                    className="row profile-card flex items-center w-full"
                    key={index}
                  >
                    <div className="col-lg-4 col-md-6 col-sm-12 p-4">
                      {profileImages[profile.mobileNumber] ? (
                        <img
                          src={profileImages[profile.mobileNumber]}
                          alt={`${profile.name}`}
                          className="profile-image"
                        />
                      ) : (
                        <div className="d-flex justify-center items-center avatar-placeholder">
                          <FaUserCircle style={{ fontSize: "100px" }} />
                        </div>
                      )}
                    </div>

                    <div className="col-lg-8 col-md-6 col-sm-12 p-4">
                      <h3 className="card-name">{profile.name}</h3>
                      <p>
                        <span>
                          <FaUser />
                        </span>
                        Age: {profile.age}
                      </p>
                      <p>
                        <span>
                          <FaPrayingHands />
                        </span>
                        Religion: {profile.religion}
                      </p>
                      <p>
                        <span>
                          <FaMapMarkerAlt />
                        </span>
                        Community: {profile.community}
                      </p>
                      <button
                        className="show-more-btn bg-blue-500 text-white px-4 py-2 rounded transition duration-200 ease-in-out transform hover:scale-105"
                        onClick={() => handleMoreDetailsClick(profile)}
                      >
                        Show More Details
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-center mt-4 w-full">
            <div>
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i ? "active" : ""}`}
                  >
                    <button className="page-link" onClick={() => setPage(i)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FramerCard;
