import "./Features.css";
import {
  FaUsers,
  FaCalendarAlt,
  FaBriefcase,
  FaUserGraduate,
  FaComments,
  FaChartLine,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaUsers />,
      title: "Alumni Network",
      desc: "Connect with alumni across different industries and build valuable professional relationships.",
    },
    {
      icon: <FaUserGraduate />,
      title: "Mentorship",
      desc: "Students can request mentorship from experienced alumni for career guidance.",
    },
    {
      icon: <FaBriefcase />,
      title: "Job Portal",
      desc: "Explore internships and job opportunities shared by alumni and recruiters.",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Events",
      desc: "Stay updated with reunions, workshops, seminars and alumni events.",
    },
    {
      icon: <FaComments />,
      title: "Community",
      desc: "Interact through discussions, announcements and alumni success stories.",
    },
    {
      icon: <FaChartLine />,
      title: "Analytics",
      desc: "Admin dashboard with reports, engagement statistics and alumni growth.",
    },
  ];

  return (
    <section className="features" id="features">

      <div className="section-title">
        <span>OUR FEATURES</span>

        <h2>Everything You Need In One Platform</h2>

        <p>
          Alumni Nexus provides powerful tools that connect students,
          alumni and institutions through one smart platform.
        </p>
      </div>

      <div className="feature-grid">
        {features.map((item, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
}

export default Features;