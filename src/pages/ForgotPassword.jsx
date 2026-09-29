import "../styles/ForgotPassword.css";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";


function ForgotPassword() {

  const navigate = useNavigate();


  // ==========================================
  // STATES
  // ==========================================

  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // Clear previous messages

    setMessage("");

    setError("");


    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    if (!email.trim()) {

      setError(
        "Please enter your registered email address."
      );

      return;

    }


    // ==========================================
    // START LOADING
    // ==========================================

    setLoading(true);


    try {

      // ==========================================
      // FORGOT PASSWORD API
      // ==========================================

      const response = await fetch(

        "http://localhost:5000/api/auth/forgot-password",

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            email:
              email.trim(),

          }),

        }

      );


      // ==========================================
      // GET SERVER RESPONSE
      // ==========================================

      const data =
        await response.json();


      console.log(
        "FORGOT PASSWORD RESPONSE:",
        data
      );


      // ==========================================
      // API ERROR
      // ==========================================

      if (!response.ok) {

        setError(

          data.message ||

          "Unable to process password reset request."

        );

        return;

      }


      // ==========================================
      // RESET TOKEN RECEIVED
      // ==========================================

      if (data.resetToken) {

        console.log(
          "RESET TOKEN RECEIVED"
        );


        // ========================================
        // GO TO RESET PASSWORD PAGE
        // ========================================

        navigate(

          `/reset-password?token=${encodeURIComponent(
            data.resetToken
          )}`,

          {
            replace: true,
          }

        );


        return;

      }


      // ==========================================
      // NO TOKEN
      // ==========================================

      setMessage(

        data.message ||

        "Password reset instructions have been sent."

      );


    }

    // ==========================================
    // SERVER CONNECTION ERROR
    // ==========================================

    catch (error) {

      console.error(

        "FORGOT PASSWORD ERROR:",

        error

      );


      setError(

        "Unable to connect to server. Please make sure backend is running."

      );

    }


    // ==========================================
    // STOP LOADING
    // ==========================================

    finally {

      setLoading(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="forgot-page">


      <div className="forgot-card">


        {/* ======================================
            ICON
        ====================================== */}

        <div className="forgot-icon">

          🔐

        </div>


        {/* ======================================
            TITLE
        ====================================== */}

        <h1>

          Forgot Password?

        </h1>


        <p className="forgot-description">

          Enter your registered email address
          to reset your password.

        </p>


        {/* ======================================
            FORM
        ====================================== */}

        <form

          onSubmit={handleSubmit}

          className="forgot-form"

        >


          {/* EMAIL LABEL */}

          <label>

            Email Address

          </label>


          {/* EMAIL INPUT */}

          <input

            type="email"

            placeholder="Enter your registered email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

            required

          />


          {/* ====================================
              ERROR MESSAGE
          ==================================== */}

          {error && (

            <div className="forgot-error">

              {error}

            </div>

          )}


          {/* ====================================
              SUCCESS MESSAGE
          ==================================== */}

          {message && (

            <div className="forgot-success">

              {message}

            </div>

          )}


          {/* ====================================
              RESET BUTTON
          ==================================== */}

          <button

            type="submit"

            disabled={loading}

          >

            {loading

              ? "Processing..."

              : "Reset Password"

            }

          </button>


        </form>


        {/* ======================================
            BACK TO LOGIN
        ====================================== */}

        <div className="back-login">

          <Link to="/login">

            ← Back to Login

          </Link>

        </div>


      </div>

    </div>

  );

}


export default ForgotPassword;