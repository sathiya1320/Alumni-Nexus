import "../styles/Login.css";

import {
  Link,
  useNavigate
} from "react-router-dom";

import { useState } from "react";


function Login() {

  const navigate = useNavigate();


  // ==========================================
  // STATES
  // ==========================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);


    try {

      const response = await fetch(

        "http://localhost:5000/api/auth/login",

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            email: email.trim(),

            password: password,

          }),

        }

      );


      const data =
        await response.json();


      // ==========================================
      // LOGIN FAILED
      // ==========================================

      if (!response.ok) {

        setError(

          data.message ||
          "Login failed"

        );

        return;

      }


      // ==========================================
      // VALIDATE RESPONSE
      // ==========================================

      if (!data.token || !data.user) {

        setError(
          "Invalid response from server"
        );

        return;

      }


      // ==========================================
      // CLEAR OLD LOGIN DATA
      // ==========================================

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      localStorage.removeItem("role");


      // ==========================================
      // SAVE TOKEN
      // ==========================================

      localStorage.setItem(
        "token",
        data.token
      );


      // ==========================================
      // SAVE USER
      // ==========================================

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      // ==========================================
      // GET ROLE
      // ==========================================

      const role =
        data.user.role?.toLowerCase();


      localStorage.setItem(
        "role",
        role
      );


      console.log(
        "LOGIN SUCCESS"
      );

      console.log(
        "USER:",
        data.user
      );

      console.log(
        "ROLE:",
        role
      );


      // ==========================================
      // ROLE BASED REDIRECT
      // ==========================================

      if (role === "student") {

        navigate(
          "/student-dashboard",
          { replace: true }
        );

      }

      else if (role === "alumni") {

        navigate(
          "/alumni-dashboard",
          { replace: true }
        );

      }

      else if (
        role === "staff" ||
        role === "admin"
      ) {

        navigate(
          "/staff-dashboard",
          { replace: true }
        );

      }

      else {

        setError(
          "Invalid user role. Please contact administrator."
        );

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        localStorage.removeItem("role");

      }


    }

    catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );


      setError(

        "Unable to connect to server. Please make sure backend is running."

      );

    }

    finally {

      setLoading(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>
          Welcome Back 👋
        </h1>


        <p>
          Login to Alumni Nexus
        </p>


        <form
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />


          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />


          {/* FORGOT PASSWORD */}

          <div className="forgot-password">

            <Link to="/forgot-password">

              Forgot Password?

            </Link>

          </div>


          {/* ERROR */}

          {error && (

            <p className="login-error">
              {error}
            </p>

          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

        </form>


        {/* REGISTER */}

        <div className="register-link">

          Don't have an account?

          <Link to="/register">

            {" "}
            Register

          </Link>

        </div>


      </div>

    </div>

  );

}


export default Login;