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
import { Accordion } from "react-bootstrap";

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
          <ImageCard mobileNumber={mobileNumber} userDetails={userDetails} />
          <Accordion defaultActiveKey="0">
            {/* Primary Details */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>Primary Details</Accordion.Header>
              <Accordion.Body>
                <PrimaryUserDetails
                  status={status}
                  setStatus={setStatus}
                  response={userDetails?.response}
                  mobileNumber={mobileNumber}
                  imageUrl={profileImage}
                />
              </Accordion.Body>
            </Accordion.Item>

            {/* Family Details */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>Family Details</Accordion.Header>
              <Accordion.Body>
                <UserFamilyDetails
                  status={status}
                  setStatus={setStatus}
                  response={userDetails?.response?.userFamilyDetails}
                />
              </Accordion.Body>
            </Accordion.Item>

            {/* Personal Details */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>Personal Details</Accordion.Header>
              <Accordion.Body>
                <UserPersonalDetails
                  status={status}
                  setStatus={setStatus}
                  response={userDetails?.response?.userPersonalDetails}
                />
              </Accordion.Body>
            </Accordion.Item>

            {/* Lifestyle and Education */}
            <Accordion.Item eventKey="3">
              <Accordion.Header>Lifestyle and Education</Accordion.Header>
              <Accordion.Body>
                <UserLifeStyleAndEducation
                  status={status}
                  setStatus={setStatus}
                  response={userDetails?.response?.userLifeStyleAndEducation}
                />
              </Accordion.Body>
            </Accordion.Item>

            {/* Partner Preferences */}
            <Accordion.Item eventKey="4">
              <Accordion.Header>Partner Preferences</Accordion.Header>
              <Accordion.Body>
                <UserPartnerPreferences
                  status={status}
                  setStatus={setStatus}
                  response={userDetails?.response?.userPartnerPreferences}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
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
            <ImageCard mobileNumber={mobileNumber} userDetails={userDetails} />

            <SideBar
              setActiveSection={setActiveSection}
              setStatus={setStatus}
            />
          </div>
        )}

        <div className="col-lg-9 col-md-8 col-sm-12">
          {renderActiveSection()}
        </div>
      </div>
    </section>
  );
};

export default DemoCardDetails;
