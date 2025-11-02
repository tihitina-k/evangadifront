import { useState } from "react";
import classes from "./signUp.module.css";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../utility/axios";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup({ onSwitch }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  function validateUserData(firstname, lastname, username) {
    const isValidFname = /^[A-Za-z]{2,}$/.test(firstname.trim());
    const isValidLname = /^[A-Za-z]{2,}$/.test(lastname.trim());
    const isValidUserName = /^[A-Za-z0-9]+$/.test(username.trim());
    const isValidUsernameLength = username.trim().length > 1;
    return (
      isValidFname && isValidLname && isValidUserName && isValidUsernameLength
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateUserData(
        formData.firstname,
        formData.lastname,
        formData.username
      )
    ) {
      return await Swal.fire({
        title: "Error",
        text: "Please enter a valid first, last and username. Names should contain only letters and include at least two characters",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    try {
      // Log payload for debugging
      console.log(
        "Sending register payload:",
        JSON.stringify(formData, null, 2)
      );

      // POST request to backend
      const response = await axiosInstance.post("/user/register", formData);

      console.log("Backend response:", response.data);

      if (response.status === 201) {
        setError(null);
        await Swal.fire({
          title: "Success!",
          text: "User registered successfully! Logging in...",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Auto-login after registration
        try {
          const loginResponse = await axiosInstance.post("/user/login", {
            usernameOrEmail: formData.email,
            password: formData.password,
          });

          if (loginResponse.status === 200) {
            localStorage.setItem("Evangadi_Forum", loginResponse.data.token);
            window.location.href = "/";
          } else {
            setError(
              loginResponse.data.msg || "Login failed. Please try again."
            );
          }
        } catch (loginError) {
          console.error("Login error:", loginError);
          setError("An error occurred during login. Please try again.");
        }
      } else {
        setError(response.data.msg);
        await Swal.fire({
          title: "Error",
          text:
            response.data.msg || "Error submitting the form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setSuccess(null);
      }
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setError(
        err.response?.data?.msg ||
          "Error submitting the form. Please try again."
      );
      await Swal.fire({
        title: "Error",
        text:
          err.response?.data?.msg ||
          "Error submitting the form. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className={classes.formcontainer}>
      <h2>Join the network</h2>
      <p className="signin-text">
        Already have an account?{" "}
        <a
          onClick={onSwitch}
          style={{ cursor: "pointer", color: "var(--primary-color)" }}
        >
          Sign in
        </a>
      </p>
      {error && <p className={classes.error}>{error}</p>}
      {success && <p className={classes.success}>{success}</p>}
      <form method="POST" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <div className={classes.nameinputs}>
          <input
            type="text"
            name="firstname"
            placeholder="First name"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last name"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
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
          <div style={{ padding: "5px", fontSize: "14px" }}>
            I agree to the <Link to="/privacyPolicy">privacy policy</Link> and{" "}
            <Link to="/terms">terms of service</Link>.
          </div>
        </div>
        <button type="submit" className={classes.submitbtn}>
          Agree and Join
        </button>
        <p className={classes.signintext}>
          <a
            onClick={onSwitch}
            style={{ cursor: "pointer", color: "var(--primary-color)" }}
          >
            Already have an account?
          </a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
