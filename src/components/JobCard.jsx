function JobCard(props) {
  return (
    <div className="job-card">

      <h2>{props.company}</h2>

      <h3>{props.position}</h3>

      <p>📍 {props.location}</p>

      <p>💰 {props.salary}</p>

      <button>Apply Now</button>

    </div>
  );
}

export default JobCard;