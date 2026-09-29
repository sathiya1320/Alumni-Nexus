import Hero from "../components/Hero";
import Features from "../components/Features";
import Events from "../components/Events";

function Home() {
  return (
    <>

      {/* HOME */}

      <section id="home">
        <Hero />
      </section>


      {/* ABOUT */}

      <section id="about">
        <h1>About Us</h1>

        <p>
          Alumni Nexus helps students and alumni connect
          through events, mentorship and networking.
        </p>
      </section>


      {/* FEATURES */}

      <section id="features">
        <Features />
      </section>


      {/* EVENTS */}

      <section id="events">
        <Events />
      </section>


      {/* CONTACT */}

      <section id="contact">

        <h1>Contact Us</h1>

        <p>
          Have any questions or suggestions?
          Feel free to contact us.
        </p>

        <p>
          Email: alumninexus@gmail.com
        </p>

        <p>
          Chennai, Tamil Nadu
        </p>

      </section>

    </>
  );
}

export default Home;