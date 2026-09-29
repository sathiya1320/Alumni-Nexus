import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaLinkedin,
  FaFileAlt,
  FaCalendarAlt,
  FaEdit,
  FaUser,
  FaClock,
} from "react-icons/fa";

import API from "../services/api";
import "./AlumniDetails.css";

function AlumniDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* =====================================================
     STAFF ACCESS CHECK
  ===================================================== */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== "staff") {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }, [navigate]);

  /* =====================================================
     FETCH ALUMNI DETAILS
  ===================================================== */

  useEffect(() => {
    const fetchAlumniDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAlumni(response.data.user);
      } catch (err) {
        console.error("FETCH ALUMNI DETAILS ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load alumni details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchAlumniDetails();
    }
  }, [id, token]);

  /* =====================================================
     INITIALS
  ===================================================== */

  const getInitials = (name) => {
    if (!name) return "A";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  /* =====================================================
     BACK
  ===================================================== */

  const handleBack = () => {
    navigate("/staff-alumni");
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = () => {
    navigate(`/staff-alumni/${id}/edit`);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="alumni-details-page">
        <div className="details-loading">
          <div className="details-spinner"></div>

          <h3>Loading Alumni Details...</h3>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !alumni) {
    return (
      <div className="alumni-details-page">

        <div className="details-error">

          <div className="error-icon">
            <FaUserGraduate />
          </div>

          <h2>Alumni Not Found</h2>

          <p>
            {error ||
              "The requested alumni record could not be found."}
          </p>

          <button
            className="back-list-button"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Back to Alumni List
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="alumni-details-page">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="details-topbar">

        <button
          className="back-button"
          onClick={handleBack}
        >
          <FaArrowLeft />
          <span>Back to Alumni</span>
        </button>

        <button
          className="top-edit-button"
          onClick={handleEdit}
        >
          <FaEdit />
          Edit Profile
        </button>

      </div>

      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <div className="profile-header-card">

        <div className="profile-header-left">

          <div className="large-profile-avatar">
            {getInitials(alumni.name)}
          </div>

          <div className="profile-header-info">

            <h1>
              {alumni.name || "Unnamed Alumni"}
            </h1>

            <p className="profile-designation">
              {alumni.designation ||
                "Professional"}
            </p>

            <div className="profile-meta">

              <span>
                <FaGraduationCap />

                {alumni.department ||
                  "B.Sc Computer Science"}
              </span>

              {alumni.passingYear && (
                <span>
                  <FaCalendarAlt />

                  Batch {alumni.passingYear}
                </span>
              )}

              {alumni.company && (
                <span>
                  <FaBuilding />

                  {alumni.company}
                </span>
              )}

            </div>

          </div>

        </div>

        <div className="profile-status">

          <span className="status-dot"></span>

          <span>Alumni</span>

        </div>

      </div>

      {/* =================================================
          CONTENT GRID
      ================================================= */}

      <div className="details-content-grid">

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <div className="details-card">

          <div className="details-card-header">

            <div className="card-icon">
              <FaUser />
            </div>

            <div>
              <h2>Personal Information</h2>

              <p>
                Basic contact and personal details
              </p>
            </div>

          </div>

          <div className="details-grid">

            <div className="detail-item">

              <label>
                <FaUser />
                Full Name
              </label>

              <strong>
                {alumni.name || "Not provided"}
              </strong>

            </div>

            <div className="detail-item">

              <label>
                <FaEnvelope />
                Email Address
              </label>

              <strong>
                {alumni.email || "Not provided"}
              </strong>

            </div>

            <div className="detail-item">

              <label>
                <FaPhone />
                Phone Number
              </label>

              <strong>
                {alumni.phone || "Not provided"}
              </strong>

            </div>

            <div className="detail-item">

              <label>
                <FaMapMarkerAlt />
                Location
              </label>

              <strong>
                {alumni.location ||
                  "Not provided"}
              </strong>

            </div>

          </div>

        </div>

        {/* =================================================
            EDUCATION
        ================================================= */}

        <div className="details-card">

          <div className="details-card-header">

            <div className="card-icon">
              <FaGraduationCap />
            </div>

            <div>
              <h2>Education</h2>

              <p>
                Academic information
              </p>
            </div>

          </div>

          <div className="details-grid">

            <div className="detail-item">

              <label>
                <FaGraduationCap />
                Department
              </label>

              <strong>
                {alumni.department ||
                  "B.Sc Computer Science"}
              </strong>

            </div>

            <div className="detail-item">

              <label>
                <FaCalendarAlt />
                Passing Year
              </label>

              <strong>
                {alumni.passingYear ||
                  "Not provided"}
              </strong>

            </div>

          </div>

        </div>

        {/* =================================================
            PROFESSIONAL INFORMATION
        ================================================= */}

        <div className="details-card full-width-card">

          <div className="details-card-header">

            <div className="card-icon">
              <FaBriefcase />
            </div>

            <div>
              <h2>Professional Information</h2>

              <p>
                Current career and professional details
              </p>
            </div>

          </div>

          <div className="details-grid four-columns">

            <div className="detail-item">

              <label>
                <FaBuilding />
                Company
              </label>

              <strong>
                {alumni.company ||
                  "Not provided"}
              </strong>

            </div>

            <div className="detail-item">

              <label>
                <FaBriefcase />
                Designation
              </label>

              <strong>
                {alumni.designation ||
                  "Not provided"}
              </strong>

            </div>

            <div className="detail-item">

              <label>
                <FaClock />
                Experience
              </label>

              <strong>
                {alumni.experience ||
                  "Not provided"}
              </strong>

            </div>

            <div className="detail-item">

              <label>
                Career Interest
              </label>

              <strong>
                {alumni.careerInterest ||
                  "Not provided"}
              </strong>

            </div>

          </div>

        </div>

        {/* =================================================
            ABOUT
        ================================================= */}

        <div className="details-card full-width-card">

          <div className="details-card-header">

            <div className="card-icon">
              <FaUserGraduate />
            </div>

            <div>
              <h2>About Alumni</h2>

              <p>
                Professional introduction
              </p>
            </div>

          </div>

          <div className="about-content">

            <p>
              {alumni.about ||
                "No introduction has been added by this alumni yet."}
            </p>

          </div>

        </div>

        {/* =================================================
            SKILLS
        ================================================= */}

        <div className="details-card">

          <div className="details-card-header">

            <div className="card-icon">
              <FaBriefcase />
            </div>

            <div>
              <h2>Skills</h2>

              <p>
                Professional skills
              </p>
            </div>

          </div>

          <div className="skills-container">

            {alumni.skills &&
            alumni.skills.length > 0 ? (
              alumni.skills.map((skill, index) => (
                <span
                  className="skill-badge"
                  key={index}
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="not-available">
                No skills added.
              </p>
            )}

          </div>

        </div>

        {/* =================================================
            PROFESSIONAL LINKS
        ================================================= */}

        <div className="details-card">

          <div className="details-card-header">

            <div className="card-icon">
              <FaLinkedin />
            </div>

            <div>
              <h2>Professional Links</h2>

              <p>
                Online professional resources
              </p>
            </div>

          </div>

          <div className="professional-links">

            {alumni.linkedinUrl ? (
              <a
                href={alumni.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="linkedin-link"
              >
                <FaLinkedin />

                <span>
                  View LinkedIn Profile
                </span>
              </a>
            ) : (
              <p className="not-available">
                LinkedIn profile not added.
              </p>
            )}

            {alumni.resumeUrl ? (
              <a
                href={alumni.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="resume-link"
              >
                <FaFileAlt />

                <span>
                  {alumni.resumeName ||
                    "View Resume"}
                </span>
              </a>
            ) : (
              <p className="not-available">
                Resume not uploaded.
              </p>
            )}

          </div>

        </div>

        {/* =================================================
            RECORD INFORMATION
        ================================================= */}

        <div className="details-card full-width-card">

          <div className="record-info">

            <div>
              <label>Record Created</label>

              <strong>
                {alumni.createdAt
                  ? new Date(
                      alumni.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "Not available"}
              </strong>
            </div>

            <div>
              <label>Last Updated</label>

              <strong>
                {alumni.updatedAt
                  ? new Date(
                      alumni.updatedAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "Not available"}
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AlumniDetails;