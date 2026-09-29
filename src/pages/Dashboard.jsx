import React from "react";

import "../styles/Dashboard.css";

function Dashboard() {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );


  if (!user) {

    return (

      <div>
        Please login first.
      </div>

    );

  }


  // =====================================================
  // STUDENT DASHBOARD
  // =====================================================

  if (user.role === "student") {

    return (

      <div className="dashboard-page">

        <div className="dashboard-header">

          <h1>
            Welcome, {user.name} 👋
          </h1>

          <p>
            Student Dashboard
          </p>

        </div>


        <div className="dashboard-grid">

          <div className="dashboard-card">

            <h2>
              🎓 My Profile
            </h2>

            <p>
              Manage your student profile
              and academic information.
            </p>

          </div>


          <div className="dashboard-card">

            <h2>
              👨‍💼 Alumni Network
            </h2>

            <p>
              Search and connect with
              alumni.
            </p>

          </div>


          <div className="dashboard-card">

            <h2>
              🤝 Mentorship
            </h2>

            <p>
              Connect with alumni for
              mentorship opportunities.
            </p>

          </div>


          <div className="dashboard-card">

            <h2>
              💼 Jobs
            </h2>

            <p>
              Explore career and job
              opportunities.
            </p>

          </div>

        </div>

      </div>

    );

  }


  // =====================================================
  // ALUMNI DASHBOARD
  // =====================================================

  if (user.role === "alumni") {

    return (

      <div className="dashboard-page">

        <div className="dashboard-header">

          <h1>
            Welcome, {user.name} 👋
          </h1>

          <p>
            Alumni Dashboard
          </p>

        </div>


        <div className="dashboard-grid">

          <div className="dashboard-card">

            <h2>
              👤 My Profile
            </h2>

            <p>
              Update your professional
              information.
            </p>

          </div>


          <div className="dashboard-card">

            <h2>
              🎓 Student Mentorship
            </h2>

            <p>
              Support students through
              mentorship.
            </p>

          </div>


          <div className="dashboard-card">

            <h2>
              🤝 Alumni Network
            </h2>

            <p>
              Connect with other alumni.
            </p>

          </div>


          <div className="dashboard-card">

            <h2>
              💼 Career Opportunities
            </h2>

            <p>
              Share and explore
              professional opportunities.
            </p>

          </div>

        </div>

      </div>

    );

  }


  // =====================================================
  // STAFF DASHBOARD
  // =====================================================

  if (user.role === "staff") {

    return (

      <div className="dashboard-page">

        <div className="dashboard-header">

          <h1>
            Welcome, {user.name} 👋
          </h1>

          <p>
            Staff / Admin Dashboard
          </p>

        </div>


        <div className="dashboard-grid">

          <div className="dashboard-card">

            <h2>
              👥 User Management
            </h2>

            <p>
              Manage students and alumni.
            </p>

          </div>


          <div className="dashboard-card">

            <h2>
              🎓 Alumni Management
            </h2>

            <p>
              View and manage alumni
              records.
            </p>

          </div>


          <div className="dashboard-card">

            <h2>
              📅 Event Management
            </h2>

            <p>
              Create and manage alumni
              events.
            </p>

          </div>


          <div className="dashboard-card">

            <h2>
              📊 Reports
            </h2>

            <p>
              View system reports and
              statistics.
            </p>

          </div>

        </div>

      </div>

    );

  }


  return null;
}

export default Dashboard;