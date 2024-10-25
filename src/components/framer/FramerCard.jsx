import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProfiles,
  getProfileImage,
} from "../../services/userAllDetailsService";
import {
  FaUserCircle,
  FaUser,
  FaPrayingHands,
  FaMapMarkerAlt,
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
    <section className="profile-carousel container mx-auto">
      <div className="flex flex-wrap">
        <div className="row w-full">
          <div
            className="col-lg-3 col-md-12 col-sm-12"
            style={{ padding: "20px 5px", minWidth: "300px" }}
          >
            <div className="filters-column">
              <div className="w-full">
                <h5 className="text-xl font-semibold">Filters</h5>
                <div className="filter-row mb-3">
                  <input
                    type="text"
                    placeholder="Search for profiles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control search-input w-full p-2"
                  />
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
                    <div className="col-lg-4 col-md-6 col-sm-12">
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
                            <FaMapMarkerAlt />
                          </span>
                          Community: {profile.community}
                        </p>
                        <p className="col-lg-6 col-md-6 col-sm-12 d-flex">
                          <span className="mr-2">
                            <FaMapMarkerAlt />
                          </span>
                          Gender: {profile.gender}
                        </p>
                      </div>
                      <p className="d-flex">
                        <span className="mr-2">
                          <FaMapMarkerAlt />
                        </span>
                        Language Known: {profile.langKnown}
                      </p>
                      <button
                        className="show-more-btn bg-blue-500 text-white w-full lg:w-4/12 float-right px-4 py-2 rounded transition duration-200 ease-in-out transform hover:scale-105"
                        onClick={() => handleMoreDetailsClick(profile)}
                      >
                        Show More
                      </button>
                    </div>
                  </div>
                ))
            )}

            {/* Pagination */}
            <div className="d-flex justify-center mt-2 w-full">
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
