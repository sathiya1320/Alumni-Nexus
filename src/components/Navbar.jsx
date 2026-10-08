import { Link, useNavigate } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user")
    );
  } catch {
    user = null;
  }

  const handleSection = (sectionId) => {

    if (window.location.pathname === "/") {

      const section =
        document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      window.history.pushState(
        null,
        "",
        "/#" + sectionId
      );

      return;
    }

    navigate("/#" + sectionId);

    setTimeout(() => {

      const section =
        document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

    }, 300);
  };

  const handleProfile = () => {

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.role === "student") {
      navigate("/student-profile");
      return;
    }

    if (user.role === "alumni") {
      navigate("/alumni-profile");
      return;
    }

    if (user.role === "staff") {
      navigate("/staff-profile");
      return;
    }

    navigate("/profile");
  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/", {
      replace: true,
    });
  };

  return (
    <nav className="navbar">

      <Link
        to="/"
        className="logo"
      >

        <FaUserGraduate
          className="logo-icon"
        />

        <span>
          Alumni Nexus
        </span>

      </Link>

      <div className="nav-links">

        <a
          href="/#home"
          onClick={(e) => {
            e.preventDefault();
            handleSection("home");
          }}
        >
          Home
        </a>

        <a
          href="/#about"
          onClick={(e) => {
            e.preventDefault();
            handleSection("about");
          }}
        >
          About
        </a>

        <a
          href="/#features"
          onClick={(e) => {
            e.preventDefault();
            handleSection("features");
          }}
        >
          Features
        </a>

        <a
          href="/#contact"
          onClick={(e) => {
            e.preventDefault();
            handleSection("contact");
          }}
        >
          Contact
        </a>

        {token && user && (
          <button
            className="profile-nav-btn"
            onClick={handleProfile}
          >
            Profile
          </button>
        )}

      </div>

      <div className="nav-actions">

        {!token ? (
          <>
            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-btn"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;