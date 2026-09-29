import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ===============================
// PAGES
// ===============================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";

import EventRegistration from "./pages/EventRegistration";

import Jobs from "./pages/Jobs";
import SearchAlumni from "./pages/SearchAlumni";
import Alumni from "./pages/Alumni";
import Events from "./pages/Events";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import StaffDashboard from "./pages/StaffDashboard";

import StudentProfile from "./pages/StudentProfile";
import AlumniProfile from "./pages/AlumniProfile";
import StaffProfile from "./pages/StaffProfile";

import StaffEvents from "./pages/StaffEvents";

import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";

import ProfessionalProfile from "./pages/ProfessionalProfile";
import MyApplications from "./pages/MyApplications";

import StaffJobs from "./pages/StaffJobs";

import AlumniManagement from "./pages/AlumniManagement";
import AlumniDetails from "./pages/AlumniDetails";
import EditAlumni from "./pages/EditAlumni";

import Mentorship from "./pages/Mentorship";


// =====================================================
// HOME LAYOUT
// =====================================================

function HomeLayout() {
  return (
    <>
      <Navbar />
      <Home />
      <Footer />
    </>
  );
}


// =====================================================
// GET CURRENT USER
// =====================================================

function getCurrentUser() {
  try {
    const userData = localStorage.getItem("user");

    if (!userData) {
      return null;
    }

    return JSON.parse(userData);
  } catch (error) {
    console.error("USER DATA ERROR:", error);
    return null;
  }
}


// =====================================================
// PROFILE REDIRECT
// =====================================================

function ProfileRedirect() {
  const user = getCurrentUser();

  const role =
    user?.role ||
    localStorage.getItem("role");

  if (role === "alumni") {
    return (
      <Navigate
        to="/alumni-profile"
        replace
      />
    );
  }

  if (role === "student") {
    return (
      <Navigate
        to="/student-profile"
        replace
      />
    );
  }

  if (role === "staff") {
    return (
      <Navigate
        to="/staff-profile"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/login"
      replace
    />
  );
}


// =====================================================
// DASHBOARD REDIRECT
// =====================================================

function DashboardRedirect() {
  const user = getCurrentUser();

  const role =
    user?.role ||
    localStorage.getItem("role");

  if (role === "alumni") {
    return (
      <Navigate
        to="/alumni-dashboard"
        replace
      />
    );
  }

  if (role === "student") {
    return (
      <Navigate
        to="/student-dashboard"
        replace
      />
    );
  }

  if (role === "staff") {
    return (
      <Navigate
        to="/staff-dashboard"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/login"
      replace
    />
  );
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={<HomeLayout />}
        />


        {/* =================================================
            AUTH
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ⭐ FORGOT PASSWORD */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />


        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={<DashboardRedirect />}
        />


        {/* =================================================
            STUDENT
        ================================================= */}

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student-profile"
          element={<StudentProfile />}
        />


        {/* =================================================
            ALUMNI
        ================================================= */}

        <Route
          path="/alumni-dashboard"
          element={<AlumniDashboard />}
        />

        <Route
          path="/alumni-profile"
          element={<AlumniProfile />}
        />


        {/* =================================================
            STAFF
        ================================================= */}

        <Route
          path="/staff-dashboard"
          element={<StaffDashboard />}
        />

        <Route
          path="/staff-profile"
          element={<StaffProfile />}
        />

        <Route
          path="/staff-events"
          element={<StaffEvents />}
        />

        <Route
          path="/staff-jobs"
          element={<StaffJobs />}
        />


        {/* =================================================
            STAFF ALUMNI MANAGEMENT
        ================================================= */}

        <Route
          path="/staff-alumni"
          element={<AlumniManagement />}
        />

        <Route
          path="/staff/alumni-management"
          element={<AlumniManagement />}
        />

        <Route
          path="/staff-alumni/:id"
          element={<AlumniDetails />}
        />

        <Route
          path="/staff-alumni/:id/edit"
          element={<EditAlumni />}
        />


        {/* =================================================
            EVENTS
        ================================================= */}

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/event-registration/:id"
          element={<EventRegistration />}
        />


        {/* =================================================
            JOBS
        ================================================= */}

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/job-details/:id"
          element={<JobDetails />}
        />

        <Route
          path="/apply-job/:id"
          element={<ApplyJob />}
        />

        <Route
          path="/my-applications"
          element={<MyApplications />}
        />


        {/* =================================================
            ALUMNI SEARCH
        ================================================= */}

        <Route
          path="/search-alumni"
          element={<SearchAlumni />}
        />

        <Route
          path="/alumni"
          element={<Alumni />}
        />


        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <Route
          path="/notifications"
          element={<Notifications />}
        />


        {/* =================================================
            SETTINGS
        ================================================= */}

        <Route
          path="/settings"
          element={<Settings />}
        />


        {/* =================================================
            PROFESSIONAL PROFILE
        ================================================= */}

        <Route
          path="/professional-profile"
          element={<ProfessionalProfile />}
        />


        {/* =================================================
            PROFILE
        ================================================= */}

        <Route
          path="/profile"
          element={<ProfileRedirect />}
        />


        {/* =================================================
            OLD DASHBOARD
        ================================================= */}

        <Route
          path="/old-dashboard"
          element={<Dashboard />}
        />


        {/* =================================================
            MENTORSHIP
        ================================================= */}

        <Route
          path="/mentorship"
          element={<Mentorship />}
        />


        {/* =================================================
            UNKNOWN ROUTE
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;