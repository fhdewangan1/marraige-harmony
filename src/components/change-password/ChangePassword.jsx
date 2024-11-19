import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { AxiosConfig } from "../../config/AxiosConfig";
import Swal from "sweetalert2";
import AuthHook from "../../auth/AuthHook";

function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const navigate = useNavigate();

  // Get the user session
  const session = AuthHook();
  const mobileNumber = session?.userName; // Use the userName from the session

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    if (formData.newPassword !== formData.confirmNewPassword) {
      setLoading(false);
      Swal.fire({
        title: "Passwords did not match",
        text: "Please make sure your new password and confirm password match.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await AxiosConfig.put(
        `/user/${mobileNumber}/change-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Password Changed Successfully",
          text: "Your password has been updated!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setLoading(false); // Stop loading
          navigate("/profiles"); // Navigate to profiles or desired page
        });
      } else {
        Swal.fire({
          title: "Change Password Failed",
          text: response.data.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Change password failed", error);
      setLoading(false); // Stop loading in case of error

      Swal.fire({
        title: "Change Password Failed",
        text: error.response?.data?.message || "Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="py-20 hover:bg-gray-50 transition duration-100">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-vector/data-stealing-malware-abstract-concept-illustration_335657-2128.jpg?t=st=1729431260~exp=1729434860~hmac=86ff5a58fc82695dab840e0471702f12b29a7022c4f1bbe79ffa79e7509cc811&w=740",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <form className="w-full p-8 lg:w-1/2" onSubmit={handleSubmit}>
          <div className="py-3 text-end">
            <Link to={"/profiles"} className="text-decoration-none">
              <i className="fa-solid fa-arrow-left-long"></i>
              <span className="ml-3 font-bold text-gray-700 hover:text-gray-600">
                Dashboard
              </span>
            </Link>
          </div>
          <p className="text-xl text-gray-600 text-center py-2">
            Change Your Password!
          </p>
          <hr className="w-full md:w-2/4 mx-auto" />
          {["oldPassword", "newPassword", "confirmNewPassword"].map((field) => (
            <div key={field} className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {field === "oldPassword"
                  ? "Old Password"
                  : field === "newPassword"
                  ? "New Password"
                  : "Confirm New Password"}
              </label>
              <div className="relative">
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  name={field}
                  type={showPassword[field] ? "text" : "password"}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={
                    field === "oldPassword"
                      ? "Enter your old password"
                      : field === "newPassword"
                      ? "Enter your new password"
                      : "Confirm your new password"
                  }
                />
                <span
                  onClick={() => togglePasswordVisibility(field)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                >
                  {showPassword[field] ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>
            </div>
          ))}
          <div className="mt-8">
            <button
              className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              type="submit"
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
