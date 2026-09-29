import "./Hero.css";
import hero from "../assets/images/hero.png";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <h1>
          Connecting <span>Alumni</span><br />
          Empowering <span>Students</span><br />
          Shaping the Future
        </h1>

        <p>
          Alumni Nexus is a smart platform that connects alumni,
          students and institutions together for networking,
          mentorship, career guidance and event engagement.
        </p>

        <div className="hero-buttons">
          <button className="start-btn">Get Started</button>
          <button className="explore-btn">Explore</button>
        </div>

      </div>

      <div className="hero-right">
        <img src={hero} alt="Alumni Hero" />
      </div>

    </section>
  );
}

export default Hero;