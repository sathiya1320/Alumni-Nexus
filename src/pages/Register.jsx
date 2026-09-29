import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGraduationCap, FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    passingYear: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;

    setFormData((prev) => ({
      ...prev,
      role,
      passingYear: "",
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!formData.password) {
      setError("Please enter a password");
      return;
    }

    // Passing year required only for Student / Alumni
    if (
      (formData.role === "student" ||
        formData.role === "alumni") &&
      !formData.passingYear
    ) {
      setError("Please enter your passing year");
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      };

      // Send passing year only for Student / Alumni
      if (
        formData.role === "student" ||
        formData.role === "alumni"
      ) {
        dataToSend.passingYear =
          Number(formData.passingYear);
      }

      const response = await API.post(
        "/auth/register",
        dataToSend
      );

      setSuccess(
        response.data.message ||
          "Account created successfully!"
      );

      setFormData({
        name: "",
        email: "",
        role: "student",
        passingYear: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* HEADER */}
        <div className="register-header">

          <h1>Create Account</h1>

          <div className="register-icon">
            <FaGraduationCap />
          </div>

          <p>
            Join the Alumni Nexus Community
          </p>

        </div>


        {/* FORM */}
        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          {/* FULL NAME */}
          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

          </div>


          {/* EMAIL */}
          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

          </div>


          {/* ROLE */}
          <div className="form-group">

            <label>Register As</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
            >

              <option value="student">
                Student
              </option>

              <option value="alumni">
                Alumni
              </option>

              <option value="staff">
                Staff
              </option>

            </select>


            {/* ROLE DESCRIPTION */}
            <div className="role-description">

              {formData.role === "student" && (
                <>
                  Register as a B.Sc Computer
                  Science student.
                </>
              )}

              {formData.role === "alumni" && (
                <>
                  Join the Alumni Nexus
                  professional network.
                </>
              )}

              {formData.role === "staff" && (
                <>
                  Staff members can manage
                  events and alumni activities.
                </>
              )}

            </div>

          </div>


          {/* PASSING YEAR */}
          {(formData.role === "student" ||
            formData.role === "alumni") && (

            <div className="form-group">

              <label>Passing Year</label>

              <input
                type="number"
                name="passingYear"
                value={formData.passingYear}
                onChange={handleChange}
                placeholder="Example: 2026"
                min="2000"
                max="2100"
              />

            </div>

          )}


          {/* PASSWORD */}
          <div className="form-group">

            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}

              </button>

            </div>

          </div>


          {/* ERROR */}
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}


          {/* SUCCESS */}
          {success && (
            <div className="register-success">
              {success}
            </div>
          )}


          {/* BUTTON */}
          <button
            type="submit"
            className="create-account-btn"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

          </button>

        </form>


        {/* LOGIN */}
        <div className="login-link">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;