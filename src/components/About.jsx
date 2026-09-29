import "./About.css";

function About() {
  return (
    <section className="about" id="about">

      <div className="about-left">

        <span className="tag">ABOUT US</span>

        <h2>
          Bridging Alumni,
          <span> Students & Colleges</span>
        </h2>

        <p>
          Alumni Nexus is a modern alumni management platform
          that helps institutions maintain lifelong relationships
          with alumni while providing students with mentorship,
          networking opportunities and career guidance.
        </p>

        <div className="about-list">

          <div className="item">
            ✅ Alumni Directory
          </div>

          <div className="item">
            ✅ Event Management
          </div>

          <div className="item">
            ✅ Mentorship Programs
          </div>

          <div className="item">
            ✅ Job Opportunities
          </div>

        </div>

      </div>

      <div className="about-right">

        <div className="card">

          <h3>10,000+</h3>
          <p>Registered Alumni</p>

        </div>

        <div className="card">

          <h3>500+</h3>
          <p>Companies Connected</p>

        </div>

        <div className="card">

          <h3>250+</h3>
          <p>Events Organized</p>

        </div>

        <div className="card">

          <h3>1000+</h3>
          <p>Students Mentored</p>

        </div>

      </div>

    </section>
  );
}

export default About;