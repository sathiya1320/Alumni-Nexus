import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./JobDetails.css";

const API =
  "https://alumni-nexus-cklf.onrender.com/api";

function JobDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const token =
    localStorage.getItem("token");

  const userData =
    localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

  const role = user?.role;

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response =
        await fetch(
          `${API}/jobs/${id}`,
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
          data.message ||
            "Unable to fetch job"
        );
      }

      setJob(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="job-details-loading">
        Loading job...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <h2>Job not found</h2>
      </div>
    );
  }

  return (
    <div className="job-details-page">

      {/* =========================================
          BACK BUTTON
      ========================================== */}

      <button
        className="back-btn"
        onClick={() =>
          navigate("/jobs")
        }
      >
        ← Back to Jobs
      </button>


      <div className="job-details-layout">

        {/* =========================================
            MAIN JOB DETAILS
        ========================================== */}

        <main className="job-main">

          <div className="job-title-box">

            <div className="large-company-logo">
              {job.company
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <span className="details-job-type">
                {job.jobType}
              </span>

              <h1>
                {job.title}
              </h1>

              <h3>
                {job.company}
              </h3>

            </div>

          </div>


          {/* =========================================
              JOB INFO
          ========================================== */}

          <div className="details-info">

            <span>
              📍 {job.location}
            </span>

            <span>
              🏠 {job.workMode}
            </span>

            <span>
              💼 {job.experience}
            </span>

            {job.salary && (
              <span>
                💰 {job.salary}
              </span>
            )}

          </div>


          {/* =========================================
              ABOUT
          ========================================== */}

          <section>

            <h2>
              About the Role
            </h2>

            <p>
              {job.description}
            </p>

          </section>


          {/* =========================================
              RESPONSIBILITIES
          ========================================== */}

          <section>

            <h2>
              Responsibilities
            </h2>

            <p className="multiline">
              {job.responsibilities ||
                "Responsibilities will be discussed during the selection process."}
            </p>

          </section>


          {/* =========================================
              REQUIREMENTS
          ========================================== */}

          <section>

            <h2>
              Requirements
            </h2>

            <p className="multiline">
              {job.requirements ||
                "Please refer to the required skills for this position."}
            </p>

          </section>


          {/* =========================================
              SKILLS
          ========================================== */}

          <section>

            <h2>
              Skills
            </h2>

            <div className="details-skills">

              {job.skills?.map(
                (skill, index) => (
                  <span
                    key={index}
                  >
                    {skill}
                  </span>
                )
              )}

            </div>

          </section>

        </main>


        {/* =========================================
            RIGHT SIDE
        ========================================== */}

        <aside className="job-apply-card">

          {/* =====================================
              STAFF VIEW
          ===================================== */}

          {role === "staff" ? (

            <>

              <h2>
                Job Management
              </h2>

              <p>
                Staff members cannot apply
                for jobs.
              </p>


              <div className="deadline-box">

                <small>
                  Application Deadline
                </small>

                <strong>
                  {new Date(
                    job.deadline
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </>

          ) : (

            <>
              {/* =================================
                  STUDENT / ALUMNI
              ================================= */}

              <h2>
                Ready to apply?
              </h2>

              <p>
                Your resume and LinkedIn
                profile will be included
                with your application.
              </p>


              <div className="deadline-box">

                <small>
                  Application Deadline
                </small>

                <strong>
                  {new Date(
                    job.deadline
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </strong>

              </div>


              {job.hasApplied ? (

                <div className="already-applied">

                  ✓ Already Applied

                  <span>
                    Status:{" "}
                    {job.applicationStatus}
                  </span>

                </div>

              ) : (

                <button
                  className="apply-btn"
                  onClick={() =>
                    navigate(
                      `/apply-job/${job._id}`
                    )
                  }
                >
                  Apply Now →
                </button>

              )}

            </>

          )}

        </aside>

      </div>

    </div>
  );
}

export default JobDetails;