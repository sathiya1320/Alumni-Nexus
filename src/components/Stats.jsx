import "./Stats.css";
import {
  FaUserGraduate,
  FaUniversity,
  FaBriefcase,
  FaCalendarCheck,
  FaAward,
  FaHandshake
} from "react-icons/fa";

function Stats() {

  const stats = [
    {
      icon: <FaUserGraduate />,
      number: "25,000+",
      title: "Registered Alumni"
    },
    {
      icon: <FaUniversity />,
      number: "120+",
      title: "Partner Colleges"
    },
    {
      icon: <FaBriefcase />,
      number: "500+",
      title: "Companies"
    },
    {
      icon: <FaCalendarCheck />,
      number: "300+",
      title: "Events Conducted"
    },
    {
      icon: <FaAward />,
      number: "2,000+",
      title: "Placements"
    },
    {
      icon: <FaHandshake />,
      number: "98%",
      title: "Alumni Satisfaction"
    }
  ];

  return (

<section className="stats">

<div className="stats-title">

<span>ACHIEVEMENTS</span>

<h2>Our Impact In Numbers</h2>

<p>
Connecting alumni, empowering students and
building stronger institutions across the country.
</p>

</div>

<div className="stats-grid">

{
stats.map((item,index)=>(

<div className="stat-card" key={index}>

<div className="stat-icon">
{item.icon}
</div>

<h1>{item.number}</h1>

<h4>{item.title}</h4>

</div>

))
}

</div>

</section>

  );
}

export default Stats;