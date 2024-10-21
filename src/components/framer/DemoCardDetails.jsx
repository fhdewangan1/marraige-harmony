import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SideBar from "./SideBar/SideBar";
import PrimaryUserDetails from "../Profile/primary-user-details/PrimaryUserDetails";
import UserFamilyDetails from "../Profile/user-family-details/UserFamilyDetails";
import UserPersonalDetails from "../Profile/user-personal-details/UserPersonalDetails";
import UserLifeStyleAndEducation from "../Profile/user-life-style-and-education/UserLifeStyleAndEducation";
import UserPartnerPreferences from "../Profile/user-partner-preferences/UserPartnerPreferences";
import { getAllUserDetails } from "../../services/userAllDetailsService";
import { getProfileImage } from "../../services/userAllDetailsService";
import "./CommonStyles.css";
import ImageCard from "../Profile/primary-user-details/ImageCard";

const DemoCardDetails = () => {
  const { mobileNumber } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [activeSection, setActiveSection] = useState("PrimaryUserDetails");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [status, setStatus] = useState(false);

  // Fetch user data
  const fetchUserData = async (mobileNumber) => {
    try {
      const allData = await getAllUserDetails(mobileNumber);
      setUserDetails(allData);
      const imageUrl = await getProfileImage(mobileNumber);
      setProfileImage(imageUrl.imageUrl);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  useEffect(() => {
    fetchUserData(mobileNumber);
  }, [mobileNumber, status]);
  // Handle screen resize to adjust mobile view

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to render all sections at once or the active component
  const renderActiveSection = () => {
    if (isMobile) {
      return (
        <>
          <ImageCard mobileNumber={mobileNumber} />
          <h1 className="text-center">Primary Details</h1>
          <PrimaryUserDetails
            status={status}
            setStatus={setStatus}
            response={userDetails?.response}
            mobileNumber={mobileNumber}
            imageUrl={profileImage}
          />
          <h1 className="text-center">Family Details</h1>
          <UserFamilyDetails
            status={status}
            setStatus={setStatus}
            response={userDetails?.response?.userFamilyDetails}
          />
          <h1 className="text-center">Personal Details</h1>
          <UserPersonalDetails
            status={status}
            setStatus={setStatus}
            response={userDetails?.response?.userPersonalDetails}
          />
          <h1 className="text-center">Lifestyle and Education</h1>
          <UserLifeStyleAndEducation
            status={status}
            setStatus={setStatus}
            response={userDetails?.response?.userLifeStyleAndEducation}
          />
          <h1 className="text-center">Partner Preferences</h1>
          <UserPartnerPreferences
            status={status}
            setStatus={setStatus}
            response={userDetails?.response?.userPartnerPreferences}
          />
        </>
      );
    }

    switch (activeSection) {
      case "PrimaryUserDetails":
        return (
          <PrimaryUserDetails
            status={status}
            setStatus={setStatus}
            response={userDetails?.response}
            mobileNumber={mobileNumber}
            imageUrl={profileImage}
          />
        );
      case "UserFamilyDetails":
        return (
          <UserFamilyDetails
            status={status}
            setStatus={setStatus}
            response={userDetails?.response?.userFamilyDetails}
          />
        );
      case "UserPersonalDetails":
        return (
          <UserPersonalDetails
            status={status}
            setStatus={setStatus}
            response={userDetails?.response?.userPersonalDetails}
          />
        );
      case "UserLifeStyleAndEducation":
        return (
          <UserLifeStyleAndEducation
            status={status}
            setStatus={setStatus}
            response={userDetails?.response?.userLifeStyleAndEducation}
          />
        );
      case "UserPartnerPreferences":
        return (
          <UserPartnerPreferences
            status={status}
            setStatus={setStatus}
            response={userDetails?.response?.userPartnerPreferences}
          />
        );
      default:
        return (
          <PrimaryUserDetails
            status={status}
            setStatus={setStatus}
            response={userDetails?.response}
          />
        );
    }
  };

  return (
    <section className="demo-card-details" style={{ height: "100vh" }}>
      <div className="row h-full">
        {/* Sidebar with navigation, only visible on larger screens */}
        {!isMobile && (
          <div
            className="col-lg-3 col-md-4 col-sm-12"
            style={{ marginBottom: "80px" }}
          >
            <SideBar setActiveSection={setActiveSection} />
          </div>
        )}
        {/* Display the active component or all sections in mobile view */}
        <div className="col-lg-9 col-md-8 col-sm-12">
          {renderActiveSection()}
        </div>
      </div>
    </section>
  );
};

export default DemoCardDetails;
