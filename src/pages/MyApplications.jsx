import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MyApplications.css";

const API =
  "https://alumni-nexus-cklf.onrender.com/api";

function MyApplications() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const userData =
    localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

  const role = user?.role;

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (
      role !== "student" &&
      role !== "alumni"
    ) {
      setLoading(false);
      return;
    }

    fetchApplications();
  }, []);

  const fetchApplications =
    async () => {
      try {
        const response =
          await fetch(
            `${API}/jobs/applications/my`,
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
              "Unable to fetch applications"
          );
        }

        setApplications(
          data
        );
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

  const getStatusClass =
    (status) => {
      return status
        .toLowerCase()
        .replaceAll(" ", "-");
    };

  // =========================================
  // STAFF
  // =========================================

  if (
    role === "staff" ||
    role === "admin"
  ) {
    return (
      <div className="applications-page">

        <div className="empty-applications">

          <div>
            🚫
          </div>

          <h2>
            Staff Cannot Apply
          </h2>

          <p>
            Staff members can only
            manage jobs and review
            applications.
          </p>

          <button
            onClick={() =>
              navigate("/jobs")
            }
          >
            Back to Jobs
          </button>

        </div>

      </div>
    );
  }

  if (loading) {
    return (
      <div className="applications-loading">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="applications-page">

      <div className="applications-header">

        <button
          onClick={() =>
            navigate("/jobs")
          }
        >
          ← Back to Jobs
        </button>

        <h1>
          My Applications
        </h1>

        <p>
          Track your job applications
          and their current status.
        </p>

      </div>

      {applications.length === 0 ? (
        <div className="empty-applications">

          <div>
            📋
          </div>

          <h2>
            No Applications Yet
          </h2>

          <p>
            Start exploring jobs and
            apply for opportunities.
          </p>

          <button
            onClick={() =>
              navigate("/jobs")
            }
          >
            Explore Jobs
          </button>

        </div>
      ) : (
        <div className="applications-list">

          {applications.map(
            (application) => (
              <div
                className="application-card"
                key={
                  application._id
                }
              >

                <div>

                  <h2>
                    {
                      application
                        .job?.title
                    }
                  </h2>

                  <h3>
                    {
                      application
                        .job?.company
                    }
                  </h3>

                  <p>
                    📍{" "}
                    {
                      application
                        .job?.location
                    }
                  </p>

                  <small>
                    Applied on{" "}
                    {new Date(
                      application.appliedAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </small>
                  {application.coverMessage && (
                      <p className="application-cover-message">
                        <strong>Cover Message:</strong>{" "}
                        {application.coverMessage}
                      </p>
                    )}

                </div>

                <div className="application-status">

                  <span
                    className={`status ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>

                  <button
                    onClick={() =>
                      navigate(
                        `/job-details/${application.job?._id}`
                      )
                    }
                  >
                    View Job
                  </button>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default MyApplications;