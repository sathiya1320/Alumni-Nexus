import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./StaffJobs.css";

const API = "https://alumni-nexus-cklf.onrender.com/api";

function StaffJobs() {
  const navigate = useNavigate();

  // =====================================================
  // USER
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const role = user?.role;

  const isStaff = role === "staff";
  const isAlumni = role === "alumni";

  // =====================================================
  // STATES
  // =====================================================

  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // EMPTY FORM
  // =====================================================

  const emptyForm = {
    title: "",
    company: "",
    jobType: "Full Time",
    workMode: "Hybrid",
    location: "",
    experience: "Fresher",
    salary: "",
    skills: "",
    description: "",
    requirements: "",
    responsibilities: "",
    deadline: "",
    applicationLink: "",
    status: "Published",
  };

  const [form, setForm] = useState(emptyForm);

  // =====================================================
  // SAFE RESPONSE
  // =====================================================

  const readResponse = async (response) => {
    const text = await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        text.startsWith("<")
          ? `Server returned an invalid response. Status: ${response.status}`
          : text
      );
    }
  };

  // =====================================================
  // INITIAL CHECK
  // =====================================================

  useEffect(() => {
    if (!isStaff && !isAlumni) {
      alert("Only staff and alumni can manage jobs.");

      navigate("/jobs");

      return;
    }

    fetchJobs();
  }, []);

  // =====================================================
  // FETCH JOBS
  // =====================================================

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API}/jobs/staff/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Unable to load jobs. Status: ${response.status}`
        );
      }

      const jobList = Array.isArray(data)
        ? data
        : Array.isArray(data?.jobs)
        ? data.jobs
        : [];

      setJobs(jobList);
    } catch (error) {
      console.error("FETCH JOBS ERROR:", error);

      alert(error.message || "Unable to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE FORM
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE JOB
  // =====================================================

  const saveJob = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const jobData = {
        title: form.title.trim(),
        company: form.company.trim(),
        jobType: form.jobType,
        workMode: form.workMode,
        location: form.location.trim(),
        experience: form.experience,
        salary: form.salary.trim(),

        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        description: form.description.trim(),
        requirements: form.requirements.trim(),
        responsibilities: form.responsibilities.trim(),
        deadline: form.deadline,
        applicationLink: form.applicationLink.trim(),
        status: form.status,
      };

      if (
        !jobData.title ||
        !jobData.company ||
        !jobData.location ||
        !jobData.description ||
        !jobData.deadline
      ) {
        alert("Please fill all required fields.");
        return;
      }

      const url = editingId
        ? `${API}/jobs/${editingId}`
        : `${API}/jobs`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(jobData),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Unable to save job. Status: ${response.status}`
        );
      }

      alert(
        editingId
          ? "Job updated successfully"
          : "Job published successfully"
      );

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await fetchJobs();
    } catch (error) {
      console.error("SAVE JOB ERROR:", error);

      alert(error.message || "Unable to save job");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EDIT JOB
  // =====================================================

  const editJob = (job) => {
    setEditingId(job._id);

    setForm({
      title: job.title || "",
      company: job.company || "",

      jobType: job.jobType || "Full Time",

      workMode: job.workMode || "Hybrid",

      location: job.location || "",

      experience: job.experience || "Fresher",

      salary: job.salary || "",

      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : job.skills || "",

      description: job.description || "",

      requirements: job.requirements || "",

      responsibilities: job.responsibilities || "",

      deadline: job.deadline
        ? String(job.deadline).substring(0, 10)
        : "",

      applicationLink: job.applicationLink || "",

      status: job.status || "Published",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE JOB
  // =====================================================

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API}/jobs/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Unable to delete job. Status: ${response.status}`
        );
      }

      alert("Job deleted successfully");

      if (selectedJob?._id === id) {
        setSelectedJob(null);
        setApplications([]);
      }

      await fetchJobs();
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);

      alert(error.message || "Unable to delete job");
    }
  };

  // =====================================================
  // VIEW APPLICATIONS
  // =====================================================

  const viewApplications = async (job) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API}/jobs/${job._id}/applications`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Unable to load applications. Status: ${response.status}`
        );
      }

      const applicationList = Array.isArray(data)
        ? data
        : Array.isArray(data?.applications)
        ? data.applications
        : [];

      setApplications(applicationList);

      setSelectedJob(job);

      setTimeout(() => {
        const panel = document.querySelector(
          ".applications-panel"
        );

        if (panel) {
          panel.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } catch (error) {
      console.error(
        "VIEW APPLICATIONS ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to load applications"
      );
    }
  };

  // =====================================================
  // UPDATE APPLICATION STATUS
  // =====================================================

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API}/jobs/applications/${applicationId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Unable to update application. Status: ${response.status}`
        );
      }

      alert("Application status updated");

      if (selectedJob) {
        await viewApplications(selectedJob);
      }
    } catch (error) {
      console.error(
        "UPDATE STATUS ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to update application status"
      );
    }
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // =====================================================
  // VIEW APPLICANT
  // =====================================================

  const viewApplicant = (applicationId) => {
    if (!applicationId) {
      alert("Applicant application ID is missing.");
      return;
    }

    navigate(
      `/staff/applications/${applicationId}`
    );
  };

  // =====================================================
  // PAGE TEXT
  // =====================================================

  const pageLabel = isStaff
    ? "STAFF MANAGEMENT"
    : "ALUMNI CAREER CENTER";

  const pageTitle = isStaff
    ? "Job Management"
    : "My Job Posts";

  const pageDescription = isStaff
    ? "Create and manage career opportunities for students and alumni."
    : "Post and manage career opportunities shared with the Alumni Nexus community.";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="staff-jobs-page">

      {/* HEADER */}

      <div className="staff-jobs-header">

        <div>
          <p>{pageLabel}</p>

          <h1>{pageTitle}</h1>

          <span>{pageDescription}</span>
        </div>

        <button
          type="button"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          + Add New Job
        </button>

      </div>

      {/* FORM */}

      {showForm && (
        <form
          className="job-form"
          onSubmit={saveJob}
        >

          <div className="form-header">

            <h2>
              {editingId
                ? "Edit Job"
                : "Create New Job"}
            </h2>

            <button
              type="button"
              onClick={closeForm}
            >
              ✕
            </button>

          </div>

          <div className="form-grid">

            <input
              name="title"
              placeholder="Job Title *"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              name="company"
              placeholder="Company Name *"
              value={form.company}
              onChange={handleChange}
              required
            />

            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
            >
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>

            <select
              name="workMode"
              value={form.workMode}
              onChange={handleChange}
            >
              <option>On-site</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>

            <input
              name="location"
              placeholder="Location *"
              value={form.location}
              onChange={handleChange}
              required
            />

            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
            >
              <option>Fresher</option>
              <option>0–1 Years</option>
              <option>1–3 Years</option>
              <option>3+ Years</option>
            </select>

            <input
              name="salary"
              placeholder="Salary Range"
              value={form.salary}
              onChange={handleChange}
            />

            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
            />

          </div>

          <input
            name="skills"
            placeholder="Skills - React, Node.js, MongoDB"
            value={form.skills}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Job Description *"
            value={form.description}
            onChange={handleChange}
            required
          />

          <textarea
            name="responsibilities"
            placeholder="Responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
          />

          <textarea
            name="requirements"
            placeholder="Requirements"
            value={form.requirements}
            onChange={handleChange}
          />

          <input
            name="applicationLink"
            placeholder="Application Link (optional)"
            value={form.applicationLink}
            onChange={handleChange}
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Published</option>
            <option>Draft</option>
            <option>Closed</option>
          </select>

          <button
            className="publish-btn"
            type="submit"
            disabled={saving}
          >
            {saving
              ? editingId
                ? "Updating..."
                : "Publishing..."
              : editingId
              ? "Update Job"
              : "Publish Job"}
          </button>

        </form>
      )}

      {/* JOB LIST */}

      <div className="staff-job-list">

        {loading ? (

          <div className="staff-empty">
            Loading jobs...
          </div>

        ) : jobs.length === 0 ? (

          <div className="staff-empty">

            <h3>
              {isStaff
                ? "No jobs created yet."
                : "You have not posted any jobs yet."}
            </h3>

            <p>
              Click "+ Add New Job"
              to create a new opportunity.
            </p>

          </div>

        ) : (

          jobs.map((job) => (

            <div
              className="staff-job-card"
              key={job._id}
            >

              <div className="staff-job-info">

                <span>
                  {job.status}
                </span>

                <h2>
                  {job.title}
                </h2>

                <h3>
                  {job.company}
                </h3>

                <p>
                  📍 {job.location}
                  &nbsp; • &nbsp;
                  {job.jobType}
                  &nbsp; • &nbsp;
                  {job.workMode}
                </p>

                {!isStaff && (
                  <small>
                    Posted by you
                  </small>
                )}

              </div>

              <div className="staff-job-actions">

                <strong>
                  👥 {job.applicationCount || 0} Applications
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    viewApplications(job)
                  }
                >
                  View Applicants
                </button>

                <button
                  type="button"
                  onClick={() =>
                    editJob(job)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() =>
                    deleteJob(job._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      {/* APPLICATIONS */}

      {selectedJob && (

        <div className="applications-panel">

          <div className="panel-header">

            <div>

              <h2>
                Applications
              </h2>

              <p>
                {selectedJob.title}
                {" - "}
                {selectedJob.company}
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedJob(null);
                setApplications([]);
              }}
            >
              ✕
            </button>

          </div>

          {applications.length === 0 ? (

            <p>
              No applications yet.
            </p>

          ) : (

            applications.map((application) => (

              <div
                className="applicant-card"
                key={application._id}
              >

                <div>

                  <h3>
                    {application.applicant?.name ||
                      "Unknown Applicant"}
                  </h3>

                  <p>
                    {application.applicant?.email ||
                      "No email"}
                  </p>

                  <p>
                    Role:{" "}
                    {application.applicant?.role ||
                      "Unknown"}
                  </p>

                  <p>
                    Cover Message:{" "}
                    {application.coverMessage ||
                      "No cover message"}
                  </p>

                  <button
                    type="button"
                    className="view-applicant-btn"
                    onClick={() =>
                      viewApplicant(
                        application._id
                      )
                    }
                  >
                    👤 View Applicant
                  </button>

                </div>

                <div className="applicant-links">

                  {application.linkedinUrl && (
                    <a
                      href={application.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      🔗 LinkedIn
                    </a>
                  )}

                  {application.resumeUrl && (
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📄 Resume
                    </a>
                  )}

                </div>

                <div className="status-actions">

                  <span>
                    {application.status}
                  </span>

                  <select
                    value={application.status}
                    onChange={(e) =>
                      updateStatus(
                        application._id,
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Applied
                    </option>

                    <option>
                      Under Review
                    </option>

                    <option>
                      Shortlisted
                    </option>

                    <option>
                      Selected
                    </option>

                    <option>
                      Rejected
                    </option>

                  </select>

                </div>

              </div>

            ))

          )}

        </div>

      )}

    </div>
  );
}

export default StaffJobs;