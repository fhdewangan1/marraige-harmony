import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthHook = () => {
  const navigate = useNavigate();

  const userDetails = useCallback(() => {
    try {
      let session = JSON.parse(localStorage.getItem("userInfo"));
      if (new Date(session?.tokenExpirationInMilis) < new Date()) {
        localStorage.clear();
        navigate("/login");
      }
      return JSON.parse(localStorage.getItem("userInfo"));
    } catch (err) {
      console.log("err :", err);
      return {};
    }
    // eslint-disable-next-line
  }, []);

  return userDetails();
};

export default AuthHook;
