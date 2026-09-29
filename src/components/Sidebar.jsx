import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUser,
  FaGraduationCap,
  FaCalendarAlt,
  FaBriefcase,
  FaBell,
  FaUserFriends,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUser />
    },
    {
      name: "Alumni",
      path: "/alumni",
      icon: <FaGraduationCap />
    },
    {
      name: "Events",
      path: "/events",
      icon: <FaCalendarAlt />
    },
    {
      name: "Jobs",
      path: "/jobs",
      icon: <FaBriefcase />
    },

    // ⭐ NEW MENTORSHIP OPTION
    {
      name: "Mentorship",
      path: "/mentorship",
      icon: <FaUserFriends />
    },

    {
      name: "Notifications",
      path: "/notifications",
      icon: <FaBell />
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <FaGraduationCap />
        <span>Alumni Nexus</span>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">

        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </Link>
        ))}

        {/* LOGOUT */}
        <button
          className="sidebar-item logout-btn"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">
            <FaSignOutAlt />
          </span>

          <span>Logout</span>
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;