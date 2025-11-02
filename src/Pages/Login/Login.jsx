import { useState } from "react";
import { axiosInstance } from "../../utility/axios.js";
import classes from "./login.module.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login({ onSwitch }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending login payload:", JSON.stringify(formData, null, 2));

      // Ensure endpoint uses lowercase '/login' to match backend
      const response = await axiosInstance.post("/user/login", formData);

      console.log("Backend response:", response.data);

      if (response.status === 200) {
        localStorage.setItem("Evangadi_Forum", response.data.token);
        setError(null);
        setSuccess("Login successful! Redirecting...");

        await Swal.fire({
          title: "Success!",
          text: "User logged in successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });

        window.location.href = "/"; // redirect to homepage
      } else {
        setError(response.data.msg || "Login failed.");
        setSuccess(null);
        await Swal.fire({
          title: "Error",
          text:
            response.data.msg || "Error submitting the form. Please try again",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.msg || "Error logging in. Please try again."
      );
      setSuccess(null);
      await Swal.fire({
        title: "Error",
        text:
          err.response?.data?.msg ||
          "Error submitting the form. Please try again",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className={classes.formcontainer}>
      <div className={classes.innerContainer}>
        <div className={classes.heading}>
          <h2 className={classes.title}>Login to your account</h2>
          <p className={classes.signuptext}>
            Don't have an account?{" "}
            <a
              onClick={onSwitch}
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
            >
              create a new account
            </a>
          </p>
          {error && (
            <p className={classes.error} style={{ marginBottom: "10px" }}>
              {error}
            </p>
          )}
          {success && <p className={classes.success}>{success}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="usernameOrEmail"
            placeholder="User name or Email"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
          />
          <div className={classes.passwordinput}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <p className={classes.forgotpasswordtext}>
            <Link to="/forgetPass">Forgot password?</Link>
          </p>

          <button type="submit" className={classes.submitbtn}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
