import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ProfessionalProfile.css";

const API = "https://alumni-nexus-cklf.onrender.com/api";

function ProfessionalProfile() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const [linkedinUrl, setLinkedinUrl] =
    useState("");

  const [resume, setResume] =
    useState(null);

  const [profile, setProfile] =
    useState(null);

  const [savingLinkedIn, setSavingLinkedIn] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(
        `${API}/users/profile`,
        {
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
          data.message
        );
      }

      const user =
        data.user || data;

      setProfile(user);

      setLinkedinUrl(
        user.linkedinUrl || ""
      );
    } catch (error) {
      alert(error.message);
    }
  };


  const saveLinkedIn = async () => {
    try {
      setSavingLinkedIn(true);

      const response = await fetch(
        `${API}/jobs/profile/linkedin`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            linkedinUrl,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message
        );
      }

      alert(
        "LinkedIn profile saved successfully!"
      );

      loadProfile();
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingLinkedIn(false);
    }
  };


  const uploadResume = async () => {
    if (!resume) {
      alert(
        "Please select a resume."
      );

      return;
    }

    const formData =
      new FormData();

    formData.append(
      "resume",
      resume
    );

    try {
      setUploading(true);

      const response = await fetch(
        `${API}/jobs/profile/resume`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message
        );
      }

      alert(
        "Resume uploaded successfully!"
      );

      setResume(null);

      loadProfile();
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="professional-page">

      <div className="professional-header">

        <button
          onClick={() =>
            navigate(-1)
          }
        >
          ← Back
        </button>

        <h1>
          Professional Profile
        </h1>

        <p>
          Keep your resume and LinkedIn
          profile ready for job applications.
        </p>

      </div>


      {/* LINKEDIN */}

      <div className="professional-section">

        <div className="section-heading">
          <div className="section-icon">
            🔗
          </div>

          <div>
            <h2>
              LinkedIn Profile
            </h2>

            <p>
              Add your professional LinkedIn
              profile.
            </p>
          </div>
        </div>


        <label>
          LinkedIn Profile URL
        </label>

        <input
          type="url"
          value={linkedinUrl}
          onChange={(e) =>
            setLinkedinUrl(
              e.target.value
            )
          }
          placeholder="https://www.linkedin.com/in/your-name"
        />


        {profile?.linkedinUrl && (
          <a
            className="current-link"
            href={
              profile.linkedinUrl
            }
            target="_blank"
            rel="noreferrer"
          >
            🔗 View Current LinkedIn Profile
          </a>
        )}


        <button
          className="save-profile-btn"
          onClick={saveLinkedIn}
          disabled={savingLinkedIn}
        >
          {savingLinkedIn
            ? "Saving..."
            : "Save LinkedIn Profile"}
        </button>

      </div>


      {/* RESUME */}

      <div className="professional-section">

        <div className="section-heading">

          <div className="section-icon">
            📄
          </div>

          <div>
            <h2>
              Resume
            </h2>

            <p>
              Upload your latest resume.
            </p>
          </div>

        </div>


        {profile?.resumeUrl && (

          <div className="current-resume">

            <span>
              📄
            </span>

            <div>

              <strong>
                {profile.resumeName}
              </strong>

              <small>
                Resume uploaded
              </small>

            </div>

            <a
              href={
                profile.resumeUrl
              }
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>

          </div>

        )}


        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            setResume(
              e.target.files[0]
            )
          }
        />

        <small className="file-info">
          PDF, DOC or DOCX • Maximum 5MB
        </small>


        <button
          className="save-profile-btn"
          onClick={uploadResume}
          disabled={uploading}
        >
          {uploading
            ? "Uploading..."
            : "Upload Resume"}
        </button>

      </div>


      {/* APPLICATION READINESS */}

      <div className="readiness-card">

        <h2>
          Job Application Readiness
        </h2>

        <div className="readiness-item">

          <span>
            {profile?.resumeUrl
              ? "✓"
              : "○"}
          </span>

          Resume
          {profile?.resumeUrl
            ? " Added"
            : " Not Added"}

        </div>


        <div className="readiness-item">

          <span>
            {profile?.linkedinUrl
              ? "✓"
              : "○"}
          </span>

          LinkedIn Profile
          {profile?.linkedinUrl
            ? " Added"
            : " Not Added"}

        </div>


        {profile?.resumeUrl &&
        profile?.linkedinUrl ? (

          <div className="ready-message">
            ✓ Your profile is ready for
            job applications.
          </div>

        ) : (

          <div className="warning-message">
            Add both resume and LinkedIn
            profile before applying for jobs.
          </div>

        )}

      </div>

    </div>
  );
}

export default ProfessionalProfile;