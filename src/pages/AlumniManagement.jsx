import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaUserGraduate,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaBuilding,
  FaEnvelope,
  FaSyncAlt,
  FaFilter,
  FaTimes,
  FaPlus,
  FaFileExcel,
  FaUpload,
} from "react-icons/fa";

import API from "../services/api";

import "./AlumniManagement.css";

function AlumniManagement() {
  const navigate = useNavigate();

  const [alumni, setAlumni] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [year, setYear] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
      recordsPerPage: 100,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [adding, setAdding] =
    useState(false);

  const [importing, setImporting] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [addForm, setAddForm] =
    useState({
      name: "",
      email: "",
      password: "",
      company: "",
      designation: "",
      department:
        "B.Sc Computer Science",
      passingYear: "",
      phone: "",
      location: "",
      experience: "",
      careerInterest: "",
      skills: "",
      linkedinUrl: "",
      about: "",
    });

  const token =
    localStorage.getItem("token");

  // =====================================================
  // STAFF ACCESS
  // =====================================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user =
        JSON.parse(storedUser);

      if (user.role !== "staff") {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(
        "USER DATA ERROR:",
        err
      );

      navigate("/login");
    }
  }, [navigate]);

  // =====================================================
  // FETCH ALUMNI
  // =====================================================

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await API.get(
          "/users/alumni",
          {
            params: {
              search:
                search.trim(),
              year,
              page: currentPage,

              // 100 records per page
              limit: 100,
            },

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        response.data;

      setAlumni(
        data.alumni || []
      );

      setPagination(
        data.pagination || {
          currentPage,
          totalPages: 1,
          totalRecords:
            data.alumni?.length || 0,
          recordsPerPage: 100,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (err) {
      console.error(
        "FETCH ALUMNI ERROR:",
        err
      );

      if (
        err.response?.status ===
        401
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

        return;
      }

      setError(
        err.response?.data
          ?.message ||
          "Unable to load alumni records."
      );

      setAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH WHEN FILTER/PAGE CHANGES
  // =====================================================

  useEffect(() => {
    if (token) {
      fetchAlumni();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    search,
    year,
  ]);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearchChange = (
    e
  ) => {
    setSearch(
      e.target.value
    );

    setCurrentPage(1);
  };

  // =====================================================
  // YEAR
  // =====================================================

  const handleYearChange = (
    e
  ) => {
    setYear(
      e.target.value
    );

    setCurrentPage(1);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setYear("");
    setCurrentPage(1);
  };

  // =====================================================
  // ADD FORM CHANGE
  // =====================================================

  const handleAddChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setAddForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // =====================================================
  // ADD ALUMNI
  // =====================================================

  const handleAddAlumni =
    async (e) => {
      e.preventDefault();

      if (adding) {
        return;
      }

      try {
        setAdding(true);

        const payload = {
          ...addForm,

          skills:
            addForm.skills
              .split(",")
              .map((skill) =>
                skill.trim()
              )
              .filter(Boolean),
        };

        const response =
          await API.post(
            "/staff/alumni-management/add",
            payload,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        alert(
          response.data
            ?.message ||
            "Alumni added successfully"
        );

        setAddForm({
          name: "",
          email: "",
          password: "",
          company: "",
          designation: "",
          department:
            "B.Sc Computer Science",
          passingYear: "",
          phone: "",
          location: "",
          experience: "",
          careerInterest: "",
          skills: "",
          linkedinUrl: "",
          about: "",
        });

        setShowAddForm(false);

        setCurrentPage(1);

        await fetchAlumni();
      } catch (err) {
        console.error(
          "ADD ALUMNI ERROR:",
          err
        );

        alert(
          err.response?.data
            ?.message ||
            "Unable to add alumni"
        );
      } finally {
        setAdding(false);
      }
    };

  // =====================================================
  // EXCEL FILE SELECT
  // =====================================================

  const handleFileChange = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowed =
      /\.(xlsx|xls|csv)$/i;

    if (
      !allowed.test(
        file.name
      )
    ) {
      alert(
        "Please select an Excel or CSV file."
      );

      e.target.value = "";

      return;
    }

    setSelectedFile(file);
  };

  // =====================================================
  // IMPORT EXCEL
  // =====================================================

  const handleExcelImport =
    async () => {
      if (importing) {
        return;
      }

      if (!selectedFile) {
        alert(
          "Please choose an Excel file first."
        );

        return;
      }

      const confirmed =
        window.confirm(
          `Import "${selectedFile.name}" into Alumni Management?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setImporting(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          selectedFile
        );

        const response =
          await API.post(
            "/staff/alumni-management/import",
            formData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const summary =
          response.data?.summary;

        alert(
          `Excel import completed!\n\n` +
          `Total Rows: ${summary?.totalRows || 0}\n` +
          `Added: ${summary?.added || 0}\n` +
          `Skipped: ${summary?.skipped || 0}`
        );

        setSelectedFile(null);

        const fileInput =
          document.getElementById(
            "excel-upload"
          );

        if (fileInput) {
          fileInput.value = "";
        }

        setCurrentPage(1);

        await fetchAlumni();
      } catch (err) {
        console.error(
          "EXCEL IMPORT ERROR:",
          err
        );

        alert(
          err.response?.data
            ?.message ||
            "Unable to import Excel file"
        );
      } finally {
        setImporting(false);
      }
    };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete =
    async (
      alumniId,
      alumniName
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete ${alumniName}?\n\nThis action cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          alumniId
        );

        await API.delete(
          `/users/alumni/${alumniId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Alumni deleted successfully."
        );

        await fetchAlumni();
      } catch (err) {
        console.error(
          "DELETE ALUMNI ERROR:",
          err
        );

        alert(
          err.response?.data
            ?.message ||
            "Unable to delete alumni."
        );
      } finally {
        setDeletingId(null);
      }
    };

  // =====================================================
  // GROUP BY YEAR
  // =====================================================

  const groupedAlumni =
    useMemo(() => {
      const groups = {};

      const sortedAlumni =
        [...alumni].sort(
          (a, b) => {
            const yearA =
              Number(
                a.passingYear
              ) || 0;

            const yearB =
              Number(
                b.passingYear
              ) || 0;

            if (
              yearA !== yearB
            ) {
              return (
                yearB - yearA
              );
            }

            return (
              a.name || ""
            ).localeCompare(
              b.name || ""
            );
          }
        );

      sortedAlumni.forEach(
        (person) => {
          const groupYear =
            person.passingYear ||
            "Year Not Available";

          if (
            !groups[groupYear]
          ) {
            groups[groupYear] =
              [];
          }

          groups[groupYear].push(
            person
          );
        }
      );

      return groups;
    }, [alumni]);

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (
    name
  ) => {
    if (!name) {
      return "A";
    }

    const words =
      name.trim().split(" ");

    if (
      words.length === 1
    ) {
      return words[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[
        words.length - 1
      ].charAt(0)
    ).toUpperCase();
  };

  // =====================================================
  // AVATAR COLOR
  // =====================================================

  const getAvatarClass = (
    name
  ) => {
    if (!name) {
      return "avatar-color-1";
    }

    const firstLetter =
      name.charCodeAt(0);

    const colorNumber =
      (firstLetter % 6) + 1;

    return `avatar-color-${colorNumber}`;
  };

  // =====================================================
  // VIEW
  // =====================================================

  const handleViewDetails =
    (id) => {
      navigate(
        `/staff-alumni/${id}`
      );
    };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (
    id
  ) => {
    navigate(
      `/staff-alumni/${id}/edit`
    );
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const goToPreviousPage =
    () => {
      if (
        pagination.hasPreviousPage
      ) {
        setCurrentPage(
          (prev) =>
            prev - 1
        );
      }
    };

  const goToNextPage =
    () => {
      if (
        pagination.hasNextPage
      ) {
        setCurrentPage(
          (prev) =>
            prev + 1
        );
      }
    };

  const goToPage = (
    page
  ) => {
    if (
      page >= 1 &&
      page <=
        pagination.totalPages
    ) {
      setCurrentPage(page);
    }
  };

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const getPageNumbers =
    () => {
      const totalPages =
        pagination.totalPages;

      if (
        totalPages <= 7
      ) {
        return Array.from(
          {
            length:
              totalPages,
          },
          (_, index) =>
            index + 1
        );
      }

      const pages = [];

      pages.push(1);

      if (
        currentPage > 4
      ) {
        pages.push("...");
      }

      const start =
        Math.max(
          2,
          currentPage - 1
        );

      const end =
        Math.min(
          totalPages - 1,
          currentPage + 1
        );

      for (
        let page = start;
        page <= end;
        page++
      ) {
        pages.push(page);
      }

      if (
        currentPage <
        totalPages - 3
      ) {
        pages.push("...");
      }

      pages.push(
        totalPages
      );

      return pages;
    };

  // =====================================================
  // RECORD RANGE
  // =====================================================

  const startRecord =
    pagination.totalRecords ===
    0
      ? 0
      : (currentPage - 1) *
          pagination.recordsPerPage +
        1;

  const endRecord =
    Math.min(
      currentPage *
        pagination.recordsPerPage,
      pagination.totalRecords
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="alumni-management-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="alumni-management-header">

        <div className="header-title-section">

          <div className="header-icon">
            <FaUserGraduate />
          </div>

          <div>
            <h1>
              Alumni Management
            </h1>

            <p>
              Manage, search and maintain
              alumni records
            </p>
          </div>

        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >

          <button
            className="refresh-button"
            onClick={
              fetchAlumni
            }
            disabled={loading}
          >
            <FaSyncAlt
              className={
                loading
                  ? "refresh-spinning"
                  : ""
              }
            />

            <span>
              Refresh
            </span>
          </button>

          <button
            className="refresh-button"
            onClick={() =>
              setShowAddForm(
                (prev) =>
                  !prev
              )
            }
          >
            <FaPlus />

            <span>
              Add Alumni
            </span>
          </button>

        </div>

      </div>

      {/* =================================================
          ADD ALUMNI + EXCEL IMPORT
      ================================================= */}

      {showAddForm && (
        <div
          className="filter-card"
          style={{
            marginBottom:
              "24px",
          }}
        >

          <div className="filter-header">

            <div>
              <h2>
                <FaUserGraduate />
                Add Alumni
              </h2>

              <p>
                Add one alumni manually
                or import many records
                from Excel.
              </p>
            </div>

            <button
              className="clear-filter-button"
              type="button"
              onClick={() =>
                setShowAddForm(false)
              }
            >
              <FaTimes />
              Close
            </button>

          </div>

          {/* ===========================
              EXCEL IMPORT
          ============================ */}

          <div
            style={{
              padding:
                "20px",
              marginBottom:
                "20px",
              border:
                "1px dashed #cbd5e1",
              borderRadius:
                "14px",
              background:
                "#f8fafc",
            }}
          >

            <h3
              style={{
                marginTop: 0,
              }}
            >
              <FaFileExcel />{" "}
              Import Alumni from
              Excel
            </h3>

            <p>
              Upload .xlsx, .xls or
              .csv file. Up to 100
              records will be shown per
              page.
            </p>

            <input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={
                handleFileChange
              }
            />

            {selectedFile && (
              <p
                style={{
                  marginTop:
                    "10px",
                }}
              >
                Selected:{" "}
                <strong>
                  {
                    selectedFile.name
                  }
                </strong>
              </p>
            )}

            <button
              type="button"
              className="refresh-button"
              onClick={
                handleExcelImport
              }
              disabled={
                importing ||
                !selectedFile
              }
              style={{
                marginTop:
                  "12px",
              }}
            >
              <FaUpload />

              <span>
                {importing
                  ? "Importing..."
                  : "Import Excel"}
              </span>
            </button>

          </div>

          {/* ===========================
              MANUAL ADD FORM
          ============================ */}

          <form
            onSubmit={
              handleAddAlumni
            }
          >

            <div
              className="form-grid"
            >

              <input
                name="name"
                placeholder="Full Name *"
                value={
                  addForm.name
                }
                onChange={
                  handleAddChange
                }
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={
                  addForm.email
                }
                onChange={
                  handleAddChange
                }
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password (optional)"
                value={
                  addForm.password
                }
                onChange={
                  handleAddChange
                }
              />

              <input
                name="company"
                placeholder="Company"
                value={
                  addForm.company
                }
                onChange={
                  handleAddChange
                }
              />

              <input
                name="designation"
                placeholder="Designation"
                value={
                  addForm.designation
                }
                onChange={
                  handleAddChange
                }
              />

              <input
                name="department"
                placeholder="Department"
                value={
                  addForm.department
                }
                onChange={
                  handleAddChange
                }
              />

              <input
                name="passingYear"
                placeholder="Passing Year *"
                value={
                  addForm.passingYear
                }
                onChange={
                  handleAddChange
                }
                required
              />

              <input
                name="phone"
                placeholder="Phone"
                value={
                  addForm.phone
                }
                onChange={
                  handleAddChange
                }
              />

              <input
                name="location"
                placeholder="Location"
                value={
                  addForm.location
                }
                onChange={
                  handleAddChange
                }
              />

              <input
                name="experience"
                placeholder="Experience"
                value={
                  addForm.experience
                }
                onChange={
                  handleAddChange
                }
              />

              <input
                name="careerInterest"
                placeholder="Career Interest"
                value={
                  addForm.careerInterest
                }
                onChange={
                  handleAddChange
                }
              />

              <input
                name="skills"
                placeholder="Skills: React, Node.js, MongoDB"
                value={
                  addForm.skills
                }
                onChange={
                  handleAddChange
                }
              />

              <input
                name="linkedinUrl"
                placeholder="LinkedIn URL"
                value={
                  addForm.linkedinUrl
                }
                onChange={
                  handleAddChange
                }
              />

            </div>

            <textarea
              name="about"
              placeholder="About Alumni"
              value={
                addForm.about
              }
              onChange={
                handleAddChange
              }
              style={{
                width: "100%",
                marginTop:
                  "15px",
              }}
            />

            <button
              type="submit"
              className="publish-btn"
              disabled={adding}
              style={{
                marginTop:
                  "15px",
              }}
            >
              {adding
                ? "Adding..."
                : "Add Alumni"}
            </button>

          </form>

        </div>
      )}

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="alumni-summary-card">

        <div className="summary-icon">
          <FaUsers />
        </div>

        <div className="summary-content">

          <span>
            Total Alumni
          </span>

          <strong>
            {
              pagination.totalRecords
            }
          </strong>

        </div>

        <div className="summary-info">

          Showing{" "}
          <strong>
            {startRecord}-
            {endRecord}
          </strong>{" "}
          records

        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="filter-card">

        <div className="filter-header">

          <div>

            <h2>
              <FaFilter />
              Search Alumni
            </h2>

            <p>
              Search by name, email,
              company or department
            </p>

          </div>

          {(search || year) && (
            <button
              className="clear-filter-button"
              onClick={
                clearFilters
              }
            >
              <FaTimes />
              Clear Filters
            </button>
          )}

        </div>

        <div className="filter-controls">

          <div className="search-box">

            <FaSearch
              className="search-icon"
            />

            <input
              type="text"
              value={search}
              onChange={
                handleSearchChange
              }
              placeholder="Search name, email, company or department..."
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(
                    1
                  );
                }}
              >
                <FaTimes />
              </button>
            )}

          </div>

          <div className="year-filter">

            <select
              value={year}
              onChange={
                handleYearChange
              }
            >

              <option value="">
                All Passing Years
              </option>

              {Array.from(
                {
                  length: 31,
                },
                (_, index) =>
                  2027 - index
              ).map(
                (
                  yearValue
                ) => (
                  <option
                    key={
                      yearValue
                    }
                    value={
                      yearValue
                    }
                  >
                    {yearValue}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="error-message">

          <strong>
            Something went wrong
          </strong>

          <span>
            {error}
          </span>

          <button
            onClick={
              fetchAlumni
            }
          >
            Try Again
          </button>

        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="loading-container">

          <div className="loading-spinner"></div>

          <h3>
            Loading alumni records...
          </h3>

          <p>
            Please wait while we fetch
            the records.
          </p>

        </div>

      ) : alumni.length === 0 ? (

        <div className="empty-state">

          <div className="empty-icon">
            <FaUserGraduate />
          </div>

          <h2>
            No Alumni Found
          </h2>

          <p>
            No alumni records match
            your current search or
            filter.
          </p>

          {(search || year) && (
            <button
              className="reset-button"
              onClick={
                clearFilters
              }
            >
              Clear Filters
            </button>
          )}

        </div>

      ) : (

        <div className="alumni-list-container">

          {Object.entries(
            groupedAlumni
          ).map(
            (
              [
                groupYear,
                members,
              ]
            ) => (

              <section
                className="year-section"
                key={
                  groupYear
                }
              >

                {/* YEAR HEADER */}

                <div className="year-section-header">

                  <div className="year-title">

                    <div className="year-icon">
                      <FaUserGraduate />
                    </div>

                    <div>

                      <h2>
                        {groupYear ===
                        "Year Not Available"
                          ? groupYear
                          : `${groupYear} Year Alumni`}
                      </h2>

                      <span>
                        {
                          members.length
                        }{" "}
                        {members.length ===
                        1
                          ? "record"
                          : "records"}
                      </span>

                    </div>

                  </div>

                  <div className="year-count">
                    {
                      members.length
                    }
                  </div>

                </div>

                {/* TABLE */}

                <div className="alumni-table-wrapper">

                  <table className="alumni-table">

                    <thead>

                      <tr>

                        <th className="number-column">
                          #
                        </th>

                        <th>
                          Alumni
                        </th>

                        <th>
                          Email
                        </th>

                        <th>
                          Company
                        </th>

                        <th>
                          Department
                        </th>

                        <th>
                          Passing Year
                        </th>

                        <th className="actions-column">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {members.map(
                        (
                          person,
                          index
                        ) => (

                          <tr
                            key={
                              person._id
                            }
                          >

                            <td className="number-cell">
                              {startRecord +
                                index}
                            </td>

                            <td>

                              <div className="alumni-person">

                                <div
                                  className={`alumni-avatar ${getAvatarClass(
                                    person.name
                                  )}`}
                                >
                                  {getInitials(
                                    person.name
                                  )}
                                </div>

                                <div className="alumni-person-info">

                                  <strong>
                                    {
                                      person.name ||
                                      "Unnamed Alumni"
                                    }
                                  </strong>

                                  {person.designation && (
                                    <span>
                                      {
                                        person.designation
                                      }
                                    </span>
                                  )}

                                </div>

                              </div>

                            </td>

                            <td>

                              <div className="table-detail">

                                <FaEnvelope />

                                <span>
                                  {
                                    person.email ||
                                    "Not available"
                                  }
                                </span>

                              </div>

                            </td>

                            <td>

                              <div className="company-detail">

                                <FaBuilding />

                                <span>
                                  {
                                    person.company ||
                                    "Not specified"
                                  }
                                </span>

                              </div>

                            </td>

                            <td>

                              <span className="department-badge">

                                {
                                  person.department ||
                                  "B.Sc Computer Science"
                                }

                              </span>

                            </td>

                            <td>

                              <span className="passing-year">

                                {
                                  person.passingYear ||
                                  "N/A"
                                }

                              </span>

                            </td>

                            {/* ==========================
                                VIEW / EDIT / DELETE
                            =========================== */}

                            <td>

                              <div className="action-buttons">

                                <button
                                  type="button"
                                  className="view-button"
                                  title="View Details"
                                  onClick={() =>
                                    handleViewDetails(
                                      person._id
                                    )
                                  }
                                >
                                  <FaEye />

                                  <span>
                                    View
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  className="edit-button"
                                  title="Edit Alumni"
                                  onClick={() =>
                                    handleEdit(
                                      person._id
                                    )
                                  }
                                >
                                  <FaEdit />

                                  <span>
                                    Edit
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  className="delete-button"
                                  title="Delete Alumni"
                                  disabled={
                                    deletingId ===
                                    person._id
                                  }
                                  onClick={() =>
                                    handleDelete(
                                      person._id,
                                      person.name
                                    )
                                  }
                                >
                                  <FaTrash />

                                  <span>
                                    {deletingId ===
                                    person._id
                                      ? "..."
                                      : "Delete"}
                                  </span>
                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </section>

            )
          )}

        </div>
      )}

      {/* =================================================
          PAGINATION
      ================================================= */}

      {!loading &&
        alumni.length > 0 &&
        pagination.totalPages > 1 && (

          <div className="pagination-container">

            <div className="pagination-info">

              Showing{" "}
              <strong>
                {startRecord}-
                {endRecord}
              </strong>{" "}
              of{" "}
              <strong>
                {
                  pagination.totalRecords
                }
              </strong>{" "}
              alumni

            </div>

            <div className="pagination-controls">

              <button
                className="pagination-arrow"
                disabled={
                  !pagination.hasPreviousPage
                }
                onClick={
                  goToPreviousPage
                }
              >
                <FaChevronLeft />
              </button>

              {getPageNumbers().map(
                (
                  page,
                  index
                ) =>
                  page ===
                  "..." ? (

                    <span
                      className="pagination-dots"
                      key={`dots-${index}`}
                    >
                      ...
                    </span>

                  ) : (

                    <button
                      key={page}
                      className={`page-number ${
                        currentPage ===
                        page
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        goToPage(
                          page
                        )
                      }
                    >
                      {page}
                    </button>

                  )
              )}

              <button
                className="pagination-arrow"
                disabled={
                  !pagination.hasNextPage
                }
                onClick={
                  goToNextPage
                }
              >
                <FaChevronRight />
              </button>

            </div>

            <div className="pagination-limit">

              <span>
                100 records per page
              </span>

            </div>

          </div>
        )}

    </div>
  );
}

export default AlumniManagement;