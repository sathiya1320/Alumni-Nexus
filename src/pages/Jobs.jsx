import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";

const API = "http://localhost:5000/api";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All");
  const [workMode, setWorkMode] = useState("All");

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, search, jobType, workMode]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `${API}/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch jobs"
        );
      }

      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let result = [...jobs];

    if (search.trim()) {
      const keyword =
        search.toLowerCase();

      result = result.filter((job) => {
        return (
          job.title
            ?.toLowerCase()
            .includes(keyword) ||
          job.company
            ?.toLowerCase()
            .includes(keyword) ||
          job.location
            ?.toLowerCase()
            .includes(keyword) ||
          job.skills?.some((skill) =>
            skill
              .toLowerCase()
              .includes(keyword)
          )
        );
      });
    }

    if (jobType !== "All") {
      result = result.filter(
        (job) =>
          job.jobType === jobType
      );
    }

    if (workMode !== "All") {
      result = result.filter(
        (job) =>
          job.workMode === workMode
      );
    }

    setFilteredJobs(result);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="jobs-loading">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="jobs-page">

      {/* HEADER */}

      <div className="jobs-header">

        <div>
          <p className="jobs-small-title">
            ALUMNI NEXUS CAREER CENTER
          </p>

          <h1>
            Find Your Next
            <span> Opportunity</span>
          </h1>

          <p className="jobs-subtitle">
            Explore career opportunities
            shared by Alumni Nexus.
          </p>
        </div>

        {user?.role === "staff" && (
          <button
            className="post-job-btn"
            onClick={() =>
              navigate("/staff-jobs")
            }
          >
            + Post Job
          </button>
        )}
      </div>


      {/* SEARCH */}

      <div className="jobs-search-box">

        <span>🔍</span>

        <input
          type="text"
          placeholder="Search by job title, company or skill..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* FILTERS */}

      <div className="jobs-filters">

        <select
          value={jobType}
          onChange={(e) =>
            setJobType(e.target.value)
          }
        >
          <option value="All">
            All Job Types
          </option>

          <option value="Full Time">
            Full Time
          </option>

          <option value="Part Time">
            Part Time
          </option>

          <option value="Internship">
            Internship
          </option>

          <option value="Contract">
            Contract
          </option>
        </select>


        <select
          value={workMode}
          onChange={(e) =>
            setWorkMode(e.target.value)
          }
        >
          <option value="All">
            All Work Modes
          </option>

          <option value="Remote">
            Remote
          </option>

          <option value="Hybrid">
            Hybrid
          </option>

          <option value="On-site">
            On-site
          </option>
        </select>


        <button
          className="applications-btn"
          onClick={() =>
            navigate("/my-applications")
          }
        >
          📋 My Applications
        </button>

      </div>


      {/* JOB COUNT */}

      <div className="job-count">
        {filteredJobs.length} opportunities
        found
      </div>


      {/* JOB LIST */}

      {filteredJobs.length === 0 ? (

        <div className="no-jobs">

          <div className="no-jobs-icon">
            💼
          </div>

          <h2>
            No Jobs Available
          </h2>

          <p>
            New career opportunities
            will appear here.
          </p>

        </div>

      ) : (

        <div className="jobs-grid">

          {filteredJobs.map((job) => (

            <div
              className="job-card"
              key={job._id}
            >

              <div className="job-card-top">

                <div className="company-logo">
                  {job.company
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <span className="job-type">
                    {job.jobType}
                  </span>

                  <h2>
                    {job.title}
                  </h2>

                  <p className="company-name">
                    {job.company}
                  </p>
                </div>

              </div>


              <div className="job-info">

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


              <div className="job-skills">

                {job.skills
                  ?.slice(0, 4)
                  .map((skill, index) => (
                    <span key={index}>
                      {skill}
                    </span>
                  ))}

              </div>


              <p className="job-description">
                {job.description?.length > 120
                  ? job.description.substring(
                      0,
                      120
                    ) + "..."
                  : job.description}
              </p>


              <div className="job-footer">

                <div>
                  <small>
                    Apply before
                  </small>

                  <strong>
                    {formatDate(
                      job.deadline
                    )}
                  </strong>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/job-details/${job._id}`
                    )
                  }
                >
                  View Details →
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Jobs;