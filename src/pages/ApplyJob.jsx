import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./ApplyJob.css";

const API = "https://alumni-nexus-cklf.onrender.com/api";

function ApplyJob() {
  const { id } = useParams();

  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const [job, setJob] = useState(null);

  const [profile, setProfile] =
    useState(null);

  const [coverMessage, setCoverMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [jobResponse, profileResponse] =
        await Promise.all([
          fetch(`${API}/jobs/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const jobData =
        await jobResponse.json();

      const profileData =
        await profileResponse.json();

      if (!jobResponse.ok) {
        throw new Error(
          jobData.message
        );
      }

      if (!profileResponse.ok) {
        throw new Error(
          profileData.message
        );
      }

      setJob(jobData);

      setProfile(
        profileData.user || profileData
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  const submitApplication = async () => {
    if (!profile?.resumeUrl) {
      alert(
        "Please upload your resume before applying."
      );

      navigate(
        "/professional-profile"
      );

      return;
    }

    if (!profile?.linkedinUrl) {
      alert(
        "Please add your LinkedIn profile before applying."
      );

      navigate(
        "/professional-profile"
      );

      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API}/jobs/${id}/apply`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            coverMessage,
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
        "Application submitted successfully!"
      );

      navigate(
        "/my-applications"
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="apply-loading">
        Loading...
      </div>
    );
  }


  return (
    <div className="apply-page">

      <button
        className="apply-back"
        onClick={() =>
          navigate(
            `/job-details/${id}`
          )
        }
      >
        ← Back to Job
      </button>


      <div className="apply-layout">

        <main className="apply-main">

          <h1>
            Apply for {job?.title}
          </h1>

          <p className="apply-company">
            {job?.company}
          </p>


          {/* RESUME */}

          <div className="professional-card">

            <div className="professional-icon">
              📄
            </div>

            <div className="professional-content">

              <h3>
                Resume
              </h3>

              {profile?.resumeUrl ? (

                <>
                  <p>
                    {profile.resumeName}
                  </p>

                  <a
                    href={
                      profile.resumeUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume
                  </a>
                </>

              ) : (

                <p className="missing">
                  Resume not uploaded
                </p>

              )}

            </div>

          </div>


          {/* LINKEDIN */}

          <div className="professional-card">

            <div className="professional-icon">
              🔗
            </div>

            <div className="professional-content">

              <h3>
                LinkedIn Profile
              </h3>

              {profile?.linkedinUrl ? (

                <a
                  href={
                    profile.linkedinUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  View LinkedIn Profile
                </a>

              ) : (

                <p className="missing">
                  LinkedIn profile not added
                </p>

              )}

            </div>

          </div>


          {/* COVER MESSAGE */}

          <div className="cover-section">

            <label>
              Cover Message
              <span>
                Optional
              </span>
            </label>

            <textarea
              value={coverMessage}
              onChange={(e) =>
                setCoverMessage(
                  e.target.value
                )
              }
              placeholder="Tell the employer why you are interested in this opportunity..."
              rows="7"
            />

          </div>

        </main>


        {/* RIGHT SIDE */}

        <aside className="application-summary">

          <h2>
            Application Summary
          </h2>


          <div className="summary-row">

            <span>Job</span>

            <strong>
              {job?.title}
            </strong>

          </div>


          <div className="summary-row">

            <span>Company</span>

            <strong>
              {job?.company}
            </strong>

          </div>


          <div className="summary-row">

            <span>Location</span>

            <strong>
              {job?.location}
            </strong>

          </div>


          <div className="summary-row">

            <span>Job Type</span>

            <strong>
              {job?.jobType}
            </strong>

          </div>


          <div className="included-box">

            <h3>
              Your application includes
            </h3>

            <p>
              ✓ Resume
            </p>

            <p>
              ✓ LinkedIn Profile
            </p>

            <p>
              ✓ Cover Message
            </p>

          </div>


          <button
            className="submit-application"
            disabled={submitting}
            onClick={
              submitApplication
            }
          >
            {submitting
              ? "Submitting..."
              : "Submit Application"}
          </button>

        </aside>

      </div>

    </div>
  );
}

export default ApplyJob;