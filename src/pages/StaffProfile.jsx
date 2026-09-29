import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StaffProfile.css";

function StaffProfile() {

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };


  return (

    <div className="staff-profile-page">

      <aside className="staff-profile-sidebar">

        <h2>
          🎓 Alumni Nexus
        </h2>

        <p>
          STAFF PORTAL
        </p>

        <Link to="/staff-dashboard">
          🏠 Dashboard
        </Link>

        <Link to="/alumni">
          👥 Alumni Records
        </Link>

        <Link to="/events">
          📅 Events
        </Link>

        <Link to="/jobs">
          💼 Jobs
        </Link>

        <Link to="/notifications">
          🔔 Notifications
        </Link>

        <Link to="/staff-profile">
          👤 My Profile
        </Link>

        <button onClick={handleLogout}>
          🚪 Logout
        </button>

      </aside>


      <main className="staff-profile-main">

        <div className="staff-profile-header">

          <span>
            STAFF PROFILE
          </span>

          <h1>
            Staff Account 🏢
          </h1>

          <p>
            Manage your institutional staff information.
          </p>

        </div>


        <section className="staff-profile-card">

          <div className="staff-avatar-large">

            {user.name
              ?.charAt(0)
              .toUpperCase()}

          </div>


          <h2>
            {user.name || "Staff"}
          </h2>

          <span className="staff-role">
            STAFF
          </span>


          <div className="staff-info-grid">

            <div>
              <small>
                FULL NAME
              </small>

              <strong>
                {user.name || "Not updated"}
              </strong>
            </div>


            <div>
              <small>
                EMAIL
              </small>

              <strong>
                {user.email || "Not updated"}
              </strong>
            </div>


            <div>
              <small>
                STAFF ID
              </small>

              <strong>
                {user.staffId || "Not assigned"}
              </strong>
            </div>


            <div>
              <small>
                DEPARTMENT
              </small>

              <strong>
                {user.department || "Not updated"}
              </strong>
            </div>


            <div>
              <small>
                DESIGNATION
              </small>

              <strong>
                {user.designation || "Not updated"}
              </strong>
            </div>


            <div>
              <small>
                ROLE
              </small>

              <strong>
                Staff
              </strong>
            </div>

          </div>

        </section>

      </main>

    </div>

  );
}

export default StaffProfile;