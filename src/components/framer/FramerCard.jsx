import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProfiles,
  getProfileImage,
} from "../../services/userAllDetailsService";
import {
  FaUser,
  FaPrayingHands,
  FaVenusMars,
  FaLanguage,
  FaUsers,
  FaUserCircle,
} from "react-icons/fa";
import AuthHook from "../../auth/AuthHook";
import "./Cards.css";

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
  const [minAge, setMinAge] = useState(""); // Initialize minAge
  const [maxAge, setMaxAge] = useState(""); // Initialize maxAge
  const [minHeight, setMinHeight] = useState(""); // Initialize minHeight
  const [maxHeight, setMaxHeight] = useState(""); // Initialize maxHeight
  const [location, setLocation] = useState(""); // Initialize location
  const [religion, setReligion] = useState(""); // Initialize religion
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const pageSize = 10;

  const session = AuthHook();
  const userGender = session.gender;

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
      console.log("err :", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line
  }, [page, userGender]);

  if (error) return <div>{error}</div>;

  const handleApplyFilters = () => {
    let filteredUsers = allUserDetails;

    // Apply each filter conditionally
    if (searchTerm) {
      filteredUsers = filteredUsers.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    if (minAge && maxAge) {
      filteredUsers = filteredUsers.filter(
        (user) => user.age >= minAge && user.age <= maxAge
      );
    }
    if (minHeight && maxHeight) {
      filteredUsers = filteredUsers.filter(
        (user) => user.height >= minHeight && user.height <= maxHeight
      );
    }
    if (location) {
      filteredUsers = filteredUsers.filter((user) =>
        user.residence
          .toLowerCase()
          .split(",")
          .some((part) =>
            part.trim().toLowerCase().includes(location.toLowerCase())
          )
      );
    }

    if (religion) {
      filteredUsers = filteredUsers.filter((user) =>
        user.religion.toLowerCase().includes(religion.toLowerCase())
      );
    }

    setUserDetails(filteredUsers);
    setTotalPages(Math.ceil(filteredUsers.length / pageSize));
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setMinAge("");
    setMaxAge("");
    setMinHeight("");
    setMaxHeight("");
    setLocation("");
    setReligion("");
    setUserDetails(allUserDetails);
    setTotalPages(Math.ceil(allUserDetails.length / pageSize));
    setPage(0);
  };

  return (
    <section className="profile-carousel container mx-auto">
      <div className="flex flex-wrap">
        <div className="row w-full">
          <div
            className="col-lg-3 col-md-12 col-sm-12"
            style={{ padding: "20px 15px" }}
          >
            <div className="filters-column">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-semibold">Filters</h5>
                <button
                  onClick={handleApplyFilters}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full transition duration-200 ease-in-out transform hover:scale-105"
                >
                  Apply
                </button>
              </div>

              {/* Name Filter */}
              <div className="filter-row mb-3">
                <input
                  type="text"
                  placeholder="Search for profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control search-input w-full p-2"
                />
              </div>

              {/* Age Range Filter */}
              <div className="flex mb-3 position-relative">
                <select
                  value={minAge}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseInt(value) <= maxAge) {
                      setMinAge(value); // Only set minAge if it's <= maxAge
                    }
                  }}
                  className="form-control mr-2 p-2 pr-5"
                >
                  {[...Array(43)].map((_, i) => (
                    <option key={i} value={i + 18}>
                      {i + 18} years
                    </option>
                  ))}
                </select>{" "}
                <span className="text-2xl mr-2">-</span>
                <select
                  value={maxAge}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseInt(value) >= minAge) {
                      setMaxAge(value); // Only set maxAge if it's >= minAge
                    }
                  }}
                  className="form-control p-2 pr-5"
                >
                  {[...Array(43)].map((_, i) => (
                    <option key={i} value={i + 18}>
                      {i + 18} years
                    </option>
                  ))}
                </select>
              </div>

              {/* Height Range Filter */}
              {/* <div className="flex mb-3">
                <select
                  value={minHeight}
                  onChange={(e) => setMinHeight(e.target.value)}
                  className="form-control mr-2 p-2"
                >
                  <option value="">Min Height</option>
                  {[...Array(7)].map((_, i) => (
                    <option key={i} value={i + 3}>
                      {i + 3} ft
                    </option>
                  ))}
                </select>
                <span className="text-2xl mr-2">-</span>
                <select
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(e.target.value)}
                  className="form-control p-2"
                >
                  <option value="">Max Height</option>
                  {[...Array(7)].map((_, i) => (
                    <option key={i} value={i + 3}>
                      {i + 3} ft
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Location Filter */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control w-full p-2"
                />
              </div>

              {/* Religion Filter */}
              <div className="mb-3">
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="form-control w-full p-2"
                >
                  <option value="">Select Religion</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Parsi">Parsi</option>
                  <option value="Jain">Jain</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Jewish">Jewish</option>
                  <option value="No Religion">No Religion</option>
                  <option value="Spiritual">Spiritual</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Clear Search Button */}
              <div className="text-right">
                <button
                  onClick={handleClearSearch}
                  className="clear-button bg-gray-500 text-white px-4 py-2 rounded-full mt-2"
                >
                  Clear Search
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-9 col-md-12 col-sm-12 vertical-scroll">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : userDetails.length === 0 ? (
              <div
                className="d-flex justify-center items-center h-full bg-white w-full"
                style={{ minHeight: "300px" }}
              >
                <div className="text-center fontFamily-extrabold">
                  No profiles found matching your search criteria
                </div>
              </div>
            ) : (
              userDetails
                .slice(page * pageSize, (page + 1) * pageSize)
                .map((profile, index) => (
                  <div
                    className="row profile-card flex items-center w-full"
                    key={index}
                  >
                    <div
                      className="col-lg-4 col-md-12 col-sm-12 mx-auto"
                      style={{ padding: "20px 40px" }}
                    >
                      <div className="" style={{ height: "200px" }}>
                        {profileImages[profile.mobileNumber] ? (
                          <img
                            src={profileImages[profile.mobileNumber]}
                            alt={`${profile.firstName}`}
                            className="profile-image"
                          />
                        ) : (
                          <div className="d-flex justify-center items-center avatar-placeholder">
                            <FaUserCircle style={{ fontSize: "100px" }} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-8 col-md-12 col-sm-12 p-4">
                      <h3 className="card-name mb-4">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <div className="row">
                        <p className="col-lg-6 col-md-6 col-sm-12 d-flex">
                          <span className="mr-2">
                            <FaUser />
                          </span>
                          Age: {profile.age}
                        </p>
                        <p className="col-lg-6 col-md-6 col-sm-12 d-flex">
                          <span className="mr-2">
                            <FaPrayingHands />
                          </span>
                          Religion: {profile.religion}
                        </p>
                      </div>
                      <div className="row">
                        <p className="col-lg-6 col-md-6 col-sm-12 d-flex">
                          <span className="mr-2">
                            <FaUsers /> {/* Community icon */}
                          </span>
                          Community: {profile.community}
                        </p>
                        <p className="col-lg-6 col-md-6 col-sm-12 d-flex">
                          <span className="mr-2">
                            <FaVenusMars /> {/* Alternative Gender icon */}
                          </span>
                          Gender: {profile.gender}
                        </p>
                      </div>
                      <p className="d-flex">
                        <span className="mr-2">
                          <FaLanguage /> {/* Language Known icon */}
                        </span>
                        Language Known: {profile.langKnown}
                      </p>
                      <button
                        className="show-more-btn bg-blue-500 text-white w-full lg:w-4/12 float-right px-4 py-2 rounded transition duration-200 ease-in-out transform hover:scale-105"
                        onClick={() => handleMoreDetailsClick(profile)}
                      >
                        Show More Details
                      </button>
                    </div>
                  </div>
                ))
            )}

            {/* Pagination */}
            <div className="d-flex justify-center mt-2 w-full mb-4">
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
      </div>
    </section>
  );
};

export default FramerCard;
