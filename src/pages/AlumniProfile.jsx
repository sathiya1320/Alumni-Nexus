import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaBriefcase,
  FaUser,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaFilePdf,
  FaUpload,
  FaEye,
  FaLinkedin,
} from "react-icons/fa";

import API from "../services/api";
import "./AlumniProfile.css";

function AlumniProfile() {
  const navigate = useNavigate();

  // ==========================================
  // USER DATA
  // ==========================================

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  });

  // ==========================================
  // PROFILE DATA
  // ==========================================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    passingYear: "",
    company: "",
    designation: "",
    location: "",
    experience: "",
    skills: "",
    about: "",
    careerInterest: "",
    linkedinUrl: "",
    resumeUrl: "",
    resumeName: "",
    resumeUploadedAt: null,
  });

  // ==========================================
  // EDIT MODE
  // ==========================================

  const [editMode, setEditMode] = useState(false);

  const [saving, setSaving] = useState(false);

  // ==========================================
  // RESUME
  // ==========================================

  const [selectedResume, setSelectedResume] = useState(null);

  const [resumeUploading, setResumeUploading] = useState(false);

  // ==========================================
  // LOAD USER DATA
  // ==========================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await API.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.user || response.data;

      setUser(data);

      localStorage.setItem("user", JSON.stringify(data));

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        department: data.department || "",
        passingYear: data.passingYear || "",
        company: data.company || "",
        designation: data.designation || "",
        location: data.location || "",
        experience: data.experience || "",

        // MongoDB-la skills array varum
        // Example: ["React", "Node.js"]
        // UI-la "React, Node.js" ah show pannuvom
        skills: Array.isArray(data.skills)
          ? data.skills.join(", ")
          : data.skills || "",

        about: data.about || "",
        careerInterest: data.careerInterest || "",
        linkedinUrl: data.linkedinUrl || "",
        resumeUrl: data.resumeUrl || "",
        resumeName: data.resumeName || "",
        resumeUploadedAt: data.resumeUploadedAt || null,
      });
    } catch (error) {
      console.error("PROFILE LOAD ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Skills string -> array
      const skillsArray = profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const response = await API.put(
        "/users/profile",
        {
          name: profile.name,
          phone: profile.phone,
          location: profile.location,
          about: profile.about,
          skills: skillsArray,
          company: profile.company,
          designation: profile.designation,
          experience: profile.experience,
          careerInterest: profile.careerInterest,
          linkedinUrl: profile.linkedinUrl,

          department: profile.department,
          passingYear: profile.passingYear,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser =
        response.data.user || response.data;

      // Resume information local state-la preserve pannuvom
      const finalUser = {
        ...updatedUser,

        resumeUrl:
          updatedUser.resumeUrl || profile.resumeUrl,

        resumeName:
          updatedUser.resumeName || profile.resumeName,

        resumeUploadedAt:
          updatedUser.resumeUploadedAt ||
          profile.resumeUploadedAt,
      };

      setUser(finalUser);

      localStorage.setItem(
        "user",
        JSON.stringify(finalUser)
      );

      setProfile((prev) => ({
        ...prev,

        name: finalUser.name || "",
        email: finalUser.email || "",
        phone: finalUser.phone || "",
        department: finalUser.department || "",
        passingYear: finalUser.passingYear || "",
        company: finalUser.company || "",
        designation: finalUser.designation || "",
        location: finalUser.location || "",
        experience: finalUser.experience || "",

        skills: Array.isArray(finalUser.skills)
          ? finalUser.skills.join(", ")
          : finalUser.skills || "",

        about: finalUser.about || "",
        careerInterest:
          finalUser.careerInterest || "",

        linkedinUrl:
          finalUser.linkedinUrl || "",

        resumeUrl:
          finalUser.resumeUrl || "",

        resumeName:
          finalUser.resumeName || "",

        resumeUploadedAt:
          finalUser.resumeUploadedAt || null,
      }));

      setEditMode(false);

      alert("Profile updated successfully! ✅");
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    loadProfile();

    setSelectedResume(null);

    setEditMode(false);
  };

  // ==========================================
  // SELECT RESUME
  // ==========================================

  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only PDF, DOC and DOCX files are allowed."
      );

      e.target.value = "";

      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Resume file size must be less than 5 MB."
      );

      e.target.value = "";

      return;
    }

    setSelectedResume(file);
  };

  // ==========================================
  // UPLOAD RESUME
  // ==========================================

  const handleResumeUpload = async () => {
    if (!selectedResume) {
      alert("Please select a resume file.");
      return;
    }

    try {
      setResumeUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append(
        "resume",
        selectedResume
      );

      const response = await API.post(
        "/jobs/profile/resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const uploadedResume =
        response.data.resume;

      // Update profile page
      setProfile((prev) => ({
        ...prev,

        resumeUrl:
          uploadedResume.url,

        resumeName:
          uploadedResume.name,

        resumeUploadedAt:
          uploadedResume.uploadedAt,
      }));

      // Update localStorage user
      const updatedUser = {
        ...user,

        resumeUrl:
          uploadedResume.url,

        resumeName:
          uploadedResume.name,

        resumeUploadedAt:
          uploadedResume.uploadedAt,
      };

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // Clear selected file
      setSelectedResume(null);

      alert(
        "Resume uploaded successfully! ✅"
      );
    } catch (error) {
      console.error(
        "RESUME UPLOAD ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Resume upload failed"
      );
    } finally {
      setResumeUploading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/");
  };

  // ==========================================
  // VIEW RESUME
  // ==========================================

  const handleViewResume = () => {
    if (!profile.resumeUrl) {
      alert("No resume uploaded.");
      return;
    }

    window.open(
      profile.resumeUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================
  // SIDEBAR
  // ==========================================

  return (
    <div className="alumni-profile-page">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="alumni-sidebar">

        <div className="sidebar-logo">
          <FaUserGraduate />

          <span>
            Alumni Nexus
          </span>
        </div>

        <div className="sidebar-menu">

          <button
            onClick={() =>
              navigate("/alumni-dashboard")
            }
          >
            <FaHome />
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/alumni")
            }
          >
            <FaUsers />
            Alumni Network
          </button>

          <button
            onClick={() =>
              navigate("/events")
            }
          >
            <FaCalendarAlt />
            Events
          </button>

          <button
            onClick={() =>
              navigate("/jobs")
            }
          >
            <FaBriefcase />
            Jobs
          </button>

          <button
            className="active"
            onClick={() =>
              navigate("/alumni-profile")
            }
          >
            <FaUser />
            Profile
          </button>

          <button
            onClick={() =>
              navigate("/notifications")
            }
          >
            <FaBell />
            Notifications
          </button>

          <button
            onClick={() =>
              navigate("/settings")
            }
          >
            <FaCog />
            Settings
          </button>

        </div>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </aside>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="alumni-profile-main">

        {/* HEADER */}

        <div className="profile-topbar">

          <div>
            <h1>
              My Profile
            </h1>

            <p>
              Manage your personal and
              professional information
            </p>
          </div>

          <div className="profile-user">

            <div className="profile-avatar">
              {profile.name
                ? profile.name
                    .charAt(0)
                    .toUpperCase()
                : "A"}
            </div>

            <div>
              <strong>
                {profile.name ||
                  "Alumni"}
              </strong>

              <span>
                Alumni
              </span>
            </div>

          </div>

        </div>

        {/* PROFILE CARD */}

        <div className="profile-card">

          {/* =================================
              PROFILE HEADER
          ================================= */}

          <div className="profile-card-header">

            <div className="big-avatar">
              {profile.name
                ? profile.name
                    .charAt(0)
                    .toUpperCase()
                : "A"}
            </div>

            <div className="profile-heading">

              <h2>
                {profile.name ||
                  "Alumni User"}
              </h2>

              <p>
                {profile.designation ||
                  "Alumni"}
              </p>

              <span>
                {profile.company ||
                  "Professional"}
              </span>

            </div>

            {!editMode ? (
              <button
                className="edit-profile-btn"
                onClick={() =>
                  setEditMode(true)
                }
              >
                <FaEdit />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">

                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <FaSave />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>
            )}

          </div>

          {/* =================================
              ACADEMIC INFORMATION
          ================================= */}

          <section className="profile-section">

            <h3>
              Academic Information
            </h3>

            <div className="profile-grid">

              <div className="profile-field">
                <label>
                  Full Name
                </label>

                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                ) : (
                  <p>
                    {profile.name ||
                      "Not provided"}
                  </p>
                )}
              </div>

              <div className="profile-field">
                <label>
                  Email
                </label>

                <p>
                  {profile.email ||
                    "Not provided"}
                </p>
              </div>

              <div className="profile-field">
                <label>
                  Department
                </label>

                <p>
                  {profile.department ||
                    "B.Sc Computer Science"}
                </p>
              </div>

              <div className="profile-field">
                <label>
                  Passing Year
                </label>

                <p>
                  {profile.passingYear ||
                    "Not provided"}
                </p>
              </div>

            </div>

          </section>

          {/* =================================
              CONTACT INFORMATION
          ================================= */}

          <section className="profile-section">

            <h3>
              Contact Information
            </h3>

            <div className="profile-grid">

              <div className="profile-field">
                <label>
                  Phone
                </label>

                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p>
                    {profile.phone ||
                      "Not provided"}
                  </p>
                )}
              </div>

              <div className="profile-field">
                <label>
                  Location
                </label>

                {editMode ? (
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                  />
                ) : (
                  <p>
                    {profile.location ||
                      "Not provided"}
                  </p>
                )}
              </div>

            </div>

          </section>

          {/* =================================
              PROFESSIONAL INFORMATION
          ================================= */}

          <section className="profile-section">

            <h3>
              Professional Information
            </h3>

            <div className="profile-grid">

              <div className="profile-field">
                <label>
                  Company
                </label>

                {editMode ? (
                  <input
                    type="text"
                    name="company"
                    value={profile.company}
                    onChange={handleChange}
                    placeholder="Enter company"
                  />
                ) : (
                  <p>
                    {profile.company ||
                      "Not provided"}
                  </p>
                )}
              </div>

              <div className="profile-field">
                <label>
                  Designation
                </label>

                {editMode ? (
                  <input
                    type="text"
                    name="designation"
                    value={profile.designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                  />
                ) : (
                  <p>
                    {profile.designation ||
                      "Not provided"}
                  </p>
                )}
              </div>

              <div className="profile-field">
                <label>
                  Experience
                </label>

                {editMode ? (
                  <input
                    type="text"
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    placeholder="Example: 2 years"
                  />
                ) : (
                  <p>
                    {profile.experience ||
                      "Not provided"}
                  </p>
                )}
              </div>

              <div className="profile-field">
                <label>
                  Career Interest
                </label>

                {editMode ? (
                  <input
                    type="text"
                    name="careerInterest"
                    value={
                      profile.careerInterest
                    }
                    onChange={handleChange}
                    placeholder="Example: Full Stack Development"
                  />
                ) : (
                  <p>
                    {profile.careerInterest ||
                      "Not provided"}
                  </p>
                )}
              </div>

            </div>

          </section>

          {/* =================================
              SKILLS
          ================================= */}

          <section className="profile-section">

            <h3>
              Skills
            </h3>

            {editMode ? (
              <input
                type="text"
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                placeholder="Example: React, Node.js, MongoDB"
                className="full-input"
              />
            ) : (
              <div className="skills-container">

                {profile.skills ? (
                  profile.skills
                    .split(",")
                    .map((skill, index) => (
                      <span
                        className="skill-tag"
                        key={index}
                      >
                        {skill.trim()}
                      </span>
                    ))
                ) : (
                  <p>
                    No skills added
                  </p>
                )}

              </div>
            )}

          </section>

          {/* =================================
              ABOUT
          ================================= */}

          <section className="profile-section">

            <h3>
              About Me
            </h3>

            {editMode ? (
              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange}
                placeholder="Tell something about yourself..."
                rows="5"
                className="full-textarea"
              />
            ) : (
              <p className="about-text">
                {profile.about ||
                  "No information added yet."}
              </p>
            )}

          </section>

          {/* =================================
              LINKEDIN
          ================================= */}

          <section className="profile-section">

            <h3>
              <FaLinkedin />
              LinkedIn Profile
            </h3>

            {editMode ? (
              <input
                type="text"
                name="linkedinUrl"
                value={profile.linkedinUrl}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/in/your-profile"
                className="full-input"
              />
            ) : (
              <>
                {profile.linkedinUrl ? (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin-link"
                  >
                    <FaLinkedin />
                    View LinkedIn Profile
                  </a>
                ) : (
                  <p>
                    LinkedIn profile not added
                  </p>
                )}
              </>
            )}

          </section>

          {/* =================================
              RESUME
          ================================= */}

          <section className="profile-section resume-section">

            <h3>
              <FaFilePdf />
              Resume
            </h3>

            {editMode ? (
              <div className="resume-upload-box">

                <div className="resume-upload-info">

                  <FaFilePdf className="resume-icon" />

                  <div>

                    <strong>
                      Upload your resume
                    </strong>

                    <p>
                      PDF, DOC or DOCX
                      <br />
                      Maximum size: 5 MB
                    </p>

                  </div>

                </div>

                <input
                  type="file"
                  id="resumeInput"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                />

                {selectedResume && (
                  <div className="selected-file">

                    <FaFilePdf />

                    <span>
                      {selectedResume.name}
                    </span>

                  </div>
                )}

                <button
                  type="button"
                  className="upload-resume-btn"
                  onClick={handleResumeUpload}
                  disabled={
                    !selectedResume ||
                    resumeUploading
                  }
                >
                  <FaUpload />

                  {resumeUploading
                    ? "Uploading..."
                    : "Upload Resume"}
                </button>

                {profile.resumeName && (
                  <p className="existing-resume">
                    Current resume:{" "}
                    <strong>
                      {profile.resumeName}
                    </strong>
                  </p>
                )}

              </div>
            ) : (
              <div className="resume-display-box">

                {profile.resumeUrl ? (
                  <>
                    <div className="resume-file">

                      <FaFilePdf />

                      <div>

                        <strong>
                          {profile.resumeName ||
                            "My Resume"}
                        </strong>

                        {profile.resumeUploadedAt && (
                          <small>
                            Uploaded:{" "}
                            {new Date(
                              profile.resumeUploadedAt
                            ).toLocaleDateString()}
                          </small>
                        )}

                      </div>

                    </div>

                    <button
                      type="button"
                      className="view-resume-btn"
                      onClick={handleViewResume}
                    >
                      <FaEye />
                      View Resume
                    </button>
                  </>
                ) : (
                  <div className="no-resume">

                    <FaFilePdf />

                    <p>
                      No resume uploaded yet.
                    </p>

                    <span>
                      Click "Edit Profile" to
                      upload your resume.
                    </span>

                  </div>
                )}

              </div>
            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default AlumniProfile;