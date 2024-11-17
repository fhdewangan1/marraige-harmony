import { useState } from "react";
import {
  FaUser,
  FaUsers,
  FaIdCard,
  FaGraduationCap,
  FaHeart,
} from "react-icons/fa";
import "./SideBar.css";

const SideBar = ({ setActiveSection }) => {
  const [activeSection, setActive] = useState("PrimaryUserDetails");

  const handleSectionClick = (section) => {
    setActive(section);
    setActiveSection(section);
  };

  return (
    <section className="side-bar-wrap">
      <ul>
        <li
          className={activeSection === "PrimaryUserDetails" ? "selected" : ""}
          onClick={() => handleSectionClick("PrimaryUserDetails")}
        >
          <FaUser className="icon" /> Primary User Details
        </li>
        <li
          className={activeSection === "UserFamilyDetails" ? "selected" : ""}
          onClick={() => handleSectionClick("UserFamilyDetails")}
        >
          <FaUsers className="icon" /> Family Details
        </li>
        <li
          className={activeSection === "UserPersonalDetails" ? "selected" : ""}
          onClick={() => handleSectionClick("UserPersonalDetails")}
        >
          <FaIdCard className="icon" /> Personal Details
        </li>
        <li
          className={
            activeSection === "UserLifeStyleAndEducation" ? "selected" : ""
          }
          onClick={() => handleSectionClick("UserLifeStyleAndEducation")}
        >
          <FaGraduationCap className="icon" /> Lifestyle & Education
        </li>
        <li
          className={
            activeSection === "UserPartnerPreferences" ? "selected" : ""
          }
          onClick={() => handleSectionClick("UserPartnerPreferences")}
        >
          <FaHeart className="icon" /> Partner Preferences
        </li>
      </ul>
    </section>
  );
};

export default SideBar;
