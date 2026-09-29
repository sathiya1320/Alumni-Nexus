import React, {
  useEffect,
  useState
} from "react";

import {
  FaUsers,
  FaSearch,
  FaUserGraduate,
  FaUserTie,
  FaHandshake,
  FaGraduationCap
} from "react-icons/fa";

import {
  useSearchParams
} from "react-router-dom";

import API from "../services/api";

import "./Alumni.css";


function Alumni() {

  // ==========================================
  // URL QUERY PARAMETER
  // ==========================================

  const [searchParams] =
    useSearchParams();

  const roleFilter =
    searchParams.get("role") || "network";


  // ==========================================
  // STATE
  // ==========================================

  const [users, setUsers] =
    useState([]);

  const [filteredUsers, setFilteredUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionMessage, setActionMessage] =
    useState("");

  const [sendingId, setSendingId] =
    useState(null);


  // ==========================================
  // CURRENT USER
  // ==========================================

  let currentUser = null;

  try {
    currentUser = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    currentUser = null;
  }

  const currentUserId =
    currentUser?._id ||
    currentUser?.id;


  const currentUserRole =
    currentUser?.role ||
    localStorage.getItem("role");


  // ==========================================
  // FETCH USERS
  // ==========================================

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");


        // ======================================
        // LOGIN CHECK
        // ======================================

        if (!token) {

          setError(
            "Please login again."
          );

          return;
        }


        // ======================================
        // SELECT API
        // ======================================

        let endpoint =
          "/users/network";


        if (
          roleFilter === "student"
        ) {

          endpoint =
            "/users/students";

        } else if (
          roleFilter === "alumni"
        ) {

          endpoint =
            "/users/alumni";

        } else {

          endpoint =
            "/users/network";

        }


        console.log(
          "USER API:",
          endpoint
        );


        // ======================================
        // API REQUEST
        // ======================================

        const response =
          await API.get(
            endpoint,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        console.log(
          "USERS FROM BACKEND:",
          response.data
        );


        const responseData =
          response.data;


        let userList = [];


        // ======================================
        // HANDLE DIFFERENT RESPONSE FORMATS
        // ======================================

        if (
          Array.isArray(
            responseData
          )
        ) {

          userList =
            responseData;

        } else if (
          Array.isArray(
            responseData.users
          )
        ) {

          userList =
            responseData.users;

        } else if (
          Array.isArray(
            responseData.alumni
          )
        ) {

          userList =
            responseData.alumni;

        } else if (
          Array.isArray(
            responseData.data
          )
        ) {

          userList =
            responseData.data;

        }


        setUsers(
          userList
        );

      } catch (err) {

        console.error(
          "ALUMNI NETWORK ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load users"
        );

      } finally {

        setLoading(false);

      }

    };


    fetchUsers();

  }, [roleFilter]);


  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  useEffect(() => {

    let result =
      [...users];


    const searchText =
      search
        .trim()
        .toLowerCase();


    if (searchText) {

      result =
        result.filter(
          (user) => {

            const name =
              user.name
                ?.toLowerCase() || "";


            const email =
              user.email
                ?.toLowerCase() || "";


            const department =
              user.department
                ?.toLowerCase() || "";


            const company =
              user.company
                ?.toLowerCase() || "";


            const designation =
              user.designation
                ?.toLowerCase() || "";


            const skills =
              Array.isArray(
                user.skills
              )
                ? user.skills
                    .join(" ")
                    .toLowerCase()
                : (
                    user.skills || ""
                  ).toLowerCase();


            return (
              name.includes(searchText) ||
              email.includes(searchText) ||
              department.includes(searchText) ||
              company.includes(searchText) ||
              designation.includes(searchText) ||
              skills.includes(searchText)
            );

          }
        );

    }


    setFilteredUsers(
      result
    );

  }, [
    users,
    search
  ]);


  // ==========================================
  // PAGE TITLE
  // ==========================================

  const getPageTitle = () => {

    if (
      roleFilter === "student"
    ) {

      return "Students";

    }

    if (
      roleFilter === "alumni"
    ) {

      return "Alumni Network";

    }

    return "Alumni Network";

  };


  // ==========================================
  // PAGE DESCRIPTION
  // ==========================================

  const getPageDescription = () => {

    if (
      roleFilter === "student"
    ) {

      return (
        "Connect with current students of Alumni Nexus."
      );

    }

    if (
      roleFilter === "alumni"
    ) {

      return (
        "Connect with professional alumni and expand your network."
      );

    }

    return (
      "Connect with alumni and expand your professional network."
    );

  };


  // ==========================================
  // ROLE TEXT
  // ==========================================

  const getRoleText = (
    role
  ) => {

    if (
      role === "student"
    ) {

      return "Student";

    }

    if (
      role === "alumni"
    ) {

      return "Professional Alumni";

    }

    if (
      role === "staff"
    ) {

      return "Staff";

    }

    return "Member";

  };


  // ==========================================
  // ROLE ICON
  // ==========================================

  const getRoleIcon = (
    role
  ) => {

    if (
      role === "student"
    ) {

      return <FaUserGraduate />;

    }

    if (
      role === "alumni"
    ) {

      return <FaUserTie />;

    }

    return <FaUsers />;

  };


  // ==========================================
  // CONNECT
  // ==========================================

  const handleConnect =
    async (
      userId
    ) => {

      try {

        setSendingId(
          userId
        );

        setActionMessage("");


        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          setActionMessage(
            "Please login again."
          );

          return;

        }


        console.log(
          "CONNECT USER ID:",
          userId
        );


        // ====================================
        // IMPORTANT:
        // CORRECT BACKEND ROUTE
        // ====================================

        const response =
          await API.post(
            `/connections/send/${userId}`,
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        console.log(
          "CONNECT RESPONSE:",
          response.data
        );


        setActionMessage(
          response.data.message ||
          "Connection request sent successfully 🤝"
        );

      } catch (err) {

        console.error(
          "CONNECTION ERROR:",
          err
        );

        console.error(
          "CONNECTION STATUS:",
          err.response?.status
        );

        console.error(
          "CONNECTION SERVER RESPONSE:",
          err.response?.data
        );


        setActionMessage(

          err.response?.data?.message ||

          "Unable to send connection request"

        );

      } finally {

        setSendingId(null);

      }

    };


  // ==========================================
  // MENTORSHIP
  // ==========================================

  const handleMentorship =
    async (
      alumniId
    ) => {

      const mentorshipMessage =
        window.prompt(
          "Enter your mentorship message:"
        );


      if (
        mentorshipMessage === null
      ) {

        return;

      }


      try {

        setSendingId(
          alumniId
        );

        setActionMessage("");


        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          setActionMessage(
            "Please login again."
          );

          return;

        }


        const response =
          await API.post(
            "/mentorship/request",
            {
              mentorId:
                alumniId,

              message:
                mentorshipMessage
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        console.log(
          "MENTORSHIP RESPONSE:",
          response.data
        );


        setActionMessage(
          response.data.message ||
          "Mentorship request sent successfully 🎓"
        );

      } catch (err) {

        console.error(
          "MENTORSHIP ERROR:",
          err
        );

        console.error(
          "MENTORSHIP STATUS:",
          err.response?.status
        );

        console.error(
          "MENTORSHIP SERVER RESPONSE:",
          err.response?.data
        );


        setActionMessage(

          err.response?.data?.message ||

          "Unable to send mentorship request"

        );

      } finally {

        setSendingId(null);

      }

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="alumni-page">

        <div className="alumni-loading">

          <div className="loading-spinner">
          </div>

          <p>
            Loading members...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="alumni-page">

        <div className="alumni-error">

          <h2>
            Unable to Load Users
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="alumni-page">


      {/* =====================================
          HERO
      ====================================== */}

      <div className="alumni-hero">

        <div>

          <h1>
            {getPageTitle()}
          </h1>

          <p>
            {getPageDescription()}
          </p>

        </div>

      </div>


      {/* =====================================
          ACTION MESSAGE
      ====================================== */}

      {actionMessage && (

        <div className="search-message">

          {actionMessage}

        </div>

      )}


      {/* =====================================
          SEARCH
      ====================================== */}

      <div className="alumni-search">

        <FaSearch />

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search by name, company, department, skills..."
        />

      </div>


      {/* =====================================
          RESULT INFO
      ====================================== */}

      <div className="result-info">

        <div>

          <strong>
            {filteredUsers.length}
          </strong>

          {" "}

          {
            filteredUsers.length === 1
              ? "member"
              : "members"
          }

        </div>


        {search && (

          <button
            className="clear-search"
            onClick={() =>
              setSearch("")
            }
          >
            Clear Search
          </button>

        )}

      </div>


      {/* =====================================
          USER CARDS
      ====================================== */}

      {filteredUsers.length === 0 ? (

        <div className="empty-users">

          <div className="empty-icon">

            <FaUsers />

          </div>

          <h2>
            No Members Found
          </h2>

          <p>

            {search

              ? `No members found for "${search}".`

              : roleFilter === "student"

              ? "No students are available."

              : roleFilter === "alumni"

              ? "No alumni members are available."

              : "No network members are available."

            }

          </p>


          {search && (

            <button
              onClick={() =>
                setSearch("")
              }
            >
              Clear Search
            </button>

          )}

        </div>

      ) : (

        <div className="alumni-grid">

          {filteredUsers.map(
            (member) => {

              const memberId =
                member._id ||
                member.id;


              const isCurrentUser =
                currentUserId &&
                currentUserId.toString() ===
                  memberId?.toString();


              // ==================================
              // STUDENT → ALUMNI
              // ==================================

              const canRequestMentorship =
                currentUserRole === "student" &&
                member.role === "alumni" &&
                !isCurrentUser;


              // ==================================
              // CONNECT
              // Student can connect only alumni.
              // Alumni can connect other members.
              // ==================================

              const canConnect =
                !isCurrentUser &&
                (
                  currentUserRole === "student"
                    ? member.role === "alumni"
                    : currentUserRole === "alumni"
                );


              return (

                <div
                  className="alumni-card"
                  key={memberId}
                >


                  {/* =============================
                      AVATAR
                  ============================== */}

                  <div className="member-avatar">

                    {
                      member.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                      "U"
                    }

                  </div>


                  {/* =============================
                      NAME
                  ============================== */}

                  <h2>

                    {
                      member.name ||
                      "Unknown User"
                    }

                  </h2>


                  {/* =============================
                      ROLE
                  ============================== */}

                  <div className="member-role">

                    {
                      getRoleIcon(
                        member.role
                      )
                    }

                    <span>

                      {
                        getRoleText(
                          member.role
                        )
                      }

                    </span>

                  </div>


                  {/* =============================
                      COMPANY
                  ============================== */}

                  <p className="member-detail">

                    <strong>
                      Company:
                    </strong>

                    {" "}

                    {
                      member.company ||
                      "Not updated"
                    }

                  </p>


                  {/* =============================
                      DESIGNATION
                  ============================== */}

                  <p className="member-detail">

                    <strong>
                      Designation:
                    </strong>

                    {" "}

                    {
                      member.designation ||
                      "Not updated"
                    }

                  </p>


                  {/* =============================
                      DEPARTMENT
                  ============================== */}

                  <p className="member-detail">

                    <strong>
                      Department:
                    </strong>

                    {" "}

                    {
                      member.department ||
                      "B.Sc Computer Science"
                    }

                  </p>


                  {/* =============================
                      PASSING YEAR
                  ============================== */}

                  {member.role === "alumni" && (

                    <p className="member-detail">

                      <strong>
                        Passing Year:
                      </strong>

                      {" "}

                      {
                        member.passingYear ||
                        "Not updated"
                      }

                    </p>

                  )}


                  {/* =============================
                      SKILLS
                  ============================== */}

                  <p className="member-skills">

                    <strong>
                      Skills:
                    </strong>

                    {" "}

                    {
                      Array.isArray(
                        member.skills
                      )

                        ? member.skills.join(
                            ", "
                          )

                        : member.skills ||
                          "Not updated"

                    }

                  </p>


                  {/* =============================
                      ACTION BUTTONS
                  ============================== */}

                  {(canConnect ||
                    canRequestMentorship) && (

                    <div
                      className="alumni-actions"
                    >


                      {/* =========================
                          CONNECT
                      ========================== */}

                      {canConnect && (

                        <button
                          className="connect-btn"
                          disabled={
                            sendingId ===
                            memberId
                          }
                          onClick={() =>
                            handleConnect(
                              memberId
                            )
                          }
                        >

                          <FaHandshake />

                          {sendingId ===
                          memberId
                            ? "Sending..."
                            : "Connect"
                          }

                        </button>

                      )}


                      {/* =========================
                          MENTORSHIP
                      ========================== */}

                      {canRequestMentorship && (

                        <button
                          className="mentor-btn"
                          disabled={
                            sendingId ===
                            memberId
                          }
                          onClick={() =>
                            handleMentorship(
                              memberId
                            )
                          }
                        >

                          <FaGraduationCap />

                          {sendingId ===
                          memberId
                            ? "Sending..."
                            : "Mentorship"
                          }

                        </button>

                      )}

                    </div>

                  )}

                </div>

              );

            }
          )}

        </div>

      )}

    </div>

  );

}


export default Alumni;