import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./StudentProfile.css";

function StudentProfile() {
const [user, setUser] = useState(() => {
  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser || savedUser === "undefined") {
      return {};
    }

    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Invalid user data in localStorage:", error);
    localStorage.removeItem("user");
    return {};
  }
});

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    department: "",
    passingYear: "",
    phone: "",
    skills: "",
    careerInterest: "",
    about: "",
    linkedinUrl: "",
    resumeUrl: "",
    resumeName: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  const [linkedinSaving, setLinkedinSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await API.get("/users/profile", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const latestUser = response.data.user;

      setUser(latestUser);

      localStorage.setItem(
        "user",
        JSON.stringify(latestUser)
      );

      setProfile({
        name: latestUser.name || "",
        email: latestUser.email || "",
        department: latestUser.department || "",
        passingYear: latestUser.passingYear || "",
        phone: latestUser.phone || "",

        skills: Array.isArray(latestUser.skills)
          ? latestUser.skills.join(", ")
          : latestUser.skills || "",

        careerInterest:
          latestUser.careerInterest || "",

        about: latestUser.about || "",

        linkedinUrl:
          latestUser.linkedinUrl || "",

        resumeUrl:
          latestUser.resumeUrl || "",

        resumeName:
          latestUser.resumeName || ""
      });
    } catch (error) {
      console.error(
        "PROFILE LOAD ERROR:",
        error.response?.data || error.message
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    loadProfile();
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const skillsArray = profile.skills
        ? profile.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [];

      const response = await API.put(
        "/users/profile",
        {
          name: profile.name,
          department: profile.department,
          passingYear: profile.passingYear,
          phone: profile.phone,
          skills: skillsArray,
          careerInterest: profile.careerInterest,
          about: profile.about
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setProfile({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        department: updatedUser.department || "",
        passingYear: updatedUser.passingYear || "",
        phone: updatedUser.phone || "",

        skills: Array.isArray(updatedUser.skills)
          ? updatedUser.skills.join(", ")
          : updatedUser.skills || "",

        careerInterest:
          updatedUser.careerInterest || "",

        about:
          updatedUser.about || "",

        linkedinUrl:
          updatedUser.linkedinUrl || "",

        resumeUrl:
          updatedUser.resumeUrl || "",

        resumeName:
          updatedUser.resumeName || ""
      });

      setEditMode(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file only.");

      e.target.value = "";

      setResumeFile(null);

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Resume must be less than 5 MB.");

      e.target.value = "";

      setResumeFile(null);

      return;
    }

    setResumeFile(file);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      alert("Please select your resume first.");
      return;
    }

    try {
      setResumeUploading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const formData = new FormData();

      formData.append("resume", resumeFile);

      const response = await API.post(
        "/jobs/profile/resume",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setProfile((prev) => ({
        ...prev,

        resumeUrl:
          updatedUser.resumeUrl || "",

        resumeName:
          updatedUser.resumeName || ""
      }));

      setResumeFile(null);

      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error(
        "RESUME UPLOAD ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to upload resume"
      );
    } finally {
      setResumeUploading(false);
    }
  };

  const handleLinkedInSave = async () => {
    const linkedinUrl =
      profile.linkedinUrl.trim();

    if (!linkedinUrl) {
      alert(
        "Please enter your LinkedIn profile URL."
      );
      return;
    }

    if (!linkedinUrl.includes("linkedin.com")) {
      alert(
        "Please enter a valid LinkedIn profile URL."
      );
      return;
    }

    try {
      setLinkedinSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await API.put(
        "/jobs/profile/linkedin",
        {
          linkedinUrl: linkedinUrl
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setProfile((prev) => ({
        ...prev,

        linkedinUrl:
          updatedUser.linkedinUrl || ""
      }));

      alert(
        "LinkedIn profile saved successfully!"
      );
    } catch (error) {
      console.error(
        "LINKEDIN SAVE ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to save LinkedIn profile"
      );
    } finally {
      setLinkedinSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    window.location.href = "/login";
  };

  return (
    <div className="student-profile-page">

      <aside className="student-sidebar">

        <div className="student-logo">
          🎓 Alumni Nexus
        </div>

        <div className="student-label">
          STUDENT PORTAL
        </div>

        <nav>

          <Link to="/student-dashboard">
            🏠 Dashboard
          </Link>

          <Link to="/alumni">
            👥 Alumni Network
          </Link>

          <Link to="/events">
            📅 Events
          </Link>

          <Link to="/jobs">
            💼 Jobs
          </Link>

          <Link
            to="/student-profile"
            className="active"
          >
            👨‍🎓 My Profile
          </Link>

          <Link to="/notifications">
            🔔 Notifications
          </Link>

          <Link to="/settings">
            ⚙️ Settings
          </Link>

        </nav>

        <button
          className="student-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      <main className="student-profile-main">

        <div className="profile-page-header">

          <div>

            <span className="profile-label">
              STUDENT PROFILE
            </span>

            <h1>
              My Profile 👨‍🎓
            </h1>

            <p>
              Manage your academic, personal
              and professional information.
            </p>

          </div>

          <div className="profile-actions">

            {!editMode ? (

              <button
                className="edit-profile-btn"
                onClick={handleEdit}
              >
                ✏️ Edit Profile
              </button>

            ) : (

              <>
                <button
                  className="cancel-profile-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  className="save-profile-btn"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : "💾 Save Changes"}
                </button>
              </>

            )}

          </div>

        </div>

        <section className="student-profile-card">

          <div className="profile-user-header">

            <div className="profile-avatar">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "S"}
            </div>

            <div>

              <h2>
                {profile.name || "Student"}
              </h2>

              <span className="student-badge">
                STUDENT
              </span>

              <p>
                {profile.department ||
                  "Department not updated"}
              </p>

            </div>

          </div>

          <div className="profile-divider"></div>

          <h2 className="section-title">
            🎓 Academic Information
          </h2>

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

                <div className="profile-value">
                  {profile.name || "Not updated"}
                </div>

              )}

            </div>

            <div className="profile-field">

              <label>
                Email
              </label>

              <div className="profile-value disabled-field">
                {profile.email || "Not updated"}
              </div>

            </div>

            <div className="profile-field">

              <label>
                Department
              </label>

              {editMode ? (

                <input
                  type="text"
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                />

              ) : (

                <div className="profile-value">
                  {profile.department ||
                    "Not updated"}
                </div>

              )}

            </div>

            <div className="profile-field">

              <label>
                Passing Year
              </label>

              {editMode ? (

                <input
                  type="number"
                  name="passingYear"
                  value={profile.passingYear}
                  onChange={handleChange}
                />

              ) : (

                <div className="profile-value">
                  {profile.passingYear ||
                    "Not updated"}
                </div>

              )}

            </div>

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
                />

              ) : (

                <div className="profile-value">
                  {profile.phone ||
                    "Not updated"}
                </div>

              )}

            </div>

            <div className="profile-field">

              <label>
                Skills
              </label>

              {editMode ? (

                <input
                  type="text"
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="React, Java, Python"
                />

              ) : (

                <div className="profile-value">
                  {profile.skills ||
                    "Not updated"}
                </div>

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
                  value={profile.careerInterest}
                  onChange={handleChange}
                  placeholder="Web Development"
                />

              ) : (

                <div className="profile-value">
                  {profile.careerInterest ||
                    "Not updated"}
                </div>

              )}

            </div>

          </div>

          <h2 className="section-title about-title">
            📝 About Me
          </h2>

          <div className="about-box">

            {editMode ? (

              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange}
                rows="5"
                placeholder="Tell something about yourself..."
              />

            ) : (

              <p>
                {profile.about ||
                  "You have not added information about yourself yet."}
              </p>

            )}

          </div>

          <h2 className="section-title professional-title">
            💼 Professional Information
          </h2>

          <div className="professional-section">

            <div className="professional-card">

              <div className="professional-icon">
                📄
              </div>

              <div className="professional-content">

                <h3>
                  Resume
                </h3>

                <p>
                  Upload your latest resume
                  for job applications.
                </p>

                {profile.resumeUrl ? (

                  <div className="resume-current">

                    <strong>
                      {profile.resumeName ||
                        "Resume uploaded"}
                    </strong>

                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Resume
                    </a>

                  </div>

                ) : (

                  <p className="missing">
                    No resume uploaded yet.
                  </p>

                )}

                <div className="resume-upload-row">

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeChange}
                  />

                  <button
                    className="upload-resume-btn"
                    onClick={handleResumeUpload}
                    disabled={
                      resumeUploading ||
                      !resumeFile
                    }
                  >
                    {resumeUploading
                      ? "Uploading..."
                      : "Upload Resume"}
                  </button>

                </div>

                <small>
                  PDF only • Maximum 5 MB
                </small>

              </div>

            </div>

            <div className="professional-card">

              <div className="professional-icon">
                🔗
              </div>

              <div className="professional-content">

                <h3>
                  LinkedIn Profile
                </h3>

                <p>
                  Add your LinkedIn profile
                  for job applications.
                </p>

                <input
                  type="url"
                  name="linkedinUrl"
                  value={profile.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className="linkedin-input"
                />

                <button
                  className="save-linkedin-btn"
                  onClick={handleLinkedInSave}
                  disabled={linkedinSaving}
                >
                  {linkedinSaving
                    ? "Saving..."
                    : "🔗 Save LinkedIn Profile"}
                </button>

                {profile.linkedinUrl && (

                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="linkedin-view"
                  >
                    View LinkedIn Profile →
                  </a>

                )}

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentProfile;