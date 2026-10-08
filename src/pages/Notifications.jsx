import React, {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import "./Notifications.css";

function Notifications() {
  const [
    receivedRequests,
    setReceivedRequests,
  ] = useState([]);

  const [
    sentRequests,
    setSentRequests,
  ] = useState([]);

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // =========================================
  // MEETING MODAL
  // =========================================

  const [
    meetingModal,
    setMeetingModal,
  ] = useState(null);

  const [
    meetingLink,
    setMeetingLink,
  ] = useState("");

  // =========================================
  // FETCH DATA
  // =========================================

  const fetchNotifications =
    async () => {
      try {
        setLoading(true);

        // -------------------------------
        // RECEIVED CONNECTION REQUESTS
        // -------------------------------

        try {
          const receivedResponse =
            await API.get(
              "/connections/received"
            );

          setReceivedRequests(
            receivedResponse.data
              .requests || []
          );
        } catch (error) {
          console.error(
            "RECEIVED REQUEST ERROR:",
            error
          );

          setReceivedRequests([]);
        }

        // -------------------------------
        // SENT REQUESTS
        // -------------------------------

        try {
          const sentResponse =
            await API.get(
              "/connections/sent"
            );

          setSentRequests(
            sentResponse.data
              .requests || []
          );
        } catch (error) {
          console.error(
            "SENT REQUEST ERROR:",
            error
          );

          setSentRequests([]);
        }

        // -------------------------------
        // REAL NOTIFICATIONS
        // -------------------------------

        const notificationResponse =
          await API.get(
            "/notifications"
          );

        const notificationList =
          notificationResponse.data
            .notifications || [];

        setNotifications(
          notificationList
        );
      } catch (error) {
        console.error(
          "NOTIFICATION ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================================
  // PAGE OPEN
  // =========================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================================
  // MARK ALL NOTIFICATIONS AS READ
  // =========================================

  const markAllNotificationsAsRead =
    async () => {
      try {
        await API.put(
          "/notifications/read-all"
        );

        // Refresh notification data
        await fetchNotifications();

      } catch (error) {
        console.error(
          "MARK ALL READ ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to mark notifications as read"
        );
      }
    };

  // =========================================
  // ACCEPT CONNECTION
  // =========================================

  const handleAcceptDirect =
    async (request) => {
      try {
        const response =
          await API.put(
            `/connections/accept/${request._id}`,
            {}
          );

        alert(
          response.data.message
        );

        fetchNotifications();
      } catch (error) {
        console.error(
          "ACCEPT CONNECTION ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to accept request"
        );
      }
    };

  // =========================================
  // ACCEPT MENTORSHIP
  // =========================================

  const handleAccept =
    async () => {
      if (!meetingModal) {
        return;
      }

      try {
        const response =
          await API.put(
            `/connections/accept/${meetingModal._id}`,
            {
              meetingLink,
            }
          );

        alert(
          response.data.message
        );

        setMeetingModal(null);

        setMeetingLink("");

        fetchNotifications();
      } catch (error) {
        console.error(
          "ACCEPT REQUEST ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to accept request"
        );
      }
    };

  // =========================================
  // REJECT CONNECTION
  // =========================================

  const handleReject =
    async (connectionId) => {
      const confirmReject =
        window.confirm(
          "Are you sure you want to reject this request?"
        );

      if (!confirmReject) {
        return;
      }

      try {
        const response =
          await API.put(
            `/connections/reject/${connectionId}`
          );

        alert(
          response.data.message
        );

        fetchNotifications();
      } catch (error) {
        console.error(
          "REJECT REQUEST ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to reject request"
        );
      }
    };

  // =========================================
  // MARK ONE READ
  // =========================================

  const markNotificationAsRead =
    async (notificationId) => {
      try {
        await API.put(
          `/notifications/read/${notificationId}`
        );

        setNotifications(
          (prev) =>
            prev.map(
              (notification) =>
                notification._id ===
                notificationId
                  ? {
                      ...notification,
                      isRead: true,
                    }
                  : notification
            )
        );
      } catch (error) {
        console.error(
          "MARK READ ERROR:",
          error
        );
      }
    };

  // =========================================
  // TIME FORMAT
  // =========================================

  const formatTime =
    (date) => {
      if (!date) {
        return "";
      }

      return new Date(
        date
      ).toLocaleString(
        "en-IN"
      );
    };

  // =========================================
  // NOTIFICATION ICON
  // =========================================

  const getNotificationIcon =
    (type, status) => {
      if (type === "job") {
        if (
          status === "Selected"
        ) {
          return "🎉";
        }

        if (
          status === "Rejected"
        ) {
          return "❌";
        }

        if (
          status === "Shortlisted"
        ) {
          return "⭐";
        }

        if (
          status === "Under Review"
        ) {
          return "🔎";
        }

        return "💼";
      }

      if (type === "event") {
        return "🔔";
      }

      if (
        type === "mentorship"
      ) {
        return "🎓";
      }

      if (
        type === "connection"
      ) {
        return "🤝";
      }

      return "🔔";
    };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="notifications-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="notifications-header">

        <div>
          <h1>
            Notifications
          </h1>

          <p>
            Stay updated with your
            Alumni Nexus activities.
          </p>
        </div>

        <div
          className="notification-header-actions"
        >

          {/* MARK ALL AS READ */}

          <button
            className="mark-read"
            onClick={
              markAllNotificationsAsRead
            }
          >
            ✓ Mark All as Read
          </button>

          {/* REFRESH */}

          <button
            className="mark-read"
            onClick={
              fetchNotifications
            }
          >
            🔄 Refresh
          </button>

        </div>

      </div>

      {/* =====================================
          LOADING
      ====================================== */}

      {loading && (
        <div className="loading-notification">
          Loading notifications...
        </div>
      )}

      {!loading && (
        <>

          {/* =================================
              REAL NOTIFICATIONS
          ================================= */}

          {notifications.length >
            0 && (

            <>

              <h2 className="notification-section-title">
                Notifications
              </h2>

              <div className="notification-list">

                {notifications.map(
                  (notification) => {

                    const status =
                      notification.applicationStatus;

                    return (
                      <div
                        className={`notification-card ${
                          !notification.isRead
                            ? "unread-notification"
                            : ""
                        }`}
                        key={
                          notification._id
                        }
                        onClick={() => {

                          if (
                            !notification.isRead
                          ) {
                            markNotificationAsRead(
                              notification._id
                            );
                          }

                        }}
                      >

                        {/* ICON */}

                        <div className="notification-icon">

                          {getNotificationIcon(
                            notification.type,
                            status
                          )}

                        </div>

                        {/* CONTENT */}

                        <div className="notification-content">

                          <h3>
                            {
                              notification.title
                            }
                          </h3>

                          <p>
                            {
                              notification.message
                            }
                          </p>

                          {/* =========================
                              JOB DETAILS
                          ========================== */}

                          {notification.type ===
                            "job" && (
                            <div className="job-notification-details">

                              {notification.jobTitle && (
                                <p>
                                  <strong>
                                    Job:
                                  </strong>{" "}
                                  {
                                    notification.jobTitle
                                  }
                                </p>
                              )}

                              {notification.companyName && (
                                <p>
                                  <strong>
                                    Company:
                                  </strong>{" "}
                                  {
                                    notification.companyName
                                  }
                                </p>
                              )}

                              {notification.applicationStatus && (
                                <p>
                                  <strong>
                                    Status:
                                  </strong>{" "}

                                  <span
                                    className={`job-notification-status ${notification.applicationStatus
                                      .toLowerCase()
                                      .replaceAll(
                                        " ",
                                        "-"
                                      )}`}
                                  >
                                    {
                                      notification.applicationStatus
                                    }
                                  </span>
                                </p>
                              )}

                            </div>
                          )}

                          {/* =========================
                              EVENT DETAILS
                          ========================== */}

                          {notification.type ===
                            "event" && (
                            <p className="event-name">

                              <strong>
                                Event:
                              </strong>{" "}

                              {
                                notification.eventTitle ||
                                "Alumni Event"
                              }

                            </p>
                          )}

                          <small>
                            {formatTime(
                              notification.createdAt
                            )}
                          </small>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </>
          )}

          {/* =================================
              RECEIVED REQUESTS
          ================================= */}

          {receivedRequests.length >
            0 && (

            <>

              <h2 className="notification-section-title">
                Received Requests
              </h2>

              <div className="notification-list">

                {receivedRequests.map(
                  (request) => (

                    <div
                      className="notification-card"
                      key={
                        request._id
                      }
                    >

                      <div className="notification-icon">

                        {request.requestType ===
                        "mentorship"
                          ? "🎓"
                          : "🤝"}

                      </div>

                      <div className="notification-content">

                        <h3>

                          {request.requestType ===
                          "mentorship"
                            ? "New Mentorship Request"
                            : "New Connection Request"}

                        </h3>

                        <p>

                          <strong>
                            {
                              request
                                .sender
                                ?.name ||
                              "User"
                            }
                          </strong>{" "}

                          has sent you a{" "}

                          {
                            request.requestType ||
                            "connection"
                          }{" "}
                          request.

                        </p>

                        {request.status ===
                          "pending" && (

                          <div className="request-actions">

                            <button
                              className="accept-btn"
                              onClick={() => {

                                if (
                                  request.requestType ===
                                  "mentorship"
                                ) {

                                  setMeetingModal(
                                    request
                                  );

                                } else {

                                  handleAcceptDirect(
                                    request
                                  );

                                }

                              }}
                            >
                              ✓ Accept
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() =>
                                handleReject(
                                  request._id
                                )
                              }
                            >
                              ✕ Reject
                            </button>

                          </div>
                        )}

                        {request.status ===
                          "accepted" && (
                          <div className="status accepted">
                            ✓ Accepted
                          </div>
                        )}

                        {request.status ===
                          "rejected" && (
                          <div className="status rejected">
                            ✕ Rejected
                          </div>
                        )}

                        <small>
                          {formatTime(
                            request.createdAt
                          )}
                        </small>

                      </div>

                    </div>
                  )
                )}

              </div>

            </>
          )}

          {/* =================================
              SENT REQUESTS
          ================================= */}

          {sentRequests.length >
            0 && (

            <>

              <h2 className="notification-section-title">
                My Requests
              </h2>

              <div className="notification-list">

                {sentRequests.map(
                  (request) => (

                    <div
                      className="notification-card"
                      key={
                        request._id
                      }
                    >

                      <div className="notification-icon">

                        {request.requestType ===
                        "mentorship"
                          ? "🎓"
                          : "🤝"}

                      </div>

                      <div className="notification-content">

                        <h3>

                          {request.requestType ===
                          "mentorship"
                            ? "Mentorship Request"
                            : "Connection Request"}

                        </h3>

                        <p>

                          Request sent to{" "}

                          <strong>
                            {
                              request
                                .receiver
                                ?.name ||
                              "User"
                            }
                          </strong>

                        </p>

                        {request.status ===
                          "pending" && (
                          <div className="status pending">
                            ⏳ Pending
                          </div>
                        )}

                        {request.status ===
                          "accepted" && (
                          <>
                            <div className="status accepted">
                              ✓ Accepted
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
                                🎥 Join Meeting
                              </a>
                            )}
                          </>
                        )}

                        {request.status ===
                          "rejected" && (
                          <div className="status rejected">
                            ✕ Rejected
                          </div>
                        )}

                        <small>
                          {formatTime(
                            request.createdAt
                          )}
                        </small>

                      </div>

                    </div>
                  )
                )}

              </div>

            </>
          )}

          {/* =================================
              EMPTY
          ================================= */}

          {notifications.length ===
            0 &&
            receivedRequests.length ===
              0 &&
            sentRequests.length ===
              0 && (

              <div className="empty-notification">

                <h3>
                  No notifications yet
                </h3>

                <p>
                  Your connection,
                  mentorship, event and
                  job notifications will
                  appear here.
                </p>

              </div>
            )}

        </>
      )}

      {/* =====================================
          GOOGLE MEET MODAL
      ====================================== */}

      {meetingModal && (

        <div className="meeting-overlay">

          <div className="meeting-modal">

            <button
              className="close-modal"
              onClick={() => {

                setMeetingModal(null);
                setMeetingLink("");

              }}
            >
              ×
            </button>

            <h2>
              Accept Mentorship Request
            </h2>

            <p>
              Student:{" "}

              <strong>
                {
                  meetingModal
                    .sender?.name ||
                  "Student"
                }
              </strong>
            </p>

            <p>
              You can add a Google
              Meet link for the
              mentorship session.
            </p>

            <input
              type="url"
              placeholder="Paste Google Meet Link (optional)"
              value={
                meetingLink
              }
              onChange={(e) =>
                setMeetingLink(
                  e.target.value
                )
              }
            />

            <button
              className="accept-meeting-btn"
              onClick={
                handleAccept
              }
            >
              Accept Request
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Notifications;