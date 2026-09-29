import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/SearchAlumni.css";

function SearchAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sendingId, setSendingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  // =====================================
  // LOAD ALUMNI
  // =====================================

  const fetchAlumni = async () => {
    try {
      setLoading(true);

      const response =
        await API.get("/users/alumni");

      setAlumni(
        response.data.alumni || []
      );
    } catch (error) {
      console.error(
        "GET ALUMNI ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to load alumni"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  // =====================================
  // CONNECT
  // =====================================

  const handleConnect = async (
    alumniId
  ) => {
    try {
      setSendingId(alumniId);
      setMessage("");

      const response =
        await API.post(
          `/connections/send/${alumniId}`
        );

      setMessage(
        response.data.message
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to send connection request"
      );
    } finally {
      setSendingId(null);
    }
  };

  // =====================================
  // MENTORSHIP
  // =====================================

  const handleMentorship = async (
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
      setSendingId(alumniId);
      setMessage("");

      const response =
        await API.post(
          "/mentorship/request",
          {
            mentorId: alumniId,
            message:
              mentorshipMessage,
          }
        );

      setMessage(
        response.data.message
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to send mentorship request"
      );
    } finally {
      setSendingId(null);
    }
  };

  // =====================================
  // SEARCH
  // =====================================

  const filteredAlumni =
    alumni.filter((person) => {
      const text =
        `${person.name || ""} ${
          person.company || ""
        } ${
          person.designation || ""
        } ${
          person.location || ""
        }`.toLowerCase();

      return text.includes(
        searchTerm.toLowerCase()
      );
    });

  return (
    <div className="search-container">

      <h1>🎓 Search Alumni</h1>

      <p>
        Connect with alumni and request
        mentorship.
      </p>

      <input
        type="text"
        placeholder="Search alumni by name, company or location..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="search-box"
      />

      {message && (
        <div className="search-message">
          {message}
        </div>
      )}

      {loading ? (
        <div className="loading-notification">
          Loading alumni...
        </div>
      ) : (
        <div className="alumni-grid">

          {filteredAlumni.length === 0 ? (
            <div className="empty-notification">
              <h3>
                No alumni found
              </h3>

              <p>
                Try another search.
              </p>
            </div>
          ) : (
            filteredAlumni.map(
              (person) => (

                <div
                  className="alumni-card"
                  key={person._id}
                >

                  <div className="alumni-avatar">
                    {person.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <h2>
                    {person.name}
                  </h2>

                  <p>
                    {person.designation ||
                      "Alumni"}
                  </p>

                  <p>
                    {person.company ||
                      "Company not updated"}
                  </p>

                  <p>
                    📍{" "}
                    {person.location ||
                      "Location not updated"}
                  </p>

                  <div className="alumni-actions">

                    <button
                      className="connect-btn"
                      disabled={
                        sendingId ===
                        person._id
                      }
                      onClick={() =>
                        handleConnect(
                          person._id
                        )
                      }
                    >
                      🤝{" "}
                      {sendingId ===
                      person._id
                        ? "Sending..."
                        : "Connect"}
                    </button>

                    <button
                      className="mentor-btn"
                      disabled={
                        sendingId ===
                        person._id
                      }
                      onClick={() =>
                        handleMentorship(
                          person._id
                        )
                      }
                    >
                      🎓 Mentorship
                    </button>

                  </div>

                </div>
              )
            )
          )}

        </div>
      )}

    </div>
  );
}

export default SearchAlumni;