import React, {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import "./StaffEvents.css";


function StaffEvents() {

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processing, setProcessing] =
    useState(null);


  // ==========================================
  // CREATE EVENT FORM
  // ==========================================

  const [form, setForm] =
    useState({
      title: "",
      category: "",
      date: "",
      location: "",
      description: "",
    });


  // ==========================================
  // FETCH EVENTS
  // ==========================================

  useEffect(() => {

    fetchEvents();

  }, []);


  const fetchEvents =
    async () => {

      try {

        setLoading(true);

        setError("");

        const response =
          await API.get(
            "/events/staff/all"
          );

        setEvents(
          response.data
        );

      } catch (error) {

        console.error(
          "STAFF EVENTS ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Unable to load events"
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (
    e
  ) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };


  // ==========================================
  // CREATE EVENT
  // ==========================================

  const handleCreateEvent =
    async (e) => {

      e.preventDefault();


      try {

        await API.post(
          "/events",
          form
        );


        alert(
          "Event created successfully"
        );


        setForm({
          title: "",
          category: "",
          date: "",
          location: "",
          description: "",
        });


        fetchEvents();

      } catch (error) {

        console.error(
          "CREATE EVENT ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Unable to create event"
        );

      }

    };


  // ==========================================
  // APPROVE
  // ==========================================

  const handleApprove =
    async (
      eventId,
      registrationId
    ) => {

      try {

        setProcessing(
          registrationId
        );


        const response =
          await API.put(
            `/events/${eventId}/registrations/${registrationId}/approve`
          );


        alert(
          response.data.message ||
          "Registration approved"
        );


        fetchEvents();

      } catch (error) {

        console.error(
          "APPROVE ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Unable to approve registration"
        );

      } finally {

        setProcessing(null);

      }

    };


  // ==========================================
  // REJECT
  // ==========================================

  const handleReject =
    async (
      eventId,
      registrationId
    ) => {

      const confirmReject =
        window.confirm(
          "Are you sure you want to reject this registration?"
        );


      if (!confirmReject) {
        return;
      }


      try {

        setProcessing(
          registrationId
        );


        const response =
          await API.put(
            `/events/${eventId}/registrations/${registrationId}/reject`
          );


        alert(
          response.data.message ||
          "Registration rejected"
        );


        fetchEvents();

      } catch (error) {

        console.error(
          "REJECT ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Unable to reject registration"
        );

      } finally {

        setProcessing(null);

      }

    };


  // ==========================================
  // DELETE EVENT
  // ==========================================

  const handleDelete =
    async (eventId) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this event?"
        );


      if (!confirmDelete) {
        return;
      }


      try {

        await API.delete(
          `/events/${eventId}`
        );


        alert(
          "Event deleted successfully"
        );


        fetchEvents();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Unable to delete event"
        );

      }

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="staff-events-page">

        <div className="staff-loading">

          Loading events...

        </div>

      </div>

    );

  }


  return (

    <div className="staff-events-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="staff-events-header">

        <div>

          <p>
            STAFF PORTAL
          </p>

          <h1>
            Event Management
          </h1>

          <span>
            Create events and review
            participant registrations.
          </span>

        </div>

      </div>


      {/* =====================================
          CREATE EVENT
      ===================================== */}

      <div className="create-event-card">

        <h2>
          Create New Event
        </h2>

        <form
          onSubmit={
            handleCreateEvent
          }
        >

          <div className="form-grid">

            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={
                handleChange
              }
              required
            />


            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={
                handleChange
              }
              required
            />


            <input
              type="date"
              name="date"
              value={form.date}
              onChange={
                handleChange
              }
              required
            />


            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={
                handleChange
              }
              required
            />

          </div>


          <textarea
            name="description"
            placeholder="Event Description"
            value={
              form.description
            }
            onChange={
              handleChange
            }
            required
          />


          <button
            type="submit"
            className="create-event-btn"
          >
            + Create Event
          </button>

        </form>

      </div>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (

        <div className="staff-error">

          {error}

        </div>

      )}


      {/* =====================================
          EVENTS
      ===================================== */}

      <div className="staff-events-list">

        {events.length === 0 ? (

          <div className="no-events">

            <h2>
              No Events
            </h2>

            <p>
              Create your first event above.
            </p>

          </div>

        ) : (

          events.map(
            (event) => (

              <div
                className="staff-event-card"
                key={event._id}
              >

                {/* EVENT INFO */}

                <div className="staff-event-top">

                  <div>

                    <span className="event-category">

                      {event.category}

                    </span>

                    <h2>

                      {event.title}

                    </h2>

                    <p>

                      📅{" "}

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

                      📍{" "}

                      {event.location}

                    </p>

                  </div>


                  <button
                    className="delete-event-btn"
                    onClick={() =>
                      handleDelete(
                        event._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>


                <p className="staff-event-description">

                  {event.description}

                </p>


                {/* =================================
                    REGISTRATION SUMMARY
                ================================= */}

                <div className="registration-summary">

                  <h3>

                    Event Registrations

                  </h3>

                  <span>

                    {
                      event.registrations
                        ?.length || 0
                    }{" "}

                    Registration(s)

                  </span>

                </div>


                {/* =================================
                    REGISTRATIONS
                ================================= */}

                {event.registrations?.length >
                0 ? (

                  <div className="registrations-list">

                    {event.registrations.map(
                      (registration) => {

                        const participant =
                          registration.user;

                        return (

                          <div
                            className="registration-item"
                            key={
                              registration._id
                            }
                          >

                            <div className="participant-info">

                              <div className="participant-avatar">

                                {participant?.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "U"}

                              </div>


                              <div>

                                <h4>

                                  {participant?.name ||
                                    "Unknown User"}

                                </h4>

                                <p>

                                  {participant?.email ||
                                    "No email"}

                                </p>

                                <p>

                                  Role:{" "}

                                  {participant?.role ||
                                    "Unknown"}

                                </p>

                              </div>

                            </div>


                            <div className="interest-info">

                              <strong>
                                Interested In
                              </strong>

                              <p>

                                {
                                  registration.participationInterest
                                }

                              </p>


                              {registration.message && (

                                <>

                                  <strong>
                                    Message
                                  </strong>

                                  <p>
                                    {
                                      registration.message
                                    }
                                  </p>

                                </>

                              )}

                            </div>


                            <div className="registration-status-area">

                              <span
                                className={`registration-status ${registration.status}`}
                              >

                                {registration.status ===
                                "pending"
                                  ? "⏳ Pending"
                                  : registration.status ===
                                    "approved"
                                  ? "✓ Approved"
                                  : "✕ Rejected"}

                              </span>


                              {registration.status ===
                                "pending" && (

                                <div className="registration-actions">

                                  <button
                                    className="approve-btn"
                                    disabled={
                                      processing ===
                                      registration._id
                                    }
                                    onClick={() =>
                                      handleApprove(
                                        event._id,
                                        registration._id
                                      )
                                    }
                                  >

                                    {processing ===
                                    registration._id
                                      ? "..."
                                      : "✓ Accept"}

                                  </button>


                                  <button
                                    className="reject-btn"
                                    disabled={
                                      processing ===
                                      registration._id
                                    }
                                    onClick={() =>
                                      handleReject(
                                        event._id,
                                        registration._id
                                      )
                                    }
                                  >

                                    ✕ Reject

                                  </button>

                                </div>

                              )}

                            </div>

                          </div>

                        );

                      }
                    )}

                  </div>

                ) : (

                  <div className="no-registrations">

                    No registrations yet.

                  </div>

                )}

              </div>

            )
          )

        )}

      </div>

    </div>

  );

}


export default StaffEvents;