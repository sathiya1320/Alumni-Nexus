import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../services/api";

import "./EventRegistration.css";

function EventRegistration() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [event, setEvent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    participationInterest,
    setParticipationInterest,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  // ==========================================
  // FETCH EVENT
  // ==========================================

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await API.get("/events");

      const selectedEvent =
        response.data.find(
          (item) =>
            String(item._id) ===
            String(id)
        );

      if (!selectedEvent) {
        setError(
          "Event not found"
        );
        return;
      }

      setEvent(
        selectedEvent
      );

      // If rejected registration exists,
      // show old interest value
      if (
        selectedEvent.myRegistration
          ?.participationInterest
      ) {
        setParticipationInterest(
          selectedEvent.myRegistration
            .participationInterest
        );
      }

    } catch (error) {
      console.error(
        "EVENT REGISTRATION ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load event"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !participationInterest
      ) {
        alert(
          "Please select your event interest"
        );
        return;
      }

      try {
        setSubmitting(true);

        const response =
          await API.post(
            `/events/${id}/register`,
            {
              participationInterest,
              message,
            }
          );

        alert(
          response.data.message ||
          "Registration submitted successfully"
        );

        navigate("/events");

      } catch (error) {

        console.error(
          "REGISTRATION SUBMIT ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Unable to submit registration"
        );

      } finally {
        setSubmitting(false);
      }
    };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="event-registration-page">

        <div className="registration-loading">
          Loading event...
        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !event) {
    return (
      <div className="event-registration-page">

        <div className="registration-error">

          <h2>
            {error ||
              "Event not found"}
          </h2>

          <button
            onClick={() =>
              navigate("/events")
            }
          >
            Back to Events
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // REGISTRATION STATUS
  // ==========================================

  const existingRegistration =
    event.myRegistration;

  const currentStatus =
    existingRegistration?.status;

  return (
    <div className="event-registration-page">

      <div className="event-registration-container">

        <div className="event-registration-card">

          <p className="registration-label">
            EVENT REGISTRATION
          </p>

          <h1>
            {event.title}
          </h1>

          <p className="registration-subtitle">
            Submit your registration for
            staff approval.
          </p>

          {/* EVENT DETAILS */}

          <div className="event-details">

            <p>
              <strong>
                Category:
              </strong>{" "}
              {event.category}
            </p>

            <p>
              <strong>
                Date:
              </strong>{" "}
              {new Date(
                event.date
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>

            <p>
              <strong>
                Location:
              </strong>{" "}
              {event.location}
            </p>

            <p>
              <strong>
                Description:
              </strong>{" "}
              {event.description}
            </p>

          </div>

          {/* PENDING */}

          {currentStatus ===
            "pending" && (

            <div className="status-message pending-status">
              ⏳ Your registration is
              waiting for staff approval.
            </div>

          )}

          {/* APPROVED */}

          {currentStatus ===
            "approved" && (

            <div className="status-message approved-status">
              ✓ Your registration has
              already been approved.
            </div>

          )}

          {/* REJECTED */}

          {currentStatus ===
            "rejected" && (

            <div className="status-message rejected-status">
              ✕ Your previous registration
              was rejected. You can submit
              again below.
            </div>

          )}

          {/* FORM */}

          {currentStatus !==
            "pending" &&
            currentStatus !==
            "approved" && (

            <form
              className="registration-form"
              onSubmit={
                handleSubmit
              }
            >

              <label>
                What type of event are
                you interested in
                participating in?
              </label>

              <select
                value={
                  participationInterest
                }
                onChange={(e) =>
                  setParticipationInterest(
                    e.target.value
                  )
                }
                required
              >

                <option value="">
                  Select your interest
                </option>

                <option value="Alumni Meet / Networking">
                  Alumni Meet / Networking
                </option>

                <option value="Career Guidance / Mentorship">
                  Career Guidance / Mentorship
                </option>

                <option value="Technical Workshop">
                  Technical Workshop
                </option>

                <option value="Startup / Entrepreneurship">
                  Startup / Entrepreneurship
                </option>

                <option value="Cultural Event">
                  Cultural Event
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

              <label>
                Additional Message
                <span>
                  {" "} (Optional)
                </span>
              </label>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Tell us anything you would like the staff to know..."
              />

              <button
                type="submit"
                className="register-submit-btn"
                disabled={submitting}
              >

                {submitting
                  ? "Submitting..."
                  : currentStatus ===
                    "rejected"
                  ? "Submit Again"
                  : "Submit Registration"}

              </button>

            </form>
          )}

          {/* BACK */}

          <button
            className="back-btn"
            onClick={() =>
              navigate("/events")
            }
          >
            ← Back to Events
          </button>

        </div>

      </div>

    </div>
  );
}

export default EventRegistration;