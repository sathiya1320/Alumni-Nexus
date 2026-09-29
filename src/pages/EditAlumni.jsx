import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaSave,
  FaUserGraduate,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBuilding,
  FaBriefcase,
  FaLinkedin,
  FaFileAlt,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

import API from "../services/api";
import "./EditAlumni.css";

function EditAlumni() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "B.Sc Computer Science",
    passingYear: "",
    phone: "",
    location: "",
    company: "",
    designation: "",
    experience: "",
    careerInterest: "",
    about: "",
    skills: [],
    linkedinUrl: "",
    resumeUrl: "",
    resumeName: "",
  });

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
      console.error("USER ERROR:", err);
      navigate("/login");
    }
  }, [navigate]);

  /* =====================================================
     FETCH ALUMNI
  ===================================================== */

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.user;

        setFormData({
          name: user.name || "",
          email: user.email || "",
          department:
            user.department || "B.Sc Computer Science",
          passingYear: user.passingYear || "",
          phone: user.phone || "",
          location: user.location || "",
          company: user.company || "",
          designation: user.designation || "",
          experience: user.experience || "",
          careerInterest: user.careerInterest || "",
          about: user.about || "",
          skills: Array.isArray(user.skills)
            ? user.skills
            : [],
          linkedinUrl: user.linkedinUrl || "",
          resumeUrl: user.resumeUrl || "",
          resumeName: user.resumeName || "",
        });
      } catch (err) {
        console.error("FETCH ALUMNI ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load alumni details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchAlumni();
    }
  }, [id, token]);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  /* =====================================================
     ADD SKILL
  ===================================================== */

  const handleAddSkill = () => {
    const newSkill = skillInput.trim();

    if (!newSkill) {
      return;
    }

    const alreadyExists = formData.skills.some(
      (skill) =>
        skill.toLowerCase() === newSkill.toLowerCase()
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));

    setSkillInput("");
  };

  /* =====================================================
     ENTER KEY FOR SKILL
  ===================================================== */

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  /* =====================================================
     REMOVE SKILL
  ===================================================== */

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  /* =====================================================
     FORM VALIDATION
  ===================================================== */

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Full name is required.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email address is required.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!formData.passingYear) {
      setError("Passing year is required.");
      return false;
    }

    return true;
  };

  /* =====================================================
     SAVE CHANGES
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const response = await API.put(
        `/users/alumni/${id}`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          department: formData.department.trim(),
          passingYear: formData.passingYear,
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          company: formData.company.trim(),
          designation: formData.designation.trim(),
          experience: formData.experience.trim(),
          careerInterest:
            formData.careerInterest.trim(),
          about: formData.about.trim(),
          skills: formData.skills,
          linkedinUrl:
            formData.linkedinUrl.trim(),
          resumeUrl:
            formData.resumeUrl.trim(),
          resumeName:
            formData.resumeName.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        ...response.data.user,
        skills: Array.isArray(response.data.user?.skills)
          ? response.data.user.skills
          : prev.skills,
      }));

      setSuccess(
        "Alumni profile updated successfully."
      );

      /*
       * After saving, stay on edit page for a moment.
       * Then go to details page.
       */
      setTimeout(() => {
        navigate(`/staff-alumni/${id}`);
      }, 900);
    } catch (err) {
      console.error("UPDATE ALUMNI ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update alumni profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {
    navigate(`/staff-alumni/${id}`);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="edit-alumni-page">
        <div className="edit-loading">

          <div className="edit-spinner"></div>

          <h3>Loading Alumni Profile...</h3>

          <p>Please wait while we load the information.</p>

        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR WITHOUT DATA
  ===================================================== */

  if (error && !formData.name) {
    return (
      <div className="edit-alumni-page">

        <div className="edit-error-page">

          <div className="edit-error-icon">
            <FaUserGraduate />
          </div>

          <h2>Unable to Load Alumni</h2>

          <p>{error}</p>

          <button
            onClick={() =>
              navigate("/staff-alumni")
            }
          >
            <FaArrowLeft />
            Back to Alumni
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="edit-alumni-page">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="edit-topbar">

        <button
          className="edit-back-button"
          onClick={handleCancel}
        >
          <FaArrowLeft />
          <span>Back to Details</span>
        </button>

        <div className="edit-page-title">

          <div className="edit-title-icon">
            <FaUserGraduate />
          </div>

          <div>
            <h1>Edit Alumni Profile</h1>

            <p>
              Update and maintain alumni information
            </p>
          </div>

        </div>

      </div>

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="form-alert form-alert-error">

          <div>
            <strong>Update Failed</strong>
            <span>{error}</span>
          </div>

          <button
            onClick={() => setError("")}
          >
            <FaTimes />
          </button>

        </div>
      )}

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (
        <div className="form-alert form-alert-success">

          <div>
            <strong>Success</strong>
            <span>{success}</span>
          </div>

        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <form
        className="edit-alumni-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <section className="edit-form-card">

          <div className="edit-card-header">

            <div className="edit-card-icon">
              <FaUser />
            </div>

            <div>
              <h2>Personal Information</h2>

              <p>
                Basic personal and contact information
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* NAME */}

            <div className="form-group">

              <label>
                Full Name
                <span>*</span>
              </label>

              <div className="input-wrapper">

                <FaUser />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email Address
                <span>*</span>
              </label>

              <div className="input-wrapper">

                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />

              </div>

            </div>

            {/* PHONE */}

            <div className="form-group">

              <label>Phone Number</label>

              <div className="input-wrapper">

                <FaPhone />

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>

            </div>

            {/* LOCATION */}

            <div className="form-group">

              <label>Location</label>

              <div className="input-wrapper">

                <FaMapMarkerAlt />

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                />

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            EDUCATION
        ================================================= */}

        <section className="edit-form-card">

          <div className="edit-card-header">

            <div className="edit-card-icon">
              <FaGraduationCap />
            </div>

            <div>
              <h2>Education</h2>

              <p>
                Academic information
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* DEPARTMENT */}

            <div className="form-group">

              <label>
                Department
              </label>

              <div className="input-wrapper">

                <FaGraduationCap />

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="B.Sc Computer Science"
                />

              </div>

            </div>

            {/* PASSING YEAR */}

            <div className="form-group">

              <label>
                Passing Year
                <span>*</span>
              </label>

              <div className="input-wrapper">

                <FaGraduationCap />

                <select
                  name="passingYear"
                  value={formData.passingYear}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Passing Year
                  </option>

                  {Array.from(
                    { length: 31 },
                    (_, index) => 2027 - index
                  ).map((year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ))}

                </select>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            PROFESSIONAL INFORMATION
        ================================================= */}

        <section className="edit-form-card">

          <div className="edit-card-header">

            <div className="edit-card-icon">
              <FaBriefcase />
            </div>

            <div>
              <h2>Professional Information</h2>

              <p>
                Current career information
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* COMPANY */}

            <div className="form-group">

              <label>Company</label>

              <div className="input-wrapper">

                <FaBuilding />

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Current company"
                />

              </div>

            </div>

            {/* DESIGNATION */}

            <div className="form-group">

              <label>Designation</label>

              <div className="input-wrapper">

                <FaBriefcase />

                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Current designation"
                />

              </div>

            </div>

            {/* EXPERIENCE */}

            <div className="form-group">

              <label>Experience</label>

              <div className="input-wrapper">

                <FaBriefcase />

                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Example: 2 Years"
                />

              </div>

            </div>

            {/* CAREER INTEREST */}

            <div className="form-group">

              <label>Career Interest</label>

              <div className="input-wrapper">

                <FaBriefcase />

                <input
                  type="text"
                  name="careerInterest"
                  value={formData.careerInterest}
                  onChange={handleChange}
                  placeholder="Example: Full Stack Development"
                />

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            ABOUT
        ================================================= */}

        <section className="edit-form-card">

          <div className="edit-card-header">

            <div className="edit-card-icon">
              <FaUserGraduate />
            </div>

            <div>
              <h2>About Alumni</h2>

              <p>
                Professional introduction
              </p>
            </div>

          </div>

          <div className="form-group">

            <label>About</label>

            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Write a short professional introduction..."
              rows="6"
            />

            <div className="character-count">
              {formData.about.length} characters
            </div>

          </div>

        </section>

        {/* =================================================
            SKILLS
        ================================================= */}

        <section className="edit-form-card">

          <div className="edit-card-header">

            <div className="edit-card-icon">
              <FaBriefcase />
            </div>

            <div>
              <h2>Skills</h2>

              <p>
                Add professional and technical skills
              </p>
            </div>

          </div>

          <div className="skill-input-row">

            <input
              type="text"
              value={skillInput}
              onChange={(e) =>
                setSkillInput(e.target.value)
              }
              onKeyDown={handleSkillKeyDown}
              placeholder="Enter a skill..."
            />

            <button
              type="button"
              onClick={handleAddSkill}
            >
              <FaPlus />
              Add Skill
            </button>

          </div>

          <div className="edit-skills-list">

            {formData.skills.length > 0 ? (
              formData.skills.map(
                (skill, index) => (

                  <div
                    className="edit-skill-tag"
                    key={`${skill}-${index}`}
                  >

                    <span>{skill}</span>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveSkill(skill)
                      }
                    >
                      <FaTimes />
                    </button>

                  </div>

                )
              )
            ) : (
              <p className="no-skills-text">
                No skills added yet.
              </p>
            )}

          </div>

        </section>

        {/* =================================================
            PROFESSIONAL LINKS
        ================================================= */}

        <section className="edit-form-card">

          <div className="edit-card-header">

            <div className="edit-card-icon">
              <FaLinkedin />
            </div>

            <div>
              <h2>Professional Links</h2>

              <p>
                LinkedIn and resume information
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* LINKEDIN */}

            <div className="form-group">

              <label>LinkedIn Profile URL</label>

              <div className="input-wrapper">

                <FaLinkedin />

                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/in/..."
                />

              </div>

            </div>

            {/* RESUME NAME */}

            <div className="form-group">

              <label>Resume Name</label>

              <div className="input-wrapper">

                <FaFileAlt />

                <input
                  type="text"
                  name="resumeName"
                  value={formData.resumeName}
                  onChange={handleChange}
                  placeholder="Example: Afshana_Resume.pdf"
                />

              </div>

            </div>

            {/* RESUME URL */}

            <div className="form-group full-form-field">

              <label>Resume URL</label>

              <div className="input-wrapper">

                <FaFileAlt />

                <input
                  type="url"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  placeholder="Enter resume URL"
                />

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="edit-form-actions">

          <button
            type="button"
            className="cancel-edit-button"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-edit-button"
            disabled={saving}
          >

            {saving ? (
              <>
                <span className="button-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                Save Changes
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
}

export default EditAlumni;