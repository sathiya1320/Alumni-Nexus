import { useEffect, useState } from "react";
import API from "../services/api";

function Mentorship() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  const [showMeetingModal, setShowMeetingModal] =
    useState(false);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [meetingLink, setMeetingLink] =
    useState("");

  // ==========================================
  // GET USER ROLE
  // ==========================================

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserRole(user.role || "");
      } else {
        setUserRole(
          localStorage.getItem("role") || ""
        );
      }
    } catch (error) {
      console.error(
        "USER ROLE ERROR:",
        error
      );
    }
  }, []);

  // ==========================================
  // FETCH REQUESTS
  // ==========================================

  const fetchRequests = async () => {
    try {
      setLoading(true);

      let response;

      if (userRole === "student") {
        response = await API.get(
          "/mentorship/my-requests"
        );
      } else if (userRole === "alumni") {
        response = await API.get(
          "/mentorship/alumni-requests"
        );
      } else {
        setRequests([]);
        return;
      }

      setRequests(
        response.data.requests || []
      );
    } catch (error) {
      console.error(
        "MENTORSHIP ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole) {
      fetchRequests();
    }
  }, [userRole]);

  // ==========================================
  // OPEN ACCEPT MODAL
  // ==========================================

  const openAcceptModal = (request) => {
    setSelectedRequest(request);
    setMeetingLink("");
    setShowMeetingModal(true);
  };

  // ==========================================
  // ACCEPT WITH GOOGLE MEET LINK
  // ==========================================

  const acceptMentorship = async () => {
    if (!meetingLink.trim()) {
      alert(
        "Please enter the Google Meet link."
      );
      return;
    }

    if (
      !meetingLink.includes(
        "meet.google.com"
      )
    ) {
      alert(
        "Please enter a valid Google Meet link."
      );
      return;
    }

    try {
      await API.put(
        `/mentorship/${selectedRequest._id}/status`,
        {
          status: "accepted",
          meetingLink:
            meetingLink.trim(),
        }
      );

      alert(
        "Mentorship accepted successfully."
      );

      setShowMeetingModal(false);
      setSelectedRequest(null);
      setMeetingLink("");

      fetchRequests();
    } catch (error) {
      console.error(
        "ACCEPT MENTORSHIP ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to accept mentorship"
      );
    }
  };

  // ==========================================
  // REJECT
  // ==========================================

  const rejectMentorship = async (id) => {
    try {
      await API.put(
        `/mentorship/${id}/status`,
        {
          status: "rejected",
        }
      );

      fetchRequests();
    } catch (error) {
      console.error(
        "REJECT MENTORSHIP ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to reject request"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="loading-notification">
          Loading mentorship...
        </div>
      </div>
    );
  }

  // ==========================================
  // STUDENT VIEW
  // ==========================================

  if (userRole === "student") {
    return (
      <div className="notifications-page">

        <div className="notifications-header">
          <div>
            <h1>
              🎓 My Mentorship Requests
            </h1>

            <p>
              Track the mentorship requests
              you have sent to alumni.
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="empty-notification">

            <h3>
              No mentorship requests
            </h3>

            <p>
              Your mentorship requests
              will appear here.
            </p>

          </div>
        ) : (
          <div className="notification-list">

            {requests.map((request) => (
              <div
                className="notification-card"
                key={request._id}
              >

                <div className="notification-icon">
                  🎓
                </div>

                <div className="notification-content">

                  <h3>
                    Mentorship Request
                  </h3>

                  <p>
                    <strong>
                      Mentor:
                    </strong>{" "}
                    {request.mentor?.name ||
                      "Alumni"}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {request.mentor?.email ||
                      "Not available"}
                  </p>

                  {request.message && (
                    <div className="question-box">

                      <strong>
                        Your Message:
                      </strong>

                      <br />

                      {request.message}

                    </div>
                  )}

                  {/* PENDING */}

                  {request.status ===
                    "pending" && (
                    <div className="status pending">
                      ⏳ Pending
                    </div>
                  )}

                  {/* ACCEPTED */}

                  {request.status ===
                    "accepted" && (
                    <>
                      <div className="status accepted">
                        ✓ Mentorship Accepted
                      </div>

                      {request.meetingLink && (
                        <a
                          href={
                            request.meetingLink
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="meeting-link"
                        >
                          🎥 Join Google Meet
                        </a>
                      )}
                    </>
                  )}

                  {/* REJECTED */}

                  {request.status ===
                    "rejected" && (
                    <div className="status rejected">
                      ✕ Mentorship Rejected
                    </div>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    );
  }

  // ==========================================
  // ALUMNI VIEW
  // ==========================================

  return (
    <div className="notifications-page">

      <div className="notifications-header">

        <div>
          <h1>
            🎓 Mentorship Requests
          </h1>

          <p>
            Students who requested
            mentorship from you.
          </p>
        </div>

      </div>

      {requests.length === 0 ? (
        <div className="empty-notification">

          <h3>
            No mentorship requests
          </h3>

          <p>
            Student mentorship requests
            will appear here.
          </p>

        </div>
      ) : (
        <div className="notification-list">

          {requests.map((request) => (

            <div
              className="notification-card"
              key={request._id}
            >

              <div className="notification-icon">
                🎓
              </div>

              <div className="notification-content">

                <h3>
                  Mentorship Request
                </h3>

                <p>
                  <strong>
                    Student:
                  </strong>{" "}
                  {request.student?.name}
                </p>

                <p>
                  <strong>
                    Email:
                  </strong>{" "}
                  {request.student?.email}
                </p>

                <p>
                  <strong>
                    Department:
                  </strong>{" "}
                  {request.student?.department ||
                    "Not updated"}
                </p>

                {request.message && (
                  <div className="question-box">

                    <strong>
                      Message:
                    </strong>

                    <br />

                    {request.message}

                  </div>
                )}

                {/* PENDING */}

                {request.status ===
                  "pending" && (
                  <div className="request-actions">

                    <button
                      className="accept-btn"
                      onClick={() =>
                        openAcceptModal(
                          request
                        )
                      }
                    >
                      ✓ Accept
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        rejectMentorship(
                          request._id
                        )
                      }
                    >
                      ✕ Reject
                    </button>

                  </div>
                )}

                {/* ACCEPTED */}

                {request.status ===
                  "accepted" && (
                  <>
                    <div className="status accepted">
                      ✓ Mentorship Accepted
                    </div>

                    {request.meetingLink && (
                      <a
                        href={
                          request.meetingLink
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="meeting-link"
                      >
                        🎥 Join Google Meet
                      </a>
                    )}
                  </>
                )}

                {/* REJECTED */}

                {request.status ===
                  "rejected" && (
                  <div className="status rejected">
                    ✕ Mentorship Rejected
                  </div>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

      {/* ====================================== */}
      {/* GOOGLE MEET MODAL */}
      {/* ====================================== */}

      {showMeetingModal && (
        <div className="meeting-overlay">

          <div className="meeting-modal">

            <h2>
              🎥 Accept Mentorship
            </h2>

            <p>
              Enter the Google Meet link
              for the mentorship session.
            </p>

            <input
              type="url"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={meetingLink}
              onChange={(e) =>
                setMeetingLink(
                  e.target.value
                )
              }
            />

            <button
              className="accept-meeting-btn"
              onClick={
                acceptMentorship
              }
            >
              ✓ Accept Mentorship
            </button>

            <button
              className="reject-btn"
              style={{
                width: "100%",
                marginTop: "10px",
              }}
              onClick={() => {
                setShowMeetingModal(false);
                setSelectedRequest(null);
                setMeetingLink("");
              }}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Mentorship;