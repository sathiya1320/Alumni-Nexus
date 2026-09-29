import { useEffect, useState } from "react";
import API from "../services/api";

function Mentorship() {
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response =
        await API.get(
          "/mentorship/alumni-requests"
        );

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
    fetchRequests();
  }, []);

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      await API.put(
        `/mentorship/${id}/status`,
        {
          status,
        }
      );

      fetchRequests();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update request"
      );
    }
  };

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

      {loading ? (
        <div className="loading-notification">
          Loading mentorship requests...
        </div>
      ) : requests.length === 0 ? (
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
                  New Mentorship Request
                </h3>

                <p>
                  <strong>
                    {request.student?.name}
                  </strong>{" "}
                  wants you as a mentor.
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

                {request.status ===
                  "pending" && (
                  <div className="request-actions">

                    <button
                      className="accept-btn"
                      onClick={() =>
                        updateStatus(
                          request._id,
                          "accepted"
                        )
                      }
                    >
                      ✓ Accept
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateStatus(
                          request._id,
                          "rejected"
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
                    ✓ Mentorship Accepted
                  </div>
                )}

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

export default Mentorship;