import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./StaffProfile.css";

function StaffProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    qualification: "",
    specialization: "",
    experience: "",
    dateOfJoining: "",
    institution: "",
    location: "",
    about: "",
    skills: "",
  });

  // ==================================================
  // LOAD STAFF PROFILE
  // ==================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/users/profile");

      const profile = response.data.user;

      setUser(profile);

      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        department: profile.department || "",
        designation: profile.designation || "",
        qualification: profile.qualification || "",
        specialization: profile.specialization || "",
        experience: profile.experience || "",
        dateOfJoining: profile.dateOfJoining || "",
        institution: profile.institution || "",
        location: profile.location || "",
        about: profile.about || "",
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(", ")
          : profile.skills || "",
      });

      // Keep localStorage user data updated
      localStorage.setItem(
        "user",
        JSON.stringify(profile)
      );

    } catch (err) {
      console.error(
        "LOAD STAFF PROFILE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load profile"
      );

      // Token missing / expired
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login");
      }

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        qualification: formData.qualification,
        specialization: formData.specialization,
        experience: formData.experience,
        dateOfJoining: formData.dateOfJoining,
        institution: formData.institution,
        location: formData.location,
        about: formData.about,

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      const response = await API.put(
        "/users/profile",
        payload
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        department: updatedUser.department || "",
        designation: updatedUser.designation || "",
        qualification:
          updatedUser.qualification || "",
        specialization:
          updatedUser.specialization || "",
        experience:
          updatedUser.experience || "",
        dateOfJoining:
          updatedUser.dateOfJoining || "",
        institution:
          updatedUser.institution || "",
        location:
          updatedUser.location || "",
        about: updatedUser.about || "",
        skills: Array.isArray(updatedUser.skills)
          ? updatedUser.skills.join(", ")
          : "",
      });

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setEditMode(false);

      setMessage(
        "Profile updated successfully!"
      );

    } catch (err) {
      console.error(
        "UPDATE STAFF PROFILE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update profile"
      );

    } finally {
      setSaving(false);
    }
  };


  // ==================================================
  // CANCEL EDIT
  // ==================================================

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      department: user.department || "",
      designation: user.designation || "",
      qualification:
        user.qualification || "",
      specialization:
        user.specialization || "",
      experience:
        user.experience || "",
      dateOfJoining:
        user.dateOfJoining || "",
      institution:
        user.institution || "",
      location:
        user.location || "",
      about:
        user.about || "",
      skills: Array.isArray(user.skills)
        ? user.skills.join(", ")
        : "",
    });

    setEditMode(false);
    setMessage("");
    setError("");
  };


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login");
  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="staff-profile-loading">
        <div className="staff-loader"></div>
        <p>Loading staff profile...</p>
      </div>
    );
  }


  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="staff-profile-page">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

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

        <Link
          to="/staff-profile"
          className="active"
        >
          👤 My Profile
        </Link>

        <button onClick={handleLogout}>
          🚪 Logout
        </button>

      </aside>


      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

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


        {/* ========================================
            SUCCESS / ERROR
        ======================================== */}

        {message && (
          <div className="staff-success-message">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="staff-error-message">
            ⚠ {error}
          </div>
        )}


        {/* ========================================
            PROFILE CARD
        ======================================== */}

        <section className="staff-profile-card">

          <div className="staff-profile-top">

            <div className="staff-avatar-large">
              {user.name
                ?.charAt(0)
                .toUpperCase() || "S"}
            </div>

            <div className="staff-profile-title">

              <h2>
                {user.name || "Staff"}
              </h2>

              <span className="staff-role">
                STAFF
              </span>

              <p>
                {user.designation ||
                  "Institution Staff"}
              </p>

            </div>

            {!editMode && (
              <button
                className="staff-edit-btn"
                onClick={() => {
                  setEditMode(true);
                  setMessage("");
                  setError("");
                }}
              >
                ✏️ Edit Profile
              </button>
            )}

          </div>


          {/* ======================================
              VIEW MODE
          ====================================== */}

          {!editMode ? (
            <div className="staff-info-grid">

              <div className="staff-info-item">
                <small>FULL NAME</small>
                <strong>
                  {user.name || "Not updated"}
                </strong>
              </div>

              <div className="staff-info-item">
                <small>EMAIL</small>
                <strong>
                  {user.email || "Not updated"}
                </strong>
              </div>

              <div className="staff-info-item">
                <small>STAFF ID</small>
                <strong>
                  {user.staffId || "Not assigned"}
                </strong>
              </div>

              <div className="staff-info-item">
                <small>PHONE NUMBER</small>
                <strong>
                  {user.phone || "Not updated"}
                </strong>
              </div>

              <div className="staff-info-item">
                <small>DEPARTMENT</small>
                <strong>
                  {user.department || "Not updated"}
                </strong>
              </div>

              <div className="staff-info-item">
                <small>DESIGNATION</small>
                <strong>
                  {user.designation || "Not updated"}
                </strong>
              </div>

              <div className="staff-info-item">
                <small>QUALIFICATION</small>
                <strong>
                  {user.qualification || "Not updated"}
                </strong>
              </div>

              <div className="staff-info-item">
                <small>SPECIALIZATION</small>
                <strong>
                  {user.specialization || "Not updated"}
                </strong>
              </div>

              <div className="staff-info-item">
                <small>EXPERIENCE</small>
                <strong>
                  {user.experience
                    ? `${user.experience} years`
                    : "Not updated"}
                </strong>
              </div>

              <div className="staff-info-item">
                <small>DATE OF JOINING</small>
                <strong>
                  {user.dateOfJoining ||
                    "Not updated"}
                </strong>
              </div>

              <div className="staff-info-item">
                <small>INSTITUTION / COLLEGE</small>
                <strong>
                  {user.institution ||
                    "Not updated"}
                </strong>
              </div>

              <div className="staff-info-item">
                <small>LOCATION</small>
                <strong>
                  {user.location ||
                    "Not updated"}
                </strong>
              </div>

              <div className="staff-info-item staff-full-width">
                <small>ABOUT / BIO</small>
                <strong>
                  {user.about ||
                    "No bio added yet."}
                </strong>
              </div>

              <div className="staff-info-item staff-full-width">
                <small>SKILLS</small>

                <div className="staff-skills">
                  {Array.isArray(user.skills) &&
                  user.skills.length > 0 ? (
                    user.skills.map(
                      (skill, index) => (
                        <span key={index}>
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <strong>
                      No skills added yet.
                    </strong>
                  )}
                </div>
              </div>

            </div>
          ) : (

            /* ====================================
               EDIT MODE
            ==================================== */

            <form
              className="staff-profile-form"
              onSubmit={handleSave}
            >

              <div className="staff-form-grid">

                <div className="staff-form-group">
                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>


                <div className="staff-form-group">
                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    disabled
                  />

                  <small>
                    Email cannot be changed.
                  </small>
                </div>


                <div className="staff-form-group">
                  <label>
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>


                <div className="staff-form-group">
                  <label>
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                  />
                </div>


                <div className="staff-form-group">
                  <label>
                    Designation
                  </label>

                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Assistant Professor"
                  />
                </div>


                <div className="staff-form-group">
                  <label>
                    Qualification / Degree
                  </label>

                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g. M.Sc., M.Phil., Ph.D."
                  />
                </div>


                <div className="staff-form-group">
                  <label>
                    Specialization
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Data Science"
                  />
                </div>


                <div className="staff-form-group">
                  <label>
                    Years of Experience
                  </label>

                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 8"
                  />
                </div>


                <div className="staff-form-group">
                  <label>
                    Date of Joining
                  </label>

                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleChange}
                  />
                </div>


                <div className="staff-form-group">
                  <label>
                    Institution / College
                  </label>

                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="Enter institution name"
                  />
                </div>


                <div className="staff-form-group">
                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Chennai, Tamil Nadu"
                  />
                </div>


                <div className="staff-form-group staff-full-width">
                  <label>
                    Skills
                  </label>

                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Java, Python, Database"
                  />

                  <small>
                    Separate skills using commas.
                  </small>
                </div>


                <div className="staff-form-group staff-full-width">
                  <label>
                    About / Bio
                  </label>

                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Write a short description about yourself..."
                  />
                </div>

              </div>


              {/* ==================================
                  FORM BUTTONS
              ================================== */}

              <div className="staff-form-actions">

                <button
                  type="button"
                  className="staff-cancel-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="staff-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "💾 Save Changes"}
                </button>

              </div>

            </form>
          )}

        </section>

      </main>

    </div>
  );
}

export default StaffProfile;