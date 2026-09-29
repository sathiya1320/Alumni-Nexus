import React, {
  useEffect,
  useState,
} from "react";

import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaBriefcase,
  FaUser,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaGraduationCap,
  FaPlusCircle,
  FaHandshake,
} from "react-icons/fa";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import API from "../services/api";

import "./DashboardSidebar.css";

function DashboardSidebar() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  // =====================================
  // USER
  // =====================================

  const userData =
    localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

  const role =
    user?.role ||
    localStorage.getItem(
      "role"
    );

  // =====================================
  // FETCH NOTIFICATION COUNT
  // =====================================

  const fetchNotificationCount =
    async () => {

      try {

        // Notifications page open-na
        // badge 0

        if (
          location.pathname ===
          "/notifications"
        ) {
          setNotificationCount(0);
          return;
        }

        const response =
          await API.get(
            "/notifications/unread-count"
          );

        setNotificationCount(
          response.data.count || 0
        );

      } catch (error) {

        console.error(
          "NOTIFICATION COUNT ERROR:",
          error
        );

        setNotificationCount(0);
      }
    };

  // =====================================
  // LOAD + AUTO REFRESH
  // =====================================

  useEffect(() => {

    fetchNotificationCount();

    const interval =
      setInterval(
        fetchNotificationCount,
        10000
      );

    return () => {
      clearInterval(
        interval
      );
    };

  }, [location.pathname]);

  // =====================================
  // DASHBOARD PATH
  // =====================================

  let dashboardPath = "/";

  if (role === "alumni") {

    dashboardPath =
      "/alumni-dashboard";

  } else if (role === "student") {

    dashboardPath =
      "/student-dashboard";

  } else if (
    role === "staff" ||
    role === "admin"
  ) {

    dashboardPath =
      "/staff-dashboard";
  }

  // =====================================
  // PROFILE PATH
  // =====================================

  let profilePath =
    "/profile";

  if (role === "alumni") {

    profilePath =
      "/alumni-profile";

  } else if (role === "student") {

    profilePath =
      "/student-profile";

  } else if (
    role === "staff" ||
    role === "admin"
  ) {

    profilePath =
      "/staff-profile";
  }

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "role"
      );

      navigate("/login");
    };

  // =====================================
  // ACTIVE MENU
  // =====================================

  const isActive =
    (path) => {

      return (
        location.pathname ===
        path
      );
    };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="dashboard-sidebar">

      {/* LOGO */}

      <div className="sidebar-logo">

        <FaGraduationCap />

        <span>
          Alumni Nexus
        </span>

      </div>

      {/* PORTAL */}

      <div className="portal-title">

        {role === "alumni" &&
          "ALUMNI PORTAL"}

        {role === "student" &&
          "STUDENT PORTAL"}

        {(role === "staff" ||
          role === "admin") &&
          "STAFF PORTAL"}

      </div>

      <div className="sidebar-menu">

        {/* DASHBOARD */}

        <Link
          to={dashboardPath}
          className={
            isActive(
              dashboardPath
            )
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >

          <FaHome />

          <span>
            Dashboard
          </span>

        </Link>

        {/* ALUMNI NETWORK */}

        {(role === "student" ||
          role === "alumni") && (

          <Link
            to="/alumni"
            className={
              isActive("/alumni")
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >

            <FaUsers />

            <span>
              Alumni Network
            </span>

          </Link>
        )}

        {/* MENTORSHIP */}

        {(role === "student" ||
          role === "alumni") && (

          <Link
            to="/mentorship"
            className={
              isActive(
                "/mentorship"
              )
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >

            <FaHandshake />

            <span>
              Mentorship
            </span>

          </Link>
        )}

        {/* EVENTS */}

        <Link
          to="/events"
          className={
            isActive("/events")
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >

          <FaCalendarAlt />

          <span>
            {role === "staff" ||
            role === "admin"
              ? "Manage Events"
              : "Events"}
          </span>

        </Link>

        {/* JOBS */}

        <Link
          to="/jobs"
          className={
            isActive("/jobs")
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >

          <FaBriefcase />

          <span>
            {role === "staff" ||
            role === "admin"
              ? "Manage Jobs"
              : "Job Portal"}
          </span>

        </Link>

        {/* ADD JOB - STAFF */}

        {(role === "staff" ||
          role === "admin") && (

          <Link
            to="/add-job"
            className={
              isActive("/add-job")
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >

            <FaPlusCircle />

            <span>
              Add Job
            </span>

          </Link>
        )}

        {/* PROFILE */}

        <Link
          to={profilePath}
          className={
            isActive(
              profilePath
            )
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >

          <FaUser />

          <span>
            My Profile
          </span>

        </Link>

        {/* NOTIFICATIONS */}

        <Link
          to="/notifications"
          className={
            isActive(
              "/notifications"
            )
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >

          <FaBell />

          <span>
            Notifications
          </span>

          {notificationCount >
            0 &&
            location.pathname !==
              "/notifications" && (

            <span className="notification-badge">

              {notificationCount >
              99
                ? "99+"
                : notificationCount}

            </span>
          )}

        </Link>

        {/* SETTINGS */}

        <Link
          to="/settings"
          className={
            isActive(
              "/settings"
            )
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >

          <FaCog />

          <span>
            Settings
          </span>

        </Link>

      </div>

      {/* LOGOUT */}

      <div className="sidebar-bottom">

        <button
          onClick={
            handleLogout
          }
          className="logout-btn"
        >

          <FaSignOutAlt />

          <span>
            Logout
          </span>

        </button>

      </div>

    </div>
  );
}

export default DashboardSidebar;