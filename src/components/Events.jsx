import React, {
  useEffect,
  useState,
} from "react";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

import "./Events.css";


function Events() {

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const navigate = useNavigate();


  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  let user = null;

  try {

    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

  } catch {

    user = null;

  }


  // ==========================================
  // FETCH EVENTS
  // ==========================================

  const fetchEvents = async () => {

    try {

      setLoading(true);

      setError("");


      const token =
        localStorage.getItem("token");


      // ========================================
      // GUEST USER
      // DO NOT REDIRECT TO LOGIN
      // ========================================

      if (!token) {

        setEvents([]);

        return;

      }


      // ========================================
      // FETCH EVENTS FROM BACKEND
      // ========================================

      const response = await API.get(
        "/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      // ========================================
      // HANDLE RESPONSE
      // ========================================

      if (
        response.data &&
        Array.isArray(response.data.events)
      ) {

        setEvents(
          response.data.events
        );

      } else if (
        Array.isArray(response.data)
      ) {

        setEvents(
          response.data
        );

      } else {

        setEvents([]);

      }

    } catch (error) {

      console.error(
        "EVENT FETCH ERROR:",
        error
      );


      // ========================================
      // TOKEN EXPIRED / UNAUTHORIZED
      // ========================================

      if (
        error.response?.status === 401
      ) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "role"
        );

        setEvents([]);

        setError(
          "Your session has expired. Please login again."
        );

      } else {

        setError(
          error.response?.data?.message ||
          "Unable to load events"
        );

      }

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD EVENTS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {

    fetchEvents();

  }, []);


  // ==========================================
  // EVENT REGISTRATION
  // ==========================================

  const handleRegister = (eventId) => {

    const token =
      localStorage.getItem("token");


    // Guest user manually clicks Register
    if (!token) {

      navigate("/login");

      return;

    }


    navigate(
      `/event-registration/${eventId}`
    );

  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {

      return "Date not available";

    }


    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="events-page">

        <div className="events-header">

          <div>

            <h1>
              Events
            </h1>

            <p>
              Discover upcoming alumni events
              and activities.
            </p>

          </div>

        </div>


        <div className="events-message">

          <div className="event-spinner"></div>

          <p>
            Loading events...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (

    <div className="events-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="events-header">

        <div>

          <h1>
            Events
          </h1>

          <p>
            Discover upcoming alumni events
            and activities.
          </p>

        </div>


        {/* ====================================
            STAFF CREATE EVENT
        ==================================== */}

        {user?.role === "staff" && (

          <button
            className="create-event-btn"
            onClick={() =>
              navigate("/staff-events")
            }
          >

            + Create Event

          </button>

        )}

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="events-error">

          <h3>
            Unable to Load Events
          </h3>

          <p>
            {error}
          </p>


          {/* ================================
              LOGIN AGAIN BUTTON
          ================================= */}

          {error.includes(
            "session has expired"
          ) ? (

            <button
              onClick={() =>
                navigate("/login")
              }
            >
              Login Again
            </button>

          ) : (

            <button
              onClick={fetchEvents}
            >
              Try Again
            </button>

          )}

        </div>

      )}


      {/* ======================================
          GUEST USER
      ====================================== */}

      {!error &&
        !localStorage.getItem("token") && (

          <div className="no-events">

            <div className="no-events-icon">

              <FaCalendarAlt />

            </div>


            <h2>
              Alumni Events
            </h2>


            <p>
              Login to view upcoming events
              and register for alumni activities.
            </p>


            <button
              className="register-btn"
              onClick={() =>
                navigate("/login")
              }
            >

              Login to View Events

            </button>

          </div>

        )}


      {/* ======================================
          LOGGED-IN USER WITH NO EVENTS
      ====================================== */}

      {!error &&
        localStorage.getItem("token") &&
        events.length === 0 && (

          <div className="no-events">

            <div className="no-events-icon">

              <FaCalendarAlt />

            </div>


            <h2>
              No Events Available
            </h2>


            <p>
              No events have been created yet.
              Please check again later.
            </p>

          </div>

        )}


      {/* ======================================
          EVENT GRID
      ====================================== */}

      {!error &&
        events.length > 0 && (

          <div className="events-grid">

            {events.map((event) => {

              // ==================================
              // REGISTRATION
              // ==================================

              const registration =
                event.myRegistration;

              const status =
                registration?.status;


              return (

                <div
                  className="event-card"
                  key={event._id}
                >


                  {/* ==============================
                      CATEGORY
                  ============================== */}

                  <div className="event-top">

                    <span>

                      {event.category ||
                        "General Event"}

                    </span>

                  </div>


                  {/* ==============================
                      TITLE
                  ============================== */}

                  <h2>

                    {event.title}

                  </h2>


                  {/* ==============================
                      DATE
                  ============================== */}

                  <p className="event-info">

                    <FaCalendarAlt />

                    <span>

                      {formatDate(
                        event.date
                      )}

                    </span>

                  </p>


                  {/* ==============================
                      LOCATION
                  ============================== */}

                  <p className="event-info">

                    <FaMapMarkerAlt />

                    <span>

                      {event.location ||
                        "Location not available"}

                    </span>

                  </p>


                  {/* ==============================
                      DESCRIPTION
                  ============================== */}

                  <p className="event-description">

                    {event.description ||
                      "No description available."}

                  </p>


                  {/* ==============================
                      ORGANIZER
                  ============================== */}

                  <div className="event-created">

                    <FaUserTie />

                    <span>

                      Organized by{" "}

                      <strong>

                        {event.createdBy?.name ||
                          "Staff"}

                      </strong>

                    </span>

                  </div>


                  {/* ==============================
                      STUDENT / ALUMNI
                  ============================== */}

                  {(user?.role === "student" ||
                    user?.role === "alumni") && (

                    <button
                      className={
                        status === "approved"
                          ? "registered-btn"
                          : status === "pending"
                          ? "pending-btn"
                          : "register-btn"
                      }

                      disabled={
                        status === "approved" ||
                        status === "pending"
                      }

                      onClick={() =>
                        handleRegister(
                          event._id
                        )
                      }
                    >

                      {status === "approved"
                        ? "✓ Registered"

                        : status === "pending"
                        ? "⏳ Pending Approval"

                        : status === "rejected"
                        ? "Register Again"

                        : "Register Now"}

                    </button>

                  )}


                  {/* ==============================
                      STAFF
                  ============================== */}

                  {user?.role === "staff" && (

                    <div className="staff-event-info">

                      <span>
                        Registrations
                      </span>

                      <strong>

                        {event.registrationCount ||
                          0}

                      </strong>

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        )}

    </div>

  );

}


export default Events;