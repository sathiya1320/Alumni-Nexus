import "../styles/ResetPassword.css";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useState } from "react";


function ResetPassword() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();


  const token =
    searchParams.get("token");


  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setMessage("");


    if (!token) {

      setError(
        "Invalid or missing reset token."
      );

      return;

    }


    if (password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;

    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;

    }


    setLoading(true);


    try {

      const response = await fetch(
        "https://alumni-nexus-cklf.onrender.com/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
            password,
          }),

        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        setError(
          data.message ||
          "Password reset failed."
        );

        return;

      }


      setMessage(
        data.message ||
        "Password reset successful."
      );


      setTimeout(() => {

        navigate(
          "/login",
          { replace: true }
        );

      }, 2000);


    } catch (error) {

      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      setError(
        "Unable to connect to server."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="reset-page">

      <div className="reset-card">

        <div className="reset-icon">
          🔑
        </div>


        <h1>
          Reset Password
        </h1>


        <p>
          Create a new password for your
          Alumni Nexus account.
        </p>


        <form
          onSubmit={handleSubmit}
        >

          <label>
            New Password
          </label>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />


          <label>
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
          />


          {error && (

            <div className="reset-error">
              {error}
            </div>

          )}


          {message && (

            <div className="reset-success">
              {message}
            </div>

          )}


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Updating..."
              : "Update Password"
            }

          </button>

        </form>


        <Link
          to="/login"
          className="reset-login"
        >
          ← Back to Login
        </Link>

      </div>

    </div>

  );

}


export default ResetPassword;