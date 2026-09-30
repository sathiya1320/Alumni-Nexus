import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import "./ApplicantProfile.css";
const API = "https://alumni-nexus-cklf.onrender.com/api";


function ApplicantProfile() {

  const navigate = useNavigate();

  const { applicationId } =
    useParams();


  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================
  // FETCH APPLICANT
  // =========================================

  useEffect(() => {

    fetchApplicant();

  }, [applicationId]);


  const fetchApplicant = async () => {

    try {

      setLoading(true);

      setError("");


      const token =
        localStorage.getItem("token");


      if (!token) {

        setError(
          "Please login again."
        );

        return;
      }


      const response =
        await fetch(
          `${API}/jobs/applications/${applicationId}`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.message ||
          "Unable to load applicant"
        );
      }


      setApplication(
        data.application
      );

    } catch (err) {

      console.error(
        "APPLICANT PROFILE ERROR:",
        err
      );

      setError(
        err.message ||
        "Unable to load applicant"
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="applicant-profile-page">

        <div className="applicant-loading">

          <div className="loading-spinner">
            ⏳
          </div>

          <h2>
            Loading Applicant...
          </h2>

        </div>

      </div>
    );
  }


  // =========================================
  // ERROR
  // =========================================

  if (error || !application) {

    return (
      <div className="applicant-profile-page">

        <div className="applicant-error">

          <div>
            ⚠️
          </div>

          <h2>
            Applicant Not Found
          </h2>

          <p>
            {error ||
              "Applicant details are unavailable."}
          </p>

          <button
            onClick={() =>
              navigate("/staff-jobs")
            }
          >
            ← Back to Job Management
          </button>

        </div>

      </div>
    );
  }


  const applicant =
    application.applicant || {};

  const job =
    application.job || {};


  return (

    <div className="applicant-profile-page">


      {/* =====================================
          TOP BAR
      ===================================== */}

      <div className="applicant-topbar">

        <button
          onClick={() =>
            navigate("/staff-jobs")
          }
        >
          ← Back to Applications
        </button>

      </div>


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="applicant-header">

        <div className="applicant-avatar">

          {applicant.name
            ?.charAt(0)
            ?.toUpperCase() || "A"}

        </div>


        <div>

          <p className="profile-label">
            JOB APPLICANT
          </p>

          <h1>
            {applicant.name ||
              "Unknown Applicant"}
          </h1>

          <p className="applicant-role">

            {applicant.role === "alumni"
              ? "Alumni"
              : "Student"}

          </p>

        </div>

      </div>


      {/* =====================================
          MAIN GRID
      ===================================== */}

      <div className="applicant-grid">


        {/* ===================================
            PERSONAL INFORMATION
        =================================== */}

        <div className="applicant-card">

          <h2>
            Personal Information
          </h2>


          <div className="detail-list">

            <div className="detail-item">

              <span>
                Full Name
              </span>

              <strong>
                {applicant.name ||
                  "Not provided"}
              </strong>

            </div>


            <div className="detail-item">

              <span>
                Email
              </span>

              <strong>
                {applicant.email ||
                  "Not provided"}
              </strong>

            </div>


            <div className="detail-item">

              <span>
                Phone
              </span>

              <strong>
                {applicant.phone ||
                  "Not provided"}
              </strong>

            </div>


            <div className="detail-item">

              <span>
                Location
              </span>

              <strong>
                {applicant.location ||
                  "Not provided"}
              </strong>

            </div>

          </div>

        </div>


        {/* ===================================
            EDUCATION
        =================================== */}

        <div className="applicant-card">

          <h2>
            Education
          </h2>


          <div className="detail-list">

            <div className="detail-item">

              <span>
                Department
              </span>

              <strong>
                {applicant.department ||
                  "B.Sc Computer Science"}
              </strong>

            </div>


            <div className="detail-item">

              <span>
                Passing Year
              </span>

              <strong>
                {applicant.passingYear ||
                  "Not provided"}
              </strong>

            </div>

          </div>

        </div>


        {/* ===================================
            PROFESSIONAL
        =================================== */}

        <div className="applicant-card">

          <h2>
            Professional Information
          </h2>


          <div className="detail-list">

            <div className="detail-item">

              <span>
                Company
              </span>

              <strong>
                {applicant.company ||
                  "Not provided"}
              </strong>

            </div>


            <div className="detail-item">

              <span>
                Designation
              </span>

              <strong>
                {applicant.designation ||
                  "Not provided"}
              </strong>

            </div>


            <div className="detail-item">

              <span>
                Experience
              </span>

              <strong>
                {applicant.experience ||
                  "Not provided"}
              </strong>

            </div>


            <div className="detail-item">

              <span>
                Career Interest
              </span>

              <strong>
                {applicant.careerInterest ||
                  "Not provided"}
              </strong>

            </div>

          </div>

        </div>


        {/* ===================================
            SKILLS
        =================================== */}

        <div className="applicant-card">

          <h2>
            Skills
          </h2>


          {Array.isArray(
            applicant.skills
          ) &&
          applicant.skills.length > 0 ? (

            <div className="skills-list">

              {applicant.skills.map(
                (skill, index) => (

                  <span
                    key={index}
                    className="skill-tag"
                  >
                    {skill}
                  </span>

                )
              )}

            </div>

          ) : (

            <p className="not-provided">
              No skills provided.
            </p>

          )}

        </div>


        {/* ===================================
            ABOUT
        =================================== */}

        <div className="applicant-card full-width">

          <h2>
            About Applicant
          </h2>

          <p className="about-text">

            {applicant.about ||
              "No information provided."}

          </p>

        </div>


        {/* ===================================
            SOCIAL / RESUME
        =================================== */}

        <div className="applicant-card">

          <h2>
            Documents & Links
          </h2>


          <div className="profile-links">

            {applicant.linkedinUrl ? (

              <a
                href={
                  applicant.linkedinUrl
                }
                target="_blank"
                rel="noreferrer"
              >
                🔗 View LinkedIn Profile
              </a>

            ) : (

              <span>
                🔗 LinkedIn not provided
              </span>

            )}


            {application.resumeUrl ? (

              <a
                href={
                  application.resumeUrl
                }
                target="_blank"
                rel="noreferrer"
              >
                📄 View / Download Resume
              </a>

            ) : applicant.resumeUrl ? (

              <a
                href={
                  applicant.resumeUrl
                }
                target="_blank"
                rel="noreferrer"
              >
                📄 View / Download Resume
              </a>

            ) : (

              <span>
                📄 Resume not provided
              </span>

            )}

          </div>

        </div>


        {/* ===================================
            JOB APPLICATION
        =================================== */}

        <div className="applicant-card">

          <h2>
            Job Application
          </h2>


          <div className="detail-list">

            <div className="detail-item">

              <span>
                Job Title
              </span>

              <strong>
                {job.title ||
                  "Not available"}
              </strong>

            </div>


            <div className="detail-item">

              <span>
                Company
              </span>

              <strong>
                {job.company ||
                  "Not available"}
              </strong>

            </div>


            <div className="detail-item">

              <span>
                Applied On
              </span>

              <strong>
                {application.appliedAt
                  ? new Date(
                      application.appliedAt
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "Not available"}
              </strong>

            </div>


            <div className="detail-item">

              <span>
                Application Status
              </span>

              <strong
                className={`application-status ${application.status
                  ?.toLowerCase()
                  .replaceAll(
                    " ",
                    "-"
                  )}`}
              >
                {application.status ||
                  "Applied"}
              </strong>

            </div>

          </div>

        </div>


        {/* ===================================
            COVER MESSAGE
        =================================== */}

        <div className="applicant-card full-width">

          <h2>
            Cover Message
          </h2>

          <div className="cover-message">

            {application.coverMessage
              ? application.coverMessage
              : "No cover message provided."}

          </div>

        </div>

      </div>


      {/* =====================================
          FOOTER ACTION
      ===================================== */}

      <div className="applicant-bottom-actions">

        <button
          onClick={() =>
            navigate("/staff-jobs")
          }
        >
          ← Back to Job Management
        </button>

      </div>

    </div>
  );
}


export default ApplicantProfile;