function AlumniCard({
  name,
  company,
  position,
  location
}) {
  return (
    <div className="alumni-card">

      <div className="avatar">
        👤
      </div>

      <h2>{name}</h2>

      <h4>{position}</h4>

      <p>🏢 {company}</p>

      <p>📍 {location}</p>

      <button>
        Connect
      </button>

    </div>
  );
}

export default AlumniCard;