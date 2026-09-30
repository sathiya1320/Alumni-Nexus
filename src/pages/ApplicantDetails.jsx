import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./ApplicantDetails.css";

const API = "https://alumni-nexus-cklf.onrender.com/api";

function ApplicantDetails() {
  const { applicationId } = useParams();

  const navigate = useNavigate();

  // =====================================================
  // TOKEN
  // =====================================================

  const token = localStorage.getItem("token");

  // =====================================================
  // USER
  // =====================================================

  let user = null;

  try {
    const userData =
      localStorage.getItem("user");

    user = userData
      ? JSON.parse(userData)
      : null;
  } catch (error) {
    console.error(
      "USER DATA ERROR:",
      error
    );
  }

  // =====================================================
  // STATES
  // =====================================================

  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // CHECK STAFF + FETCH
  // =====================================================

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    if (user?.role !== "staff") {
      navigate("/dashboard", {
        replace: true,
      });

      return;
    }

    if (!applicationId) {
      setError(
        "Application ID is missing."
      );

      setLoading(false);

      return;
    }

    fetchApplicant();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  // =====================================================
  // FETCH APPLICANT
  // =====================================================

  const fetchApplicant = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
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

      console.log(
        "APPLICANT API RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load applicant details"
        );
      }

      setApplication(
        data?.application || data
      );
    } catch (error) {
      console.error(
        "APPLICANT DETAILS ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to load applicant details"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status = ""
  ) => {
    return status
      .toLowerCase()
      .replaceAll(" ", "-");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="applicant-details-page">

        <div className="applicant-loading">
          Loading applicant details...
        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="applicant-details-page">

        <div className="applicant-error">

          <h2>
            Unable to load applicant
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
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

  // =====================================================
  // NO APPLICATION
  // =====================================================

  if (!application) {
    return (
      <div className="applicant-details-page">

        <div className="applicant-error">

          <h2>
            Applicant not found
          </h2>

          <button
            type="button"
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

  // =====================================================
  // DATA
  // =====================================================

  const applicant =
    application.applicant || {};

  const job =
    application.job || {};

  // =====================================================
  // URL HELPER
  // =====================================================

  const makeUrl = (url) => {
    if (!url) {
      return "";
    }

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `https://alumni-nexus-cklf.onrender.com${
      url.startsWith("/")
        ? url
        : `/${url}`
    }`;
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="applicant-details-page">

      {/* ==========================================
          TOP HEADER
      ========================================== */}

      <div className="applicant-details-header">

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/staff-jobs")
          }
        >
          ← Back to Job Management
        </button>

        <div>

          <p className="page-label">
            STAFF MANAGEMENT
          </p>

          <h1>
            Applicant Details
          </h1>

          <p>
            View complete applicant
            information and application
            details.
          </p>

        </div>

      </div>


      {/* ==========================================
          MAIN GRID
      ========================================== */}

      <div className="applicant-details-grid">

        {/* ========================================
            APPLICANT PROFILE
        ======================================== */}

        <div className="applicant-card-large">

          <div className="applicant-avatar">

            {applicant.name
              ? applicant.name
                  .charAt(0)
                  .toUpperCase()
              : "A"}

          </div>

          <h2>
            {applicant.name ||
              "Unknown Applicant"}
          </h2>

          <p className="applicant-role">
            {applicant.designation ||
              applicant.role ||
              "Applicant"}
          </p>


          <div className="profile-info">

            <div>

              <strong>
                Email
              </strong>

              <span>
                {applicant.email ||
                  "Not provided"}
              </span>

            </div>


            <div>

              <strong>
                Phone
              </strong>

              <span>
                {applicant.phone ||
                  "Not provided"}
              </span>

            </div>


            <div>

              <strong>
                Location
              </strong>

              <span>
                {applicant.location ||
                  "Not provided"}
              </span>

            </div>

          </div>


          {/* LINKS */}

          <div className="profile-links">

            {applicant.linkedinUrl && (
              <a
                href={makeUrl(
                  applicant.linkedinUrl
                )}
                target="_blank"
                rel="noreferrer"
              >
                🔗 View LinkedIn
              </a>
            )}


            {applicant.resumeUrl && (
              <a
                href={makeUrl(
                  applicant.resumeUrl
                )}
                target="_blank"
                rel="noreferrer"
              >
                📄 View Resume
              </a>
            )}

          </div>

        </div>


        {/* ========================================
            ACADEMIC DETAILS
        ======================================== */}

        <div className="details-card">

          <h2>
            Academic Details
          </h2>

          <div className="details-grid">

            <div>

              <label>
                Department
              </label>

              <p>
                {applicant.department ||
                  "Not provided"}
              </p>

            </div>


            <div>

              <label>
                Passing Year
              </label>

              <p>
                {applicant.passingYear ||
                  "Not provided"}
              </p>

            </div>

          </div>

        </div>


        {/* ========================================
            PROFESSIONAL DETAILS
        ======================================== */}

        <div className="details-card">

          <h2>
            Professional Details
          </h2>

          <div className="details-grid">

            <div>

              <label>
                Company
              </label>

              <p>
                {applicant.company ||
                  "Not provided"}
              </p>

            </div>


            <div>

              <label>
                Designation
              </label>

              <p>
                {applicant.designation ||
                  "Not provided"}
              </p>

            </div>


            <div>

              <label>
                Experience
              </label>

              <p>
                {applicant.experience ||
                  "Not provided"}
              </p>

            </div>


            <div>

              <label>
                Career Interest
              </label>

              <p>
                {applicant.careerInterest ||
                  "Not provided"}
              </p>

            </div>

          </div>

        </div>


        {/* ========================================
            SKILLS
        ======================================== */}

        <div className="details-card">

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
                  <span key={index}>
                    {skill}
                  </span>
                )
              )}

            </div>

          ) : (

            <p>
              No skills added.
            </p>

          )}

        </div>


        {/* ========================================
            ABOUT
        ======================================== */}

        <div className="details-card">

          <h2>
            About Applicant
          </h2>

          <p className="about-text">
            {applicant.about ||
              "No information provided."}
          </p>

        </div>


        {/* ========================================
            JOB DETAILS
        ======================================== */}

        <div className="details-card job-details-card">

          <h2>
            Applied Job
          </h2>

          <div className="job-info">

            <h3>
              {job.title ||
                "Job Title"}
            </h3>

            <p>
              {job.company ||
                "Company"}
            </p>

            <span>
              📍{" "}
              {job.location ||
                "Location not provided"}
            </span>

          </div>


          <div className="application-meta">

            <div>

              <label>
                Applied On
              </label>

              <p>
                {application.appliedAt
                  ? new Date(
                      application.appliedAt
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "Not available"}
              </p>

            </div>


            <div>

              <label>
                Application Status
              </label>

              <span
                className={`application-status ${getStatusClass(
                  application.status
                )}`}
              >
                {application.status ||
                  "Applied"}
              </span>

            </div>

          </div>

        </div>


        {/* ========================================
            COVER MESSAGE
        ======================================== */}

        <div className="details-card">

          <h2>
            Cover Message
          </h2>

          <p className="cover-message">
            {application.coverMessage ||
              "No cover message provided."}
          </p>

        </div>


        {/* ========================================
            RESUME
        ======================================== */}

        <div className="details-card">

          <h2>
            Resume
          </h2>

          {application.resumeUrl ? (

            <div className="resume-box">

              <div>

                <strong>
                  📄{" "}
                  {application.resumeName ||
                    "Resume"}
                </strong>

                <p>
                  Applicant's submitted resume
                </p>

              </div>

              <a
                href={makeUrl(
                  application.resumeUrl
                )}
                target="_blank"
                rel="noreferrer"
                className="resume-btn"
              >
                View / Download
              </a>

            </div>

          ) : (

            <p>
              Resume not available.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default ApplicantDetails;