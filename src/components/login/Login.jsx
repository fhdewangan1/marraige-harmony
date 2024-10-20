import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosConfig } from "../../config/AxiosConfig";
import Swal from "sweetalert2";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import the eye icons

function Login() {
  const [formData, setFormData] = useState({ mobileNumber: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  // Function to validate the form fields
  const validate = (name, value) => {
    const newErrors = {};

    // Validate Mobile
    if (name === "mobileNumber") {
      if (!value) {
        newErrors.mobileNumber = "Contact is required";
      } else if (!/^\d{10}$/.test(value)) {
        newErrors.mobileNumber = "Mobile must be of 10 digits";
      } else {
        delete newErrors.mobileNumber; // Remove the error if the field is valid
      }
    }

    // Validate Password
    if (name === "password") {
      if (!value) {
        newErrors.password = "Password is required";
      } else {
        delete newErrors.password; // Remove the error if the field is valid
      }
    }

    setErrors(newErrors);
  };

  const validateAll = () => {
    const newErrors = {};

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Contact is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile must be a 10-digit number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate the specific field that changed
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (validateAll()) {
      try {
        const response = await AxiosConfig.get("/auth/login-profile", {
          params: formData,
        });
        if (response?.data?.statusCode === 200) {
          localStorage.setItem("userInfo", JSON.stringify(response.data));

          Swal.fire({
            title: "Login Successful",
            text: "You have successfully logged in!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            setLoading(false);
            navigate("/profiles");
          });
        } else {
          Swal.fire({
            title: "Login failed",
            text: response?.data?.statusMessage,
            icon: "error",
            confirmButtonText: "OK",
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Login failed", error);
        setLoading(false);

        Swal.fire({
          title: "Login Failed",
          text: "Please check your credentials and try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        title: "Invalid Credentials",
        text: "Please fill all credentials",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
      <div className="max-w-screen-xl h-100 m-0 sm:m-10 bg-white shadow-lg sm:rounded-lg flex justify-center flex-1 transition-transform duration-300 ease-in-out transform ">
        <div className="lg:w-1/2 xl:w-5/12 p-4 sm:p-12">
          <div className="py-3">
            <Link to={"/"} className="text-decoration-none flex items-center">
              <i className="fa-solid fa-arrow-left-long"></i>
              <span className="ml-3 font-bold text-blue-500 hover:text-blue-700 transition duration-200">
                Visit Home
              </span>
            </Link>
          </div>

          <div className="mt-12 flex flex-col items-center">
            <div className="w-full flex-1">
              <h1 className="mb-5 text-2xl xl:text-3xl font-extrabold text-center">
                Login
              </h1>

              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white transition duration-200 ease-in-out"
                  type="tel"
                  name="mobileNumber"
                  onChange={handleChange}
                  value={formData.mobileNumber}
                  placeholder="Mobile"
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mobileNumber}
                  </p>
                )}
                <div className="relative mt-4">
                  <input
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white transition duration-200 ease-in-out "
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-4 text-gray-600 hover:text-gray-800 transition duration-200"
                    onClick={togglePasswordVisibility} // Toggle visibility on button click
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible size={24} />
                    ) : (
                      <AiFillEye size={24} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <div className="text-end mt-2">
                  <Link
                    className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800 transition duration-200"
                    to={"/forgot-password"}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <button
                  className={`mt-4 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleSubmit}
                  disabled={loading} // Disable button while loading
                >
                  {loading ? (
                    <div className="loader">Loading...!</div>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6 -ml-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <path d="M20 8v6M23 11h-6" />
                      </svg>
                      <span className="ml-3">Login</span>
                    </>
                  )}
                </button>
                <div className="py-3">
                  <Link
                    to={"/register"}
                    className="text-decoration-none flex justify-center"
                  >
                    <span className="text-sm">Don't have an account?</span>
                    <span className="ml-3 font-bold text-blue-500 hover:text-blue-700 transition duration-200">
                      Signup Now
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex-1 bg-indigo-100 text-center hidden lg:flex rounded-r-lg"
          style={{
            backgroundImage:
              'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")',
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
    </div>
  );
}

export default Login;
