import React, {
  useEffect,
  useState
} from "react";

import {
  FaUsers,
  FaUserGraduate,
  FaHandshake,
  FaBriefcase,
  FaArrowRight,
  FaCalendarAlt
} from "react-icons/fa";

import {
  Link,
  useNavigate
} from "react-router-dom";

import DashboardSidebar
  from "../components/DashboardSidebar";

import API
  from "../services/api";

import "./AlumniDashboard.css";


function AlumniDashboard() {

  const navigate = useNavigate();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // CURRENT USER
  // ==========================================

  const getUser = () => {

    try {

      return JSON.parse(
        localStorage.getItem("user") || "null"
      );

    } catch {

      return null;

    }

  };


  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const user = getUser();


      // LOGIN CHECK
      if (!token || !user) {

        navigate("/login");

        return;

      }


      // ROLE CHECK
      if (user.role === "student") {

        navigate("/student-dashboard");

        return;

      }


      if (
        user.role === "staff" ||
        user.role === "admin"
      ) {

        navigate("/staff-dashboard");

        return;

      }


      // API REQUEST
      const response =
        await API.get(
          "/dashboard/alumni",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      console.log(
        "ALUMNI DASHBOARD RESPONSE:",
        response.data
      );


      setData(response.data);

    } catch (error) {

      console.error(
        "ALUMNI DASHBOARD ERROR:",
        error
      );


      // TOKEN ERROR
      if (
        error.response?.status === 401
      ) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

        return;

      }


      setError(
        error.response?.data?.message ||
        "Unable to load dashboard"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD
  // ==========================================

  useEffect(() => {

    fetchDashboard();

  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="dashboard-layout">

        <DashboardSidebar />

        <main className="dashboard-content">

          <div className="dashboard-loader">

            <div className="spinner"></div>

            <p>
              Loading your dashboard...
            </p>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="dashboard-layout">

        <DashboardSidebar />

        <main className="dashboard-content">

          <div className="dashboard-error">

            <h2>
              Unable to Load Dashboard
            </h2>

            <p>
              {error}
            </p>

            <button
              className="retry-btn"
              onClick={fetchDashboard}
            >
              Try Again
            </button>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // DASHBOARD DATA
  // ==========================================

  const totalNetworkMembers =
    data?.totalNetworkMembers || 0;

  const totalAlumni =
    data?.totalAlumni || 0;

  const totalStudents =
    data?.totalStudents || 0;

  const pendingMentorshipRequests =
    data?.pendingMentorshipRequests || 0;

  const jobsPosted =
    data?.jobsPosted || 0;


  // ==========================================
  // USER
  // ==========================================

  const user = getUser();


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="dashboard-layout">

      <DashboardSidebar />


      <main className="dashboard-content">


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="dashboard-topbar">

          <div>

            <p className="portal-label">
              ALUMNI PORTAL
            </p>

            <h1>

              Welcome back,

              <br />

              <span>
                {user?.name || "Alumni"} 👋
              </span>

            </h1>

            <p className="welcome-description">

              Manage your professional network,
              mentorship and career contributions.

            </p>

          </div>


          <div className="profile-summary">

            <div className="profile-avatar">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}

            </div>

            <div>

              <h4>
                {user?.name || "Alumni"}
              </h4>

              <p>
                Alumni Member
              </p>

            </div>

          </div>

        </div>


        {/* =====================================
            NETWORK OVERVIEW
        ===================================== */}

        <div className="section-heading">

          <div>

            <h2>
              Network Overview
            </h2>

            <p>
              Your Alumni Nexus activity overview
            </p>

          </div>

        </div>


        {/* =====================================
            STATS
        ===================================== */}

        <div className="stats-grid">


          {/* NETWORK */}

          <Link
            to="/alumni"
            className="stat-card"
          >

            <div className="stat-icon network-icon">
              <FaUsers />
            </div>

            <div className="stat-info">

              <p>
                Network Members
              </p>

              <h3>
                {totalNetworkMembers}
              </h3>

              <small>
                View all members →
              </small>

            </div>

          </Link>


          {/* STUDENTS */}

          <Link
            to="/alumni"
            className="stat-card"
          >

            <div className="stat-icon student-icon">
              <FaUserGraduate />
            </div>

            <div className="stat-info">

              <p>
                Students
              </p>

              <h3>
                {totalStudents}
              </h3>

              <small>
                View students →
              </small>

            </div>

          </Link>


          {/* =================================
              MENTORSHIP
          ================================= */}

          <Link
            to="/mentorship"
            className="stat-card"
          >

            <div className="stat-icon mentorship-icon">
              <FaHandshake />
            </div>

            <div className="stat-info">

              <p>
                Mentorship Requests
              </p>

              <h3>
                {pendingMentorshipRequests}
              </h3>

              <small>
                View requests →
              </small>

            </div>

          </Link>


          {/* JOBS */}

          <Link
            to="/jobs"
            className="stat-card"
          >

            <div className="stat-icon job-icon">
              <FaBriefcase />
            </div>

            <div className="stat-info">

              <p>
                Jobs Posted
              </p>

              <h3>
                {jobsPosted}
              </h3>

              <small>
                View jobs →
              </small>

            </div>

          </Link>

        </div>


        {/* =====================================
            QUICK ACTIONS
        ===================================== */}

        <div className="quick-section">

          <div className="section-heading">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Access important features quickly
              </p>

            </div>

          </div>


          <div className="quick-actions-grid">


            {/* ALUMNI NETWORK */}

            <Link
              to="/alumni"
              className="quick-action-card"
            >

              <div className="quick-icon">
                <FaUsers />
              </div>

              <div>

                <h3>
                  Alumni Network
                </h3>

                <p>
                  Connect with alumni and students.
                </p>

              </div>

              <FaArrowRight
                className="arrow-icon"
              />

            </Link>


            {/* =================================
                MENTORSHIP - NEW
            ================================= */}

            <Link
              to="/mentorship"
              className="quick-action-card"
            >

              <div className="quick-icon">
                <FaHandshake />
              </div>

              <div>

                <h3>
                  Mentorship
                </h3>

                <p>
                  View and manage mentorship requests.
                </p>

              </div>

              <FaArrowRight
                className="arrow-icon"
              />

            </Link>


            {/* JOB PORTAL */}

            <Link
              to="/jobs"
              className="quick-action-card"
            >

              <div className="quick-icon">
                <FaBriefcase />
              </div>

              <div>

                <h3>
                  Job Portal
                </h3>

                <p>
                  Explore career opportunities.
                </p>

              </div>

              <FaArrowRight
                className="arrow-icon"
              />

            </Link>


            {/* EVENTS */}

            <Link
              to="/events"
              className="quick-action-card"
            >

              <div className="quick-icon">
                <FaCalendarAlt />
              </div>

              <div>

                <h3>
                  Upcoming Events
                </h3>

                <p>
                  Participate in alumni events.
                </p>

              </div>

              <FaArrowRight
                className="arrow-icon"
              />

            </Link>

          </div>

        </div>


        {/* =====================================
            BOTTOM GRID
        ===================================== */}

        <div className="dashboard-bottom-grid">


          {/* RECENT MEMBERS */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Recent Members
                </h2>

                <p>
                  Recently joined network members
                </p>

              </div>

              <Link to="/alumni">
                View All
              </Link>

            </div>


            <div className="recent-list">

              {data?.recentUsers?.length > 0 ? (

                data.recentUsers.map(
                  (member) => (

                    <div
                      className="recent-user"
                      key={member._id}
                    >

                      <div className="recent-avatar">

                        {member.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}

                      </div>


                      <div className="recent-user-info">

                        <h4>
                          {member.name}
                        </h4>

                        <p>

                          {member.role === "staff"
                            ? "Staff"
                            : member.role === "alumni"
                              ? "Alumni"
                              : "Student"}

                          {" • "}

                          {member.role === "staff"
                            ? "Staff Member"
                            : member.department ||
                              "Department not updated"}

                        </p>

                      </div>

                    </div>

                  )
                )

              ) : (

                <div className="empty-state">

                  <FaUsers />

                  <p>
                    No recent members available.
                  </p>

                </div>

              )}

            </div>

          </div>


          {/* PLATFORM ACTIVITY */}

          <div className="dashboard-panel activity-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Platform Activity
                </h2>

                <p>
                  Current Alumni Nexus statistics
                </p>

              </div>

            </div>


            {/* TOTAL ALUMNI */}

            <div className="activity-item">

              <div className="activity-number">
                {totalAlumni}
              </div>

              <div>

                <h4>
                  Total Alumni
                </h4>

                <p>
                  Registered alumni members
                </p>

              </div>

            </div>


            {/* TOTAL STUDENTS */}

            <div className="activity-item">

              <div className="activity-number">
                {totalStudents}
              </div>

              <div>

                <h4>
                  Total Students
                </h4>

                <p>
                  Registered student members
                </p>

              </div>

            </div>


            {/* PENDING MENTORSHIP */}

            <div className="activity-item">

              <div className="activity-number">
                {pendingMentorshipRequests}
              </div>

              <div>

                <h4>
                  Pending Mentorship
                </h4>

                <p>
                  Requests waiting for response
                </p>

              </div>

            </div>


            {/* JOBS */}

            <div className="activity-item">

              <div className="activity-number">
                {jobsPosted}
              </div>

              <div>

                <h4>
                  Jobs Posted
                </h4>

                <p>
                  Opportunities contributed
                </p>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}


export default AlumniDashboard;