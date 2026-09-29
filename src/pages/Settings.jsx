import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // ==========================================
  // LOAD CURRENT LOGGED-IN USER
  // ==========================================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("User data error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // PROFILE NAVIGATION BASED ON ROLE
  // ==========================================
  const handleProfile = () => {
    if (!user) return;

    if (user.role === "student") {
      navigate("/student-profile");
    } else if (user.role === "alumni") {
      navigate("/alumni-profile");
    } else if (user.role === "staff") {
      navigate("/staff-profile");
    }
  };

  // ==========================================
  // DASHBOARD NAVIGATION BASED ON ROLE
  // ==========================================
  const handleDashboard = () => {
    if (!user) return;

    if (user.role === "student") {
      navigate("/student-dashboard");
    } else if (user.role === "alumni") {
      navigate("/alumni-dashboard");
    } else if (user.role === "staff") {
      navigate("/staff-dashboard");
    }
  };

  if (!user) {
    return (
      <div className="settings-loading">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="settings-page">

      <div className="settings-container">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="settings-header">

          <button
            className="back-btn"
            onClick={handleDashboard}
          >
            ← Dashboard
          </button>

          <div>
            <h1>Settings ⚙️</h1>

            <p>
              Manage your Alumni Nexus account
            </p>
          </div>

        </div>


        {/* ==========================================
            PROFILE CARD
        ========================================== */}

        <div className="settings-card">

          <div className="settings-card-title">

            <div className="settings-icon">
              👤
            </div>

            <div>
              <h2>Account Information</h2>

              <p>
                Your registered account details
              </p>
            </div>

          </div>


          <div className="settings-info-grid">

            <div className="settings-info">

              <span>Name</span>

              <strong>
                {user.name || "Not updated"}
              </strong>

            </div>


            <div className="settings-info">

              <span>Email</span>

              <strong>
                {user.email || "Not updated"}
              </strong>

            </div>


            <div className="settings-info">

              <span>Department</span>

              <strong>
                {user.department || "Not updated"}
              </strong>

            </div>


            <div className="settings-info">

              <span>Passing Year</span>

              <strong>
                {user.passingYear || "Not updated"}
              </strong>

            </div>


            <div className="settings-info">

              <span>Account Type</span>

              <strong className={`role-badge ${user.role}`}>
                {user.role === "student" && "🎓 Student"}

                {user.role === "alumni" && "👨‍🎓 Alumni"}

                {user.role === "staff" && "🏢 Staff"}
              </strong>

            </div>

          </div>

        </div>


        {/* ==========================================
            ROLE INFORMATION
        ========================================== */}

        <div className="settings-card">

          <div className="settings-card-title">

            <div className="settings-icon">
              🔐
            </div>

            <div>

              <h2>Access & Permissions</h2>

              <p>
                Features available for your account
              </p>

            </div>

          </div>


          {user.role === "student" && (

            <div className="permission-box student-box">

              <h3>🎓 Student Access</h3>

              <ul>
                <li>View alumni profiles</li>
                <li>Search alumni by skills and company</li>
                <li>Connect with alumni</li>
                <li>Request mentorship</li>
                <li>View events</li>
                <li>View job opportunities</li>
                <li>Manage student profile</li>
              </ul>

            </div>

          )}


          {user.role === "alumni" && (

            <div className="permission-box alumni-box">

              <h3>👨‍🎓 Alumni Access</h3>

              <ul>
                <li>View student profiles</li>
                <li>View alumni profiles</li>
                <li>Connect with students</li>
                <li>Connect with alumni</li>
                <li>Provide mentorship</li>
                <li>Post job opportunities</li>
                <li>Participate in events</li>
                <li>Manage alumni profile</li>
              </ul>

            </div>

          )}


          {user.role === "staff" && (

            <div className="permission-box staff-box">

              <h3>🏢 Staff Access</h3>

              <ul>
                <li>Manage alumni records</li>
                <li>Manage student records</li>
                <li>Manage events</li>
                <li>Manage job information</li>
                <li>Send notifications</li>
                <li>Monitor users</li>
                <li>Manage institutional activities</li>
              </ul>

            </div>

          )}

        </div>


        {/* ==========================================
            ACTIONS
        ========================================== */}

        <div className="settings-card">

          <div className="settings-card-title">

            <div className="settings-icon">
              🛠️
            </div>

            <div>

              <h2>Account Actions</h2>

              <p>
                Manage your account
              </p>

            </div>

          </div>


          <div className="settings-actions">

            <button
              className="profile-settings-btn"
              onClick={handleProfile}
            >
              👤 Edit My Profile
            </button>


            <button
              className="logout-settings-btn"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;