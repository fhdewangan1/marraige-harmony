import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [gender, setGender] = React.useState(null);
  const [ageFrom, setAgeFrom] = React.useState(null);
  const [ageTo, setAgeTo] = React.useState(null);
  const [religion, setReligion] = React.useState("");
  const [motherTongue, setMotherTongue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);

  const handleCardClick = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    if (showContactDetails === true) {
      setShowContactDetails(false);
    } else {
      setShowContactDetails(true); // Toggle the contact details
    }
  };

  const navigate = useNavigate();

  const handleGenderChange = (event) => setGender(event.target.value);
  const handleAgeFromChange = (event) => setAgeFrom(event.target.value);
  const handleAgeToChange = (event) => setAgeTo(event.target.value);
  const handleReligionChange = (event) => setReligion(event.target.value);
  const handleMotherTongueChange = (event) =>
    setMotherTongue(event.target.value);

  const handleBeginClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  useEffect(() => {
    localStorage.removeItem("userInfo");
  }, []);

  return (
    <>
      <section
        className="relative bg-cover bg-center bg-fixed h-screen md:h-4/5 lg:h-4/5 px-2 sm:px-4 md:px-6 lg:px-8"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/5759223/pexels-photo-5759223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
        {/* Black overlay */}
        {/* <div className="flex flex-col items-center justify-end pb-16 text-center h-full mx-4 lg:px-0 relative z-10 lg:float-left md:float-left">
          <h1 className="text-4xl text-red-400 hover:text-red-500 transition duration-300 transform hover:scale-105 font-extrabold md:text-5xl drop-shadow-lg">
            Find Your Perfect Match
          </h1>
          <p className="text-lg text-white mt-4 max-w-xl leading-relaxed">
            Connecting millions for marriages and happiness.
          </p>
          <Link
            to="/login"
            className="mt-8 bg-red-400 text-white py-3 px-8 rounded-md shadow-lg hover:bg-red-500 transition duration-300 transform hover:scale-105"
          >
            Get Started
          </Link>
        </div> */}
      </section>

      <div
        className="flex justify-center w-full p-4 lg:p-8"
        style={{ marginTop: "-15%", position: "relative" }}
      >
        <div className="w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Find Your Match
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Gender Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                I’m looking for a
              </label>
              <select
                value={gender}
                onChange={handleGenderChange}
                className="py-2 px-3 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
              >
                <option value="">Select</option>
                <option value="Female">Woman</option>
                <option value="Male">Man</option>
              </select>
            </div>

            {/* Age From Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Age From
              </label>
              <select
                value={ageFrom}
                onChange={handleAgeFromChange}
                className="py-2 px-3 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
              >
                {[...Array(63)].map((_, i) => (
                  <option key={i + 18} value={i + 18}>
                    {i + 18}
                  </option>
                ))}
              </select>
            </div>

            {/* Age To Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Age To
              </label>
              <select
                value={ageTo}
                onChange={handleAgeToChange}
                className="py-2 px-3 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
              >
                {[...Array(63)].map((_, i) => (
                  <option key={i + 18} value={i + 18}>
                    {i + 18}
                  </option>
                ))}
              </select>
            </div>

            {/* Religion Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Religion
              </label>
              <select
                value={religion}
                onChange={handleReligionChange}
                className="py-2 px-3 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
              >
                <option value="">Select</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Sikh">Sikh</option>
                <option value="Parsi">Parsi</option>
                <option value="Jain">Jain</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Jewish">Jewish</option>
                <option value="No Religion">No Religion</option>
                <option value="Spiritual - not religious">Spiritual</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Mother Tongue Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Mother Tongue
              </label>
              <select
                value={motherTongue}
                onChange={handleMotherTongueChange}
                className="py-2 px-3 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
              >
                <option value="">Select</option>
                <option value="Bengali">Bengali</option>
                <option value="English">English</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Hindi">Hindi</option>
                <option value="Kannada">Kannada</option>
                <option value="Marathi">Marathi</option>
                <option value="Marwari">Marwari</option>
                <option value="Odia">Odia</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Urdu">Urdu</option>
                {/* Add more languages as needed */}
              </select>
            </div>

            {/* Submit Button */}
            <div className="mb-4 flex items-end justify-center">
              <button
                onClick={handleBeginClick}
                disabled={loading}
                className="w-full h-full py-2  inline-block text-white bg-pink-600 hover:bg-pink-700 font-semibold rounded transition duration-300"
              >
                {loading ? (
                  <span className="flex justify-center">Loading...</span>
                ) : (
                  "Let’s Begin"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 bg-white px-2">
        <div className="container mx-auto">
          <div className="relative flex justify-center mb-8">
            {/* <!-- Animated Icons --> */}
            <div className="absolute animate-pulse bg-blue-400 rounded-full h-6 w-6 opacity-75"></div>
            <div className="absolute animate-bounce bg-gray-300 rounded-full h-4 w-4 top-0 left-0 opacity-75"></div>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* <!-- Content Column --> */}
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0 px-4">
              <div>
                <div className="mb-6">
                  <span className="text-gray-500 uppercase font-semibold text-sm">
                    ABOUT US
                  </span>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to the Marriage Harmony
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Ready Matrimonial provides decent Matrimonial PHP Script in
                    various design templates at a reasonable price. It is also
                    available in Android &amp; iOS versions.
                  </p>
                </div>
                <ul className="list-disc pl-5 mb-6 text-gray-600">
                  <li className="mb-2">Profile with fully updated details</li>
                  <li className="mb-2">Multiple &amp; easy ways to contact</li>
                  <li className="mb-2">Automatic Matching System</li>
                  <li>Easy &amp; flexible navigations</li>
                </ul>
                <div className="text-center py-5">
                  <Link
                    to="/register"
                    className="inline-block text-white bg-pink-600 hover:bg-pink-700 font-semibold rounded transition duration-300"
                    style={{ textDecoration: "none", padding: "12px 22px" }}
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
            {/* <!-- Image Column --> */}
            <div className="w-full lg:w-1/2 px-4 hidden sm:block">
              <div className="flex justify-center">
                <img
                  className="rounded-lg shadow-lg w-full"
                  src="https://images.pexels.com/photos/11652315/pexels-photo-11652315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="About Us Image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white px-3">
        <div className="container mx-auto">
          <div className="relative flex justify-center mb-12">
            {/* <!-- Animated Icons --> */}
            <div className="absolute animate-bounce bg-gray-300 rounded-full h-4 w-4 top-0 left-4 opacity-75"></div>
            <div className="absolute animate-spin bg-red-400 rounded-full h-5 w-5 top-0 right-4 opacity-75"></div>
          </div>

          <div
            className="flex flex-wrap -mx-4"
            style={{ justifyContent: "space-around" }}
          >
            {/* <!-- Title Block --> */}
            <div
              className="w-full lg:w-1/3 px-4 mb-8"
              style={{ alignContent: "center" }}
            >
              <span className="text-gray-500 uppercase font-semibold text-sm">
                Features
              </span>
              <h2 className="text-5xl font-bold text-gray-800 mt-2">
                Our Features
              </h2>
            </div>
            {/* <!-- Feature Block --> */}
            <div className="w-full lg:w-1/3 md:w-1/2 px-4 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
                <div className="text-green-500 mb-4">
                  <i className="fas fa-user-friends text-4xl"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">
                  <Link
                    to="/login"
                    className="text-gray-800 hover:text-green-500"
                    style={{ textDecoration: "none" }}
                  >
                    Personalized Matching
                  </Link>
                </h4>
                <p className="text-gray-600">
                  We provide personalized matchmaking services to find the
                  perfect partner for you.
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center mb-12">
            <div className="absolute animate-ping bg-blue-400 rounded-full h-6 w-6 opacity-75"></div>
          </div>

          <div
            className="flex flex-wrap -mx-4 mt-3"
            style={{ justifyContent: "space-around" }}
          >
            {/* <!-- Feature Block --> */}
            <div className="w-full lg:w-1/3 md:w-1/2 px-4 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
                <div className="text-red-500 mb-4">
                  <i className="fas fa-bell text-4xl"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">
                  <Link
                    to="/login"
                    className="text-gray-800 hover:text-red-500"
                    style={{ textDecoration: "none" }}
                  >
                    Easily Update Profile
                  </Link>
                </h4>
                <p className="text-gray-600">
                  The activities such as changing the display picture, birth
                  details, and personal information.
                </p>
              </div>
            </div>
            {/* <!-- Feature Block --> */}
            <div className="w-full lg:w-1/3 md:w-1/2 px-4 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
                <div className="text-purple-500 mb-4">
                  <i className="fas fa-headset text-4xl"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">
                  <Link
                    to="/login"
                    className="text-gray-800 hover:text-purple-500"
                    onClick={handleCardClick}
                    style={{ textDecoration: "none" }}
                  >
                    Customer Support
                  </Link>
                </h4>
                <p className="text-gray-600">
                  24/7 customer support to assist you throughout your journey.
                </p>
                {showContactDetails && (
                  <div className="mt-4 p-4 bg-purple-100 rounded">
                    <h5 className="text-lg font-semibold">Contact Details:</h5>
                    <p className="text-gray-700">Phone: +123 456 7890</p>
                    <p className="text-gray-700">Email: support@example.com</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
